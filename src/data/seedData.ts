import {
  AgentTimelineStep,
  BulkOrderRequest,
  BuyerOffer,
  DemoScriptStep,
  HandloomProduct,
  JanAIConsignment,
  JudgeMetrics,
} from '../types/loomlink';

export const ASSETS = {
  gadwalSico: '/src/assets/images/gadwal_sico_saree_1795106741166.jpg',
  narayanpetCotton:
    '/src/assets/images/narayanpet_cotton_saree_1795106741238.jpg',
  loomPitloom: '/src/assets/images/weaver_handloom_pitloom_1795106742811.jpg',
  yarnBill: '/src/assets/images/yarn_bill_document_1795106742098.jpg',
  lakshmiPortrait:
    '/src/assets/images/artisan_lakshmi_portrait_1795106742789.jpg',
};

export interface ClusterPerson {
  id: string;
  name: string;
  role: 'artisan' | 'handler' | 'operator' | 'buyer' | 'judge';
  roleLabel: string;
  village: string;
  cluster: string;
  summary: string;
  permissions: string;
}

export const DEMO_PERSONAS: ClusterPerson[] = [
  {
    id: 'p-lakshmi',
    name: 'Lakshmi Devi',
    role: 'artisan',
    roleLabel: 'Artisan (Master Weaver)',
    village: 'Near Gadwal',
    cluster: 'Gadwal Cluster · Telugu',
    summary:
      'Pit-loom weaver crafting Gadwal Sico & cotton sarees with her family.',
    permissions: 'Full authority: Voice-PIN approval for prices, claims & orders.',
  },
  {
    id: 'p-ramesh',
    name: 'Ramesh',
    role: 'handler',
    roleLabel: 'Household Handler (Son)',
    village: 'Near Gadwal',
    cluster: 'Family Support',
    summary:
      'Helps photograph loom work and yarn bills on a shared Android phone.',
    permissions: 'Can upload photos & prep drafts. Cannot approve prices or claims.',
  },
  {
    id: 'p-srinivas',
    name: 'Srinivas',
    role: 'operator',
    roleLabel: 'JanAI Café Operator',
    village: 'Gadwal Kiosk Hub',
    cluster: 'Village Logistics & QC',
    summary:
      'Runs village kiosk for quality checks, packaging, dispatch & payout tracking.',
    permissions: 'Manages QC & dispatch. Cannot approve prices or product claims.',
  },
  {
    id: 'p-buyer',
    name: 'Hyderabad & Bengaluru Buyers',
    role: 'buyer',
    roleLabel: 'Boutique & Bulk Buyers',
    village: 'Hyderabad / Bengaluru',
    cluster: 'Verified Craft Marketplace',
    summary:
      'Browse zero-hallucination listings, submit offers, and place cluster bulk orders.',
    permissions: 'Can inspect verified evidence and negotiate direct with artisan.',
  },
  {
    id: 'p-judge',
    name: 'Hackathon Jury',
    role: 'judge',
    roleLabel: 'Tech4Bharat Judge View',
    village: 'GAVS Hackathon 2026',
    cluster: 'Governance & Metrics',
    summary:
      'Audit HITL compliance, zero-hallucination enforcement, and guided 3-min demo.',
    permissions: 'Full platform telemetry & instant demo reset.',
  },
];

export const INITIAL_AGENT_TIMELINE: AgentTimelineStep[] = [
  {
    id: 1,
    label: 'Transcribing Telugu voice',
    status: 'idle',
    detail: 'Waiting for voice or text intake',
  },
  {
    id: 2,
    label: 'Extracting product attributes',
    status: 'idle',
    detail: 'Craft, weave composition, workers, days, yarn cost',
  },
  {
    id: 3,
    label: 'Checking unsupported claims',
    status: 'idle',
    detail: 'Zero-hallucination guard on GI, Handloom Mark & silk claims',
  },
  {
    id: 4,
    label: 'Requesting evidence',
    status: 'idle',
    detail: 'Yarn purchase bill, loom photo, cooperative ID',
  },
  {
    id: 5,
    label: 'Matching GI eligibility',
    status: 'idle',
    detail: 'Cross-checking cluster registry & certificate status',
  },
  {
    id: 6,
    label: 'Fetching comparable market rates [SIMULATED]',
    status: 'idle',
    detail: 'Simulated boutique & retail benchmark lookup',
  },
  {
    id: 7,
    label: 'Calculating deterministic price',
    status: 'idle',
    detail: 'Formula-based floor & recommended direct price',
  },
  {
    id: 8,
    label: 'Preparing buyer-ready listing',
    status: 'idle',
    detail: 'Strict claim badges attached; zero fabricated story copy',
  },
  {
    id: 9,
    label: 'Waiting for artisan approval',
    status: 'idle',
    detail: 'Requires Lakshmi Devi Voice-PIN before publishing',
  },
];

