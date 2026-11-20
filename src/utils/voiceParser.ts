import {
  ClaimStatus,
  EvidenceItem,
  LanguageCode,
  ParsedVoiceResult,
  ProductClaim,
  UserRole,
} from '../types/loomlink';

export const LAKSHMI_DEMO_TRANSCRIPT =
  'Idi Gadwal saree. Cotton body, silk border, zari pallu. Ikkada rendu mandi five days work chesaru. Yarn cost ₹3,200.';

/**
 * Deterministic multilingual / code-mixed voice transcript parser.
 * Supports Telugu Romanized/script, Hindi, Kannada, and English tokens.
 */
export function parseVoiceTranscript(
  rawTranscript: string,
  language: LanguageCode
): ParsedVoiceResult {
  const text = rawTranscript.trim();
  const lower = text.toLowerCase();

  // Detect cluster / craft
  const isNarayanpet =
    lower.includes('narayanpet') ||
    lower.includes('నారాయణపేట') ||
    lower.includes('नारायणपेट') ||
    lower.includes('ನಾರಾಯಣಪೇಟೆ');

  const cluster: 'Gadwal' | 'Narayanpet' = isNarayanpet
    ? 'Narayanpet'
    : 'Gadwal';

  const hasCotton =
    lower.includes('cotton') ||
    lower.includes('పత్తి') ||
    lower.includes('सूती') ||
    lower.includes('ಹತ್ತಿ');
  const hasSilk =
    lower.includes('silk') ||
    lower.includes('పట్టు') ||
    lower.includes('रेशम') ||
    lower.includes('ರೇಷ್ಮೆ') ||
    lower.includes('sico');
  const hasZari = lower.includes('zari') || lower.includes('జరీ');

  let material = 'Cotton body';
  if (hasCotton && hasSilk && hasZari) {
    material = 'Cotton body, silk border, zari pallu';
  } else if (hasCotton && hasSilk) {
    material = 'Cotton body, silk border';
  } else if (isNarayanpet) {
    material = 'Pure handloom cotton with traditional border';
  }

  const craft = isNarayanpet
    ? 'Narayanpet cotton saree'
    : hasSilk
      ? 'Gadwal cotton-silk Sico saree'
      : 'Gadwal handloom saree';

  // Detect workers (handles English numerals + Telugu "rendu mandi", Hindi "do log", Kannada "ibbaru")
  let workers = isNarayanpet ? 1 : 2;
  const workerMatch = lower.match(
    /(\d+)\s*(people|workers|persons|mandi|log|jan)/
  );
  if (workerMatch) {
    workers = Math.max(1, parseInt(workerMatch[1], 10));
  } else if (
    lower.includes('rendu mandi') ||
    lower.includes('రెండు మంది') ||
    lower.includes('do log') ||
    lower.includes('ibbaru')
  ) {
    workers = 2;
  } else if (lower.includes('okka') || lower.includes('ek ')) {
    workers = 1;
  }

  // Detect days
  let days = isNarayanpet ? 1 : 5;
  const dayMatch = lower.match(/(\d+)\s*(days|day|rojulu|din|dina)/);
  if (dayMatch) {
    days = Math.max(1, parseInt(dayMatch[1], 10));
  } else if (
    lower.includes('five days') ||
    lower.includes('aidu rojulu') ||
    lower.includes('paanch din') ||
    lower.includes('aidu dina')
  ) {
    days = 5;
  }

  // Detect yarn / material cost
  let yarnCost = isNarayanpet ? 600 : 3200;
  const costMatch = text.match(/(?:₹|rs\.?|inr|cost)\s*([\d,]+)/i);
  if (costMatch) {
    const parsed = parseInt(costMatch[1].replace(/,/g, ''), 10);
    if (!Number.isNaN(parsed) && parsed > 0) {
      yarnCost = parsed;
    }
  }

  const giClaimed =
    lower.includes('gadwal') ||
    lower.includes('narayanpet') ||
    lower.includes('gi');

  const handloomMarkClaimed =
    lower.includes('handloom') || lower.includes('loom');

  const confidence: 'HIGH' | 'MEDIUM' | 'LOW' =
    text.length >= 25 && (costMatch || lower.includes('saree'))
      ? 'HIGH'
      : text.length >= 12
        ? 'MEDIUM'
        : 'LOW';

  return {
    transcript: text,
    languageDetected: language,
    craft,
    cluster,
    material,
    workers,
    days,
    yarnCost,
    giClaimed,
    handloomMarkClaimed,
    confidence,
  };
}

/**
 * Zero-hallucination claim evaluator:
 * Claims can NEVER become VERIFIED without matching uploaded evidence.
 */
