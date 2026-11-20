import test from 'node:test';
import assert from 'node:assert/strict';
import { LOOM_DOST_DICTIONARY } from '../data/loomDostDictionary';
import {
  INITIAL_AGENT_TIMELINE,
  createInitialBulkOrders,
  createInitialJanAIConsignments,
  createInitialOffers,
  createInitialProducts,
} from '../data/seedData';
import { LanguageCode } from '../types/loomlink';
import {
  buildPricingDemoCues,
  buildScreenCues,
  resolveDostQuestion,
} from './loomDostEngine';

function createSnapshot(lang: LanguageCode = 'te') {
  return {
    screen: 'pricing' as const,
    role: 'artisan' as const,
    language: lang,
    isOffline: false,
    product: createInitialProducts()[0],
    activeOffer: createInitialOffers()[0],
    bulkOrders: createInitialBulkOrders(),
    consignment: createInitialJanAIConsignments()[0],
    timeline: INITIAL_AGENT_TIMELINE,
  };
}

test('Pricing Studio 10-step demo flow produces exact Telugu script and targets', () => {
  const cues = buildPricingDemoCues(createSnapshot('te'));
  assert.equal(cues.length, 8);
  assert.equal(
    cues[0].text,
    'ఇది మీ గద్వాల్ చీర ధరల పేజీ. నేను ప్రతి రూపాయిని వివరిస్తాను.'
  );
  assert.equal(cues[1].targetId, 'pricing-material');
  assert.equal(cues[1].text, 'మీ దారం ఖర్చు ₹3,200.');
  assert.equal(cues[2].targetId, 'pricing-labour');
  assert.equal(
    cues[2].text,
    'మీ కుటుంబం 2 మంది, 5 రోజులు పనిచేసింది. అందుకు ₹2,200.'
  );
  assert.equal(cues[3].targetId, 'pricing-floor');
  assert.equal(
    cues[3].text,
    'మీ కనిష్ట ధర ₹5,400. దీని కంటే తక్కువ ధరను అంగీకరించకండి.'
  );
  assert.equal(cues[4].targetId, 'pricing-gi-badge');
  assert.equal(cues[4].claimBadge, 'PENDING');
  assert.equal(
    cues[4].text,
    'GI రుజువు ఇంకా లేదు. కాబట్టి ఇది PENDINGగా ఉంటుంది.'
  );
  assert.equal(cues[5].yesNoPrompt?.question, 'మీకు ధర ఎలా వచ్చిందో మళ్ళీ చెప్పాలా?');
  assert.equal(cues[7].state, 'APPROVAL_REMINDER');
  assert.equal(
    cues[7].text,
    'ఈ ధరను ప్రచురించడానికి మీ Voice-PIN ఆమోదం అవసరం.'
  );
});

test('All 4 languages provide complete floor price and claim definitions', () => {
  const langs: LanguageCode[] = ['te', 'kn', 'hi', 'en'];
  for (const lang of langs) {
    const bundle = LOOM_DOST_DICTIONARY[lang];
    assert.ok(bundle.ui.name.length > 0);
    assert.ok(bundle.pricingDemoFlow.floor('₹5,400').includes('₹5,400'));
    assert.ok(bundle.claimDefinitions.VERIFIED.length > 0);
    assert.ok(bundle.claimDefinitions['ARTISAN-REPORTED'].length > 0);
    assert.ok(bundle.claimDefinitions.PENDING.length > 0);
    assert.ok(bundle.claimDefinitions.BLOCKED.length > 0);
  }
});

test('Context cues adapt across Evidence, Negotiation, Bulk, JanAI, and Value Receipt', () => {
  const base = createSnapshot('en');

  const negCues = buildScreenCues({ ...base, screen: 'negotiation' });
  assert.ok(negCues[0].text.includes('₹5,100'));
  assert.ok(negCues[0].text.includes('₹5,400'));
  assert.equal(negCues[2].state, 'APPROVAL_REMINDER');

  const bulkCues = buildScreenCues({ ...base, screen: 'bulk' });
  assert.ok(bulkCues[0].text.includes('50'));
  assert.ok(bulkCues[0].text.includes('17'));

  const janaiCues = buildScreenCues({ ...base, screen: 'janai' });
  assert.equal(janaiCues[1].state, 'APPROVAL_REMINDER');

  const receiptCues = buildScreenCues({ ...base, screen: 'receipt' });
  assert.ok(receiptCues[0].text.includes('₹33,450'));
  assert.ok(receiptCues[1].text.includes('66.9%'));
  assert.ok(receiptCues[2].text.includes('₹2,590'));
});

test('Deterministic Q&A resolver handles floor price, GI status, Yes replay, and empty errors', () => {
  const snap = createSnapshot('te');
  const floorAns = resolveDostQuestion('floor price', snap);
  assert.equal(floorAns.targetId, 'pricing-floor');
  assert.ok(floorAns.text.includes('₹5,400'));

  const giAns = resolveDostQuestion('why gi pending', snap);
  assert.equal(giAns.claimBadge, 'PENDING');

  const yesAns = resolveDostQuestion('yes', snap);
  assert.equal(yesAns.id, 'pricing-slow-summary');

  const emptyAns = resolveDostQuestion('   ', snap);
  assert.equal(emptyAns.state, 'ERROR_HELP');
});