export function createInitialProducts(): HandloomProduct[] {
  return [
    {
      id: 'prod-gadwal-01',
      title: 'Gadwal Cotton-Silk Sico Saree — Indigo Zari Temple Border',
      cluster: 'Gadwal',
      craftType: 'Gadwal cotton-silk Sico saree',
      materialSummary: 'Cotton body, silk border, zari pallu',
      artisanName: 'Lakshmi Devi',
      village: 'Near Gadwal, Telangana',
      consentToDisplayName: true,
      imageUrl: ASSETS.gadwalSico,
      secondaryImageUrl: ASSETS.loomPitloom,
      status: 'draft',
      pricingInputs: {
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
      },
      claims: [
        {
          id: 'cl-g-1',
          key: 'material',
          label: 'Material Composition',
          value: 'Cotton body, silk border, zari pallu',
          status: 'ARTISAN-REPORTED',
          requiredEvidence: ['yarn_bill'],
          reason: 'Artisan-reported; verification pending.',
        },
        {
          id: 'cl-g-2',
          key: 'labour',
          label: 'Loom Labour',
          value: '2 weavers × 5 loom days (10 person-days)',
          status: 'ARTISAN-REPORTED',
          requiredEvidence: ['loom_photo'],
          reason: 'Artisan-reported; verification pending.',
        },
        {
          id: 'cl-g-3',
          key: 'gi_tag',
          label: 'GI Gadwal Tag',
          value: 'GI Gadwal Handloom Origin',
          status: 'PENDING',
          requiredEvidence: ['gi_certificate', 'coop_id'],
          reason: 'Artisan-reported; verification pending.',
        },
        {
          id: 'cl-g-4',
          key: 'handloom_mark',
          label: 'Handloom Mark',
          value: 'Handwoven Pit-Loom Product',
          status: 'PENDING',
          requiredEvidence: ['handloom_mark'],
          reason: 'Artisan-reported; verification pending.',
        },
      ],
      evidence: [
        {
          id: 'ev-g-1',
          type: 'yarn_bill',
          title: 'Yarn Purchase Bill (₹3,200)',
          uploaded: false,
          fileNote: 'Cotton warp + mulberry silk border & zari bill',
        },
        {
          id: 'ev-g-2',
          type: 'loom_photo',
          title: 'Pit-Loom Work Photo',
          uploaded: false,
          fileNote: '2 weavers active on Gadwal pit-loom shed',
        },
        {
          id: 'ev-g-3',
          type: 'coop_id',
          title: 'Gadwal Weaver Cooperative ID',
          uploaded: false,
        },
        {
          id: 'ev-g-4',
          type: 'gi_certificate',
          title: 'GI Registration Certificate',
          uploaded: false,
        },
        {
          id: 'ev-g-5',
          type: 'handloom_mark',
          title: 'Handloom Mark Tag Photo',
          uploaded: false,
        },
      ],
      confidenceLevel: 'HIGH',
      comparableNote:
        'Comparable Gadwal Sico boutique retail rate ₹10,000 [SIMULATED].',
    },
    {
      id: 'prod-narayanpet-02',
      title: 'Narayanpet Handloom Cotton Saree — Terracotta Check',
      cluster: 'Narayanpet',
      craftType: 'Narayanpet cotton saree',
      materialSummary: 'Pure combed cotton body, indigo border, check weave',
      artisanName: 'Lakshmi Devi',
      village: 'Near Gadwal, Telangana',
      consentToDisplayName: true,
      imageUrl: ASSETS.narayanpetCotton,
      secondaryImageUrl: ASSETS.loomPitloom,
      status: 'published',
      publishedAt: 'Yesterday, 04:20 PM',
      voicePinApprovedBy: 'Lakshmi Devi (Voice-PIN)',
      voicePinApprovedAt: 'Yesterday, 04:20 PM',
      pricingInputs: {
        materialCost: 600,
        loomDays: 1,
        workers: 1,
        fairDailyWage: 220,
        packagingLogistics: 200,
        returnsReservePct: 3,
        platformFeePct: 9,
        comparableRetailPrice: 2600,
        comparableRetailRange: '₹1,800–₹3,500',
        artisanCraftMarginPct: 50,
        traderBaselinePrice: 820,
      },
      claims: [
        {
          id: 'cl-n-1',
          key: 'material',
          label: 'Material Composition',
          value: 'Pure handloom cotton with indigo border',
          status: 'VERIFIED',
          requiredEvidence: ['yarn_bill'],
          reason: 'Supported by uploaded Cotton Yarn Bill (₹600).',
          verifiedBy: 'Lakshmi Devi',
        },
        {
          id: 'cl-n-2',
          key: 'labour',
          label: 'Loom Labour',
          value: '1 weaver × 1 loom day',
          status: 'VERIFIED',
          requiredEvidence: ['loom_photo'],
          reason: 'Supported by uploaded Loom Photo.',
          verifiedBy: 'Ramesh (Son)',
        },
        {
          id: 'cl-n-3',
          key: 'gi_tag',
          label: 'Narayanpet Cluster Craft',
          value: 'Narayanpet Handloom Cotton',
          status: 'ARTISAN-REPORTED',
          requiredEvidence: ['gi_certificate'],
          reason: 'Artisan-reported; verification pending.',
        },
      ],
      evidence: [
        {
          id: 'ev-n-1',
          type: 'yarn_bill',
          title: 'Cotton Yarn Bill (₹600)',
          uploaded: true,
          uploadedBy: 'Lakshmi Devi',
          uploadedByRole: 'artisan',
          uploadedAt: 'Yesterday',
          imageUrl: ASSETS.yarnBill,
        },
        {
          id: 'ev-n-2',
          type: 'loom_photo',
          title: 'Loom Warp Photo',
          uploaded: true,
          uploadedBy: 'Ramesh (Son)',
          uploadedByRole: 'handler',
          uploadedAt: 'Yesterday',
          imageUrl: ASSETS.loomPitloom,
        },
        {
          id: 'ev-n-3',
          type: 'gi_certificate',
          title: 'GI Registration Certificate',
          uploaded: false,
        },
      ],
      confidenceLevel: 'HIGH',
      comparableNote:
        'Comparable retail ₹1,800–₹3,500 across urban handloom stores [SIMULATED].',
    },
  ];
}

