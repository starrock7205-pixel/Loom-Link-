import { LOOM_DOST_DICTIONARY } from '../data/loomDostDictionary';
import {
  DostContextSnapshot,
  DostCue,
} from '../types/loomDost';
import { calculateDeterministicPricing, calculateValueReceipt } from './pricingEngine';

function formatInr(value: number): string {
  return `₹${Math.round(value).toLocaleString('en-IN')}`;
}

/**
 * Builds the 8-cue Pricing Studio sequence matching the exact 10-step demo flow:
 * 0: Welcome
 * 1: Material cost
 * 2: Family labour
 * 3: Floor price
 * 4: GI badge status
 * 5: Ask Yes/No to repeat slowly
 * 6: Slow complete breakdown (triggered on Yes)
 * 7: Voice-PIN approval reminder (APPROVAL_REMINDER)
 */
export function buildPricingDemoCues(ctx: DostContextSnapshot): DostCue[] {
  const dict = LOOM_DOST_DICTIONARY[ctx.language];
  const pricing = calculateDeterministicPricing(ctx.product.pricingInputs);
  const giClaim = ctx.product.claims.find((c) => c.key === 'gi_tag');
  const giStatus = giClaim?.status ?? 'PENDING';

  const giText =
    giStatus === 'VERIFIED'
      ? dict.pricingDemoFlow.giVerified
      : giStatus === 'BLOCKED'
        ? dict.pricingDemoFlow.giBlocked
        : dict.pricingDemoFlow.giPending;

  const matStr = formatInr(pricing.materialCost);
  const labStr = formatInr(pricing.labourCost);
  const logStr = formatInr(pricing.packagingLogistics);
  const floorStr = formatInr(pricing.artisanFloorPrice);
  const recStr = formatInr(pricing.recommendedDirectPrice);
  const bulkMinStr = formatInr(
    Math.round(pricing.artisanFloorPrice * 1.1)
  );

  return [
    {
      id: 'pricing-welcome',
      state: 'EXPLAINING',
      title: dict.pricingDemoFlow.welcomeTitle,
      text: dict.pricingDemoFlow.welcome,
      isSimulated: true,
      thinkingLabel: dict.thinkingStatuses.calculatingPrice,
      stepIndex: 1,
      totalSteps: 7,
    },
    {
      id: 'pricing-material',
      targetId: 'pricing-material',
      state: 'EXPLAINING',
      title: dict.pricingDemoFlow.materialTitle,
      text: dict.pricingDemoFlow.material(matStr),
      stepIndex: 2,
      totalSteps: 7,
    },
    {
      id: 'pricing-labour',
      targetId: 'pricing-labour',
      state: 'EXPLAINING',
      title: dict.pricingDemoFlow.labourTitle,
      text: dict.pricingDemoFlow.labour(
        ctx.product.pricingInputs.workers,
        ctx.product.pricingInputs.loomDays,
        labStr
      ),
      stepIndex: 3,
      totalSteps: 7,
    },
    {
      id: 'pricing-floor',
      targetId: 'pricing-floor',
      state: 'EXPLAINING',
      title: dict.pricingDemoFlow.floorTitle,
      text: dict.pricingDemoFlow.floor(floorStr),
      stepIndex: 4,
      totalSteps: 7,
    },
    {
      id: 'pricing-gi',
      targetId: 'pricing-gi-badge',
      state: 'EXPLAINING',
      title: dict.pricingDemoFlow.giTitle,
      text: giText,
      claimBadge: giStatus,
      stepIndex: 5,
      totalSteps: 7,
    },
    {
      id: 'pricing-ask-replay',
      targetId: 'pricing-recommended',
      state: 'WAITING_FOR_ACTION',
      title: dict.pricingDemoFlow.askReplayTitle,
      text: dict.pricingDemoFlow.askReplay,
      yesNoPrompt: {
        question: dict.pricingDemoFlow.askReplay,
        yesLabel: dict.ui.yesBtn,
        noLabel: dict.ui.noBtn,
        actionOnYes: 'REPLAY_PRICING_SLOW',
      },
      stepIndex: 6,
      totalSteps: 7,
    },
    {
      id: 'pricing-slow-summary',
      targetId: 'pricing-fees',
      state: 'EXPLAINING',
      title: dict.pricingDemoFlow.slowSummaryTitle,
      text: dict.pricingDemoFlow.slowSummary(
        matStr,
        labStr,
        logStr,
        floorStr,
        recStr,
        bulkMinStr
      ),
      stepIndex: 6,
      totalSteps: 7,
    },
    {
      id: 'pricing-voice-pin',
      targetId: 'pricing-publish-cta',
      state: 'APPROVAL_REMINDER',
      title: dict.pricingDemoFlow.voicePinTitle,
      text: dict.pricingDemoFlow.voicePinReminder,
      stepIndex: 7,
      totalSteps: 7,
    },
  ];
}

