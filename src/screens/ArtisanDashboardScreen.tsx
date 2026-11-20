import React from 'react';
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  FileCheck2,
  Handshake,
  Mic,
  Package,
  Receipt,
  ShieldCheck,
} from 'lucide-react';
import { ASSETS } from '../data/seedData';
import { TRANSLATIONS } from '../data/translations';
import {
  BuyerOffer,
  HandloomProduct,
  LanguageCode,
  ScreenId,
  UserRole,
} from '../types/loomlink';
import { calculateDeterministicPricing } from '../utils/pricingEngine';
import {
  Button,
  Card,
  ClaimStatusBadge,
  ResilientImage,
  RoleLockNotice,
} from '../components/ui/Primitives';

interface ArtisanDashboardScreenProps {
  language: LanguageCode;
  role: UserRole;
  products: HandloomProduct[];
  offers: BuyerOffer[];
  selectedProductId: string;
  onSelectProduct: (id: string) => void;
  onNavigate: (screen: ScreenId) => void;
  onSwitchToArtisan: () => void;
}

export function ArtisanDashboardScreen({
  language,
  role,
  products,
  offers,
  selectedProductId,
  onSelectProduct,
  onNavigate,
  onSwitchToArtisan,
}: ArtisanDashboardScreenProps) {
  const t = TRANSLATIONS[language];
  const gadwal = products[0];
  const pricing = calculateDeterministicPricing(gadwal.pricingInputs);
  const pendingOffer = offers[0];

  return (
    <div className="space-y-6">
      <RoleLockNotice role={role} onSwitchToArtisan={onSwitchToArtisan} />

      {/* Artisan Welcome Card */}
      <Card className="p-5 sm:p-7 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <ResilientImage
              src={ASSETS.lakshmiPortrait}
              alt="Artisan Lakshmi Devi"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-[#1E2A4A]/15 shrink-0"
              fallbackTitle="Lakshmi Devi"
            />
            <div>
              <p className="text-xs font-semibold text-[#C2593F]">
                Gadwal Weaver Cooperative · Cluster Member
              </p>
              <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#1E2A4A] mt-0.5">
                {t.greeting}
              </h1>
              <p className="text-sm text-[#565B69] mt-1">{t.promiseBanner}</p>
            </div>
          </div>

          <Button
            variant="terracotta"
            size="lg"
            onClick={() => onNavigate('voice')}
            className="w-full sm:w-auto"
          >
            <Mic className="w-5 h-5" />
            <span>{t.recordSareeCta}</span>
          </Button>
        </div>
      </Card>

      {/* Large Touch-Friendly 3-Tap Quick Action Grid */}
      <section aria-labelledby="quick-actions-heading" className="space-y-3">
        <h2
          id="quick-actions-heading"
          className="font-display text-xl font-semibold text-[#1E2A4A]"
        >
          Your Loom Actions (3 Taps to Market)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="p-5 flex flex-col justify-between gap-4">
            <div className="space-y-1.5">
              <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] border border-[#1E2A4A]/15 flex items-center justify-center text-[#C2593F]">
                <Mic className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-display text-lg font-semibold text-[#1E2A4A]">
                1. {t.recordSareeCta}
              </h3>
              <p className="text-sm text-[#565B69]">
                Speak in Telugu, Hindi, or Kannada to build a structured saree listing.
              </p>
            </div>
            <Button variant="primary" onClick={() => onNavigate('voice')} className="w-full justify-between">
              <span>Open Voice Wizard</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Card>

          <Card className="p-5 flex flex-col justify-between gap-4">
            <div className="space-y-1.5">
              <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] border border-[#1E2A4A]/15 flex items-center justify-center text-[#1E2A4A]">
                <FileCheck2 className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-display text-lg font-semibold text-[#1E2A4A]">
                2. {t.evidenceCta}
              </h3>
              <p className="text-sm text-[#565B69]">
                Add yarn bill, loom photo, or GI certificate so buyers see VERIFIED claims.
              </p>
            </div>
            <Button variant="outline" onClick={() => onNavigate('evidence')} className="w-full justify-between">
              <span>Open Evidence Vault</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Card>

          <Card className="p-5 flex flex-col justify-between gap-4">
            <div className="space-y-1.5">
              <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] border border-[#1E2A4A]/15 flex items-center justify-center text-[#1F6E43]">
                <Calculator className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-display text-lg font-semibold text-[#1E2A4A]">
                3. {t.pricingCta}
              </h3>
              <p className="text-sm text-[#565B69]">
                Floor ₹{pricing.artisanFloorPrice.toLocaleString('en-IN')} · Recommended ₹
                {pricing.recommendedDirectPrice.toLocaleString('en-IN')}
              </p>
            </div>
            <Button variant="outline" onClick={() => onNavigate('pricing')} className="w-full justify-between">
              <span>Open Pricing Studio</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Card>

          <Card className="p-5 flex flex-col justify-between gap-4">
            <div className="space-y-1.5">
              <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] border border-[#1E2A4A]/15 flex items-center justify-center text-[#1E2A4A]">
                <ShieldCheck className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-display text-lg font-semibold text-[#1E2A4A]">
                4. {t.publishCta}
              </h3>
              <p className="text-sm text-[#565B69]">
                Review buyer card and confirm listing with your Voice-PIN.
              </p>
            </div>
            <Button variant="outline" onClick={() => onNavigate('publish')} className="w-full justify-between">
              <span>Review & Publish</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Card>

          <Card className="p-5 flex flex-col justify-between gap-4">
            <div className="space-y-1.5">
              <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] border border-[#1E2A4A]/15 flex items-center justify-center text-[#C2593F]">
                <Handshake className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-display text-lg font-semibold text-[#1E2A4A]">
                5. {t.offersCta}
              </h3>
              <p className="text-sm text-[#565B69]">
                {pendingOffer.buyerName}: ₹
                {pendingOffer.offeredPricePerUnit.toLocaleString('en-IN')} × {pendingOffer.quantity}
              </p>
            </div>
            <Button variant="terracotta" onClick={() => onNavigate('negotiation')} className="w-full justify-between">
              <span>Review Offer & Counter</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Card>

          <Card className="p-5 flex flex-col justify-between gap-4">
            <div className="space-y-1.5">
              <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] border border-[#1E2A4A]/15 flex items-center justify-center text-[#1F6E43]">
                <Receipt className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-display text-lg font-semibold text-[#1E2A4A]">
                6. {t.receiptCta}
              </h3>
              <p className="text-sm text-[#565B69]">
                See net payout, retail % retained, and trader uplift proof.
              </p>
            </div>
            <Button variant="outline" onClick={() => onNavigate('receipt')} className="w-full justify-between">
              <span>Open Value Receipt</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Card>
        </div>
      </section>

      {/* Active Saree Inventory */}
      <section aria-labelledby="active-sarees-heading" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2
            id="active-sarees-heading"
            className="font-display text-xl font-semibold text-[#1E2A4A]"
          >
            Your Loom Inventory ({products.length})
          </h2>
          <Button variant="ghost" size="sm" onClick={() => onNavigate('bulk')}>
            <Package className="w-4 h-4" />
            <span>Bulk Order Desk (2)</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((product) => {
            const p = calculateDeterministicPricing(product.pricingInputs);
            const verifiedCount = product.claims.filter(
              (c) => c.status === 'VERIFIED'
            ).length;
            const isSelected = product.id === selectedProductId;

            return (
              <Card
                key={product.id}
                className={`p-4 sm:p-5 flex flex-col gap-4 ${
                  isSelected ? 'ring-2 ring-[#1E2A4A]' : ''
                }`}
              >
                <div className="flex gap-4">
                  <ResilientImage
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover shrink-0 border border-[#1E2A4A]/10"
                    fallbackTitle={product.cluster}
                  />
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <p className="text-xs text-[#565B69]">
                      {product.cluster} Cluster ·{' '}
                      <span className="font-semibold text-[#1E2A4A] uppercase">
                        {product.status.replace('_', ' ')}
                      </span>
                    </p>
                    <h3 className="font-display text-lg font-semibold text-[#1E2A4A] leading-snug">
                      {product.title}
                    </h3>
                    <p className="text-sm text-[#565B69]">{product.materialSummary}</p>
                    <p className="text-sm font-mono-num font-semibold text-[#1E2A4A]">
                      Direct: ₹{p.recommendedDirectPrice.toLocaleString('en-IN')} · Floor: ₹
                      {p.artisanFloorPrice.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#1E2A4A]/10">
                  <div className="flex items-center gap-2 text-xs text-[#565B69]">
                    <CheckCircle2 className="w-4 h-4 text-[#1F6E43]" aria-hidden="true" />
                    <span>
                      {verifiedCount}/{product.claims.length} claims verified
                    </span>
                    <ClaimStatusBadge
                      status={
                        product.claims.find((c) => c.key === 'gi_tag')?.status ??
                        'PENDING'
                      }
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        onSelectProduct(product.id);
                        onNavigate('evidence');
                      }}
                    >
                      Manage
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => {
                        onSelectProduct(product.id);
                        onNavigate('publish');
                      }}
                    >
                      Listing Gate
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
