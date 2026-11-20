import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Lock,
  PackageCheck,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { BulkOrderRequest, UserRole } from '../types/loomlink';
import { canApproveCriticalAction } from '../utils/voiceParser';
import {
  Button,
  Card,
  RoleLockNotice,
  SimulatedTag,
  VoicePinModal,
} from '../components/ui/Primitives';

interface BulkOrderDeskScreenProps {
  role: UserRole;
  bulkOrders: BulkOrderRequest[];
  onApproveBulkOrder: (bulkId: string) => void;
  onSwitchToArtisan: () => void;
}

export function BulkOrderDeskScreen({
  role,
  bulkOrders,
  onApproveBulkOrder,
  onSwitchToArtisan,
}: BulkOrderDeskScreenProps) {
  const [selectedBulk, setSelectedBulk] = useState<BulkOrderRequest | null>(null);
  const isArtisan = canApproveCriticalAction(role);

  return (
    <div className="space-y-6">
      <RoleLockNotice role={role} onSwitchToArtisan={onSwitchToArtisan} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-[#C2593F]">
            Screen 8 · Cluster Capacity & Multi-Loom Coordination
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#1E2A4A]">
            Bulk Order Desk
          </h1>
          <p className="text-sm text-[#565B69] mt-1">
            Coordinate designer and corporate gifting orders across Gadwal & Narayanpet weaver families without violating floor prices.
          </p>
        </div>
        <SimulatedTag label="SIMULATED PIPELINE" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {bulkOrders.map((order, idx) => {
          const belowFloor = order.offeredPricePerUnit < order.floorPricePerUnit;
          const totalValue = order.quantity * order.offeredPricePerUnit;
          const approved = order.status === 'approved_by_artisan';

          return (
            <Card key={order.id} className="p-5 sm:p-6 flex flex-col justify-between gap-5">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-[#C2593F]">
                      {order.buyerType} · {order.cluster} Cluster
                    </p>
                    <h2 className="font-display text-xl font-semibold text-[#1E2A4A] mt-0.5">
                      {order.buyerName}
                    </h2>
                    <p className="text-sm text-[#565B69] mt-0.5">
                      {order.productTitle}
                    </p>
                  </div>
                  <PackageCheck className="w-6 h-6 text-[#1E2A4A] shrink-0" aria-hidden="true" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-sm">
                  <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#1E2A4A]/10">
                    <p className="text-xs text-[#565B69]">Quantity</p>
                    <p className="font-mono-num font-bold text-[#1E2A4A]">
                      {order.quantity} pcs
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#1E2A4A]/10">
                    <p className="text-xs text-[#565B69]">Deadline</p>
                    <p className="font-mono-num font-bold text-[#1E2A4A]">
                      {order.deadlineDays} days
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#1E2A4A]/10">
                    <p className="text-xs text-[#565B69]">Offered / pc</p>
                    <p
                      className={`font-mono-num font-bold ${
                        belowFloor ? 'text-[#B42318]' : 'text-[#1F6E43]'
                      }`}
                    >
                      ₹{order.offeredPricePerUnit.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#1E2A4A]/10">
                    <p className="text-xs text-[#565B69]">Floor / pc</p>
                    <p className="font-mono-num font-bold text-[#1E2A4A]">
                      ₹{order.floorPricePerUnit.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                <div
                  data-dost-target={idx === 1 ? 'bulk-capacity' : undefined}
                  className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#1E2A4A]/10 flex items-center gap-3 text-sm"
                >
                  <Users className="w-5 h-5 text-[#1E2A4A] shrink-0" aria-hidden="true" />
                  <span>
                    Cluster split plan:{' '}
                    <strong className="font-mono-num">
                      {order.estimatedWeaversNeeded} weavers
                    </strong>{' '}
                    across cooperative looms · Total value{' '}
                    <strong className="font-mono-num">
                      ₹{totalValue.toLocaleString('en-IN')}
                    </strong>
                  </span>
                </div>

                {belowFloor ? (
                  <div
                    data-dost-target={idx === 1 ? 'bulk-deadline-alert' : undefined}
                    className="p-3.5 rounded-xl bg-[#FEECEB] border border-[#B42318]/25 flex items-start gap-2.5 text-xs text-[#7A1811]"
                  >
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                    <p>{order.notes}</p>
                  </div>
                ) : (
                  <p className="text-sm text-[#565B69] leading-relaxed">{order.notes}</p>
                )}
              </div>

              {approved ? (
                <div className="p-3.5 rounded-xl bg-[#EAF6EE] border border-[#1F6E43]/25 flex items-center gap-2 text-sm font-semibold text-[#1F6E43]">
                  <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                  <span>
                    Approved by Lakshmi Devi Voice-PIN ({order.approvedAt ?? 'Just now'})
                  </span>
                </div>
              ) : belowFloor ? (
                <Button variant="outline" disabled className="w-full">
                  <AlertTriangle className="w-4 h-4 text-[#B42318]" />
                  <span>Blocked: Below Floor Price (₹5,400)</span>
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  disabled={!isArtisan}
                  onClick={() => setSelectedBulk(order)}
                  className="w-full"
                >
                  {isArtisan ? (
                    <>
                      <ShieldCheck className="w-5 h-5" />
                      <span>Approve Bulk Order with Voice-PIN</span>
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
          );
        })}
      </div>

      <VoicePinModal
        open={Boolean(selectedBulk)}
        title="Approve Cluster Bulk Order"
        summary={
          selectedBulk
            ? `Accept ${selectedBulk.quantity} sarees for ${selectedBulk.buyerName} at ₹${selectedBulk.offeredPricePerUnit.toLocaleString(
                'en-IN'
              )}/saree (${selectedBulk.deadlineDays} days delivery).`
            : ''
        }
        role={role}
        onClose={() => setSelectedBulk(null)}
        onConfirm={() => {
          if (selectedBulk) {
            onApproveBulkOrder(selectedBulk.id);
          }
          setSelectedBulk(null);
        }}
        onSwitchToArtisan={onSwitchToArtisan}
      />
    </div>
  );
}