export function createInitialOffers(): BuyerOffer[] {
  return [
    {
      id: 'offer-hyd-01',
      productId: 'prod-gadwal-01',
      buyerName: 'Deccan Looms Boutique',
      buyerLocation: 'Banjara Hills, Hyderabad',
      quantity: 5,
      offeredPricePerUnit: 5100,
      counterOfferPerUnit: 8000,
      status: 'counter_drafted',
      agentAlert:
        'Buyer offer ₹5,100 is below floor price ₹5,400. Counteroffer prepared at ₹8,000 for artisan approval.',
      deliveryTargetDays: 12,
    },
  ];
}

export function createInitialBulkOrders(): BulkOrderRequest[] {
  return [
    {
      id: 'bulk-blr-01',
      buyerName: 'Indigo & Earth Studio',
      buyerType: 'Bengaluru Independent Designer',
      cluster: 'Narayanpet',
      productTitle: 'Narayanpet Handloom Cotton Saree (Custom Indigo Border)',
      quantity: 20,
      deadlineDays: 18,
      offeredPricePerUnit: 1700,
      floorPricePerUnit: 820,
      recommendedPricePerUnit: 1650,
      estimatedWeaversNeeded: 4,
      status: 'pending_review',
      notes:
        'Designer requests 20 uniform cotton sarees with verified yarn bill provenance. Offer ₹1,700/saree exceeds recommended ₹1,650.',
    },
    {
      id: 'bulk-corp-02',
      buyerName: 'Sahyadri FinServe CSR Gifting',
      buyerType: 'Corporate Gifting Buyer',
      cluster: 'Gadwal',
      productTitle: 'Gadwal Cotton-Silk Sico & Narayanpet Gift Assortment',
      quantity: 50,
      deadlineDays: 15,
      offeredPricePerUnit: 5100,
      floorPricePerUnit: 5400,
      recommendedPricePerUnit: 7800,
      estimatedWeaversNeeded: 17,
      status: 'pending_review',
      notes:
        '50 sarees in 15 days requires 17 weavers across Gadwal Co-op. Current offer ₹5,100 is BELOW ₹5,400 floor price — blocked without upward counteroffer.',
    },
  ];
}

