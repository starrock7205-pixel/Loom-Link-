import React from 'react';
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  IndianRupee,
  Lock,
  Truck,
} from 'lucide-react';
import { JanAIConsignment, ScreenId, UserRole } from '../types/loomlink';
import { Button, Card, SimulatedTag } from '../components/ui/Primitives';

interface JanAIConsoleScreenProps {
  role: UserRole;
  consignments: JanAIConsignment[];
  onAdvanceStage: (
    consignmentId: string,
    stage: 'qc' | 'packaging' | 'dispatch' | 'payout'
  ) => void;
  onSwitchToOperator: () => void;
  onNavigate: (screen: ScreenId) => void;
}

export function JanAIConsoleScreen({
  role,
  consignments,
  onAdvanceStage,
  onSwitchToOperator,
  onNavigate,
}: JanAIConsoleScreenProps) {
  const item = consignments[0];
  const completedCount = [
    item.qcPassed,
    item.packagingPhotoLogged,
    item.dispatched,
    item.payoutReleased,
  ].filter(Boolean).length;
  const allDone = completedCount === 4;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-[#C2593F]">
            Step 9 · Village Kiosk Fulfillment ({completedCount}/4 Complete · Operator: {item.operatorName})
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#1E2A4A]">
            JanAI Café Operations Console
          </h1>
          <p className="text-sm text-[#565B69] mt-1">
            Physical quality inspection, moisture-safe craft packaging, dispatch logging, and payout verification at {item.kioskLocation}.
          </p>
        </div>

        <Button variant="terracotta" onClick={() => onNavigate('receipt')}>
          <span>Step 10: Artisan Value Receipt</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Strict Authority Separation Banner */}
      <div
        data-dost-target="janai-lock-banner"
        className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#1E2A4A]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm"
      >
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-[#1E2A4A] mt-0.5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold text-[#1E2A4A]">
              Kiosk Operator Scope Enforcement ({role === 'operator' ? 'Active: Srinivas' : `Viewing as ${role}`})
            </p>
            <p className="text-xs text-[#565B69] mt-0.5">
              Srinivas can run QC, upload packaging photos, and dispatch parcels. Price edits, offer approvals, and product claim overrides remain locked to Artisan Lakshmi Devi.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {role !== 'operator' && (
            <Button size="sm" variant="outline" onClick={onSwitchToOperator}>
              Switch to Srinivas
            </Button>
          )}
          <SimulatedTag label="SIMULATED LOGISTICS & PAYOUT" />
        </div>
      </div>

      <Card className="p-5 sm:p-6 space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#1E2A4A]/10 pb-4">
          <div>
            <p className="text-xs font-mono-num text-[#565B69]">
              Order Ref: {item.orderRef} · Updated: {item.updatedAt}
            </p>
            <h2 className="font-display text-xl font-semibold text-[#1E2A4A] mt-1">
              {item.productTitle}
            </h2>
            <p className="text-sm text-[#565B69]">Buyer: {item.buyerName}</p>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-xs text-[#565B69]">Locked Order Value</p>
            <p className="text-2xl font-mono-num font-bold text-[#1E2A4A]">
              ₹{(item.agreedPricePerUnit * item.quantity).toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-[#565B69]">
              ₹{item.agreedPricePerUnit.toLocaleString('en-IN')} × {item.quantity} sarees (Read-only)
            </p>
          </div>
        </div>

        {/* 4-Stage Kiosk Workflow */}
        <div
          data-dost-target="janai-qc-card"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#1E2A4A]/12 flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <ClipboardCheck className="w-5 h-5 text-[#1E2A4A]" aria-hidden="true" />
                {item.qcPassed && (
                  <CheckCircle2 className="w-5 h-5 text-[#1F6E43]" aria-hidden="true" />
                )}
              </div>
              <h3 className="font-semibold text-sm text-[#1E2A4A]">
                1. Physical Loom QC
              </h3>
              <p className="text-xs text-[#565B69]">{item.qcNotes}</p>
            </div>
            <Button
              size="sm"
              variant={item.qcPassed ? 'outline' : 'primary'}
              disabled={item.qcPassed}
              onClick={() => onAdvanceStage(item.id, 'qc')}
            >
              {item.qcPassed ? 'QC Passed' : 'Mark QC Passed'}
            </Button>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#1E2A4A]/12 flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Camera className="w-5 h-5 text-[#1E2A4A]" aria-hidden="true" />
                {item.packagingPhotoLogged && (
                  <CheckCircle2 className="w-5 h-5 text-[#1F6E43]" aria-hidden="true" />
                )}
              </div>
              <h3 className="font-semibold text-sm text-[#1E2A4A]">
                2. Craft Packaging Photo
              </h3>
              <p className="text-xs text-[#565B69]">
                Log tamper-evident box seal + provenance slip before dispatch.
              </p>
            </div>
            <Button
              size="sm"
              variant={item.packagingPhotoLogged ? 'outline' : 'primary'}
              disabled={!item.qcPassed || item.packagingPhotoLogged}
              onClick={() => onAdvanceStage(item.id, 'packaging')}
            >
              {item.packagingPhotoLogged ? 'Photo Logged' : 'Log Packaging Photo'}
            </Button>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#1E2A4A]/12 flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Truck className="w-5 h-5 text-[#1E2A4A]" aria-hidden="true" />
                {item.dispatched && (
                  <CheckCircle2 className="w-5 h-5 text-[#1F6E43]" aria-hidden="true" />
                )}
              </div>
              <h3 className="font-semibold text-sm text-[#1E2A4A]">
                3. Courier Dispatch [SIMULATED]
              </h3>
              <p className="text-xs font-mono-num text-[#565B69]">
                AWB: {item.trackingCode}
              </p>
            </div>
            <Button
              size="sm"
              variant={item.dispatched ? 'outline' : 'primary'}
              disabled={!item.packagingPhotoLogged || item.dispatched}
              onClick={() => onAdvanceStage(item.id, 'dispatch')}
            >
              {item.dispatched ? 'Dispatched' : 'Dispatch Parcel'}
            </Button>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#1E2A4A]/12 flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <IndianRupee className="w-5 h-5 text-[#1F6E43]" aria-hidden="true" />
                {item.payoutReleased && (
                  <CheckCircle2 className="w-5 h-5 text-[#1F6E43]" aria-hidden="true" />
                )}
              </div>
              <h3 className="font-semibold text-sm text-[#1E2A4A]">
                4. Artisan Payout [SIMULATED]
              </h3>
              <p className="text-xs font-mono-num text-[#565B69]">
                Ref: {item.payoutRef}
              </p>
            </div>
            <Button
              size="sm"
              variant={item.payoutReleased ? 'outline' : 'terracotta'}
              disabled={!item.dispatched || item.payoutReleased}
              onClick={() => onAdvanceStage(item.id, 'payout')}
            >
              {item.payoutReleased ? 'Payout Settled' : 'Release Payout'}
            </Button>
          </div>
        </div>

        {allDone && (
          <div className="p-4 rounded-xl bg-[#EAF6EE] border border-[#1F6E43]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#1F6E43]">
              <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
              <span>
                Fulfillment complete! Lakshmi Devi’s Value Receipt is ready with ₹33,450 net payout.
              </span>
            </div>
            <Button size="sm" variant="primary" onClick={() => onNavigate('receipt')}>
              Open Value Receipt
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
