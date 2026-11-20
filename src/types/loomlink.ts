export type UserRole = 'artisan' | 'handler' | 'operator' | 'buyer' | 'judge';

export type LanguageCode = 'te' | 'hi' | 'kn' | 'en';

export type ScreenId =
  | 'landing'
  | 'artisan'
  | 'voice'
  | 'evidence'
  | 'pricing'
  | 'publish'
  | 'negotiation'
  | 'bulk'
  | 'janai'
  | 'marketplace'
  | 'pdp'
  | 'receipt'
  | 'judge'
  | 'script';

export type ClaimStatus = 'VERIFIED' | 'ARTISAN-REPORTED' | 'PENDING' | 'BLOCKED';

export type EvidenceType =
  | 'yarn_bill'
  | 'loom_photo'
  | 'coop_id'
  | 'gi_certificate'
  | 'handloom_mark';

export interface ProductClaim {
  id: string;
  key: 'craft' | 'material' | 'labour' | 'gi_tag' | 'handloom_mark' | 'natural_dye';
  label: string;
  value: string;
  status: ClaimStatus;
  requiredEvidence: EvidenceType[];
  reason: string;
  verifiedBy?: string;
}

export interface EvidenceItem {
  id: string;
  type: EvidenceType;
  title: string;
  uploaded: boolean;
  uploadedBy?: string;
  uploadedByRole?: UserRole;
  uploadedAt?: string;
  imageUrl?: string;
  fileNote?: string;
}

export interface PricingInputs {
  materialCost: number;
  loomDays: number;
  workers: number;
  fairDailyWage: number;
  packagingLogistics: number;
  returnsReservePct: number; // 3%
  platformFeePct: number; // 9%
  comparableRetailPrice: number;
  comparableRetailRange?: string;
  artisanCraftMarginPct: number;
  traderBaselinePrice: number;
}

export interface PricingBreakdown {
  materialCost: number;
  labourCost: number;
  personDays: number;
  artisanFloorPrice: number;
  packagingLogistics: number;
  recommendedDirectPrice: number;
  returnsReserveAmount: number;
  platformFeeAmount: number;
  totalDeductionsAtRecommended: number;
  artisanNetAtRecommended: number;
  retailRetainedPctAtRecommended: number;
  comparableRetailPrice: number;
  traderBaselinePrice: number;
  upliftVsTraderAtRecommended: number;
  upliftPctVsTraderAtRecommended: number;
}

export interface RealizationReceiptMath {
  salePricePerUnit: number;
  quantity: number;
  grossOrderValue: number;
  returnsReserveAmount: number;
  platformFeeAmount: number;
  packagingLogistics: number;
  totalDeductionsPerUnit: number;
  artisanNetPerUnit: number;
  artisanTotalNetPayout: number;
  retailRetainedPct: number;
  traderBaselinePerUnit: number;
  incomeUpliftPerUnit: number;
  incomeUpliftTotal: number;
  incomeUpliftPct: number;
}

export interface HandloomProduct {
  id: string;
  title: string;
  cluster: 'Gadwal' | 'Narayanpet';
  craftType: string;
  materialSummary: string;
  artisanName: string;
  village: string;
  consentToDisplayName: boolean;
  imageUrl: string;
  secondaryImageUrl: string;
  status: 'draft' | 'published' | 'in_negotiation' | 'order_confirmed';
  publishedAt?: string;
  voicePinApprovedBy?: string;
  voicePinApprovedAt?: string;
  pricingInputs: PricingInputs;
  claims: ProductClaim[];
  evidence: EvidenceItem[];
  confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  comparableNote: string;
}

export interface AgentTimelineStep {
  id: number;
  label: string;
  status: 'idle' | 'running' | 'done' | 'warning' | 'blocked';
  detail: string;
}

export interface BuyerOffer {
  id: string;
  productId: string;
  buyerName: string;
  buyerLocation: string;
  quantity: number;
  offeredPricePerUnit: number;
  counterOfferPerUnit: number;
  status:
    | 'offer_received'
    | 'counter_drafted'
    | 'counter_approved'
    | 'buyer_accepted'
    | 'rejected';
  agentAlert: string;
  artisanApprovedAt?: string;
  buyerAcceptedAt?: string;
  deliveryTargetDays: number;
}

export interface BulkOrderRequest {
  id: string;
  buyerName: string;
  buyerType: string;
  cluster: 'Gadwal' | 'Narayanpet';
  productTitle: string;
  quantity: number;
  deadlineDays: number;
  offeredPricePerUnit: number;
  floorPricePerUnit: number;
  recommendedPricePerUnit: number;
  estimatedWeaversNeeded: number;
  status: 'pending_review' | 'approved_by_artisan' | 'scheduled';
  notes: string;
  approvedAt?: string;
}

export interface JanAIConsignment {
  id: string;
  orderRef: string;
  productId: string;
  productTitle: string;
  buyerName: string;
  quantity: number;
  agreedPricePerUnit: number;
  operatorName: string;
  kioskLocation: string;
  qcPassed: boolean;
  qcNotes: string;
  packagingPhotoLogged: boolean;
  dispatched: boolean;
  trackingCode: string;
  payoutReleased: boolean;
  payoutRef: string;
  updatedAt: string;
}

export interface ParsedVoiceResult {
  transcript: string;
  languageDetected: LanguageCode;
  craft: string;
  cluster: 'Gadwal' | 'Narayanpet';
  material: string;
  workers: number;
  days: number;
  yarnCost: number;
  giClaimed: boolean;
  handloomMarkClaimed: boolean;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface JudgeMetrics {
  artisansOnboarded: number;
  listingsCreated: number;
  verifiedEvidenceCoveragePct: number;
  hitlApprovalCompliancePct: number;
  avgArtisanNetRealizationPct: number;
  returnRatePct: number;
  buyerLeadsCount: number;
  bulkPipelineValueInr: number;
}

export interface DemoScriptStep {
  stepNumber: number;
  minuteMark: string;
  title: string;
  screen: ScreenId;
  speakerLine: string;
  actionHint: string;
}
