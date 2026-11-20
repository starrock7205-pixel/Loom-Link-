import React, { useState } from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { HandloomProduct, ScreenId } from '../types/loomlink';
import { calculateDeterministicPricing } from '../utils/pricingEngine';
import {
  Button,
  Card,
  ClaimStatusBadge,
  ResilientImage,
  SimulatedTag,
} from '../components/ui/Primitives';

interface MarketplaceScreenProps {
  products: HandloomProduct[];
  onSelectProduct: (id: string) => void;
  onNavigate: (screen: ScreenId) => void;
}

export function MarketplaceScreen({
  products,
  onSelectProduct,
  onNavigate,
}: MarketplaceScreenProps) {
  const [clusterFilter, setClusterFilter] = useState<'ALL' | 'Gadwal' | 'Narayanpet'>('ALL');

  const filtered = products.filter((p) =>
    clusterFilter === 'ALL' ? true : p.cluster === clusterFilter
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#C2593F]">
            Screen 10 · Zero-Hallucination Direct Storefront <SimulatedTag />
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#1E2A4A]">
            Buyer Marketplace Preview
          </h1>
          <p className="text-sm text-[#565B69] mt-1">
            Every saree displays verified loom evidence, transparent weaver payout share, and honest pending claim states.
          </p>
        </div>

        {/* Interactive Cluster Filter Control */}
        <div
          role="group"
          aria-label="Filter by cluster"
          className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#F2ECE1] border border-[#1E2A4A]/12 self-start"
        >
          {(['ALL', 'Gadwal', 'Narayanpet'] as const).map((cluster) => (
            <button
              key={cluster}
              type="button"
              onClick={() => setClusterFilter(cluster)}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                clusterFilter === cluster
                  ? 'bg-[#1E2A4A] text-white'
                  : 'text-[#565B69] hover:text-[#1E2A4A]'
              }`}
            >
              {cluster === 'ALL' ? 'All Clusters' : cluster}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((product) => {
          const pricing = calculateDeterministicPricing(product.pricingInputs);
          const verifiedClaims = product.claims.filter((c) => c.status === 'VERIFIED').length;
          const giStatus =
            product.claims.find((c) => c.key === 'gi_tag')?.status ?? 'PENDING';

          return (
            <Card key={product.id} className="overflow-hidden flex flex-col justify-between">
              <div>
                <div className="aspect-[4/3] bg-[#F2ECE1] overflow-hidden">
                  <ResilientImage
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    fallbackTitle={product.cluster}
                  />
                </div>
                <div className="p-5 space-y-3">
                  <p className="text-xs text-[#565B69]">
                    {product.cluster} Cluster · {product.artisanName}
                  </p>
                  <h2 className="font-display text-lg font-semibold text-[#1E2A4A] leading-snug">
                    {product.title}
                  </h2>
                  <p className="text-sm text-[#565B69]">{product.materialSummary}</p>

                  <div className="flex items-baseline justify-between pt-2 border-t border-[#1E2A4A]/10">
                    <div>
                      <p className="text-xs text-[#565B69]">Direct Artisan Price</p>
                      <p className="text-xl font-mono-num font-bold text-[#1E2A4A]">
                        ₹{pricing.recommendedDirectPrice.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[#1F6E43] font-semibold">
                        {pricing.retailRetainedPctAtRecommended}% to weaver
                      </p>
                      <p className="text-xs font-mono-num text-[#565B69]">
                        Retail: {product.pricingInputs.comparableRetailRange ?? `₹${pricing.comparableRetailPrice.toLocaleString('en-IN')}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-5 pb-5 space-y-3">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 font-medium text-[#1F6E43]">
                    <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                    <span>{verifiedClaims} claims verified</span>
                  </span>
                  <ClaimStatusBadge status={giStatus} />
                </div>

                <Button
                  variant="primary"
                  className="w-full justify-between"
                  onClick={() => {
                    onSelectProduct(product.id);
                    onNavigate('pdp');
                  }}
                >
                  <span>Inspect Provenance & Buy</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
