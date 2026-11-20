import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateDeterministicPricing,
  calculateValueReceipt,
} from './pricingEngine';
import {
  canApproveCriticalAction,
  evaluateBuyerOffer,
  evaluateClaimsWithEvidence,
  LAKSHMI_DEMO_TRANSCRIPT,
  parseVoiceTranscript,
  validateVoicePin,
} from './voiceParser';
import { EvidenceItem, PricingInputs, ProductClaim } from '../types/loomlink';

const gadwalInputs: PricingInputs = {
  materialCost: 3200,
  loomDays: 5,
  workers: 2,
  fairDailyWage: 220,
  packagingLogistics: 350,
  returnsReservePct: 3,
  platformFeePct: 9,
  comparableRetailPrice: 10000,
  artisanCraftMarginPct: 21,
  traderBaselinePrice: 4100,
};

test('Gadwal pricing engine calculates exact floor, recommended, and retail metrics', () => {
  const result = calculateDeterministicPricing(gadwalInputs);
  assert.equal(result.materialCost, 3200);
  assert.equal(result.personDays, 10);
  assert.equal(result.labourCost, 2200);
  assert.equal(result.artisanFloorPrice, 5400);
  assert.equal(result.recommendedDirectPrice, 7800);
  assert.equal(result.comparableRetailPrice, 10000);
  assert.equal(result.returnsReserveAmount, 234);
  assert.equal(result.platformFeeAmount, 702);
});

test('Value receipt calculates exact ₹8,000 x 5 payout and uplift vs trader', () => {
  const receipt = calculateValueReceipt(8000, 5, gadwalInputs);
  assert.equal(receipt.grossOrderValue, 40000);
  assert.equal(receipt.returnsReserveAmount, 240);
  assert.equal(receipt.platformFeeAmount, 720);
  assert.equal(receipt.packagingLogistics, 350);
  assert.equal(receipt.totalDeductionsPerUnit, 1310);
  assert.equal(receipt.artisanNetPerUnit, 6690);
  assert.equal(receipt.artisanTotalNetPayout, 33450);
  assert.equal(receipt.retailRetainedPct, 66.9);
  assert.equal(receipt.incomeUpliftPerUnit, 2590);
});

test('Voice parser extracts Gadwal attributes from Lakshmi Telugu code-mixed transcript', () => {
  const parsed = parseVoiceTranscript(LAKSHMI_DEMO_TRANSCRIPT, 'te');
  assert.equal(parsed.cluster, 'Gadwal');
  assert.equal(parsed.craft, 'Gadwal cotton-silk Sico saree');
  assert.equal(parsed.material, 'Cotton body, silk border, zari pallu');
  assert.equal(parsed.workers, 2);
  assert.equal(parsed.days, 5);
  assert.equal(parsed.yarnCost, 3200);
  assert.equal(parsed.giClaimed, true);
});

test('Zero-hallucination claim validator keeps GI PENDING when only yarn bill & loom photo exist', () => {
  const initialClaims: ProductClaim[] = [
    {
      id: 'c1',
      key: 'material',
      label: 'Material Composition',
      value: 'Cotton body, silk border, zari pallu',
      status: 'ARTISAN-REPORTED',
      requiredEvidence: ['yarn_bill'],
      reason: 'Artisan-reported; verification pending.',
    },
    {
      id: 'c2',
      key: 'labour',
      label: 'Loom Labour',
      value: '2 workers × 5 days',
      status: 'ARTISAN-REPORTED',
      requiredEvidence: ['loom_photo'],
      reason: 'Artisan-reported; verification pending.',
    },
    {
      id: 'c3',
      key: 'gi_tag',
      label: 'GI Gadwal Origin',
      value: 'GI Gadwal Handloom',
      status: 'PENDING',
      requiredEvidence: ['gi_certificate', 'coop_id'],
      reason: 'Artisan-reported; verification pending.',
    },
  ];

  const evidence: EvidenceItem[] = [
    { id: 'e1', type: 'yarn_bill', title: 'Yarn Bill', uploaded: true },
    { id: 'e2', type: 'loom_photo', title: 'Loom Photo', uploaded: true },
    { id: 'e3', type: 'gi_certificate', title: 'GI Certificate', uploaded: false },
    { id: 'e4', type: 'coop_id', title: 'Cooperative ID', uploaded: false },
  ];

  const evaluated = evaluateClaimsWithEvidence(initialClaims, evidence);
  assert.equal(evaluated[0].status, 'VERIFIED');
  assert.equal(evaluated[1].status, 'VERIFIED');
  assert.equal(evaluated[2].status, 'PENDING');

  const blocked = evaluateClaimsWithEvidence(initialClaims, evidence, true);
  assert.equal(blocked[2].status, 'BLOCKED');
});

test('Buyer offer evaluator detects below-floor and below-recommended offers and drafts ₹8,000 counteroffer', () => {
  const belowFloor = evaluateBuyerOffer(5100, 5400, 7800);
  assert.equal(belowFloor.belowFloor, true);
  assert.equal(belowFloor.recommendedCounter, 8000);
  assert.match(belowFloor.alertMessage, /below floor price/i);

  const belowRecommended = evaluateBuyerOffer(7500, 5400, 7800);
  assert.equal(belowRecommended.withinRecommended, false);
  assert.equal(belowRecommended.belowFloor, false);
  assert.equal(belowRecommended.recommendedCounter, 8000);
});

test('RBAC prevents handler and operator from critical approvals and validates Voice-PIN', () => {
  assert.equal(canApproveCriticalAction('artisan'), true);
  assert.equal(canApproveCriticalAction('handler'), false);
  assert.equal(canApproveCriticalAction('operator'), false);
  assert.equal(canApproveCriticalAction('buyer'), false);
  assert.equal(validateVoicePin('1234'), true);
  assert.equal(validateVoicePin('9999'), false);
});
