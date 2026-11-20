import React, { useState } from 'react';
import {
  CheckCircle2,
  Download,
  Printer,
  Share2,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { ASSETS } from '../data/seedData';
import { BuyerOffer, HandloomProduct, JanAIConsignment } from '../types/loomlink';
import { calculateValueReceipt } from '../utils/pricingEngine';
import {
  Button,
  Card,
  ClaimStatusBadge,
  ResilientImage,
  SimulatedTag,
} from '../components/ui/Primitives';

interface ValueReceiptScreenProps {
  product: HandloomProduct;
  offer: BuyerOffer;
  consignment: JanAIConsignment;
}

export function ValueReceiptScreen({
  product,
  offer,
  consignment,
}: ValueReceiptScreenProps) {
  const [shareCopied, setShareCopied] = useState(false);

  // Use agreed counteroffer ₹8,000 × 5 (or recommended price if not yet accepted)
  const finalPricePerUnit =
    offer.status === 'buyer_accepted' || offer.status === 'counter_approved'
      ? offer.counterOfferPerUnit
      : consignment.agreedPricePerUnit || 8000;
  const qty = offer.quantity || consignment.quantity || 5;

  const math = calculateValueReceipt(
    finalPricePerUnit,
    qty,
    product.pricingInputs
  );

  const materialTotal = product.pricingInputs.materialCost;
  const labourTotal =
    product.pricingInputs.workers *
    product.pricingInputs.loomDays *
    product.pricingInputs.fairDailyWage;
  const personDays =
    product.pricingInputs.workers * product.pricingInputs.loomDays;

  const verifiedClaims = product.claims.filter((c) => c.status === 'VERIFIED');

  const handleDownloadJson = () => {
    const payload = {
      receiptId: consignment.orderRef,
      artisan: product.consentToDisplayName ? product.artisanName : 'Consent withheld',
      village: product.consentToDisplayName ? product.village : 'Cluster verified',
      product: product.title,
      quantity: math.quantity,
      finalPricePerUnitInr: math.salePricePerUnit,
      grossOrderValueInr: math.grossOrderValue,
      artisanNetPerUnitInr: math.artisanNetPerUnit,
      artisanTotalNetPayoutInr: math.artisanTotalNetPayout,
      retailPriceRetainedPct: math.retailRetainedPct,
      traderBaselinePerUnitInr: math.traderBaselinePerUnit,
      incomeUpliftPerUnitInr: math.incomeUpliftPerUnit,
      incomeUpliftTotalInr: math.incomeUpliftTotal,
      simulated: true,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `loomlink-value-receipt-${consignment.orderRef}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyShare = async () => {
    const summary = `LoomLink Artisan Value Receipt (${consignment.orderRef}): ${product.artisanName}, ${product.village} earned ₹${math.artisanTotalNetPayout.toLocaleString(
      'en-IN'
    )} net across ${math.quantity} ${product.cluster} sarees (${math.retailRetainedPct}% of retail price retained — +₹${math.incomeUpliftTotal.toLocaleString(
      'en-IN'
    )} uplift vs trader baseline).`;
    try {
      await navigator.clipboard.writeText(summary);
    } catch {
      // ignore clipboard errors in headless environments
    }
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <div>
          <p className="text-xs font-semibold text-[#C2593F]">
            Step 10 · Artisan Proof of Fair Realization <SimulatedTag />
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#1E2A4A]">
            Artisan Value Receipt
          </h1>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => window.print()}>
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </Button>
          <Button size="sm" variant="outline" onClick={handleDownloadJson}>
            <Download className="w-4 h-4" />
            <span>Download Receipt</span>
          </Button>
          <Button size="sm" variant="terracotta" onClick={handleCopyShare}>
            <Share2 className="w-4 h-4" />
            <span>{shareCopied ? 'Summary Copied!' : 'Share Receipt'}</span>
          </Button>
        </div>
      </div>

      {/* Physical Craft Receipt Document */}
      <Card className="overflow-hidden border-[#1E2A4A]/20">
        {/* Indigo Header Band */}
        <div className="bg-woven-indigo text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <ResilientImage
              src={product.imageUrl}
              alt={product.title}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-white/25 shrink-0"
              fallbackTitle={product.cluster}
            />
            <div>
              <p className="text-xs uppercase tracking-wider text-[#F2ECE1]/80 font-semibold">
                LoomLink Verified Fair-Trade Settlement · {consignment.orderRef}
              </p>
              <h2 className="font-display text-xl sm:text-2xl font-semibold mt-1">
                {product.title}
              </h2>
              <p className="text-sm text-[#F2ECE1]/90 mt-1">
                {product.consentToDisplayName
                  ? `${product.artisanName} · ${product.village} (Displayed with Artisan Consent)`
                  : 'Cluster-Verified Artisan (Name withheld by choice)'}
              </p>
            </div>
          </div>

          <div
            data-dost-target="receipt-net-payout"
            className="sm:text-right shrink-0"
          >
            <p className="text-xs text-[#F2ECE1]/80">Total Net Payout ({math.quantity} Sarees)</p>
            <p className="text-3xl sm:text-4xl font-mono-num font-bold text-white mt-0.5">
              ₹{math.artisanTotalNetPayout.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-[#F2ECE1]/85 mt-1">
              ₹{math.artisanNetPerUnit.toLocaleString('en-IN')} net per saree
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6 bg-white">
          {/* 3 Hero Realization Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              data-dost-target="receipt-retained-pct"
              className="p-4 rounded-2xl bg-[#EAF6EE] border border-[#1F6E43]/25 text-[#1F6E43]"
            >
              <p className="text-xs font-semibold">Retail Price Retained</p>
              <p className="text-3xl font-mono-num font-bold mt-1">
                {math.retailRetainedPct}%
              </p>
              <p className="text-xs mt-1">
                Of ₹{product.pricingInputs.comparableRetailPrice.toLocaleString('en-IN')} retail benchmark
              </p>
            </div>

            <div
              data-dost-target="receipt-trader-uplift"
              className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#1E2A4A]/15 text-[#1E2A4A]"
            >
              <p className="text-xs font-semibold text-[#565B69] inline-flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-[#C2593F]" aria-hidden="true" />
                <span>Uplift vs Trader Baseline</span>
              </p>
              <p className="text-3xl font-mono-num font-bold text-[#C2593F] mt-1">
                +₹{math.incomeUpliftPerUnit.toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-[#565B69] mt-1">
                +{math.incomeUpliftPct}% per saree (+₹{math.incomeUpliftTotal.toLocaleString('en-IN')} total)
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#1E2A4A]/15 text-[#1E2A4A]">
              <p className="text-xs font-semibold text-[#565B69]">Days of Family Loom Work</p>
              <p className="text-3xl font-mono-num font-bold mt-1">
                {personDays} Days
              </p>
              <p className="text-xs text-[#565B69] mt-1">
                {product.pricingInputs.workers} weavers × {product.pricingInputs.loomDays} days / saree
              </p>
            </div>
          </div>

          {/* Transparent Per-Saree Rupee Ledger */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-display text-lg font-semibold text-[#1E2A4A]">
                Per-Saree Settlement Breakdown
              </h3>
              <div className="divide-y divide-[#1E2A4A]/10 text-sm">
                <div className="py-2.5 flex justify-between gap-2">
                  <span className="font-semibold text-[#1E2A4A]">
                    Final Agreed Buyer Price
                  </span>
                  <span className="font-mono-num font-bold text-[#1E2A4A]">
                    ₹{math.salePricePerUnit.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="py-2.5 flex justify-between gap-2 text-[#565B69]">
                  <span>
                    Packaging & JanAI Dispatch
                  </span>
                  <span className="font-mono-num">
                    - ₹{math.packagingLogistics.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="py-2.5 flex justify-between gap-2 text-[#565B69]">
                  <span>
                    Returns Reserve ({product.pricingInputs.returnsReservePct}%)
                  </span>
                  <span className="font-mono-num">
                    - ₹{math.returnsReserveAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="py-2.5 flex justify-between gap-2 text-[#565B69]">
                  <span>
                    Platform Fee ({product.pricingInputs.platformFeePct}%)
                  </span>
                  <span className="font-mono-num">
                    - ₹{math.platformFeeAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="py-3 flex justify-between gap-2 font-bold text-[#1F6E43]">
                  <span>Artisan Net Realization / Saree</span>
                  <span className="font-mono-num text-lg">
                    ₹{math.artisanNetPerUnit.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-display text-lg font-semibold text-[#1E2A4A]">
                Material, Labour & Trader Comparison
              </h3>
              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#1E2A4A]/10 space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#565B69]">Yarn & Zari Cost (Verified)</span>
                  <span className="font-mono-num font-semibold text-[#1E2A4A]">
                    ₹{materialTotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#565B69]">Family Loom Labour Value</span>
                  <span className="font-mono-num font-semibold text-[#1E2A4A]">
                    ₹{labourTotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between border-t border-[#1E2A4A]/10 pt-2">
                  <span className="text-[#565B69]">Traditional Trader Payout</span>
                  <span className="font-mono-num font-semibold text-[#B42318]">
                    ₹{math.traderBaselinePerUnit.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-[#1F6E43]">
                    LoomLink Direct Surplus Earned
                  </span>
                  <span className="font-mono-num font-bold text-[#1F6E43]">
                    +₹{math.incomeUpliftPerUnit.toLocaleString('en-IN')} / saree
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Provenance & Voice-PIN Footer */}
          <div className="pt-4 border-t border-[#1E2A4A]/12 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-[#1E2A4A] inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#1F6E43]" aria-hidden="true" />
                <span>Verified Provenance Badges ({verifiedClaims.length} Verified)</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.claims.map((claim) => (
                  <div
                    key={claim.id}
                    className="inline-flex items-center gap-1.5 text-xs bg-[#FAF7F2] px-2.5 py-1 rounded-lg border border-[#1E2A4A]/10"
                  >
                    <span className="font-medium text-[#1E2A4A]">{claim.label}:</span>
                    <ClaimStatusBadge status={claim.status} />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <ResilientImage
                src={ASSETS.lakshmiPortrait}
                alt="Artisan Lakshmi Devi"
                className="w-11 h-11 rounded-full object-cover border border-[#1E2A4A]/15"
                fallbackTitle="LD"
              />
              <div className="text-xs">
                <p className="font-semibold text-[#1E2A4A] inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1F6E43]" aria-hidden="true" />
                  <span>Voice-PIN Authorized</span>
                </p>
                <p className="text-[#565B69]">
                  {product.artisanName} · {consignment.payoutRef}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
