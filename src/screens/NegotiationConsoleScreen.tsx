import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Handshake,
  Lock,
  ShieldCheck,
} from 'lucide-react';
import {
  BuyerOffer,
  HandloomProduct,
  ScreenId,
  UserRole,
} from '../types/loomlink';
import { calculateDeterministicPricing } from '../utils/pricingEngine';
import {
  canApproveCriticalAction,
  evaluateBuyerOffer,
} from '../utils/voiceParser';
import {
  Button,
  Card,
  RoleLockNotice,
  SimulatedTag,
  VoicePinModal,
} from '../components/ui/Primitives';

interface NegotiationConsoleScreenProps {
  role: UserRole;
  product: HandloomProduct;
  offers: BuyerOffer[];
  onApproveCounteroffer: (offerId: string, counterPrice: number) => void;
  onSimulateBuyerAccept: (offerId: string) => void;
  onSimulateCustomOffer: (offerId: string, price: number) => void;
  onNavigate: (screen: ScreenId) => void;
  onSwitchToArtisan: () => void;
}

export function NegotiationConsoleScreen({
  role,
  product,
  offers,
  onApproveCounteroffer,
  onSimulateBuyerAccept,
  onSimulateCustomOffer,
  onNavigate,
  onSwitchToArtisan,
}: NegotiationConsoleScreenProps) {
  const offer = offers[0];
  const pricing = calculateDeterministicPricing(product.pricingInputs);
  const evaluation = evaluateBuyerOffer(
    offer.offeredPricePerUnit,
    pricing.artisanFloorPrice,
    pricing.recommendedDirectPrice
  );

  const [counterDraft, setCounterDraft] = useState(
    offer.counterOfferPerUnit || evaluation.recommendedCounter
  );
  const [pinOpen, setPinOpen] = useState(false);
  const isArtisan = canApproveCriticalAction(role);

  useEffect(() => {
    setCounterDraft(offer.counterOfferPerUnit || evaluation.recommendedCounter);
  }, [offer.counterOfferPerUnit, offer.offeredPricePerUnit, evaluation.recommendedCounter]);

  return (
    <div className="space-y-6">
      <RoleLockNotice role={role} onSwitchToArtisan={onSwitchToArtisan} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-[#C2593F]">
            Steps 6–8 · Below-Floor Offer Guard & AI Counteroffer
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#1E2A4A]">
            Buyer Negotiation Console
          </h1>
          <p className="text-sm text-[#565B69] mt-1">
            AI guards the artisan’s floor and recommended price, drafts counteroffers, and awaits explicit Voice-PIN approval.
          </p>
        </div>

        <Button variant="outline" onClick={() => onNavigate('janai')}>
          <span>Next: JanAI Café Ops</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Incoming Offer Card */}
        <Card className="lg:col-span-6 p-5 sm:p-6 space-y-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-[#C2593F]">
                Incoming Boutique Offer <SimulatedTag />
              </p>
              <h2 className="font-display text-xl font-semibold text-[#1E2A4A] mt-0.5">
                {offer.buyerName}
              </h2>
              <p className="text-xs text-[#565B69]">
                {offer.buyerLocation} · Delivery window: {offer.deliveryTargetDays} days
              </p>
            </div>
            <Handshake className="w-6 h-6 text-[#1E2A4A]" aria-hidden="true" />
          </div>

          <div
            data-dost-target="negotiation-offer"
            className="grid grid-cols-2 gap-3 text-sm"
          >
            <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#1E2A4A]/10">
              <p className="text-xs text-[#565B69]">Quantity Requested</p>
              <p className="text-xl font-mono-num font-bold text-[#1E2A4A] mt-0.5">
                {offer.quantity} Gadwal Sarees
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#1E2A4A]/10">
              <p className="text-xs text-[#565B69]">Buyer Offer / Saree</p>
              <p className="text-xl font-mono-num font-bold text-[#C2593F] mt-0.5">
                ₹{offer.offeredPricePerUnit.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {/* Agent Guardrail Alert */}
          <div
            role="status"
            data-dost-target="negotiation-guard"
            className={`p-4 rounded-xl border flex items-start gap-3 text-sm ${
              evaluation.belowFloor
                ? 'bg-[#FEECEB] border-[#B42318]/25 text-[#7A1811]'
                : 'bg-[#FEF4E6] border-[#9A5B13]/25 text-[#5D3609]'
            }`}
          >
            <AlertTriangle
              className={`w-5 h-5 shrink-0 mt-0.5 ${
                evaluation.belowFloor ? 'text-[#B42318]' : 'text-[#9A5B13]'
              }`}
              aria-hidden="true"
            />
            <div>
              <p className="font-semibold">
                {evaluation.belowFloor
                  ? `Blocked: Offer Below Artisan Floor Price (₹${pricing.artisanFloorPrice.toLocaleString(
                      'en-IN'
                    )})`
                  : 'Agent Price Protection Check'}
              </p>
              <p className="mt-0.5">{evaluation.alertMessage}</p>
            </div>
          </div>

          {/* Scenario Switcher */}
          <div className="pt-2 border-t border-[#1E2A4A]/10 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-[#565B69]">Compare boutique offer:</span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={offer.offeredPricePerUnit === 5100 ? 'primary' : 'outline'}
                onClick={() => onSimulateCustomOffer(offer.id, 5100)}
              >
                Below Floor (₹5,100)
              </Button>
              <Button
                size="sm"
                variant={offer.offeredPricePerUnit === 7500 ? 'primary' : 'outline'}
                onClick={() => onSimulateCustomOffer(offer.id, 7500)}
              >
                Below Direct (₹7,500)
              </Button>
            </div>
          </div>
        </Card>

        {/* Counteroffer & Approval Card */}
        <Card className="lg:col-span-6 p-5 sm:p-6 space-y-5">
          <div>
            <h2 className="font-display text-xl font-semibold text-[#1E2A4A]">
              Counteroffer & Artisan Approval
            </h2>
            <p className="text-xs text-[#565B69] mt-1">
              Recommended direct: ₹{pricing.recommendedDirectPrice.toLocaleString('en-IN')} · Hard floor: ₹
              {pricing.artisanFloorPrice.toLocaleString('en-IN')}
            </p>
          </div>

          <div
            data-dost-target="negotiation-counter"
            className="space-y-2"
          >
            <label
              htmlFor="counteroffer-price"
              className="text-sm font-semibold text-[#1E2A4A]"
            >
              Agent-Drafted Counteroffer per Saree (₹)
            </label>
            <input
              id="counteroffer-price"
              type="number"
              min={pricing.artisanFloorPrice}
              value={counterDraft}
              disabled={offer.status === 'buyer_accepted'}
              onChange={(e) =>
                setCounterDraft(parseInt(e.target.value, 10) || pricing.artisanFloorPrice)
              }
              className="w-full min-h-[48px] px-4 rounded-xl bg-[#FAF7F2] border border-[#1E2A4A]/20 text-lg font-mono-num font-bold text-[#1E2A4A]"
            />
            <p className="text-xs text-[#565B69]">
              Total order value at ₹{counterDraft.toLocaleString('en-IN')} × {offer.quantity}:{' '}
              <strong className="font-mono-num text-[#1E2A4A]">
                ₹{(counterDraft * offer.quantity).toLocaleString('en-IN')}
              </strong>
            </p>
          </div>

          {offer.status === 'buyer_accepted' ? (
            <div className="p-4 rounded-xl bg-[#EAF6EE] border border-[#1F6E43]/25 space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#1F6E43]">
                <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                <span>
                  Buyer Accepted ₹{offer.counterOfferPerUnit.toLocaleString('en-IN')}/saree (Total ₹
                  {(offer.counterOfferPerUnit * offer.quantity).toLocaleString('en-IN')})
                </span>
              </div>
              <p className="text-xs text-[#1F6E43]">
                Order routed to Srinivas at Gadwal JanAI Café Kiosk #04 for QC, packaging & payout.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="primary" onClick={() => onNavigate('janai')}>
                  Open JanAI Café Console
                </Button>
                <Button size="sm" variant="terracotta" onClick={() => onNavigate('receipt')}>
                  Preview Value Receipt
                </Button>
              </div>
            </div>
          ) : offer.status === 'counter_approved' ? (
            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#1E2A4A]/15 space-y-3">
              <p className="text-sm font-semibold text-[#1E2A4A]">
                Counteroffer ₹{offer.counterOfferPerUnit.toLocaleString('en-IN')} sent to {offer.buyerName} with Lakshmi Devi’s Voice-PIN!
              </p>
              <Button
                variant="terracotta"
                size="lg"
                className="w-full"
                onClick={() => onSimulateBuyerAccept(offer.id)}
              >
                <span>Simulate Buyer Accepts ₹{offer.counterOfferPerUnit.toLocaleString('en-IN')}</span>
                <SimulatedTag />
              </Button>
            </div>
          ) : (
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              data-dost-target="negotiation-approve-btn"
              disabled={!isArtisan}
              onClick={() => setPinOpen(true)}
            >
              {isArtisan ? (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>
                    Approve Counteroffer ₹{counterDraft.toLocaleString('en-IN')} (Voice-PIN)
                  </span>
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  <span>Locked (Only Artisan Can Approve Counteroffers)</span>
                </>
              )}
            </Button>
          )}
        </Card>
      </div>

      <VoicePinModal
        open={pinOpen}
        title="Approve Counteroffer"
        summary={`Send binding counteroffer of ₹${counterDraft.toLocaleString(
          'en-IN'
        )} per saree (₹${(counterDraft * offer.quantity).toLocaleString(
          'en-IN'
        )} for ${offer.quantity} sarees) to ${offer.buyerName}.`}
        role={role}
        onClose={() => setPinOpen(false)}
        onConfirm={() => {
          setPinOpen(false);
          onApproveCounteroffer(offer.id, counterDraft);
        }}
        onSwitchToArtisan={onSwitchToArtisan}
      />
    </div>
  );
}
