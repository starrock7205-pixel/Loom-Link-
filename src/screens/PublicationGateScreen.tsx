import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Lock, ShieldCheck } from 'lucide-react';
import { HandloomProduct, ScreenId, UserRole } from '../types/loomlink';
import { calculateDeterministicPricing } from '../utils/pricingEngine';
import {
  canApproveCriticalAction,
  getClaimDisplayFallback,
} from '../utils/voiceParser';
import {
  Button,
  Card,
  ClaimStatusBadge,
  ResilientImage,
  RoleLockNotice,
  SimulatedTag,
  VoicePinModal,
} from '../components/ui/Primitives';

interface PublicationGateScreenProps {
  role: UserRole;
  product: HandloomProduct;
  onPublishProduct: (productId: string) => void;
  onNavigate: (screen: ScreenId) => void;
  onSwitchToArtisan: () => void;
}

export function PublicationGateScreen({
  role,
  product,
  onPublishProduct,
  onNavigate,
  onSwitchToArtisan,
}: PublicationGateScreenProps) {
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const pricing = calculateDeterministicPricing(product.pricingInputs);
  const isPublished = product.status !== 'draft';
  const isArtisan = canApproveCriticalAction(role);

  return (
    <div className="space-y-6">
      <RoleLockNotice role={role} onSwitchToArtisan={onSwitchToArtisan} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-[#C2593F]">
            Step 5 · Human-in-the-Loop Publication Gate
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#1E2A4A]">
            Listing Preview & Voice-PIN Approval
          </h1>
          <p className="text-sm text-[#565B69] mt-1">
            Review the exact buyer-ready card before publishing. Unverified claims remain transparently marked.
          </p>
        </div>

        <Button variant="outline" onClick={() => onNavigate('negotiation')}>
          <span>Next: Buyer Offers</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Buyer Card Preview */}
        <Card className="lg:col-span-7 overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-12 items-stretch">
            <div className="sm:col-span-5 bg-[#F2ECE1]">
              <ResilientImage
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-64 sm:h-full object-cover"
                fallbackTitle={product.cluster}
              />
            </div>

            <div className="sm:col-span-7 p-5 sm:p-6 space-y-4">
              <div>
                <p className="text-xs text-[#565B69]">
                  {product.cluster} Cluster · Woven by {product.artisanName} ({product.village})
                </p>
                <h2 className="font-display text-xl font-semibold text-[#1E2A4A] mt-1">
                  {product.title}
                </h2>
                <p className="text-sm text-[#565B69] mt-1">
                  {product.materialSummary}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#1E2A4A]/10 flex items-baseline justify-between gap-3">
                <div>
                  <p className="text-xs text-[#565B69]">Direct Artisan Price</p>
                  <p className="text-2xl font-mono-num font-bold text-[#1E2A4A]">
                    ₹{pricing.recommendedDirectPrice.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#565B69]">
                    Retail benchmark <SimulatedTag />
                  </p>
                  <p className="text-sm font-mono-num line-through text-[#565B69]">
                    ₹{pricing.comparableRetailPrice.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-[#1E2A4A]">
                  Zero-Hallucination Claim Disclosures
                </p>
                {product.claims.map((c) => (
                  <div
                    key={c.id}
                    className="flex flex-wrap items-center justify-between gap-2 text-xs py-1.5 border-b border-[#1E2A4A]/8 last:border-b-0"
                  >
                    <span className="text-[#1B1F2A]">
                      {getClaimDisplayFallback(c)}
                    </span>
                    <ClaimStatusBadge status={c.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Artisan Approval Checklist */}
        <Card className="lg:col-span-5 p-5 sm:p-6 space-y-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#1E2A4A]" aria-hidden="true" />
            <h2 className="font-display text-lg font-semibold text-[#1E2A4A]">
              Artisan Publication Sign-Off
            </h2>
          </div>

          <ul className="space-y-2.5 text-sm text-[#1B1F2A]">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1F6E43] mt-0.5 shrink-0" aria-hidden="true" />
              <span>
                Floor price locked at{' '}
                <strong className="font-mono-num">
                  ₹{pricing.artisanFloorPrice.toLocaleString('en-IN')}
                </strong>
                . No automated discounting allowed.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1F6E43] mt-0.5 shrink-0" aria-hidden="true" />
              <span>
                Recommended listing price:{' '}
                <strong className="font-mono-num">
                  ₹{pricing.recommendedDirectPrice.toLocaleString('en-IN')}
                </strong>{' '}
                (Net to Lakshmi: ₹{pricing.artisanNetAtRecommended.toLocaleString('en-IN')}).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1F6E43] mt-0.5 shrink-0" aria-hidden="true" />
              <span>
                Artisan name and Gadwal village displayed with consent.
              </span>
            </li>
          </ul>

          {isPublished ? (
            <div className="p-4 rounded-xl bg-[#EAF6EE] border border-[#1F6E43]/25 space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#1F6E43]">
                <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                <span>
                  Published with Voice-PIN ({product.voicePinApprovedAt ?? 'Approved'})
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => onNavigate('marketplace')}
                >
                  View in Marketplace
                </Button>
                <Button
                  size="sm"
                  variant="terracotta"
                  onClick={() => onNavigate('negotiation')}
                >
                  Open Buyer Offer
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="terracotta"
              size="lg"
              className="w-full"
              data-dost-target="publish-pin-btn"
              disabled={!isArtisan}
              onClick={() => setPinModalOpen(true)}
            >
              {isArtisan ? (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>Approve & Publish with Voice-PIN</span>
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  <span>Locked (Artisan Voice-PIN Required)</span>
                </>
              )}
            </Button>
          )}
        </Card>
      </div>

      <VoicePinModal
        open={pinModalOpen}
        title="Approve Listing Publication"
        summary={`Publish "${product.title}" at ₹${pricing.recommendedDirectPrice.toLocaleString(
          'en-IN'
        )} direct price with floor protection ₹${pricing.artisanFloorPrice.toLocaleString(
          'en-IN'
        )}.`}
        role={role}
        onClose={() => setPinModalOpen(false)}
        onConfirm={() => {
          setPinModalOpen(false);
          onPublishProduct(product.id);
        }}
        onSwitchToArtisan={onSwitchToArtisan}
      />
    </div>
  );
}