export function evaluateClaimsWithEvidence(
  claims: ProductClaim[],
  evidence: EvidenceItem[],
  forceBlockGi = false
): ProductClaim[] {
  const uploadedTypes = new Set(
    evidence.filter((e) => e.uploaded).map((e) => e.type)
  );

  return claims.map((claim) => {
    if (claim.key === 'gi_tag' && forceBlockGi) {
      return {
        ...claim,
        status: 'BLOCKED' as ClaimStatus,
        reason: 'GI claim blocked: cluster evidence missing or contradictory.',
        verifiedBy: undefined,
      };
    }

    const hasAllRequired =
      claim.requiredEvidence.length > 0 &&
      claim.requiredEvidence.every((req) => uploadedTypes.has(req));

    if (hasAllRequired) {
      const matched = evidence.find(
        (e) => e.uploaded && claim.requiredEvidence.includes(e.type)
      );
      return {
        ...claim,
        status: 'VERIFIED' as ClaimStatus,
        reason: `Supported by uploaded ${matched?.title ?? 'evidence'}.`,
        verifiedBy: matched?.uploadedBy ?? 'Cluster Vault',
      };
    }

    if (claim.key === 'gi_tag' || claim.key === 'handloom_mark') {
      return {
        ...claim,
        status: 'PENDING' as ClaimStatus,
        reason: 'Artisan-reported; verification pending.',
        verifiedBy: undefined,
      };
    }

    return {
      ...claim,
      status: 'ARTISAN-REPORTED' as ClaimStatus,
      reason: 'Artisan-reported; verification pending.',
      verifiedBy: undefined,
    };
  });
}

export function getClaimDisplayFallback(claim: ProductClaim): string {
  if (claim.status === 'VERIFIED') {
    return claim.value;
  }
  if (claim.status === 'BLOCKED') {
    return `${claim.value} — Blocked (${claim.reason})`;
  }
  return `${claim.value} — Artisan-reported; verification pending.`;
}

export interface OfferEvaluation {
  withinRecommended: boolean;
  belowFloor: boolean;
  recommendedCounter: number;
  alertMessage: string;
}

/**
 * Evaluates a buyer offer against deterministic floor & recommended prices.
 */
export function evaluateBuyerOffer(
  offeredPricePerUnit: number,
  floorPrice: number,
  recommendedPrice: number
): OfferEvaluation {
  const targetCounter =
    recommendedPrice === 7800
      ? 8000
      : Math.round((recommendedPrice + 200) / 50) * 50;

  if (offeredPricePerUnit < floorPrice) {
    return {
      withinRecommended: false,
      belowFloor: true,
      recommendedCounter: targetCounter,
      alertMessage:
        `Buyer offer ₹${offeredPricePerUnit.toLocaleString('en-IN')} is below floor price ₹${floorPrice.toLocaleString('en-IN')}. Counteroffer prepared at ₹${targetCounter.toLocaleString('en-IN')} for artisan approval.`,
    };
  }

  if (offeredPricePerUnit < recommendedPrice) {
    return {
      withinRecommended: false,
      belowFloor: false,
      recommendedCounter: targetCounter,
      alertMessage: `Offer ₹${offeredPricePerUnit.toLocaleString('en-IN')} is below recommended direct price ₹${recommendedPrice.toLocaleString('en-IN')}. Counteroffer prepared at ₹${targetCounter.toLocaleString('en-IN')} for artisan approval.`,
    };
  }

  return {
    withinRecommended: true,
    belowFloor: false,
    recommendedCounter: offeredPricePerUnit,
    alertMessage:
      'Offer meets recommended fair price. Ready for artisan Voice-PIN approval.',
  };
}

/**
 * Strict Human-In-The-Loop RBAC Guard:
 * Household handlers and JanAI Café operators CANNOT approve prices,
 * listings, buyer offers, counteroffers, bulk orders, or product claims.
 */
export function canApproveCriticalAction(role: UserRole): boolean {
  return role === 'artisan';
}

export function getRoleApprovalDenialReason(role: UserRole): string {
  if (role === 'handler') {
    return 'Household Handler (Ramesh) can upload photos and prep drafts, but only Artisan Lakshmi Devi can approve prices, claims, or orders via Voice-PIN.';
  }
  if (role === 'operator') {
    return 'JanAI Café Operator (Srinivas) manages QC, packaging, and dispatch, but cannot approve prices, orders, or product claims.';
  }
  if (role === 'buyer') {
    return 'Buyers cannot self-approve artisan pricing or provenance claims.';
  }
  if (role === 'judge') {
    return 'Switch active role to Artisan (Lakshmi Devi) to perform Voice-PIN approvals.';
  }
  return '';
}

export function validateVoicePin(pin: string): boolean {
  const cleaned = pin.trim();
  return cleaned === '1234' || cleaned.toLowerCase().includes('lakshmi');
}