/**
 * Generates contextual step-by-step guidance cues for the currently active screen.
 */
export function buildScreenCues(ctx: DostContextSnapshot): DostCue[] {
  const dict = LOOM_DOST_DICTIONARY[ctx.language];
  const pricing = calculateDeterministicPricing(ctx.product.pricingInputs);

  switch (ctx.screen) {
    case 'pricing':
      return buildPricingDemoCues(ctx);

    case 'voice': {
      const giStatus =
        ctx.product.claims.find((c) => c.key === 'gi_tag')?.status ?? 'PENDING';
      return [
        {
          id: 'voice-record',
          targetId: 'voice-mic-btn',
          state: 'WAITING_FOR_ACTION',
          title: dict.ui.name,
          text: dict.screens.voice.recordCue,
          isSimulated: true,
          thinkingLabel: dict.thinkingStatuses.matchingCluster,
          stepIndex: 1,
          totalSteps: 3,
        },
        {
          id: 'voice-inputs',
          targetId: 'voice-transcript',
          state: 'EXPLAINING',
          title: dict.ui.name,
          text: dict.screens.voice.inputsCue,
          stepIndex: 2,
          totalSteps: 3,
        },
        {
          id: 'voice-gi',
          targetId: 'voice-gi-claim',
          state: 'EXPLAINING',
          title: dict.pricingDemoFlow.giTitle,
          text: `${dict.screens.voice.unsupportedCue} ${dict.screens.voice.giPendingCue}`,
          claimBadge: giStatus,
          stepIndex: 3,
          totalSteps: 3,
        },
      ];
    }

    case 'evidence': {
      const matClaim = ctx.product.claims.find((c) => c.key === 'material');
      const giClaim = ctx.product.claims.find((c) => c.key === 'gi_tag');
      return [
        {
          id: 'ev-yarn',
          targetId: 'evidence-yarn-bill',
          state:
            matClaim?.status === 'VERIFIED' ? 'EXPLAINING' : 'WAITING_FOR_ACTION',
          title: dict.ui.name,
          text: dict.screens.evidence.yarnBillCue,
          claimBadge: matClaim?.status ?? 'ARTISAN-REPORTED',
          isSimulated: true,
          thinkingLabel: dict.thinkingStatuses.checkingYarnBill,
          stepIndex: 1,
          totalSteps: 4,
        },
        {
          id: 'ev-loom',
          targetId: 'evidence-loom-photo',
          state: 'EXPLAINING',
          title: dict.ui.name,
          text: dict.screens.evidence.loomPhotoCue,
          stepIndex: 2,
          totalSteps: 4,
        },
        {
          id: 'ev-coop-gi',
          targetId: 'evidence-coop-gi',
          state: 'EXPLAINING',
          title: dict.pricingDemoFlow.giTitle,
          text: `${dict.screens.evidence.coopGiCue} ${dict.screens.evidence.handloomConsentCue}`,
          claimBadge: giClaim?.status ?? 'PENDING',
          stepIndex: 3,
          totalSteps: 4,
        },
        {
          id: 'ev-matrix',
          targetId: 'evidence-claim-matrix',
          state: 'EXPLAINING',
          title: dict.ui.name,
          text: dict.screens.evidence.verifiedVsReportedCue,
          stepIndex: 4,
          totalSteps: 4,
        },
      ];
    }

    case 'publish':
      return [
        {
          id: 'pub-gate',
          targetId: 'publish-pin-btn',
          state: 'APPROVAL_REMINDER',
          title: dict.pricingDemoFlow.voicePinTitle,
          text: `${dict.screens.publish.gateCue} ${dict.pricingDemoFlow.voicePinReminder}`,
          isSimulated: true,
          thinkingLabel: dict.thinkingStatuses.preparingListing,
          stepIndex: 1,
          totalSteps: 1,
        },
      ];

    case 'negotiation': {
      const offer = ctx.activeOffer;
      const offered = offer?.offeredPricePerUnit ?? 5100;
      const floor = pricing.artisanFloorPrice;
      const belowFloor = offered < floor;
      const counter = offer?.counterOfferPerUnit ?? 8000;
      const days = offer?.deliveryTargetDays ?? 12;

      return [
        {
          id: 'neg-offer',
          targetId: 'negotiation-guard',
          state: 'EXPLAINING',
          title: dict.ui.name,
          text: belowFloor
            ? dict.screens.negotiation.offerBelowFloorCue(
                formatInr(offered),
                formatInr(floor)
              )
            : dict.screens.negotiation.offerAboveFloorCue(
                formatInr(offered),
                formatInr(pricing.recommendedDirectPrice)
              ),
          isSimulated: true,
          thinkingLabel: dict.thinkingStatuses.calculatingPrice,
          stepIndex: 1,
          totalSteps: 3,
        },
        {
          id: 'neg-counter',
          targetId: 'negotiation-counter',
          state: 'EXPLAINING',
          title: dict.ui.name,
          text: dict.screens.negotiation.counterCapacityCue(
            formatInr(counter),
            days
          ),
          stepIndex: 2,
          totalSteps: 3,
        },
        {
          id: 'neg-approve',
          targetId: 'negotiation-approve-btn',
          state: 'APPROVAL_REMINDER',
          title: dict.pricingDemoFlow.voicePinTitle,
          text: dict.screens.negotiation.approvalCue,
          stepIndex: 3,
          totalSteps: 3,
        },
      ];
    }

    case 'bulk': {
      const corp = ctx.bulkOrders[1] ?? ctx.bulkOrders[0];
      const qty = corp?.quantity ?? 50;
      const weavers = corp?.estimatedWeaversNeeded ?? 17;
      return [
        {
          id: 'bulk-cap',
          targetId: 'bulk-capacity',
          state: 'EXPLAINING',
          title: dict.ui.name,
          text: dict.screens.bulk.capacityCue(qty, weavers),
          stepIndex: 1,
          totalSteps: 2,
        },
        {
          id: 'bulk-alert',
          targetId: 'bulk-deadline-alert',
          state: 'APPROVAL_REMINDER',
          title: dict.pricingDemoFlow.voicePinTitle,
          text: dict.screens.bulk.stagedDeadlineCue,
          stepIndex: 2,
          totalSteps: 2,
        },
      ];
    }

    case 'janai':
      return [
        {
          id: 'janai-qc',
          targetId: 'janai-qc-card',
          state: 'EXPLAINING',
          title: dict.ui.name,
          text: dict.screens.janai.qcDispatchCue,
          stepIndex: 1,
          totalSteps: 2,
        },
        {
          id: 'janai-lock',
          targetId: 'janai-lock-banner',
          state: 'APPROVAL_REMINDER',
          title: dict.ui.name,
          text: dict.screens.janai.operatorLockCue,
          stepIndex: 2,
          totalSteps: 2,
        },
      ];

    case 'receipt': {
      const offer = ctx.activeOffer;
      const agreed =
        offer && (offer.status === 'buyer_accepted' || offer.status === 'counter_approved')
          ? offer.counterOfferPerUnit
          : ctx.consignment?.agreedPricePerUnit ?? 8000;
      const qty = offer?.quantity ?? ctx.consignment?.quantity ?? 5;
      const receipt = calculateValueReceipt(
        agreed,
        qty,
        ctx.product.pricingInputs
      );
      return [
        {
          id: 'rec-net',
          targetId: 'receipt-net-payout',
          state: 'EXPLAINING',
          title: dict.ui.name,
          text: dict.screens.receipt.netCue(
            formatInr(receipt.artisanNetPerUnit),
            formatInr(receipt.artisanTotalNetPayout),
            qty
          ),
          stepIndex: 1,
          totalSteps: 3,
        },
        {
          id: 'rec-retained',
          targetId: 'receipt-retained-pct',
          state: 'EXPLAINING',
          title: dict.ui.name,
          text: dict.screens.receipt.retainedCue(receipt.retailRetainedPct),
          stepIndex: 2,
          totalSteps: 3,
        },
        {
          id: 'rec-uplift',
          targetId: 'receipt-trader-uplift',
          state: 'EXPLAINING',
          title: dict.ui.name,
          text: dict.screens.receipt.upliftCue(
            formatInr(receipt.traderBaselinePerUnit),
            formatInr(receipt.incomeUpliftPerUnit)
          ),
          stepIndex: 3,
          totalSteps: 3,
        },
      ];
    }

    default:
      return [
        {
          id: 'general-welcome',
          state: 'EXPLAINING',
          title: dict.ui.name,
          text: dict.screens.general.welcomeCue,
          stepIndex: 1,
          totalSteps: 1,
        },
      ];
  }
}

