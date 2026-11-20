import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  HelpCircle,
  Lock,
  Mic,
  MicOff,
  RotateCcw,
  Send,
  ShieldCheck,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { LOOM_DOST_DICTIONARY } from '../../data/loomDostDictionary';
import { useLoomDost } from '../../context/LoomDostContext';
import { LanguageCode } from '../../types/loomlink';
import { ClaimStatusBadge } from '../ui/Primitives';
import { LoomDostCharacter } from './LoomDostCharacter';

const LANG_OPTIONS: [LanguageCode, string][] = [
  ['te', 'తెలుగు'],
  ['kn', 'ಕನ್ನಡ'],
  ['hi', 'हिन्दी'],
  ['en', 'EN'],
];

export function LoomDostPanel() {
  const {
    isOpen,
    dostState,
    isMuted,
    isSlowMode,
    isListening,
    currentCue,
    cueIndex,
    totalScreenCues,
    targetOffscreen,
    activityFeed,
    language,
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
  } = useLoomDost();

  const dict = LOOM_DOST_DICTIONARY[language];
  const [questionInput, setQuestionInput] = useState('');

  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionInput.trim()) return;
    askQuestion(questionInput);
    setQuestionInput('');
  };

  return (
    <>
      {/* Floating Collapsed Avatar in Bottom-Right (Positioned cleanly above mobile 56px bottom nav) */}
      {!isOpen && (
        <div className="fixed bottom-[4.5rem] right-4 md:bottom-6 md:right-6 z-40 flex items-center gap-2.5 no-print">
          <div className="hidden sm:block px-3 py-1.5 rounded-xl bg-white border border-[#1E2A4A]/15 shadow-sm text-xs font-semibold text-[#1E2A4A]">
            {dict.ui.idleTooltip}
          </div>
          <button
            type="button"
            onClick={openGuide}
            aria-label={dict.ui.openGuideLabel}
            data-testid="loom-dost-avatar-btn"
            className="w-16 h-16 rounded-full bg-[#FAF7F2] border-2 border-[#1E2A4A] shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C2593F]"
          >
            <LoomDostCharacter state="IDLE" size="md" />
          </button>
        </div>
      )}

      {/* Expandable Companion Bottom Sheet (Mobile) / Floating Side Card (Desktop) */}
      <AnimatePresence>
        {isOpen && currentCue && (
          <motion.section
            key="loom-dost-panel"
            aria-label={dict.ui.name}
            data-testid="loom-dost-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-x-3 bottom-[4.25rem] sm:inset-x-auto sm:bottom-5 sm:right-5 sm:w-[380px] max-h-[72vh] overflow-y-auto z-45 rounded-2xl bg-[#FAF7F2] border-2 border-[#1E2A4A]/25 shadow-2xl p-4 space-y-3.5 no-print"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <LoomDostCharacter state={dostState} size="sm" />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h2 className="font-display text-base font-bold text-[#1E2A4A] truncate">
                      {dict.ui.name}
                    </h2>
                    <span className="px-2 py-0.5 rounded bg-[#F2ECE1] border border-[#1E2A4A]/15 text-[11px] font-semibold text-[#1E2A4A]">
                      {dict.stateLabels[dostState]}
                    </span>
                  </div>
                  <p className="text-xs text-[#565B69] truncate">
                    {dict.ui.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={isMuted ? dict.ui.unmuteLabel : dict.ui.muteLabel}
                  className="min-h-[38px] min-w-[38px] rounded-xl bg-white border border-[#1E2A4A]/15 flex items-center justify-center text-[#1E2A4A] hover:bg-[#F2ECE1] cursor-pointer"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-[#B42318]" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-[#1F6E43]" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={minimizeGuide}
                  aria-label="Minimize Loom Dost"
                  className="min-h-[38px] min-w-[38px] rounded-xl bg-white border border-[#1E2A4A]/15 flex items-center justify-center text-[#565B69] hover:bg-[#F2ECE1] cursor-pointer text-xs font-bold"
                >
                  —
                </button>
                <button
                  type="button"
                  onClick={dismissGuide}
                  aria-label={dict.ui.dismissLabel}
                  className="min-h-[38px] min-w-[38px] rounded-xl bg-white border border-[#1E2A4A]/15 flex items-center justify-center text-[#565B69] hover:bg-[#FEECEB] hover:text-[#B42318] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Inline Language Switcher (Translate) */}
            <div className="flex items-center justify-between gap-2 bg-[#F2ECE1] p-1.5 rounded-xl">
              <span className="text-[11px] font-semibold text-[#1E2A4A] pl-1.5">
                {dict.ui.translateLabel}:
              </span>
              <div className="flex items-center gap-1 flex-wrap">
                {LANG_OPTIONS.map(([code, label]) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => changeLanguage(code)}
                    className={`min-h-[32px] px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      language === code
                        ? 'bg-[#1E2A4A] text-white'
                        : 'bg-white text-[#1E2A4A] hover:bg-white/80'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Contextual Explanation Card */}
            <div
              role="status"
              aria-live="polite"
              className={`p-4 rounded-xl border space-y-2.5 ${
                dostState === 'APPROVAL_REMINDER'
                  ? 'bg-[#FEF4E6] border-[#9A5B13]/35'
                  : dostState === 'ERROR_HELP'
                    ? 'bg-[#FEECEB] border-[#B42318]/30'
                    : 'bg-white border-[#1E2A4A]/15'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#C2593F]">
                  {dostState === 'APPROVAL_REMINDER' && (
                    <Lock className="w-3.5 h-3.5 text-[#9A5B13]" aria-hidden="true" />
                  )}
                  {dostState === 'WAITING_FOR_ACTION' && (
                    <Clock className="w-3.5 h-3.5 text-[#C2593F]" aria-hidden="true" />
                  )}
                  {dostState === 'EXPLAINING' && (
                    <ShieldCheck className="w-3.5 h-3.5 text-[#1F6E43]" aria-hidden="true" />
                  )}
                  <span>{currentCue.title}</span>
                </div>

                {currentCue.stepIndex && currentCue.totalSteps && (
                  <span className="text-[11px] font-mono-num font-semibold text-[#565B69]">
                    {currentCue.stepIndex}/{currentCue.totalSteps}
                  </span>
                )}
              </div>

              {/* Large Readable Explanation Text */}
              <p
                data-testid="loom-dost-message"
                className="text-base sm:text-[17px] font-medium text-[#1B1F2A] leading-relaxed"
              >
                {currentCue.text}
              </p>

              {/* Live Claim Status Badge (VERIFIED / ARTISAN-REPORTED / PENDING / BLOCKED) */}
              {currentCue.claimBadge && (
                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  <ClaimStatusBadge status={currentCue.claimBadge} />
                  <span className="text-xs text-[#565B69]">
                    {dict.claimDefinitions[currentCue.claimBadge]}
                  </span>
                </div>
              )}

              {currentCue.isSimulated && (
                <p className="text-[11px] font-mono-num font-semibold text-[#565B69]">
                  {dict.ui.simulatedBadge}
                </p>
              )}

              {targetOffscreen && (
                <p className="text-xs font-medium text-[#9A5B13] bg-[#FEF4E6] px-2.5 py-1.5 rounded-lg">
                  {dict.ui.offscreenHint}
                </p>
              )}

              {/* Yes / No Interactive Prompt (e.g. Demo Step 7/8) */}
              {currentCue.yesNoPrompt && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => answerYesNo(true)}
                    className="min-h-[44px] px-3 py-2 rounded-xl bg-[#C2593F] text-white text-sm font-semibold hover:bg-[#A6462F] cursor-pointer"
                  >
                    {currentCue.yesNoPrompt.yesLabel}
                  </button>
                  <button
                    type="button"
                    onClick={() => answerYesNo(false)}
                    className="min-h-[44px] px-3 py-2 rounded-xl bg-[#F2ECE1] text-[#1E2A4A] border border-[#1E2A4A]/20 text-sm font-semibold hover:bg-[#E7DEC8] cursor-pointer"
                  >
                    {currentCue.yesNoPrompt.noLabel}
                  </button>
                </div>
              )}

              {/* Retry Button on Error */}
              {dostState === 'ERROR_HELP' && (
                <button
                  type="button"
                  onClick={retryFromError}
                  className="min-h-[44px] w-full px-3 py-2 rounded-xl bg-[#B42318] text-white text-sm font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{dict.ui.retryBtn}</span>
                </button>
              )}
            </div>

            {/* Repeat / Slow Down / Step / Got It Controls */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={repeatCue}
                className="min-h-[42px] px-2.5 py-1.5 rounded-xl bg-white border border-[#1E2A4A]/20 text-xs font-semibold text-[#1E2A4A] hover:bg-[#F2ECE1] inline-flex items-center justify-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                <span>{dict.ui.repeatBtn}</span>
              </button>

              <button
                type="button"
                onClick={toggleSlowMode}
                className={`min-h-[42px] px-2.5 py-1.5 rounded-xl border text-xs font-semibold inline-flex items-center justify-center gap-1 cursor-pointer ${
                  isSlowMode
                    ? 'bg-[#1E2A4A] text-white border-[#1E2A4A]'
                    : 'bg-white text-[#1E2A4A] border-[#1E2A4A]/20 hover:bg-[#F2ECE1]'
                }`}
              >
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {isSlowMode ? dict.ui.normalSpeedBtn : dict.ui.slowDownBtn}
                </span>
              </button>

              <button
                type="button"
                onClick={prevCue}
                disabled={cueIndex <= 0}
                className="min-h-[42px] px-2.5 py-1.5 rounded-xl bg-white border border-[#1E2A4A]/20 text-xs font-semibold text-[#1E2A4A] hover:bg-[#F2ECE1] disabled:opacity-40 inline-flex items-center justify-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5 shrink-0" />
                <span>{dict.ui.prevBtn}</span>
              </button>

              {cueIndex < totalScreenCues - 1 ? (
                <button
                  type="button"
                  onClick={nextCue}
                  className="min-h-[42px] px-2.5 py-1.5 rounded-xl bg-[#1E2A4A] text-white text-xs font-semibold hover:bg-[#141D36] inline-flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>{dict.ui.nextBtn}</span>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={minimizeGuide}
                  className="min-h-[42px] px-2.5 py-1.5 rounded-xl bg-[#1F6E43] text-white text-xs font-semibold hover:bg-[#185735] inline-flex items-center justify-center cursor-pointer"
                >
                  {dict.ui.gotItBtn}
                </button>
              )}
            </div>

            {/* Voice Question + Text Fallback */}
            <div className="space-y-2 pt-1 border-t border-[#1E2A4A]/10">
              {isListening && (
                <p className="text-xs font-semibold text-[#C2593F]">
                  {dict.ui.listeningLabel}
                </p>
              )}

              <div className="flex flex-wrap gap-1.5">
                {dict.quickTopics.map((topic) => (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => askQuestion(topic.query)}
                    className="min-h-[34px] px-2.5 py-1 rounded-lg bg-white border border-[#1E2A4A]/15 text-xs font-medium text-[#1E2A4A] hover:bg-[#F2ECE1] inline-flex items-center gap-1 cursor-pointer"
                  >
                    <HelpCircle className="w-3 h-3 text-[#C2593F] shrink-0" />
                    <span>{topic.label}</span>
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmitQuestion} className="flex gap-2">
                <button
                  type="button"
                  onClick={toggleVoiceListening}
                  aria-label={
                    isListening ? dict.ui.stopListeningBtn : dict.ui.askVoiceBtn
                  }
                  className={`min-h-[44px] px-3 rounded-xl font-semibold text-xs inline-flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    isListening
                      ? 'bg-[#B42318] text-white'
                      : 'bg-[#C2593F] text-white hover:bg-[#A6462F]'
                  }`}
                >
                  {isListening ? (
                    <MicOff className="w-4 h-4 shrink-0" />
                  ) : (
                    <Mic className="w-4 h-4 shrink-0" />
                  )}
                  <span className="hidden sm:inline">
                    {isListening ? dict.ui.stopListeningBtn : dict.ui.askVoiceBtn}
                  </span>
                </button>

                <label htmlFor="loom-dost-question-input" className="sr-only">
                  {dict.ui.askPlaceholder}
                </label>
                <input
                  id="loom-dost-question-input"
                  type="text"
                  value={questionInput}
                  onChange={(e) => setQuestionInput(e.target.value)}
                  placeholder={dict.ui.askPlaceholder}
                  className="flex-1 min-w-0 min-h-[44px] px-3 rounded-xl bg-white border border-[#1E2A4A]/20 text-sm text-[#1B1F2A] focus:outline-2 focus:outline-[#1E2A4A]"
                />
                <button
                  type="submit"
                  aria-label={dict.ui.sendBtn}
                  className="min-h-[44px] px-3 rounded-xl bg-[#1E2A4A] text-white text-xs font-semibold hover:bg-[#141D36] inline-flex items-center justify-center shrink-0 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Collapsible Agent Activity Explanation Feed */}
            {activityFeed.length > 0 && (
              <details className="text-xs border-t border-[#1E2A4A]/10 pt-2">
                <summary className="cursor-pointer font-semibold text-[#565B69] hover:text-[#1E2A4A] py-1">
                  {dict.ui.activityTitle} ({activityFeed.length})
                </summary>
                <ul className="space-y-1.5 pt-1.5">
                  {activityFeed.map((item) => (
                    <li
                      key={item.id}
                      className="p-2 rounded-lg bg-white border border-[#1E2A4A]/10 text-[#1B1F2A]"
                    >
                      {item.message}
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
