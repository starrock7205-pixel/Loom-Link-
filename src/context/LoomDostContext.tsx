import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { LOOM_DOST_DICTIONARY } from '../data/loomDostDictionary';
import {
  useSpeechRecognitionQuery,
  useSpeechSynthesisGuidance,
} from '../hooks/useLoomDostSpeech';
import {
  DostActivityItem,
  DostContextSnapshot,
  DostCue,
  DostState,
  DostTargetId,
} from '../types/loomDost';
import { LanguageCode, ScreenId } from '../types/loomlink';
import {
  buildScreenCues,
  resolveDostQuestion,
} from '../utils/loomDostEngine';

interface LoomDostContextValue {
  isOpen: boolean;
  isDismissed: boolean;
  dostState: DostState;
  isMuted: boolean;
  isSlowMode: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  speechRecognitionSupported: boolean;
  currentCue: DostCue | null;
  cueIndex: number;
  totalScreenCues: number;
  activeTargetId?: DostTargetId;
  targetOffscreen: boolean;
  setTargetOffscreen: (offscreen: boolean) => void;
  activityFeed: DostActivityItem[];
  language: LanguageCode;
  openGuide: () => void;
  minimizeGuide: () => void;
  dismissGuide: () => void;
  nextCue: () => void;
  prevCue: () => void;
  repeatCue: () => void;
  toggleSlowMode: () => void;
  toggleMute: () => void;
  changeLanguage: (lang: LanguageCode) => void;
  answerYesNo: (yes: boolean) => void;
  askQuestion: (query: string) => void;
  toggleVoiceListening: () => void;
  retryFromError: () => void;
}

const LoomDostContext = createContext<LoomDostContextValue | null>(null);

interface LoomDostProviderProps {
  snapshot: DostContextSnapshot;
  onLanguageChange: (lang: LanguageCode) => void;
  children: React.ReactNode;
}

