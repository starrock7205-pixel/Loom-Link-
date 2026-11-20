import React, { useEffect, useState } from 'react';
import { AppShell } from './components/AppShell';
import { LoomDostWidget } from './components/loomdost/LoomDostWidget';
import {
  ASSETS,
  INITIAL_AGENT_TIMELINE,
  INITIAL_JUDGE_METRICS,
  createInitialBulkOrders,
  createInitialJanAIConsignments,
  createInitialOffers,
  createInitialProducts,
} from './data/seedData';
import {
  AgentTimelineStep,
  BulkOrderRequest,
  BuyerOffer,
  EvidenceType,
  HandloomProduct,
  JanAIConsignment,
  JudgeMetrics,
  LanguageCode,
  ParsedVoiceResult,
  PricingInputs,
  ScreenId,
  UserRole,
} from './types/loomlink';
import { calculateDeterministicPricing } from './utils/pricingEngine';
import {
  evaluateBuyerOffer,
  evaluateClaimsWithEvidence,
} from './utils/voiceParser';
import { LandingScreen } from './screens/LandingScreen';
import { ArtisanDashboardScreen } from './screens/ArtisanDashboardScreen';
import { VoiceIntakeWizardScreen } from './screens/VoiceIntakeWizardScreen';
import { EvidenceVaultScreen } from './screens/EvidenceVaultScreen';
import { PricingStudioScreen } from './screens/PricingStudioScreen';
import { PublicationGateScreen } from './screens/PublicationGateScreen';
import { NegotiationConsoleScreen } from './screens/NegotiationConsoleScreen';
import { BulkOrderDeskScreen } from './screens/BulkOrderDeskScreen';
import { JanAIConsoleScreen } from './screens/JanAIConsoleScreen';
import { MarketplaceScreen } from './screens/MarketplaceScreen';
import { ProductDetailScreen } from './screens/ProductDetailScreen';
import { ValueReceiptScreen } from './screens/ValueReceiptScreen';
import { JudgeDashboardScreen } from './screens/JudgeDashboardScreen';
import { DemoScriptScreen } from './screens/DemoScriptScreen';

const VALID_SCREENS: ScreenId[] = [
  'landing',
  'artisan',
  'voice',
  'evidence',
  'pricing',
  'publish',
  'negotiation',
  'bulk',
  'janai',
  'marketplace',
  'pdp',
  'receipt',
  'judge',
  'script',
];

