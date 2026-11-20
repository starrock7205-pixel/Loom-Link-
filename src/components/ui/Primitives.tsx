import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Lock,
  Mic,
  ShieldAlert,
  ShieldCheck,
  X,
} from 'lucide-react';
import { ClaimStatus, UserRole } from '../../types/loomlink';
import {
  canApproveCriticalAction,
  getRoleApprovalDenialReason,
  validateVoicePin,
} from '../../utils/voiceParser';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'terracotta' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E2A4A] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shrink-0 cursor-pointer active:scale-[0.98]';

  const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary: 'bg-[#1E2A4A] text-white hover:bg-[#141D36] shadow-sm',
    terracotta: 'bg-[#C2593F] text-white hover:bg-[#A6462F] shadow-sm',
    outline:
      'bg-white text-[#1E2A4A] border border-[#1E2A4A]/20 hover:bg-[#F2ECE1]',
    ghost: 'bg-transparent text-[#1E2A4A] hover:bg-[#F2ECE1]',
    danger: 'bg-[#B42318] text-white hover:bg-[#911C13]',
  };

  const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
    sm: 'min-h-[40px] px-3.5 py-2 text-xs',
    md: 'min-h-[44px] px-4 py-2.5 text-sm',
    lg: 'min-h-[52px] px-6 py-3.5 text-base',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Card({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`bg-white rounded-2xl border border-[#1E2A4A]/12 shadow-[0_1px_3px_rgba(30,42,74,0.04)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function ClaimStatusBadge({ status }: { status: ClaimStatus }) {
  const styles: Record<
    ClaimStatus,
    { bg: string; text: string; border: string; icon: React.ReactNode; label: string }
  > = {
    VERIFIED: {
      bg: 'bg-[#EAF6EE]',
      text: 'text-[#1F6E43]',
      border: 'border-[#1F6E43]/25',
      icon: <ShieldCheck className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />,
      label: 'VERIFIED',
    },
    'ARTISAN-REPORTED': {
      bg: 'bg-[#F1F5F9]',
      text: 'text-[#334155]',
      border: 'border-[#334155]/20',
      icon: <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />,
      label: 'ARTISAN-REPORTED',
    },
    PENDING: {
      bg: 'bg-[#FEF4E6]',
      text: 'text-[#9A5B13]',
      border: 'border-[#9A5B13]/25',
      icon: <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />,
      label: 'PENDING',
    },
    BLOCKED: {
      bg: 'bg-[#FEECEB]',
      text: 'text-[#B42318]',
      border: 'border-[#B42318]/25',
      icon: <ShieldAlert className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />,
      label: 'BLOCKED',
    },
  };

  const s = styles[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-semibold tracking-wide whitespace-nowrap shrink-0 ${s.bg} ${s.text} ${s.border}`}
    >
      {s.icon}
      <span>{s.label}</span>
    </span>
  );
}

export function SimulatedTag({ label = 'SIMULATED' }: { label?: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#F2ECE1] border border-[#1E2A4A]/15 text-[11px] font-mono-num font-semibold text-[#1E2A4A] whitespace-nowrap shrink-0">
      [{label}]
    </span>
  );
}