export function createInitialJanAIConsignments(): JanAIConsignment[] {
  return [
    {
      id: 'janai-01',
      orderRef: 'ORD-GDW-2026-041',
      productId: 'prod-gadwal-01',
      productTitle: 'Gadwal Cotton-Silk Sico Saree (5 Units)',
      buyerName: 'Deccan Looms Boutique, Hyderabad',
      quantity: 5,
      agreedPricePerUnit: 8000,
      operatorName: 'Srinivas',
      kioskLocation: 'Gadwal JanAI Café Kiosk #04',
      qcPassed: false,
      qcNotes: 'Awaiting selvedge, zari weave & length (6.2m) physical inspection.',
      packagingPhotoLogged: false,
      dispatched: false,
      trackingCode: 'SIM-INDPOST-GDW8821',
      payoutReleased: false,
      payoutRef: 'SIM-UPI-LAKSHMI-041',
      updatedAt: 'Pending buyer acceptance',
    },
  ];
}

export const INITIAL_JUDGE_METRICS: JudgeMetrics = {
  artisansOnboarded: 42,
  listingsCreated: 68,
  verifiedEvidenceCoveragePct: 86,
  hitlApprovalCompliancePct: 100,
  avgArtisanNetRealizationPct: 65.8,
  returnRatePct: 2.1,
  buyerLeadsCount: 29,
  bulkPipelineValueInr: 415000,
};

export const GUIDED_DEMO_SCRIPT: DemoScriptStep[] = [
  {
    stepNumber: 1,
    minuteMark: '0:00',
    title: '1. Telugu Voice Intake',
    screen: 'voice',
    speakerLine:
      'Lakshmi Devi speaks in code-mixed Telugu: "Idi Gadwal saree. Cotton body, silk border, zari pallu. Ikkada rendu mandi five days work chesaru. Yarn cost ₹3,200."',
    actionHint: 'Tap "Simulate Lakshmi Telugu Voice" to run extraction.',
  },
  {
    stepNumber: 2,
    minuteMark: '0:25',
    title: '2. Unsupported GI Claim Detection',
    screen: 'voice',
    speakerLine:
      'Zero-hallucination guard flags GI Gadwal as PENDING because no GI certificate is attached — never fabricating provenance.',
    actionHint: 'Inspect GI Gadwal PENDING status and move to Evidence Vault.',
  },
  {
    stepNumber: 3,
    minuteMark: '0:45',
    title: '3. Yarn Bill & Loom Photo Upload',
    screen: 'evidence',
    speakerLine:
      'Lakshmi or Ramesh uploads the Yarn Purchase Bill and Pit-Loom Photo. Material & Labour flip to VERIFIED while GI remains truthfully PENDING.',
    actionHint: 'Upload both Yarn Bill and Loom Photo in Evidence Vault.',
  },
  {
    stepNumber: 4,
    minuteMark: '1:10',
    title: '4. Deterministic Price Calculation',
    screen: 'pricing',
    speakerLine:
      'AI never invents prices. The visible formula adds ₹3,200 material + ₹2,200 labour = ₹5,400 floor price, and ₹7,800 recommended direct vs ₹10,000 retail.',
    actionHint: 'Verify ₹5,400 floor and ₹7,800 recommended price.',
  },
  {
    stepNumber: 5,
    minuteMark: '1:30',
    title: '5. Voice-PIN Artisan Approval',
    screen: 'publish',
    speakerLine:
      'Lakshmi approves publication with her Voice-PIN (1234). Handlers and kiosk operators remain locked out of approvals.',
    actionHint: 'Tap Approve & Publish with Voice-PIN and enter 1234.',
  },
  {
    stepNumber: 6,
    minuteMark: '1:50',
    title: '6 & 7. Below-Floor Boutique Offer & AI Counteroffer',
    screen: 'negotiation',
    speakerLine:
      'A Hyderabad boutique offers ₹5,100 × 5 (below the ₹5,400 floor). The agent blocks it and drafts an ₹8,000/saree counteroffer.',
    actionHint: 'Review the below-floor alert and ₹8,000 AI counteroffer.',
  },
  {
    stepNumber: 7,
    minuteMark: '2:10',
    title: '8. Artisan Approval & Buyer Acceptance',
    screen: 'negotiation',
    speakerLine:
      'Lakshmi approves the ₹8,000 counteroffer with her Voice-PIN, and the boutique accepts the ₹40,000 order.',
    actionHint: 'Approve ₹8,000 with Voice-PIN 1234, then click Simulate Buyer Accepts.',
  },
  {
    stepNumber: 8,
    minuteMark: '2:30',
    title: '9 & 10. JanAI Café QC, Dispatch & Value Receipt',
    screen: 'janai',
    speakerLine:
      'Srinivas logs QC, packaging, dispatch, and payout at JanAI Café. Lakshmi’s Value Receipt proves ₹6,690 net/saree (66.9% retail retained, +₹2,590 vs trader).',
    actionHint: 'Complete the 4 JanAI Café steps and open Artisan Value Receipt.',
  },
];
