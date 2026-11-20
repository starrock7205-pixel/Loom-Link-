import React from 'react';
import {
  ArrowRight,
  CheckCircle2,
  FileUp,
  RotateCcw,
  ShieldAlert,
  Upload,
} from 'lucide-react';
import { ASSETS } from '../data/seedData';
import {
  EvidenceType,
  HandloomProduct,
  ScreenId,
  UserRole,
} from '../types/loomlink';
import { getClaimDisplayFallback } from '../utils/voiceParser';
import {
  Button,
  Card,
  ClaimStatusBadge,
  ResilientImage,
} from '../components/ui/Primitives';

interface EvidenceVaultScreenProps {
  role: UserRole;
  product: HandloomProduct;
  forceBlockGi: boolean;
  onToggleEvidence: (
    productId: string,
    evidenceType: EvidenceType,
    uploaded: boolean
  ) => void;
  onUploadDemoProofs: (productId: string) => void;
  onToggleForceBlockGi: () => void;
  onNavigate: (screen: ScreenId) => void;
}

const EVIDENCE_DEMO_IMAGE: Partial<Record<EvidenceType, string>> = {
  yarn_bill: ASSETS.yarnBill,
  loom_photo: ASSETS.loomPitloom,
};

export function EvidenceVaultScreen({
  role,
  product,
  forceBlockGi,
  onToggleEvidence,
  onUploadDemoProofs,
  onToggleForceBlockGi,
  onNavigate,
}: EvidenceVaultScreenProps) {
  const uploadedCount = product.evidence.filter((e) => e.uploaded).length;
  const bothDemoUploaded =
    Boolean(product.evidence.find((e) => e.type === 'yarn_bill')?.uploaded) &&
    Boolean(product.evidence.find((e) => e.type === 'loom_photo')?.uploaded);
  const yarnUploaded = Boolean(
    product.evidence.find((e) => e.type === 'yarn_bill')?.uploaded
  );
  const loomUploaded = Boolean(
    product.evidence.find((e) => e.type === 'loom_photo')?.uploaded
  );
  const coreProofsReady = yarnUploaded && loomUploaded;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-[#C2593F]">
            Step 3 · Zero-Hallucination Provenance Vault
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#1E2A4A]">
            Evidence Vault — {product.cluster}
          </h1>
          <p className="text-sm text-[#565B69] mt-1">
            Upload the Yarn Purchase Bill and Pit-Loom Photo to verify material and labour. GI stays PENDING until a certificate is uploaded.
          </p>
        </div>

        <Button
          variant={coreProofsReady ? 'terracotta' : 'primary'}
          onClick={() => onNavigate('pricing')}
        >
          <span>Next: Deterministic Pricing</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {coreProofsReady && (
        <div
          role="status"
          className="p-4 rounded-2xl bg-[#EAF6EE] border border-[#1F6E43]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm text-[#1F6E43]"
        >
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span>
              Yarn bill & loom photo uploaded! Material & Labour are now VERIFIED, while GI Gadwal remains truthfully PENDING.
            </span>
          </div>
          <Button size="sm" variant="primary" onClick={() => onNavigate('pricing')}>
            Open Pricing Studio
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Evidence Items */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="font-display text-lg font-semibold text-[#1E2A4A]">
                  Evidence Documents ({uploadedCount}/{product.evidence.length} Uploaded)
                </h2>
                <p className="text-xs text-[#565B69]">
                  Active uploader: {role === 'handler' ? 'Ramesh (Son)' : role === 'operator' ? 'Srinivas (JanAI Café)' : 'Lakshmi Devi'}
                </p>
              </div>
              {!bothDemoUploaded && (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => onUploadDemoProofs(product.id)}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Yarn Bill + Loom Photo</span>
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {product.evidence.map((item) => (
                <div
                  key={item.id}
                  data-dost-target={
                    item.type === 'yarn_bill'
                      ? 'evidence-yarn-bill'
                      : item.type === 'loom_photo'
                        ? 'evidence-loom-photo'
                        : item.type === 'gi_certificate'
                          ? 'evidence-coop-gi'
                          : undefined
                  }
                  className="p-4 rounded-xl bg-[#FAF7F2] border border-[#1E2A4A]/12 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    {item.uploaded && (item.imageUrl || EVIDENCE_DEMO_IMAGE[item.type]) ? (
                      <ResilientImage
                        src={item.imageUrl ?? EVIDENCE_DEMO_IMAGE[item.type] ?? ''}
                        alt={item.title}
                        className="w-16 h-16 rounded-lg object-cover border border-[#1E2A4A]/15 shrink-0"
                        fallbackTitle="Proof"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-white border border-dashed border-[#1E2A4A]/25 flex items-center justify-center text-[#565B69] shrink-0">
                        <FileUp className="w-5 h-5" aria-hidden="true" />
                      </div>
                    )}

                    <div>
                      <p className="font-semibold text-sm text-[#1E2A4A]">
                        {item.title}
                      </p>
                      {item.uploaded ? (
                        <p className="text-xs text-[#1F6E43] font-medium mt-1 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>
                            Uploaded by {item.uploadedBy ?? 'Artisan'} ({item.uploadedAt ?? 'Just now'})
                          </span>
                        </p>
                      ) : (
                        <p className="text-xs text-[#565B69] mt-1">
                          Not uploaded yet. Claims requiring this document cannot show VERIFIED.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0">
                    {item.uploaded ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          onToggleEvidence(product.id, item.type, false)
                        }
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Remove Mock</span>
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="terracotta"
                        onClick={() =>
                          onToggleEvidence(product.id, item.type, true)
                        }
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Mock Proof</span>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Live Claim Verification Matrix */}
        <Card
          data-dost-target="evidence-claim-matrix"
          className="lg:col-span-5 p-5 space-y-4"
        >
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-lg font-semibold text-[#1E2A4A]">
              Live Zero-Hallucination Claim Status
            </h2>
          </div>

          <p className="text-xs text-[#565B69] leading-relaxed">
            If evidence is missing, LoomLink strictly displays{' '}
            <strong className="text-[#1E2A4A]">
              “Artisan-reported; verification pending.”
            </strong>{' '}
            Never fabricated heritage copy.
          </p>

          <div className="space-y-3">
            {product.claims.map((claim) => (
              <div
                key={claim.id}
                className="p-3.5 rounded-xl bg-white border border-[#1E2A4A]/12 space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-[#1E2A4A]">
                    {claim.label}
                  </span>
                  <ClaimStatusBadge status={claim.status} />
                </div>
                <p className="text-xs text-[#1B1F2A]">
                  {getClaimDisplayFallback(claim)}
                </p>
                <p className="text-[11px] text-[#565B69]">{claim.reason}</p>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#1E2A4A]/10 flex items-center justify-between gap-2">
            <span className="text-xs text-[#565B69]">
              Simulate missing/contradictory GI audit:
            </span>
            <Button
              size="sm"
              variant={forceBlockGi ? 'danger' : 'outline'}
              onClick={onToggleForceBlockGi}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{forceBlockGi ? 'Unblock GI Audit' : 'Trigger GI Block'}</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
