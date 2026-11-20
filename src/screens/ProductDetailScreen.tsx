import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Handshake,
  Receipt,
  ShieldCheck,
} from 'lucide-react';
import { ASSETS } from '../data/seedData';
import { HandloomProduct, ScreenId } from '../types/loomlink';
import { calculateDeterministicPricing } from '../utils/pricingEngine';
import { getClaimDisplayFallback } from '../utils/voiceParser';
import {
  Button,
  Card,
  ClaimStatusBadge,
  ResilientImage,
  SimulatedTag,
} from '../components/ui/Primitives';

interface ProductDetailScreenProps {
  product: HandloomProduct;
  onNavigate: (screen: ScreenId) => void;
  onSubmitBuyerOffer: (pricePerUnit: number, quantity: number) => void;
}

export function ProductDetailScreen({
  product,
  onNavigate,
  onSubmitBuyerOffer,
}: ProductDetailScreenProps) {
  const pricing = calculateDeterministicPricing(product.pricingInputs);
  const [activePhoto, setActivePhoto] = useState(product.imageUrl);
  const [offerPrice, setOfferPrice] = useState(pricing.recommendedDirectPrice);
  const [quantity, setQuantity] = useState(1);
  const [offerNotice, setOfferNotice] = useState('');

  const uploadedEvidence = product.evidence.filter((e) => e.uploaded);

  const handleSubmitOffer = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitBuyerOffer(offerPrice, quantity);
    setOfferNotice(
      `Offer of ₹${offerPrice.toLocaleString('en-IN')} × ${quantity} routed to Lakshmi Devi’s Negotiation Console.`
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="sm" onClick={() => onNavigate('marketplace')}>
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Button>
        <SimulatedTag label="ZERO-HALLUCINATION PDP" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Gallery & Evidence Photos */}
        <div className="lg:col-span-6 space-y-4">
          <Card className="overflow-hidden">
            <div className="aspect-[4/3] bg-[#F2ECE1]">
              <ResilientImage
                src={activePhoto}
                alt={product.title}
                className="w-full h-full object-cover"
                fallbackTitle={product.cluster}
              />
            </div>
          </Card>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Saree View', url: product.imageUrl },
              { label: 'Loom Photo', url: product.secondaryImageUrl },
              { label: 'Yarn Bill', url: ASSETS.yarnBill },
            ].map((thumb) => (
              <button
                key={thumb.label}
                type="button"
                onClick={() => setActivePhoto(thumb.url)}
                className={`rounded-xl overflow-hidden border text-left cursor-pointer transition-all ${
                  activePhoto === thumb.url
                    ? 'border-[#C2593F] ring-2 ring-[#C2593F]'
                    : 'border-[#1E2A4A]/15'
                }`}
              >
                <ResilientImage
                  src={thumb.url}
                  alt={thumb.label}
                  className="w-full h-20 object-cover"
                  fallbackTitle={thumb.label}
                />
                <p className="px-2 py-1 text-[11px] font-semibold text-[#1E2A4A] bg-white truncate">
                  {thumb.label}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Contiguous Purchase & Provenance Module */}
        <div className="lg:col-span-6 space-y-5">
          <Card className="p-5 sm:p-6 space-y-4">
            <div>
              <p className="text-xs font-semibold text-[#C2593F]">
                {product.cluster} Cluster · Weaver {product.artisanName} ({product.village})
              </p>
              <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#1E2A4A] mt-1">
                {product.title}
              </h1>
              <p className="text-sm text-[#565B69] mt-1">{product.materialSummary}</p>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#1E2A4A]/12 flex flex-wrap items-baseline justify-between gap-4">
              <div>
                <p className="text-xs text-[#565B69]">Direct Fair Price</p>
                <p className="text-3xl font-mono-num font-bold text-[#1E2A4A]">
                  ₹{pricing.recommendedDirectPrice.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#1F6E43] font-semibold">
                  Weaver receives ₹{pricing.artisanNetAtRecommended.toLocaleString('en-IN')} (
                  {pricing.retailRetainedPctAtRecommended}% of retail)
                </p>
                <p className="text-xs text-[#565B69]">
                  {product.comparableNote}
                </p>
              </div>
            </div>

            {/* Zero-Hallucination Claims Table */}
            <div className="space-y-2.5">
              <h2 className="text-sm font-semibold text-[#1E2A4A] inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#1F6E43]" aria-hidden="true" />
                <span>Verified Provenance & Claim Status</span>
              </h2>
              <div className="space-y-2">
                {product.claims.map((claim) => (
                  <div
                    key={claim.id}
                    className="p-3 rounded-xl bg-[#FAF7F2] border border-[#1E2A4A]/10 flex flex-wrap items-center justify-between gap-2 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-[#1E2A4A]">{claim.label}</p>
                      <p className="text-[#565B69] mt-0.5">
                        {getClaimDisplayFallback(claim)}
                      </p>
                    </div>
                    <ClaimStatusBadge status={claim.status} />
                  </div>
                ))}
              </div>
            </div>

            <div className="text-xs text-[#565B69]">
              Uploaded proofs: {uploadedEvidence.map((e) => e.title).join(' · ') || 'None yet'}
            </div>

            {/* Direct Offer / Buy Form */}
            <form onSubmit={handleSubmitOffer} className="pt-3 border-t border-[#1E2A4A]/10 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <label className="space-y-1 text-xs font-semibold text-[#1E2A4A]">
                  <span>Your Price / Saree (₹)</span>
                  <input
                    type="number"
                    min={1000}
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(parseInt(e.target.value, 10) || 0)}
                    className="w-full min-h-[44px] px-3 rounded-xl bg-[#FAF7F2] border border-[#1E2A4A]/20 font-mono-num text-sm"
                  />
                </label>
                <label className="space-y-1 text-xs font-semibold text-[#1E2A4A]">
                  <span>Quantity</span>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
                    className="w-full min-h-[44px] px-3 rounded-xl bg-[#FAF7F2] border border-[#1E2A4A]/20 font-mono-num text-sm"
                  />
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button type="submit" variant="terracotta" size="lg" className="flex-1">
                  <Handshake className="w-5 h-5" />
                  <span>Send Direct Offer to Artisan</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => onNavigate('receipt')}
                >
                  <Receipt className="w-5 h-5" />
                  <span>Value Receipt</span>
                </Button>
              </div>
            </form>

            {offerNotice && (
              <div className="p-3 rounded-xl bg-[#EAF6EE] border border-[#1F6E43]/25 text-xs font-semibold text-[#1F6E43] flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                  <span>{offerNotice}</span>
                </span>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => onNavigate('negotiation')}
                >
                  Open Console
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