/**
 * Deterministic, zero-hallucination question resolver for voice and text fallback queries.
 */
export function resolveDostQuestion(
  rawQuery: string,
  ctx: DostContextSnapshot
): DostCue {
  const q = rawQuery.trim().toLowerCase();
  const dict = LOOM_DOST_DICTIONARY[ctx.language];
  const pricing = calculateDeterministicPricing(ctx.product.pricingInputs);

  if (!q) {
    return {
      id: 'qa-error',
      state: 'ERROR_HELP',
      title: dict.ui.name,
      text: dict.ui.errorUnclear,
    };
  }

  // Yes / No handling for replay questions
  if (
    q === 'yes' ||
    q === 'avunu' ||
    q === 'అవును' ||
    q === 'haa' ||
    q === 'haan' ||
    q === 'हाँ' ||
    q === 'houdu' ||
    q === 'ಹೌದು'
  ) {
    const cues = buildPricingDemoCues(ctx);
    return cues[6]; // Slow summary
  }

  if (
    q.includes('floor') ||
    q.includes('minimum') ||
    q.includes('కనిష్ట') ||
    q.includes('న्यूनतम') ||
    q.includes('न्यूनतम') ||
    q.includes('ಕನಿಷ್ಠ')
  ) {
    return {
      id: 'qa-floor',
      targetId: 'pricing-floor',
      state: 'EXPLAINING',
      title: dict.pricingDemoFlow.floorTitle,
      text: dict.pricingDemoFlow.floor(formatInr(pricing.artisanFloorPrice)),
    };
  }

  if (
    q.includes('gi') ||
    q.includes('pending') ||
    q.includes('verified') ||
    q.includes('రుజువు') ||
    q.includes('ಪುರಾವೆ') ||
    q.includes('सबूत')
  ) {
    const giClaim = ctx.product.claims.find((c) => c.key === 'gi_tag');
    const status = giClaim?.status ?? 'PENDING';
    const text =
      status === 'VERIFIED'
        ? dict.pricingDemoFlow.giVerified
        : status === 'BLOCKED'
          ? dict.pricingDemoFlow.giBlocked
          : `${dict.pricingDemoFlow.giPending} ${dict.claimDefinitions[status]}`;
    return {
      id: 'qa-gi',
      targetId: ctx.screen === 'pricing' ? 'pricing-gi-badge' : 'evidence-claim-matrix',
      state: 'EXPLAINING',
      title: dict.pricingDemoFlow.giTitle,
      text,
      claimBadge: status,
    };
  }

  if (
    q.includes('pin') ||
    q.includes('approve') ||
    q.includes('ఆమోదం') ||
    q.includes('मंज़ूरी') ||
    q.includes('ಒಪ್ಪಿಗೆ')
  ) {
    return {
      id: 'qa-pin',
      targetId:
        ctx.screen === 'publish'
          ? 'publish-pin-btn'
          : ctx.screen === 'negotiation'
            ? 'negotiation-approve-btn'
            : 'pricing-publish-cta',
      state: 'APPROVAL_REMINDER',
      title: dict.pricingDemoFlow.voicePinTitle,
      text: dict.pricingDemoFlow.voicePinReminder,
    };
  }

  if (
    q.includes('yarn') ||
    q.includes('material') ||
    q.includes('silk') ||
    q.includes('దారం') ||
    q.includes('ನೂಲು') ||
    q.includes('धागा')
  ) {
    return {
      id: 'qa-material',
      targetId: ctx.screen === 'pricing' ? 'pricing-material' : 'evidence-yarn-bill',
      state: 'EXPLAINING',
      title: dict.pricingDemoFlow.materialTitle,
      text: `${dict.pricingDemoFlow.material(formatInr(pricing.materialCost))} ${dict.screens.evidence.yarnBillCue}`,
    };
  }

  if (
    q.includes('labour') ||
    q.includes('worker') ||
    q.includes('day') ||
    q.includes('శ్రమ') ||
    q.includes('ಕೆಲಸ') ||
    q.includes('मेहनत')
  ) {
    return {
      id: 'qa-labour',
      targetId: 'pricing-labour',
      state: 'EXPLAINING',
      title: dict.pricingDemoFlow.labourTitle,
      text: dict.pricingDemoFlow.labour(
        ctx.product.pricingInputs.workers,
        ctx.product.pricingInputs.loomDays,
        formatInr(pricing.labourCost)
      ),
    };
  }

  if (
    q.includes('bulk') ||
    q.includes('50') ||
    q.includes('deadline') ||
    q.includes('బల్క్') ||
    q.includes('थोक') ||
    q.includes('ಬಲ್ಕ್')
  ) {
    const corp = ctx.bulkOrders[1] ?? ctx.bulkOrders[0];
    return {
      id: 'qa-bulk',
      targetId: 'bulk-capacity',
      state: 'EXPLAINING',
      title: dict.ui.name,
      text: `${dict.screens.bulk.capacityCue(
        corp?.quantity ?? 50,
        corp?.estimatedWeaversNeeded ?? 17
      )} ${dict.screens.bulk.stagedDeadlineCue}`,
    };
  }

  if (
    q.includes('receipt') ||
    q.includes('net') ||
    q.includes('payout') ||
    q.includes('earn') ||
    q.includes('ఎంత') ||
    q.includes('कितना') ||
    q.includes('ಎಷ್ಟು')
  ) {
    const offer = ctx.activeOffer;
    const agreed =
      offer && (offer.status === 'buyer_accepted' || offer.status === 'counter_approved')
        ? offer.counterOfferPerUnit
        : ctx.consignment?.agreedPricePerUnit ?? 8000;
    const qty = offer?.quantity ?? ctx.consignment?.quantity ?? 5;
    const r = calculateValueReceipt(agreed, qty, ctx.product.pricingInputs);
    return {
      id: 'qa-receipt',
      targetId: 'receipt-net-payout',
      state: 'EXPLAINING',
      title: dict.ui.name,
      text: `${dict.screens.receipt.netCue(
        formatInr(r.artisanNetPerUnit),
        formatInr(r.artisanTotalNetPayout),
        qty
      )} ${dict.screens.receipt.retainedCue(r.retailRetainedPct)}`,
    };
  }

  // Fallback to current screen's primary cue
  const screenCues = buildScreenCues(ctx);
  return screenCues[0];
}
