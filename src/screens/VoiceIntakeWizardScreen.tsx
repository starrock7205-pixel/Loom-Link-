import React, { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  AudioLines,
  CheckCircle2,
  Clock,
  Mic,
  MicOff,
  RotateCcw,
  ShieldAlert,
  WifiOff,
} from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';
import {
  AgentTimelineStep,
  LanguageCode,
  ParsedVoiceResult,
  ScreenId,
} from '../types/loomlink';
import {
  LAKSHMI_DEMO_TRANSCRIPT,
  parseVoiceTranscript,
} from '../utils/voiceParser';
import { Button, Card, ClaimStatusBadge, SimulatedTag } from '../components/ui/Primitives';

interface VoiceIntakeWizardScreenProps {
  language: LanguageCode;
  isOffline: boolean;
  timeline: AgentTimelineStep[];
  onSetTimeline: React.Dispatch<React.SetStateAction<AgentTimelineStep[]>>;
  onApplyParsedDraft: (parsed: ParsedVoiceResult) => void;
  onNavigate: (screen: ScreenId) => void;
  onToggleOffline: (force?: boolean) => void;
}

type SimulatedErrorKind =
  | null
  | 'voice_unclear'
  | 'offline_saved'
  | 'gi_blocked'
  | 'low_confidence';

interface SpeechRecognitionAlternativeLike {
  transcript: string;
}

