import React from 'react';
import { RotateCcw, ShieldCheck } from 'lucide-react';
import { JudgeMetrics, ScreenId } from '../types/loomlink';
import { Button, Card, SimulatedTag } from '../components/ui/Primitives';

interface JudgeDashboardScreenProps {
  metrics: JudgeMetrics;
  onResetDemo: () => void;
  onNavigate: (screen: ScreenId) => void;
}

export function JudgeDashboardScreen({
  metrics,
  onResetDemo,
  onNavigate,
}: JudgeDashboardScreenProps) {
  const kpis = [
    {
      label: 'Artisans Onboarded',
      value: `${metrics.artisansOnboarded}`,
      note: 'Gadwal & Narayanpet clusters',
    },
    {
      label: 'Listings Created',
      value: `${metrics.listingsCreated}`,
      note: 'Voice-extracted saree cards',
    },
    {
      label: 'Verified Evidence Coverage',
      value: `${metrics.verifiedEvidenceCoveragePct}%`,
      note: 'Yarn bills & pit-loom photos attached',
    },
    {
      label: 'HITL Approval Compliance',
      value: `${metrics.hitlApprovalCompliancePct}%`,
      note: 'Voice-PIN required on every price & offer',
    },
    {
      label: 'Avg Artisan Net Realization',
      value: `${metrics.avgArtisanNetRealizationPct}%`,
      note: 'Share of comparable retail retained',
    },
    {
      label: 'Return Rate',
      value: `${metrics.returnRatePct}%`,
      note: 'Within 3% reserve threshold',
    },
    {
      label: 'Buyer Leads',
      value: `${metrics.buyerLeadsCount}`,
      note: 'Boutiques & independent designers',
    },
    {
      label: 'Bulk-Order Pipeline',
      value: `₹${(metrics.bulkPipelineValueInr / 100000).toFixed(2)}L`,
      note: 'Cluster cooperative fulfillment',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#C2593F]">
            Screen 13 · Tech4Bharat Jury Telemetry <SimulatedTag />
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#1E2A4A]">
            Judge Demo Dashboard
          </h1>
          <p className="text-sm text-[#565B69] mt-1">
            Live prototype governance metrics across zero-hallucination verification, Human-in-the-Loop approvals, and artisan earnings.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => onNavigate('script')}>
            Open 3-Min Demo Script
          </Button>
          <Button variant="danger" onClick={onResetDemo}>
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Data</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="p-5 space-y-2">
            <p className="text-xs font-semibold text-[#565B69]">{kpi.label}</p>
            <p className="text-3xl font-mono-num font-bold text-[#1E2A4A]">
              {kpi.value}
            </p>
            <p className="text-xs text-[#565B69]">{kpi.note}</p>
          </Card>
        ))}
      </div>

      <Card className="p-5 sm:p-6 space-y-3">
        <div className="flex items-center gap-2 text-[#1E2A4A]">
          <ShieldCheck className="w-5 h-5 text-[#1F6E43]" aria-hidden="true" />
          <h2 className="font-display text-lg font-semibold">
            Non-Negotiable Architecture Guarantees
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-[#565B69]">
          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#1E2A4A]/10">
            <p className="font-semibold text-[#1E2A4A]">1. Zero Hallucination</p>
            <p className="mt-1">
              GI Gadwal, Handloom Mark, and pure silk claims remain PENDING or BLOCKED unless supporting documents are uploaded.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#1E2A4A]/10">
            <p className="font-semibold text-[#1E2A4A]">2. Deterministic Pricing</p>
            <p className="mt-1">
              Floor ₹5,400 and recommended ₹7,800 are calculated strictly in TypeScript with visible per-rupee deductions.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#1E2A4A]/10">
            <p className="font-semibold text-[#1E2A4A]">3. Artisan Authority</p>
            <p className="mt-1">
              Household handlers and JanAI Café operators are blocked from approving prices, offers, or claims.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
