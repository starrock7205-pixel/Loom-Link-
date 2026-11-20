import {
  PricingBreakdown,
  PricingInputs,
  RealizationReceiptMath,
} from '../types/loomlink';

/**
 * Deterministic pricing engine for handloom products.
 * AI never invents prices — every rupee is derived transparently from
 * material cost, fair daily wage, person-days, logistics, and fixed % fees.
 */
export function calculateDeterministicPricing(
  inputs: PricingInputs
): PricingBreakdown {
  const materialCost = Math.max(0, Math.round(inputs.materialCost));
  const workers = Math.max(1, Math.round(inputs.workers));
  const loomDays = Math.max(1, Math.round(inputs.loomDays));
  const fairDailyWage = Math.max(100, Math.round(inputs.fairDailyWage));
  const packagingLogistics = Math.max(0, Math.round(inputs.packagingLogistics));

  const personDays = workers * loomDays;
  const labourCost = personDays * fairDailyWage;

  // Artisan floor price covers full material outlay + fair family labour
  const artisanFloorPrice = materialCost + labourCost;

  // Recommended direct price adds packaging, platform/returns reserve buffer,
  // and fair craft margin, anchored at exact Gadwal benchmark ₹7,800 when defaults apply.
  const rawTarget =
    (artisanFloorPrice * (1 + inputs.artisanCraftMarginPct / 100) +
      packagingLogistics) /
    (1 - (inputs.returnsReservePct + inputs.platformFeePct) / 100);

  // Round cleanly to nearest ₹50 for buyer-ready pricing
  const recommendedDirectPrice = Math.max(
    artisanFloorPrice + packagingLogistics + 500,
    Math.round(rawTarget / 50) * 50
  );

  const returnsReserveAmount = Math.round(
    (recommendedDirectPrice * inputs.returnsReservePct) / 100
  );
  const platformFeeAmount = Math.round(
    (recommendedDirectPrice * inputs.platformFeePct) / 100
  );

  const totalDeductionsAtRecommended =
    returnsReserveAmount + platformFeeAmount + packagingLogistics;

  const artisanNetAtRecommended =
    recommendedDirectPrice - totalDeductionsAtRecommended;

  const comparableRetailPrice = Math.max(
    recommendedDirectPrice,
    Math.round(inputs.comparableRetailPrice)
  );

  const retailRetainedPctAtRecommended = Number(
    ((artisanNetAtRecommended / comparableRetailPrice) * 100).toFixed(1)
  );

  const traderBaselinePrice = Math.max(1, Math.round(inputs.traderBaselinePrice));
  const upliftVsTraderAtRecommended =
    artisanNetAtRecommended - traderBaselinePrice;
  const upliftPctVsTraderAtRecommended = Number(
    ((upliftVsTraderAtRecommended / traderBaselinePrice) * 100).toFixed(1)
  );

  return {
    materialCost,
    labourCost,
    personDays,
    artisanFloorPrice,
    packagingLogistics,
    recommendedDirectPrice,
    returnsReserveAmount,
    platformFeeAmount,
    totalDeductionsAtRecommended,
    artisanNetAtRecommended,
    retailRetainedPctAtRecommended,
    comparableRetailPrice,
    traderBaselinePrice,
    upliftVsTraderAtRecommended,
    upliftPctVsTraderAtRecommended,
  };
}

/**
 * Computes exact Artisan Value Receipt numbers for a finalized sale price & quantity.
 */
export function calculateValueReceipt(
  salePricePerUnit: number,
  quantity: number,
  inputs: PricingInputs
): RealizationReceiptMath {
  const safePrice = Math.max(0, Math.round(salePricePerUnit));
  const safeQty = Math.max(1, Math.round(quantity));

  const returnsReserveAmount = Math.round(
    (safePrice * inputs.returnsReservePct) / 100
  );
  const platformFeeAmount = Math.round(
    (safePrice * inputs.platformFeePct) / 100
  );
  const packagingLogistics = Math.round(inputs.packagingLogistics);

  const totalDeductionsPerUnit =
    returnsReserveAmount + platformFeeAmount + packagingLogistics;
  const artisanNetPerUnit = safePrice - totalDeductionsPerUnit;
  const artisanTotalNetPayout = artisanNetPerUnit * safeQty;
  const grossOrderValue = safePrice * safeQty;

  const comparableRetail = Math.max(1, inputs.comparableRetailPrice);
  const retailRetainedPct = Number(
    ((artisanNetPerUnit / comparableRetail) * 100).toFixed(1)
  );

  const traderBaselinePerUnit = Math.max(1, inputs.traderBaselinePrice);
  const incomeUpliftPerUnit = artisanNetPerUnit - traderBaselinePerUnit;
  const incomeUpliftTotal = incomeUpliftPerUnit * safeQty;
  const incomeUpliftPct = Number(
    ((incomeUpliftPerUnit / traderBaselinePerUnit) * 100).toFixed(1)
  );

  return {
    salePricePerUnit: safePrice,
    quantity: safeQty,
    grossOrderValue,
    returnsReserveAmount,
    platformFeeAmount,
    packagingLogistics,
    totalDeductionsPerUnit,
    artisanNetPerUnit,
    artisanTotalNetPayout,
    retailRetainedPct,
    traderBaselinePerUnit,
    incomeUpliftPerUnit,
    incomeUpliftTotal,
    incomeUpliftPct,
  };
}
