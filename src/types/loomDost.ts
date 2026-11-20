import {
  AgentTimelineStep,
  BulkOrderRequest,
  BuyerOffer,
  ClaimStatus,
  HandloomProduct,
  JanAIConsignment,
  LanguageCode,
  ScreenId,
  UserRole,
} from './loomlink';

export type DostState =
  | 'IDLE'
  | 'LISTENING'
  | 'THINKING'
  | 'EXPLAINING'
  | 'WAITING_FOR_ACTION'
  | 'APPROVAL_REMINDER'
  | 'ERROR_HELP';

export type DostTargetId =
  | 'voice-mic-btn'
  | 'voice-transcript'
  | 'voice-gi-claim'
  | 'evidence-yarn-bill'
  | 'evidence-loom-photo'
  | 'evidence-coop-gi'
  | 'evidence-claim-matrix'
  | 'pricing-material'
  | 'pricing-labour'
  | 'pricing-logistics'
  | 'pricing-fees'
  | 'pricing-floor'
  | 'pricing-recommended'
  | 'pricing-gi-badge'
  | 'pricing-publish-cta'
  | 'publish-pin-btn'
  | 'negotiation-offer'
  | 'negotiation-guard'
  | 'negotiation-counter'
  | 'negotiation-approve-btn'
  | 'bulk-capacity'
  | 'bulk-deadline-alert'
  | 'janai-qc-card'
  | 'janai-lock-banner'
  | 'receipt-net-payout'
  | 'receipt-retained-pct'
  | 'receipt-trader-uplift';

export interface DostContextSnapshot {
  screen: ScreenId;
  role: UserRole;
  language: LanguageCode;
  isOffline: boolean;
  product: HandloomProduct;
  activeOffer?: BuyerOffer;
  bulkOrders: BulkOrderRequest[];
  consignment?: JanAIConsignment;
  timeline: AgentTimelineStep[];
}

export interface DostYesNoPrompt {
  question: string;
  yesLabel: string;
  noLabel: string;
  actionOnYes: 'REPLAY_PRICING_SLOW' | 'REPEAT_SLOW';
}

export interface DostCue {
  id: string;
  targetId?: DostTargetId;
  state: DostState;
  title: string;
  text: string;
  claimBadge?: ClaimStatus;
  isSimulated?: boolean;
  thinkingLabel?: string;
  yesNoPrompt?: DostYesNoPrompt;
  stepIndex?: number;
  totalSteps?: number;
}

export interface DostActivityItem {
  id: string;
  timestamp: string;
  message: string;
  simulated: boolean;
}

export interface DostQuickTopic {
  id: string;
  label: string;
  query: string;
}

export interface DostLocaleBundle {
  ui: {
    name: string;
    subtitle: string;
    idleTooltip: string;
    listeningLabel: string;
    thinkingPrefix: string;
    repeatBtn: string;
    slowDownBtn: string;
    normalSpeedBtn: string;
    translateLabel: string;
    nextBtn: string;
    prevBtn: string;
    gotItBtn: string;
    askVoiceBtn: string;
    stopListeningBtn: string;
    askPlaceholder: string;
    sendBtn: string;
    yesBtn: string;
    noBtn: string;
    muteLabel: string;
    unmuteLabel: string;
    dismissLabel: string;
    openGuideLabel: string;
    offscreenHint: string;
    errorUnclear: string;
    retryBtn: string;
    simulatedBadge: string;
    activityTitle: string;
    waitingActionBadge: string;
    approvalBadge: string;
  };
  stateLabels: Record<DostState, string>;
  thinkingStatuses: {
    checkingYarnBill: string;
    matchingCluster: string;
    calculatingPrice: string;
    preparingListing: string;
  };
  claimDefinitions: Record<ClaimStatus, string>;
  pricingDemoFlow: {
    welcomeTitle: string;
    welcome: string;
    materialTitle: string;
    material: (amount: string) => string;
    labourTitle: string;
    labour: (workers: number, days: number, amount: string) => string;
    floorTitle: string;
    floor: (amount: string) => string;
    giTitle: string;
    giPending: string;
    giVerified: string;
    giBlocked: string;
    askReplayTitle: string;
    askReplay: string;
    slowSummaryTitle: string;
    slowSummary: (
      material: string,
      labour: string,
      logistics: string,
      floor: string,
      recommended: string,
      bulkMin: string
    ) => string;
    voicePinTitle: string;
    voicePinReminder: string;
  };
  screens: {
    voice: {
      recordCue: string;
      inputsCue: string;
      unsupportedCue: string;
      giPendingCue: string;
    };
    evidence: {
      yarnBillCue: string;
      loomPhotoCue: string;
      coopGiCue: string;
      handloomConsentCue: string;
      verifiedVsReportedCue: string;
    };
    pricing: {
      logisticsCue: string;
      feesCue: string;
      recommendedBulkCue: string;
    };
    publish: {
      gateCue: string;
    };
    negotiation: {
      offerBelowFloorCue: (offer: string, floor: string) => string;
      offerAboveFloorCue: (offer: string, rec: string) => string;
      counterCapacityCue: (counter: string, days: number) => string;
      approvalCue: string;
    };
    bulk: {
      capacityCue: (qty: number, weavers: number) => string;
      stagedDeadlineCue: string;
    };
    janai: {
      qcDispatchCue: string;
      operatorLockCue: string;
    };
    receipt: {
      netCue: (netUnit: string, total: string, qty: number) => string;
      retainedCue: (pct: number) => string;
      upliftCue: (trader: string, uplift: string) => string;
    };
    general: {
      welcomeCue: string;
    };
  };
  quickTopics: DostQuickTopic[];
}
