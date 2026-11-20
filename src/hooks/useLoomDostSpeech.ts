import { useCallback, useEffect, useRef, useState } from 'react';
import { LanguageCode } from '../types/loomlink';

const LANG_TO_BCP47: Record<LanguageCode, string> = {
  te: 'te-IN',
  kn: 'kn-IN',
  hi: 'hi-IN',
  en: 'en-IN',
};

export function useSpeechSynthesisGuidance() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const supported =
    typeof window !== 'undefined' && 'speechSynthesis' in window;

  const stop = useCallback(() => {
    if (!supported) return;
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore headless browser speech errors
    }
    setIsSpeaking(false);
  }, [supported]);

  const speak = useCallback(
    (text: string, language: LanguageCode, slowMode: boolean, muted: boolean) => {
      if (!supported || muted || !text.trim()) {
        setIsSpeaking(false);
        return;
      }

      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const targetLang = LANG_TO_BCP47[language];
        utterance.lang = targetLang;
        utterance.rate = slowMode ? 0.78 : 0.96;
        utterance.pitch = 1.0;

        const voices = window.speechSynthesis.getVoices();
        const exact = voices.find((v) =>
          v.lang.toLowerCase().startsWith(targetLang.toLowerCase())
        );
        const langPrefix = voices.find((v) =>
          v.lang.toLowerCase().startsWith(language.toLowerCase())
        );
        if (exact || langPrefix) {
          utterance.voice = exact ?? langPrefix ?? null;
        }

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
      } catch {
        setIsSpeaking(false);
      }
    },
    [supported]
  );

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return { speak, stop, isSpeaking, isSupported: supported };
}

interface SpeechRecognitionAltLike {
  transcript: string;
}

interface SpeechRecognitionResLike {
  0: SpeechRecognitionAltLike;
}

interface SpeechRecognitionEvtLike {
  results: ArrayLike<SpeechRecognitionResLike>;
}

interface SpeechRecognitionInstanceLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((e: SpeechRecognitionEvtLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

export function useSpeechRecognitionQuery(
  language: LanguageCode,
  onTranscript: (text: string) => void,
  onVoiceError: () => void
) {
  const [isListening, setIsListening] = useState(false);
  const recRef = useRef<SpeechRecognitionInstanceLike | null>(null);

  const getConstructor = () => {
    if (typeof window === 'undefined') return undefined;
    const win = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionInstanceLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionInstanceLike;
    };
    return win.SpeechRecognition || win.webkitSpeechRecognition;
  };

  const stopListening = useCallback(() => {
    if (recRef.current) {
      try {
        recRef.current.stop();
      } catch {
        // ignore stop errors
      }
    }
    setIsListening(false);
  }, []);

  const startListening = useCallback(() => {
    const SpeechRec = getConstructor();
    if (!SpeechRec) {
      setIsListening(false);
      onVoiceError();
      return;
    }

    if (isListening) {
      stopListening();
      return;
    }

    try {
      const rec = new SpeechRec();
      rec.lang = LANG_TO_BCP47[language];
      rec.interimResults = false;
      rec.maxAlternatives = 1;

      rec.onresult = (event) => {
        const text = event.results?.[0]?.[0]?.transcript?.trim();
        setIsListening(false);
        if (text) {
          onTranscript(text);
        } else {
          onVoiceError();
        }
      };

      rec.onerror = () => {
        setIsListening(false);
        onVoiceError();
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recRef.current = rec;
      setIsListening(true);
      rec.start();
    } catch {
      setIsListening(false);
      onVoiceError();
    }
  }, [isListening, language, onTranscript, onVoiceError, stopListening]);

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  return {
    isListening,
    startListening,
    stopListening,
    isSupported: Boolean(getConstructor()),
  };
}