export function LoomDostProvider({
  snapshot,
  onLanguageChange,
  children,
}: LoomDostProviderProps) {
  const dict = LOOM_DOST_DICTIONARY[snapshot.language];

  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [dostState, setDostState] = useState<DostState>('IDLE');
  const [isMuted, setIsMuted] = useState(false);
  const [isSlowMode, setIsSlowMode] = useState(false);
  const [cueIndex, setCueIndex] = useState(0);
  const [customCueKey, setCustomCueKey] = useState<string | null>(null);
  const [thinkingText, setThinkingText] = useState<string | null>(null);
  const [targetOffscreen, setTargetOffscreen] = useState(false);
  const [activityFeed, setActivityFeed] = useState<DostActivityItem[]>([]);

  const prevScreenRef = useRef<ScreenId>(snapshot.screen);
  const thinkingTimerRef = useRef<number | null>(null);

  const { speak, stop: stopSpeech, isSpeaking } = useSpeechSynthesisGuidance();

  const screenCues = useMemo(() => buildScreenCues(snapshot), [snapshot]);

  const appendActivity = useCallback((message: string, simulated = true) => {
    setActivityFeed((prev) => [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        timestamp: 'Just now',
        message,
        simulated,
      },
      ...prev.slice(0, 5),
    ]);
  }, []);

  const currentCue: DostCue | null = useMemo(() => {
    if (dostState === 'ERROR_HELP') {
      return {
        id: 'error-help',
        state: 'ERROR_HELP',
        title: dict.ui.name,
        text: dict.ui.errorUnclear,
      };
    }

    if (customCueKey) {
      return resolveDostQuestion(customCueKey, snapshot);
    }

    const safeIdx = Math.min(cueIndex, Math.max(0, screenCues.length - 1));
    return screenCues[safeIdx] ?? null;
  }, [customCueKey, cueIndex, dict.ui.errorUnclear, dict.ui.name, dostState, screenCues, snapshot]);

  const speakCueIfOpen = useCallback(
    (cue: DostCue | null, slowOverride?: boolean) => {
      if (!cue || !isOpen) return;
      const slow = typeof slowOverride === 'boolean' ? slowOverride : isSlowMode;
      speak(cue.text, snapshot.language, slow, isMuted);
    },
    [isMuted, isOpen, isSlowMode, snapshot.language, speak]
  );

  // Clean up pending thinking timer on unmount
  useEffect(() => {
    return () => {
      if (thinkingTimerRef.current) {
        window.clearTimeout(thinkingTimerRef.current);
      }
    };
  }, []);

  // React to screen navigation (never forces navigation itself; only observes)
  useEffect(() => {
    if (prevScreenRef.current !== snapshot.screen) {
      prevScreenRef.current = snapshot.screen;
      setCustomCueKey(null);
      setCueIndex(0);
      stopSpeech();

      if (thinkingTimerRef.current) {
        window.clearTimeout(thinkingTimerRef.current);
      }

      if (snapshot.screen === 'pricing' && !isDismissed) {
        setIsOpen(true);
        setIsSlowMode(false);
        const firstCue = buildScreenCues(snapshot)[0];
        setDostState(firstCue?.state ?? 'EXPLAINING');
        appendActivity(dict.thinkingStatuses.calculatingPrice, true);
        if (firstCue) {
          speak(firstCue.text, snapshot.language, false, isMuted);
        }
      } else if (isOpen) {
        const firstCue = buildScreenCues(snapshot)[0];
        setDostState(firstCue?.state ?? 'EXPLAINING');
        if (firstCue?.thinkingLabel) {
          appendActivity(firstCue.thinkingLabel, true);
        }
        if (firstCue) {
          speak(firstCue.text, snapshot.language, isSlowMode, isMuted);
        }
      } else {
        setDostState('IDLE');
      }
    }
  }, [
    appendActivity,
    dict.thinkingStatuses.calculatingPrice,
    isDismissed,
    isMuted,
    isOpen,
    isSlowMode,
    snapshot,
    speak,
    stopSpeech,
  ]);

  const handleVoiceTranscript = useCallback(
    (spokenText: string) => {
      setCustomCueKey(spokenText);
      setDostState('THINKING');
      setThinkingText(dict.thinkingStatuses.checkingYarnBill);
      appendActivity(`${dict.thinkingStatuses.checkingYarnBill}`, true);

      if (thinkingTimerRef.current) {
        window.clearTimeout(thinkingTimerRef.current);
      }
      thinkingTimerRef.current = window.setTimeout(() => {
        setThinkingText(null);
        const answerCue = resolveDostQuestion(spokenText, snapshot);
        setDostState(answerCue.state);
        speak(answerCue.text, snapshot.language, isSlowMode, isMuted);
      }, 320);
    },
    [
      appendActivity,
      dict.thinkingStatuses.checkingYarnBill,
      isMuted,
      isSlowMode,
      snapshot,
      speak,
    ]
  );

  const handleVoiceError = useCallback(() => {
    setDostState('ERROR_HELP');
    speak(dict.ui.errorUnclear, snapshot.language, isSlowMode, isMuted);
  }, [dict.ui.errorUnclear, isMuted, isSlowMode, snapshot.language, speak]);

  const {
    isListening,
    startListening,
    stopListening,
    isSupported: speechRecognitionSupported,
  } = useSpeechRecognitionQuery(
    snapshot.language,
    handleVoiceTranscript,
    handleVoiceError
  );

  const openGuide = useCallback(() => {
    setIsDismissed(false);
    setIsOpen(true);
    setCustomCueKey(null);
    const cue = screenCues[cueIndex] ?? screenCues[0];
    setDostState(cue?.state ?? 'EXPLAINING');
    if (cue?.thinkingLabel) {
      appendActivity(cue.thinkingLabel, true);
    }
    if (cue) {
      speak(cue.text, snapshot.language, isSlowMode, isMuted);
    }
  }, [
    appendActivity,
    cueIndex,
    isMuted,
    isSlowMode,
    screenCues,
    snapshot.language,
    speak,
  ]);

  const minimizeGuide = useCallback(() => {
    stopListening();
    stopSpeech();
    setIsOpen(false);
    setDostState('IDLE');
  }, [stopListening, stopSpeech]);

  const dismissGuide = useCallback(() => {
    stopListening();
    stopSpeech();
    setIsOpen(false);
    setIsDismissed(true);
    setDostState('IDLE');
  }, [stopListening, stopSpeech]);

  const nextCue = useCallback(() => {
    setCustomCueKey(null);
    // On Pricing Studio, skip slow summary unless user pressed "Yes" at step 5 (ask-replay)
    let nextIdx = cueIndex + 1;
    if (
      snapshot.screen === 'pricing' &&
      screenCues[cueIndex]?.id === 'pricing-ask-replay'
    ) {
      nextIdx = 7; // Skip to Voice-PIN approval reminder
    }
    if (nextIdx >= screenCues.length) {
      nextIdx = screenCues.length - 1;
    }
    setCueIndex(nextIdx);
    const next = screenCues[nextIdx];
    if (next) {
      setDostState(next.state);
      speak(next.text, snapshot.language, isSlowMode, isMuted);
    }
  }, [
    cueIndex,
    isMuted,
    isSlowMode,
    screenCues,
    snapshot.language,
    snapshot.screen,
    speak,
  ]);

  const prevCue = useCallback(() => {
    setCustomCueKey(null);
    let prevIdx = Math.max(0, cueIndex - 1);
    if (
      snapshot.screen === 'pricing' &&
      screenCues[cueIndex]?.id === 'pricing-voice-pin'
    ) {
      prevIdx = 5; // Back to ask-replay
    }
    setCueIndex(prevIdx);
    const prev = screenCues[prevIdx];
    if (prev) {
      setDostState(prev.state);
      speak(prev.text, snapshot.language, isSlowMode, isMuted);
    }
  }, [
    cueIndex,
    isMuted,
    isSlowMode,
    screenCues,
    snapshot.language,
    snapshot.screen,
    speak,
  ]);

  const repeatCue = useCallback(() => {
    if (!currentCue) return;
    setDostState(currentCue.state);
    speak(currentCue.text, snapshot.language, isSlowMode, isMuted);
  }, [currentCue, isMuted, isSlowMode, snapshot.language, speak]);

  const toggleSlowMode = useCallback(() => {
    const nextSlow = !isSlowMode;
    setIsSlowMode(nextSlow);
    if (currentCue && isOpen) {
      speak(currentCue.text, snapshot.language, nextSlow, isMuted);
    }
  }, [currentCue, isMuted, isOpen, isSlowMode, snapshot.language, speak]);

  const toggleMute = useCallback(() => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (nextMuted) {
      stopSpeech();
    } else if (currentCue && isOpen) {
      speak(currentCue.text, snapshot.language, isSlowMode, false);
    }
  }, [currentCue, isMuted, isOpen, isSlowMode, snapshot.language, speak, stopSpeech]);

  const changeLanguage = useCallback(
    (lang: LanguageCode) => {
      stopSpeech();
      onLanguageChange(lang);
      const translatedSnapshot: DostContextSnapshot = {
        ...snapshot,
        language: lang,
      };
      const translatedCue = customCueKey
        ? resolveDostQuestion(customCueKey, translatedSnapshot)
        : buildScreenCues(translatedSnapshot)[
            Math.min(cueIndex, screenCues.length - 1)
          ];
      if (translatedCue && isOpen) {
        speak(translatedCue.text, lang, isSlowMode, isMuted);
      }
    },
    [
      cueIndex,
      customCueKey,
      isMuted,
      isOpen,
      isSlowMode,
      onLanguageChange,
      screenCues.length,
      snapshot,
      speak,
      stopSpeech,
    ]
  );

  const answerYesNo = useCallback(
    (yes: boolean) => {
      if (snapshot.screen === 'pricing') {
        if (yes) {
          // Step 8 -> Step 9: Repeat complete price breakdown slowly!
          setIsSlowMode(true);
          setCustomCueKey(null);
          setCueIndex(6); // pricing-slow-summary
          const slowCue = screenCues[6];
          if (slowCue) {
            setDostState('EXPLAINING');
            appendActivity(dict.thinkingStatuses.calculatingPrice, true);
            speak(slowCue.text, snapshot.language, true, isMuted);
          }
        } else {
          // Proceed directly to Step 10: Voice-PIN Approval Reminder
          setCustomCueKey(null);
          setCueIndex(7);
          const pinCue = screenCues[7];
          if (pinCue) {
            setDostState('APPROVAL_REMINDER');
            speak(pinCue.text, snapshot.language, isSlowMode, isMuted);
          }
        }
      } else {
        nextCue();
      }
    },
    [
      appendActivity,
      dict.thinkingStatuses.calculatingPrice,
      isMuted,
      isSlowMode,
      nextCue,
      screenCues,
      snapshot.language,
      snapshot.screen,
      speak,
    ]
  );

  const askQuestion = useCallback(
    (query: string) => {
      const cleaned = query.trim();
      if (!cleaned) {
        setDostState('ERROR_HELP');
        return;
      }
      setCustomCueKey(cleaned);
      setDostState('THINKING');
      setThinkingText(dict.thinkingStatuses.matchingCluster);
      appendActivity(dict.thinkingStatuses.matchingCluster, true);

      if (thinkingTimerRef.current) {
        window.clearTimeout(thinkingTimerRef.current);
      }
      thinkingTimerRef.current = window.setTimeout(() => {
        setThinkingText(null);
        const cue = resolveDostQuestion(cleaned, snapshot);
        setDostState(cue.state);
        speak(cue.text, snapshot.language, isSlowMode, isMuted);
      }, 280);
    },
    [
      appendActivity,
      dict.thinkingStatuses.matchingCluster,
      isMuted,
      isSlowMode,
      snapshot,
      speak,
    ]
  );

  const toggleVoiceListening = useCallback(() => {
    if (isListening) {
      stopListening();
      setDostState(currentCue?.state ?? 'EXPLAINING');
    } else {
      stopSpeech();
      setDostState('LISTENING');
      startListening();
    }
  }, [currentCue?.state, isListening, startListening, stopListening, stopSpeech]);

  const retryFromError = useCallback(() => {
    setCustomCueKey(null);
    const cue = screenCues[cueIndex] ?? screenCues[0];
    setDostState(cue?.state ?? 'EXPLAINING');
    if (cue) {
      speakCueIfOpen(cue);
    }
  }, [cueIndex, screenCues, speakCueIfOpen]);

  const effectiveState: DostState = isListening
    ? 'LISTENING'
    : thinkingText
      ? 'THINKING'
      : dostState;

  const value: LoomDostContextValue = {
    isOpen,
    isDismissed,
    dostState: effectiveState,
    isMuted,
    isSlowMode,
    isSpeaking,
    isListening,
    speechRecognitionSupported,
    currentCue: thinkingText
      ? {
          id: 'thinking-cue',
          state: 'THINKING',
          title: dict.stateLabels.THINKING,
          text: thinkingText,
          isSimulated: true,
        }
      : currentCue,
    cueIndex,
    totalScreenCues: screenCues.length,
    activeTargetId: isOpen && !thinkingText ? currentCue?.targetId : undefined,
    targetOffscreen,
    setTargetOffscreen,
    activityFeed,
    language: snapshot.language,
    openGuide,
    minimizeGuide,
    dismissGuide,
    nextCue,
    prevCue,
    repeatCue,
    toggleSlowMode,
    toggleMute,
    changeLanguage,
    answerYesNo,
    askQuestion,
    toggleVoiceListening,
    retryFromError,
  };

  return (
    <LoomDostContext.Provider value={value}>
      {children}
    </LoomDostContext.Provider>
  );
}

export function useLoomDost() {
  const ctx = useContext(LoomDostContext);
  if (!ctx) {
    throw new Error('useLoomDost must be used inside LoomDostProvider');
  }
  return ctx;
}