export function ResilientImage({
  src,
  alt,
  className = '',
  fallbackTitle = 'Handloom Textile',
}: {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#F2ECE1] text-[#1E2A4A] p-4 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <span className="font-display font-semibold text-sm">{fallbackTitle}</span>
        <span className="text-xs text-[#565B69] mt-1">Gadwal / Narayanpet Loom</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

export function RoleLockNotice({
  role,
  onSwitchToArtisan,
}: {
  role: UserRole;
  onSwitchToArtisan: () => void;
}) {
  if (canApproveCriticalAction(role)) return null;
  return (
    <div
      role="status"
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#FEF4E6] border border-[#9A5B13]/25 text-[#5D3609]"
    >
      <div className="flex items-start gap-3">
        <Lock className="w-5 h-5 mt-0.5 shrink-0 text-[#9A5B13]" aria-hidden="true" />
        <div className="text-sm leading-relaxed">
          <p className="font-semibold">Human-in-the-Loop Authority Lock</p>
          <p className="mt-0.5">{getRoleApprovalDenialReason(role)}</p>
        </div>
      </div>
      <Button
        variant="primary"
        size="sm"
        onClick={onSwitchToArtisan}
        className="self-start sm:self-center"
      >
        Switch to Artisan Lakshmi
      </Button>
    </div>
  );
}

export function VoicePinModal({
  open,
  title,
  summary,
  role,
  onClose,
  onConfirm,
  onSwitchToArtisan,
}: {
  open: boolean;
  title: string;
  summary: string;
  role: UserRole;
  onClose: () => void;
  onConfirm: () => void;
  onSwitchToArtisan: () => void;
}) {
  const [pin, setPin] = useState('');
  const [listening, setListening] = useState(false);
  const [voiceMatched, setVoiceMatched] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const isArtisan = canApproveCriticalAction(role);

  const handleSimulatedVoicePin = () => {
    setListening(true);
    setVoiceMatched(false);
    setError('');
    setTimeout(() => {
      setListening(false);
      setVoiceMatched(true);
      setPin('1234');
    }, 350);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isArtisan) {
      setError(getRoleApprovalDenialReason(role));
      return;
    }
    if (!validateVoicePin(pin)) {
      setError('Invalid Voice-PIN. Enter or speak demo PIN 1234.');
      return;
    }
    setError('');
    setPin('');
    setVoiceMatched(false);
    onConfirm();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#141D36]/60 backdrop-blur-xs p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="voice-pin-modal-title"
    >
      <div className="w-full sm:max-w-md bg-[#FAF7F2] rounded-t-3xl sm:rounded-2xl border border-[#1E2A4A]/15 shadow-xl p-6 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-wide text-[#C2593F]">
              Artisan Final Authority Gate
            </p>
            <h2
              id="voice-pin-modal-title"
              className="text-xl font-bold text-[#1E2A4A] mt-1"
            >
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Voice-PIN approval modal"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#565B69] hover:bg-[#F2ECE1] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#1E2A4A]/12 text-sm text-[#1B1F2A]">
          {summary}
        </div>

        {!isArtisan ? (
          <RoleLockNotice role={role} onSwitchToArtisan={onSwitchToArtisan} />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="voice-pin-input"
                  className="text-sm font-semibold text-[#1E2A4A]"
                >
                  Lakshmi Devi Voice-PIN <SimulatedTag />
                </label>
                <span className="text-xs text-[#565B69]">Demo PIN: 1234</span>
              </div>
              <div className="flex gap-2">
                <input
                  id="voice-pin-input"
                  type="password"
                  inputMode="numeric"
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    setVoiceMatched(false);
                    setError('');
                  }}
                  placeholder="Enter 1234 or tap Voice-PIN"
                  className="flex-1 min-h-[48px] px-4 rounded-xl bg-white border border-[#1E2A4A]/25 text-lg font-mono-num tracking-widest text-[#1E2A4A] focus:outline-2 focus:outline-[#1E2A4A]"
                />
                <Button
                  type="button"
                  variant="terracotta"
                  onClick={handleSimulatedVoicePin}
                  aria-label="Speak simulated Voice-PIN 1234"
                >
                  <Mic className="w-5 h-5 shrink-0" />
                  <span>{listening ? 'Listening...' : 'Speak PIN'}</span>
                </Button>
              </div>
              {voiceMatched && (
                <p className="text-xs font-semibold text-[#1F6E43] inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Voice-print matched: Lakshmi Devi (1234)</span>
                </p>
              )}
            </div>

            {error && (
              <p className="text-sm font-medium text-[#B42318]" role="alert">
                {error}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="flex-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Approve</span>
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
