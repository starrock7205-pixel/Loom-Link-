import React from 'react';
import { ArrowRight, Calculator, Info, TrendingUp } from 'lucide-react';
import { HandloomProduct, PricingInputs, ScreenId } from '../types/loomlink';
import { calculateDeterministicPricing } from '../utils/pricingEngine';
import { Button, Card, ClaimStatusBadge, SimulatedTag } from '../components/ui/Primitives';

interface PricingStudioScreenProps {
  product: HandloomProduct;
  onUpdatePricing: (productId: string, nextInputs: PricingInputs) => void;
  onNavigate: (screen: ScreenId) => void;
}

export function PricingStudioScreen({
  product,
  onUpdatePricing,
  onNavigate,
}: PricingStudioScreenProps) {
  const inputs = product.pricingInputs;
  const breakdown = calculateDeterministicPricing(inputs);
  const giClaim = product.claims.find((c) => c.key === 'gi_tag');
  const giStatus = giClaim?.status ?? 'PENDING';

  const updateField = (field: keyof PricingInputs, value: number) => {
    onUpdatePricing(product.id, {
      ...inputs,
      [field]: Number.isNaN(value) ? 0 : value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-[#C2593F]">
            Step 4 · Transparent Formula Engine (AI Never Sets Prices)
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#1E2A4A]">
            Deterministic Pricing Studio
          </h1>
          <p className="text-sm text-[#565B69] mt-1">
            Every rupee is calculated openly from yarn outlay, fair daily weaver wages, and fixed fee percentages.
          </p>
        </div>

        <Button
          variant="primary"
          data-dost-target="pricing-publish-cta"
          onClick={() => onNavigate('publish')}
        >
          <span>Next: Listing Publication Gate</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Inputs Panel */}
        <Card className="lg:col-span-5 p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-[#C2593F]" aria-hidden="true" />
            <h2 className="font-display text-lg font-semibold text-[#1E2A4A]">
              Loom Cost Inputs ({product.cluster})
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="space-y-1 text-sm">
              <span className="font-semibold text-[#1E2A4A]">Material Cost (₹)</span>
              <input
                type="number"
                min={0}
                value={inputs.materialCost}
                onChange={(e) =>
                  updateField('materialCost', parseInt(e.target.value, 10))
                }
                className="w-full min-h-[44px] px-3 rounded-xl bg-[#FAF7F2] border border-[#1E2A4A]/20 font-mono-num"
              />
            </label>

            <label className="space-y-1 text-sm">
              <span className="font-semibold text-[#1E2A4A]">Loom Days</span>
              <input
                type="number"
                min={1}
                value={inputs.loomDays}
                onChange={(e) =>
                  updateField('loomDays', parseInt(e.target.value, 10))
                }
                className="w-full min-h-[44px] px-3 rounded-xl bg-[#FAF7F2] border border-[#1E2A4A]/20 font-mono-num"
              />
            </label>

            <label className="space-y-1 text-sm">
              <span className="font-semibold text-[#1E2A4A]">Workers</span>
              <input
                type="number"
                min={1}
                value={inputs.workers}
                onChange={(e) =>
                  updateField('workers', parseInt(e.target.value, 10))
                }
                className="w-full min-h-[44px] px-3 rounded-xl bg-[#FAF7F2] border border-[#1E2A4A]/20 font-mono-num"
              />
            </label>

            <label className="space-y-1 text-sm">
              <span className="font-semibold text-[#1E2A4A]">Fair Daily Wage (₹)</span>
              <input
                type="number"
                min={150}
                value={inputs.fairDailyWage}
                onChange={(e) =>
                  updateField('fairDailyWage', parseInt(e.target.value, 10))
                }
                className="w-full min-h-[44px] px-3 rounded-xl bg-[#FAF7F2] border border-[#1E2A4A]/20 font-mono-num"
              />
            </label>

            <label className="space-y-1 text-sm">
              <span className="font-semibold text-[#1E2A4A]">Packaging & Logistics (₹)</span>
              <input
                type="number"
                min={0}
                value={inputs.packagingLogistics}
                onChange={(e) =>
                  updateField('packagingLogistics', parseInt(e.target.value, 10))
                }
                className="w-full min-h-[44px] px-3 rounded-xl bg-[#FAF7F2] border border-[#1E2A4A]/20 font-mono-num"
              />
            </label>

            <label className="space-y-1 text-sm">
              <span className="font-semibold text-[#1E2A4A]">Artisan Craft Margin (%)</span>
              <input
                type="number"
                min={0}
                max={100}
                value={inputs.artisanCraftMarginPct}
                onChange={(e) =>
                  updateField('artisanCraftMarginPct', parseInt(e.target.value, 10))
                }
                className="w-full min-h-[44px] px-3 rounded-xl bg-[#FAF7F2] border border-[#1E2A4A]/20 font-mono-num"
              />
            </label>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#1E2A4A]/10 text-xs text-[#565B69] space-y-1">
            <p className="font-semibold text-[#1E2A4A]">
              Fixed Platform Governance Rates
            </p>
            <p>
              Returns Reserve: <span className="font-mono-num font-semibold">{inputs.returnsReservePct}%</span> · Platform Fee:{' '}
              <span className="font-mono-num font-semibold">{inputs.platformFeePct}%</span>
            </p>
          </div>
        </Card>

        {/* Transparent Formula Output */}
        <Card className="lg:col-span-7 p-5 sm:p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-lg font-semibold text-[#1E2A4A]">
                Visible Calculation Ledger
              </h2>
              <div
                data-dost-target="pricing-gi-badge"
                className="inline-flex items-center gap-1.5 text-xs text-[#565B69]"
              >
                <span>GI {product.cluster}:</span>
                <ClaimStatusBadge status={giStatus} />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#565B69]">
              <span>Comparable retail: ₹{breakdown.comparableRetailPrice.toLocaleString('en-IN')}</span>
              <SimulatedTag />
            </div>
          </div>

          <div className="divide-y divide-[#1E2A4A]/10 text-sm">
            <div
              data-dost-target="pricing-material"
              className="py-3 flex items-center justify-between gap-4"
            >
              <div>
                <p className="font-semibold text-[#1E2A4A]">1. Material Cost (Yarn & Zari)</p>
                <p className="text-xs text-[#565B69]">Backed by uploaded yarn bill</p>
              </div>
              <span className="font-mono-num font-semibold text-[#1E2A4A]">
                ₹{breakdown.materialCost.toLocaleString('en-IN')}
              </span>
            </div>

            <div
              data-dost-target="pricing-labour"
              className="py-3 flex items-center justify-between gap-4"
            >
              <div>
                <p className="font-semibold text-[#1E2A4A]">2. Fair Family Loom Labour</p>
                <p className="text-xs text-[#565B69]">
                  {inputs.workers} workers × {inputs.loomDays} days × ₹{inputs.fairDailyWage}/day ({breakdown.personDays} person-days)
                </p>
              </div>
              <span className="font-mono-num font-semibold text-[#1E2A4A]">
                ₹{breakdown.labourCost.toLocaleString('en-IN')}
              </span>
            </div>

            <div
              data-dost-target="pricing-floor"
              className="py-3.5 px-3 -mx-3 rounded-xl bg-[#FAF7F2] flex items-center justify-between gap-4"
            >
              <div>
                <p className="font-bold text-[#1E2A4A]">Artisan Floor Price (Hard Minimum)</p>
                <p className="text-xs text-[#565B69]">
                  Material + Labour. Offers below this trigger instant agent protection.
                </p>
              </div>
              <span className="text-lg font-mono-num font-bold text-[#C2593F]">
                ₹{breakdown.artisanFloorPrice.toLocaleString('en-IN')}
              </span>
            </div>

            <div
              data-dost-target="pricing-logistics"
              className="py-3 flex items-center justify-between gap-4"
            >
              <div>
                <p className="font-semibold text-[#1E2A4A]">3. Packaging & JanAI Dispatch</p>
                <p className="text-xs text-[#565B69]">Moisture-safe craft box & courier</p>
              </div>
              <span className="font-mono-num font-semibold text-[#1E2A4A]">
                ₹{breakdown.packagingLogistics.toLocaleString('en-IN')}
              </span>
            </div>

            <div
              data-dost-target="pricing-fees"
              className="py-3 flex items-center justify-between gap-4"
            >
              <div>
                <p className="font-semibold text-[#1E2A4A]">
                  4. Returns Reserve ({inputs.returnsReservePct}%) + Platform Fee ({inputs.platformFeePct}%)
                </p>
                <p className="text-xs text-[#565B69]">
                  ₹{breakdown.returnsReserveAmount.toLocaleString('en-IN')} reserve + ₹{breakdown.platformFeeAmount.toLocaleString('en-IN')} platform at recommended price
                </p>
              </div>
              <span className="font-mono-num font-semibold text-[#1E2A4A]">
                ₹{(breakdown.returnsReserveAmount + breakdown.platformFeeAmount).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Highlighted Comparison Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div
              data-dost-target="pricing-recommended"
              className="p-4 rounded-xl bg-[#1E2A4A] text-white"
            >
              <p className="text-xs text-[#F2ECE1]/80">Recommended Direct Price</p>
              <p className="text-2xl font-mono-num font-bold mt-1">
                ₹{breakdown.recommendedDirectPrice.toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-[#F2ECE1]/80 mt-1">
                Net to weaver: ₹{breakdown.artisanNetAtRecommended.toLocaleString('en-IN')}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#EAF6EE] border border-[#1F6E43]/25 text-[#1F6E43]">
              <p className="text-xs font-semibold inline-flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Retail Value Retained</span>
              </p>
              <p className="text-2xl font-mono-num font-bold mt-1">
                {breakdown.retailRetainedPctAtRecommended}%
              </p>
              <p className="text-xs mt-1">
                vs ₹{breakdown.comparableRetailPrice.toLocaleString('en-IN')} retail
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#1E2A4A]/15 text-[#1E2A4A]">
              <p className="text-xs text-[#565B69] inline-flex items-center gap-1">
                <Info className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Trader-Led Baseline</span>
              </p>
              <p className="text-2xl font-mono-num font-bold mt-1">
                ₹{breakdown.traderBaselinePrice.toLocaleString('en-IN')}
              </p>
              <p className="text-xs font-semibold text-[#1F6E43] mt-1">
                +₹{breakdown.upliftVsTraderAtRecommended.toLocaleString('en-IN')} uplift on LoomLink
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