interface SpeechRecognitionResultLike {
  0: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionEventLike {
  results: ArrayLike<SpeechRecognitionResultLike>;
}

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

export function VoiceIntakeWizardScreen({
  language,
  isOffline,
  timeline,
  onSetTimeline,
  onApplyParsedDraft,
  onNavigate,
  onToggleOffline,
}: VoiceIntakeWizardScreenProps) {
  const t = TRANSLATIONS[language];
  const [transcript, setTranscript] = useState(LAKSHMI_DEMO_TRANSCRIPT);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedResult, setParsedResult] = useState<ParsedVoiceResult | null>(
    () =>
      timeline.some((s) => s.status === 'done')
        ? parseVoiceTranscript(LAKSHMI_DEMO_TRANSCRIPT, language)
        : null
  );
  const [simError, setSimError] = useState<SimulatedErrorKind>(null);
  const [speechNotice, setSpeechNotice] = useState('');
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore cleanup stop errors
        }
      }
    };
  }, []);

  const runAgentTimeline = (inputText: string, forceLowConfidence = false) => {
    setSimError(forceLowConfidence ? 'low_confidence' : null);
    setIsProcessing(true);

    const parsed = parseVoiceTranscript(inputText, language);
    if (forceLowConfidence) {
      parsed.confidence = 'LOW';
    }
    setParsedResult(parsed);
    onApplyParsedDraft(parsed);

    const stepDetails: Record<number, { status: AgentTimelineStep['status']; detail: string }> = {
      1: {
        status: 'done',
        detail: `Transcribed ${t.languageName}: "${inputText.slice(0, 56)}${
          inputText.length > 56 ? '...' : ''
        }"`,
      },
      2: {
        status: 'done',
        detail: `Craft: ${parsed.craft} · Material: ${parsed.material} · ${parsed.workers} weavers × ${parsed.days} days · Yarn ₹${parsed.yarnCost.toLocaleString('en-IN')}`,
      },
      3: {
        status: 'warning',
        detail:
          'GI Gadwal claimed — no GI certificate uploaded yet. Marked PENDING (Zero-Hallucination Rule).',
      },
      4: {
        status: 'done',
        detail: 'Requested Yarn Bill + Pit-Loom Photo + Cooperative ID.',
      },
      5: {
        status: 'warning',
        detail: 'GI eligibility matched to Gadwal cluster; awaiting document proof.',
      },
      6: {
        status: forceLowConfidence ? 'warning' : 'done',
        detail: forceLowConfidence
          ? 'No comparable listing found. Using cost-based estimate with LOW confidence.'
          : 'Comparable Gadwal Sico retail rate ₹10,000 [SIMULATED].',
      },
      7: {
        status: 'done',
        detail: `Floor ₹${(
          parsed.yarnCost +
          parsed.workers * parsed.days * 220
        ).toLocaleString('en-IN')} · Recommended ₹7,800`,
      },
      8: {
        status: 'done',
        detail:
          'Draft buyer card created with "Artisan-reported; verification pending" notice.',
      },
      9: {
        status: 'running',
        detail: 'Waiting for Lakshmi Devi Voice-PIN before publishing.',
      },
    };

    onSetTimeline((prev) =>
      prev.map((step) => ({
        ...step,
        status: 'running',
      }))
    );

    // Rapid deterministic progression for snappy 3-minute demo
    setTimeout(() => {
      onSetTimeline((prev) =>
        prev.map((step) => ({
          ...step,
          status: stepDetails[step.id]?.status ?? 'done',
          detail: stepDetails[step.id]?.detail ?? step.detail,
        }))
      );
      setIsProcessing(false);
    }, 450);
  };

  const handleBrowserMic = () => {
    setSpeechNotice('');
    setSimError(null);

    const win = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };
    const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRec) {
      setSpeechNotice(
        'Browser SpeechRecognition unavailable here — using text fallback or tap "Simulate Lakshmi Telugu Voice" below.'
      );
      return;
    }

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRec();
      const langMap: Record<LanguageCode, string> = {
        te: 'te-IN',
        hi: 'hi-IN',
        kn: 'kn-IN',
        en: 'en-IN',
      };
      recognition.lang = langMap[language];
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const spoken = event.results?.[0]?.[0]?.transcript;
        if (spoken) {
          setTranscript(spoken);
          runAgentTimeline(spoken);
        }
        setIsRecording(false);
      };
      recognition.onerror = () => {
        setIsRecording(false);
        setSimError('voice_unclear');
      };
      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      setIsRecording(true);
      recognition.start();
    } catch {
      setIsRecording(false);
      setSimError('voice_unclear');
    }
  };

  const handleSimulateLakshmiVoice = () => {
    setTranscript(LAKSHMI_DEMO_TRANSCRIPT);
    setSpeechNotice('Captured Lakshmi Devi Telugu code-mixed audio [SIMULATED].');
    runAgentTimeline(LAKSHMI_DEMO_TRANSCRIPT);
  };

  const handleTriggerError = (kind: SimulatedErrorKind) => {
    setSimError(kind);
    if (kind === 'offline_saved') {
      onToggleOffline(true);
    } else if (kind === 'low_confidence') {
      runAgentTimeline('Saree handloom', true);
    } else if (kind === 'gi_blocked') {
      onSetTimeline((prev) =>
        prev.map((step) =>
          step.id === 3 || step.id === 5
            ? {
                ...step,
                status: 'blocked',
                detail: 'GI claim blocked: cluster evidence missing.',
              }
            : step
        )
      );
    }
  };

  const handleRetryRecovery = () => {
    setSimError(null);
    if (isOffline) {
      onToggleOffline(false);
    }
    setTranscript(LAKSHMI_DEMO_TRANSCRIPT);
    runAgentTimeline(LAKSHMI_DEMO_TRANSCRIPT);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-[#C2593F]">
            Steps 1–2 · Multilingual Voice Intake & GI Guard ({t.languageName})
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#1E2A4A]">
            Voice Intake Wizard
          </h1>
          <p className="text-sm text-[#565B69] mt-1">{t.voicePromptHint}</p>
        </div>

        <Button variant="primary" onClick={() => onNavigate('evidence')}>
          <span>Next: Evidence Vault</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Simulated Failure & Recovery Banners */}
      {simError === 'voice_unclear' && (
        <div
          role="alert"
          className="p-4 rounded-2xl bg-[#FEECEB] border border-[#B42318]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div className="flex items-start gap-3 text-sm text-[#7A1811]">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-semibold">
                Voice unclear. Please repeat or choose from options.
              </p>
              <p className="mt-0.5">
                Background loom clatter detected. Tap retry or use the quick text fallback below.
              </p>
            </div>
          </div>
          <Button size="sm" variant="danger" onClick={handleRetryRecovery}>
            <RotateCcw className="w-4 h-4" />
            <span>Retry Voice Intake</span>
          </Button>
        </div>
      )}

      {(simError === 'offline_saved' || isOffline) && (
        <div
          role="alert"
          className="p-4 rounded-2xl bg-[#FEF4E6] border border-[#9A5B13]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div className="flex items-start gap-3 text-sm text-[#5D3609]">
            <WifiOff className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-semibold">Network unavailable. Draft saved offline.</p>
              <p className="mt-0.5">
                Your transcript and yarn cost are stored on your device. Tap reconnect to sync.
              </p>
            </div>
          </div>
          <Button size="sm" variant="primary" onClick={handleRetryRecovery}>
            <RotateCcw className="w-4 h-4" />
            <span>Reconnect & Sync</span>
          </Button>
        </div>
      )}

      {simError === 'gi_blocked' && (
        <div
          role="alert"
          className="p-4 rounded-2xl bg-[#FEECEB] border border-[#B42318]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div className="flex items-start gap-3 text-sm text-[#7A1811]">
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-semibold">
                GI claim blocked: cluster evidence missing.
              </p>
              <p className="mt-0.5">
                Zero-hallucination guard prevents publishing a GI Gadwal badge without Cooperative ID or GI Certificate.
              </p>
            </div>
          </div>
          <Button size="sm" variant="outline" onClick={() => onNavigate('evidence')}>
            <span>Upload Evidence</span>
          </Button>
        </div>
      )}

      {simError === 'low_confidence' && (
        <div
          role="status"
          className="p-4 rounded-2xl bg-[#FEF4E6] border border-[#9A5B13]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div className="flex items-start gap-3 text-sm text-[#5D3609]">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-semibold">
                No comparable listing found. Using cost-based estimate with LOW confidence.
              </p>
              <p className="mt-0.5">
                Please speak weave composition and yarn bill details for higher benchmark accuracy.
              </p>
            </div>
          </div>
          <Button size="sm" variant="outline" onClick={handleRetryRecovery}>
            <span>Restore Full Details</span>
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Voice Recorder + Transcript + Extracted Structured Listing */}
        <div className="lg:col-span-7 space-y-5">
          <Card className="p-5 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-semibold text-[#1E2A4A]">
                  1. Speak or Edit Transcript
                </h2>
                <p className="text-xs text-[#565B69]">
                  Supports Telugu, Hindi, Kannada, and English code-mixing
                </p>
              </div>
              <SimulatedTag label="Web Speech API + Fallback" />
            </div>

            <div
              data-dost-target="voice-mic-btn"
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              <Button
                variant={isRecording ? 'danger' : 'primary'}
                size="lg"
                onClick={handleBrowserMic}
                className="w-full"
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-5 h-5 shrink-0" />
                    <span>Stop Listening</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5 shrink-0" />
                    <span>{t.tapToSpeak} (Browser Mic)</span>
                  </>
                )}
              </Button>

              <Button
                variant="terracotta"
                size="lg"
                onClick={handleSimulateLakshmiVoice}
                className="w-full"
              >
                <AudioLines className="w-5 h-5 shrink-0" />
                <span>Simulate Lakshmi Telugu Voice</span>
              </Button>
            </div>

            {speechNotice && (
              <p className="text-xs font-medium text-[#1E2A4A] bg-[#FAF7F2] px-3 py-2 rounded-lg border border-[#1E2A4A]/10">
                {speechNotice}
              </p>
            )}

            <div className="space-y-2">
              <label
                htmlFor="voice-transcript-input"
                className="text-sm font-semibold text-[#1E2A4A]"
              >
                Live Voice Transcript (Text Fallback Editable)
              </label>
              <textarea
                id="voice-transcript-input"
                data-dost-target="voice-transcript"
                rows={3}
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-[#FAF7F2] border border-[#1E2A4A]/20 text-base text-[#1B1F2A] focus:outline-2 focus:outline-[#1E2A4A]"
              />
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Button
                  size="sm"
                  variant="primary"
                  disabled={isProcessing || !transcript.trim()}
                  onClick={() => runAgentTimeline(transcript)}
                >
                  <span>
                    {isProcessing ? 'Extracting Attributes...' : 'Extract & Check Claims'}
                  </span>
                </Button>

                <details className="text-xs">
                  <summary className="cursor-pointer font-medium text-[#565B69] hover:text-[#1E2A4A] py-1">
                    Test failure recovery
                  </summary>
                  <div className="flex flex-wrap items-center gap-1.5 pt-2">
                    <button
                      type="button"
                      onClick={() => handleTriggerError('voice_unclear')}
                      className="px-2 py-1 text-xs rounded border border-[#1E2A4A]/15 bg-white hover:bg-[#FAF7F2] cursor-pointer"
                    >
                      Voice Unclear
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTriggerError('offline_saved')}
                      className="px-2 py-1 text-xs rounded border border-[#1E2A4A]/15 bg-white hover:bg-[#FAF7F2] cursor-pointer"
                    >
                      Offline
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTriggerError('gi_blocked')}
                      className="px-2 py-1 text-xs rounded border border-[#1E2A4A]/15 bg-white hover:bg-[#FAF7F2] cursor-pointer"
                    >
                      Block GI
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTriggerError('low_confidence')}
                      className="px-2 py-1 text-xs rounded border border-[#1E2A4A]/15 bg-white hover:bg-[#FAF7F2] cursor-pointer"
                    >
                      Low Confidence
                    </button>
                  </div>
                </details>
              </div>
            </div>
          </Card>

          {/* Extracted Structured Product Card */}
          {parsedResult && (
            <Card className="p-5 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-display text-lg font-semibold text-[#1E2A4A]">
                  2. Extracted Structured Attributes
                </h2>
                <span className="text-xs font-mono-num font-semibold text-[#1E2A4A]">
                  Confidence: {parsedResult.confidence}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#1E2A4A]/10">
                  <p className="text-xs text-[#565B69]">Craft</p>
                  <p className="font-semibold text-[#1E2A4A] mt-0.5">
                    {parsedResult.craft}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#1E2A4A]/10">
                  <p className="text-xs text-[#565B69]">Material</p>
                  <p className="font-semibold text-[#1E2A4A] mt-0.5">
                    {parsedResult.material}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#1E2A4A]/10">
                  <p className="text-xs text-[#565B69]">Labour</p>
                  <p className="font-semibold font-mono-num text-[#1E2A4A] mt-0.5">
                    {parsedResult.workers} people × {parsedResult.days} days
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#1E2A4A]/10">
                  <p className="text-xs text-[#565B69]">Yarn Cost</p>
                  <p className="font-semibold font-mono-num text-[#1E2A4A] mt-0.5">
                    ₹{parsedResult.yarnCost.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Zero-hallucination instant check */}
              <div
                data-dost-target="voice-gi-claim"
                className="p-4 rounded-xl bg-[#FEF4E6] border border-[#9A5B13]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#1E2A4A]">
                      GI {parsedResult.cluster} Claim
                    </span>
                    <ClaimStatusBadge
                      status={simError === 'gi_blocked' ? 'BLOCKED' : 'PENDING'}
                    />
                  </div>
                  <p className="text-xs text-[#5D3609]">
                    Artisan-reported; verification pending. Cannot display as VERIFIED until evidence is uploaded.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => onNavigate('evidence')}
                >
                  Upload Proof
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Right: Visible 9-Step Agent Activity Timeline */}
        <Card className="lg:col-span-5 p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-lg font-semibold text-[#1E2A4A]">
              Agent Activity Timeline
            </h2>
            <span className="text-xs text-[#565B69]">9-Step Audit Trail</span>
          </div>

          <ol className="space-y-3">
            {timeline.map((step) => {
              const icon =
                step.status === 'done' ? (
                  <CheckCircle2 className="w-4 h-4 text-[#1F6E43] shrink-0" aria-hidden="true" />
                ) : step.status === 'warning' ? (
                  <AlertTriangle className="w-4 h-4 text-[#9A5B13] shrink-0" aria-hidden="true" />
                ) : step.status === 'blocked' ? (
                  <ShieldAlert className="w-4 h-4 text-[#B42318] shrink-0" aria-hidden="true" />
                ) : (
                  <Clock className="w-4 h-4 text-[#565B69] shrink-0" aria-hidden="true" />
                );

              return (
                <li
                  key={step.id}
                  className="p-3 rounded-xl bg-[#FAF7F2] border border-[#1E2A4A]/10 flex items-start gap-3"
                >
                  <div className="mt-0.5">{icon}</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#1E2A4A]">
                      {step.id}. {step.label}
                    </p>
                    <p className="text-xs text-[#565B69] mt-0.5 leading-relaxed">
                      {step.detail}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </Card>
      </div>
    </div>
  );
}