function resolveInitialScreen(): ScreenId {
  if (typeof window === 'undefined') return 'landing';
  const params = new URLSearchParams(window.location.search);
  const screenParam = params.get('screen') as ScreenId | null;
  if (screenParam && VALID_SCREENS.includes(screenParam)) {
    return screenParam;
  }
  if (params.get('autostart') === '1') {
    return 'artisan';
  }
  return 'landing';
}

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenId>(resolveInitialScreen);
  const [role, setRole] = useState<UserRole>('artisan');
  const [language, setLanguage] = useState<LanguageCode>('te');
  const [isOffline, setIsOffline] = useState(false);

  const [products, setProducts] = useState<HandloomProduct[]>(createInitialProducts);
  const [selectedProductId, setSelectedProductId] = useState<string>('prod-gadwal-01');
  const [forceBlockGi, setForceBlockGi] = useState(false);

  const [timeline, setTimeline] = useState<AgentTimelineStep[]>(INITIAL_AGENT_TIMELINE);
  const [offers, setOffers] = useState<BuyerOffer[]>(createInitialOffers);
  const [bulkOrders, setBulkOrders] = useState<BulkOrderRequest[]>(createInitialBulkOrders);
  const [consignments, setConsignments] = useState<JanAIConsignment[]>(
    createInitialJanAIConsignments
  );
  const [judgeMetrics, setJudgeMetrics] = useState<JudgeMetrics>(INITIAL_JUDGE_METRICS);

  const activeProduct =
    products.find((p) => p.id === selectedProductId) ?? products[0];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeScreen]);

  const handleApplyParsedDraft = (parsed: ParsedVoiceResult) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id !== 'prod-gadwal-01') return prod;
        const nextInputs: PricingInputs = {
          ...prod.pricingInputs,
          materialCost: parsed.yarnCost,
          workers: parsed.workers,
          loomDays: parsed.days,
        };
        const updatedClaims = prod.claims.map((c) => {
          if (c.key === 'material') {
            return { ...c, value: parsed.material };
          }
          if (c.key === 'labour') {
            return {
              ...c,
              value: `${parsed.workers} weavers × ${parsed.days} loom days (${
                parsed.workers * parsed.days
              } person-days)`,
            };
          }
          return c;
        });
        return {
          ...prod,
          craftType: parsed.craft,
          materialSummary: parsed.material,
          pricingInputs: nextInputs,
          confidenceLevel: parsed.confidence,
          claims: evaluateClaimsWithEvidence(updatedClaims, prod.evidence, forceBlockGi),
        };
      })
    );
  };

  const handleToggleEvidence = (
    productId: string,
    evidenceType: EvidenceType,
    uploaded: boolean
  ) => {
    const uploaderLabel =
      role === 'handler'
        ? 'Ramesh (Son)'
        : role === 'operator'
          ? 'Srinivas (JanAI Café)'
          : 'Lakshmi Devi';

    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id !== productId) return prod;
        const nextEvidence = prod.evidence.map((ev) =>
          ev.type === evidenceType
            ? {
                ...ev,
                uploaded,
                uploadedBy: uploaded ? uploaderLabel : undefined,
                uploadedByRole: uploaded ? role : undefined,
                uploadedAt: uploaded ? 'Just now' : undefined,
                imageUrl:
                  uploaded && evidenceType === 'yarn_bill'
                    ? ASSETS.yarnBill
                    : uploaded && evidenceType === 'loom_photo'
                      ? ASSETS.loomPitloom
                      : ev.imageUrl,
              }
            : ev
        );
        const nextClaims = evaluateClaimsWithEvidence(
          prod.claims,
          nextEvidence,
          forceBlockGi
        );
        return {
          ...prod,
          evidence: nextEvidence,
          claims: nextClaims,
        };
      })
    );
  };

  const handleUploadDemoProofs = (productId: string) => {
    const uploaderLabel =
      role === 'handler'
        ? 'Ramesh (Son)'
        : role === 'operator'
          ? 'Srinivas (JanAI Café)'
          : 'Lakshmi Devi';

    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id !== productId) return prod;
        const nextEvidence = prod.evidence.map((ev) =>
          ev.type === 'yarn_bill' || ev.type === 'loom_photo'
            ? {
                ...ev,
                uploaded: true,
                uploadedBy: uploaderLabel,
                uploadedByRole: role,
                uploadedAt: 'Just now',
                imageUrl:
                  ev.type === 'yarn_bill' ? ASSETS.yarnBill : ASSETS.loomPitloom,
              }
            : ev
        );
        return {
          ...prod,
          evidence: nextEvidence,
          claims: evaluateClaimsWithEvidence(
            prod.claims,
            nextEvidence,
            forceBlockGi
          ),
        };
      })
    );
  };

  const handleToggleForceBlockGi = () => {
    const nextBlock = !forceBlockGi;
    setForceBlockGi(nextBlock);
    setProducts((prev) =>
      prev.map((prod) => ({
        ...prod,
        claims: evaluateClaimsWithEvidence(prod.claims, prod.evidence, nextBlock),
      }))
    );
  };

  const handleUpdatePricing = (productId: string, nextInputs: PricingInputs) => {
    setProducts((prev) =>
      prev.map((prod) =>
        prod.id === productId ? { ...prod, pricingInputs: nextInputs } : prod
      )
    );
  };

  const handlePublishProduct = (productId: string) => {
    setProducts((prev) =>
      prev.map((prod) =>
        prod.id === productId
          ? {
              ...prod,
              status: 'published',
              publishedAt: 'Just now',
              voicePinApprovedBy: 'Lakshmi Devi (Voice-PIN)',
              voicePinApprovedAt: 'Just now',
            }
          : prod
      )
    );
    setJudgeMetrics((m) => ({
      ...m,
      listingsCreated: m.listingsCreated + 1,
    }));
  };

  const handleApproveCounteroffer = (offerId: string, counterPrice: number) => {
    setOffers((prev) =>
      prev.map((o) =>
        o.id === offerId
          ? {
              ...o,
              counterOfferPerUnit: counterPrice,
              status: 'counter_approved',
              artisanApprovedAt: 'Just now',
            }
          : o
      )
    );
  };

  const handleSimulateBuyerAccept = (offerId: string) => {
    const target = offers.find((o) => o.id === offerId);
    setOffers((prev) =>
      prev.map((o) =>
        o.id === offerId
          ? {
              ...o,
              status: 'buyer_accepted',
              buyerAcceptedAt: 'Just now',
            }
          : o
      )
    );
    if (target) {
      setConsignments((prev) =>
        prev.map((c) =>
          c.productId === target.productId
            ? {
                ...c,
                agreedPricePerUnit: target.counterOfferPerUnit,
                quantity: target.quantity,
                updatedAt: 'Buyer accepted — ready for JanAI QC',
              }
            : c
        )
      );
      setProducts((prev) =>
        prev.map((p) =>
          p.id === target.productId ? { ...p, status: 'order_confirmed' } : p
        )
      );
    }
  };

  const handleSimulateCustomOffer = (offerId: string, price: number) => {
    const targetOffer = offers.find((o) => o.id === offerId);
    const targetProduct =
      products.find((p) => p.id === targetOffer?.productId) ?? activeProduct;
    const pricing = calculateDeterministicPricing(targetProduct.pricingInputs);
    const evalResult = evaluateBuyerOffer(
      price,
      pricing.artisanFloorPrice,
      pricing.recommendedDirectPrice
    );

    setOffers((prev) =>
      prev.map((o) =>
        o.id === offerId
          ? {
              ...o,
              offeredPricePerUnit: price,
              counterOfferPerUnit:
                price < pricing.artisanFloorPrice ? 8000 : evalResult.recommendedCounter,
              agentAlert: evalResult.alertMessage,
              status: 'counter_drafted',
            }
          : o
      )
    );
  };

  const handleSubmitBuyerOfferFromPdp = (pricePerUnit: number, quantity: number) => {
    setOffers((prev) =>
      prev.map((o, idx) =>
        idx === 0
          ? {
              ...o,
              productId: activeProduct.id,
              offeredPricePerUnit: pricePerUnit,
              quantity,
              status: 'counter_drafted',
            }
          : o
      )
    );
  };

  const handleApproveBulkOrder = (bulkId: string) => {
    setBulkOrders((prev) =>
      prev.map((b) =>
        b.id === bulkId
          ? { ...b, status: 'approved_by_artisan', approvedAt: 'Just now' }
          : b
      )
    );
  };

  const handleAdvanceJanAIStage = (
    consignmentId: string,
    stage: 'qc' | 'packaging' | 'dispatch' | 'payout'
  ) => {
    setConsignments((prev) =>
      prev.map((c) => {
        if (c.id !== consignmentId) return c;
        if (stage === 'qc') {
          return {
            ...c,
            qcPassed: true,
            qcNotes: 'Selvedge, zari pallu, and 6.2m drape verified at Gadwal JanAI Café.',
            updatedAt: 'QC Passed by Srinivas',
          };
        }
        if (stage === 'packaging') {
          return {
            ...c,
            packagingPhotoLogged: true,
            updatedAt: 'Packaging photo logged',
          };
        }
        if (stage === 'dispatch') {
          return {
            ...c,
            dispatched: true,
            updatedAt: 'Dispatched via simulated courier',
          };
        }
        return {
          ...c,
          payoutReleased: true,
          updatedAt: 'Payout settled to Lakshmi Devi',
        };
      })
    );
  };

  const handleResetDemo = () => {
    setRole('artisan');
    setLanguage('te');
    setIsOffline(false);
    setForceBlockGi(false);
    setProducts(createInitialProducts());
    setSelectedProductId('prod-gadwal-01');
    setTimeline(INITIAL_AGENT_TIMELINE);
    setOffers(createInitialOffers());
    setBulkOrders(createInitialBulkOrders());
    setConsignments(createInitialJanAIConsignments());
    setJudgeMetrics(INITIAL_JUDGE_METRICS);
  };

  return (
    <AppShell
      activeScreen={activeScreen}
      onNavigate={setActiveScreen}
      role={role}
      onRoleChange={setRole}
      language={language}
      onLanguageChange={setLanguage}
      isOffline={isOffline}
      onToggleOffline={() => setIsOffline((v) => !v)}
    >
      {activeScreen === 'landing' && (
        <LandingScreen
          activeRole={role}
          language={language}
          onSelectRole={(nextRole, targetScreen) => {
            setRole(nextRole);
            setActiveScreen(targetScreen);
          }}
          onSelectLanguage={setLanguage}
          onStartDemo={() => {
            setRole('artisan');
            setLanguage('te');
            setActiveScreen('voice');
          }}
        />
      )}

      {activeScreen === 'artisan' && (
        <ArtisanDashboardScreen
          language={language}
          role={role}
          products={products}
          offers={offers}
          selectedProductId={selectedProductId}
          onSelectProduct={setSelectedProductId}
          onNavigate={setActiveScreen}
          onSwitchToArtisan={() => setRole('artisan')}
        />
      )}

      {activeScreen === 'voice' && (
        <VoiceIntakeWizardScreen
          language={language}
          isOffline={isOffline}
          timeline={timeline}
          onSetTimeline={setTimeline}
          onApplyParsedDraft={handleApplyParsedDraft}
          onNavigate={setActiveScreen}
          onToggleOffline={(force) =>
            setIsOffline((prev) => (typeof force === 'boolean' ? force : !prev))
          }
        />
      )}

      {activeScreen === 'evidence' && (
        <EvidenceVaultScreen
          role={role}
          product={activeProduct}
          forceBlockGi={forceBlockGi}
          onToggleEvidence={handleToggleEvidence}
          onUploadDemoProofs={handleUploadDemoProofs}
          onToggleForceBlockGi={handleToggleForceBlockGi}
          onNavigate={setActiveScreen}
        />
      )}

      {activeScreen === 'pricing' && (
        <PricingStudioScreen
          product={activeProduct}
          onUpdatePricing={handleUpdatePricing}
          onNavigate={setActiveScreen}
        />
      )}

      {activeScreen === 'publish' && (
        <PublicationGateScreen
          role={role}
          product={activeProduct}
          onPublishProduct={handlePublishProduct}
          onNavigate={setActiveScreen}
          onSwitchToArtisan={() => setRole('artisan')}
        />
      )}

      {activeScreen === 'negotiation' && (
        <NegotiationConsoleScreen
          role={role}
          product={activeProduct}
          offers={offers}
          onApproveCounteroffer={handleApproveCounteroffer}
          onSimulateBuyerAccept={handleSimulateBuyerAccept}
          onSimulateCustomOffer={handleSimulateCustomOffer}
          onNavigate={setActiveScreen}
          onSwitchToArtisan={() => setRole('artisan')}
        />
      )}

      {activeScreen === 'bulk' && (
        <BulkOrderDeskScreen
          role={role}
          bulkOrders={bulkOrders}
          onApproveBulkOrder={handleApproveBulkOrder}
          onSwitchToArtisan={() => setRole('artisan')}
        />
      )}

      {activeScreen === 'janai' && (
        <JanAIConsoleScreen
          role={role}
          consignments={consignments}
          onAdvanceStage={handleAdvanceJanAIStage}
          onSwitchToOperator={() => setRole('operator')}
          onNavigate={setActiveScreen}
        />
      )}

      {activeScreen === 'marketplace' && (
        <MarketplaceScreen
          products={products}
          onSelectProduct={setSelectedProductId}
          onNavigate={setActiveScreen}
        />
      )}

      {activeScreen === 'pdp' && (
        <ProductDetailScreen
          product={activeProduct}
          onNavigate={setActiveScreen}
          onSubmitBuyerOffer={handleSubmitBuyerOfferFromPdp}
        />
      )}

      {activeScreen === 'receipt' && (
        <ValueReceiptScreen
          product={activeProduct}
          offer={offers[0]}
          consignment={consignments[0]}
        />
      )}

      {activeScreen === 'judge' && (
        <JudgeDashboardScreen
          metrics={judgeMetrics}
          onResetDemo={handleResetDemo}
          onNavigate={setActiveScreen}
        />
      )}

      {activeScreen === 'script' && (
        <DemoScriptScreen
          onNavigate={setActiveScreen}
          onResetDemo={handleResetDemo}
        />
      )}

      <LoomDostWidget
        snapshot={{
          screen: activeScreen,
          role,
          language,
          isOffline,
          product: activeProduct,
          activeOffer: offers[0],
          bulkOrders,
          consignment: consignments[0],
          timeline,
        }}
        onLanguageChange={setLanguage}
      />
    </AppShell>
  );
}
