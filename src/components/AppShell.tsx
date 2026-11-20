import React from 'react';
import {
  FileCheck2,
  Home,
  Mic,
  Receipt,
  ShoppingBag,
  Truck,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { LanguageCode, ScreenId, UserRole } from '../types/loomlink';
import { TRANSLATIONS } from '../data/translations';

interface AppShellProps {
  activeScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  isOffline: boolean;
  onToggleOffline: () => void;
  children: React.ReactNode;
}

const ROLE_LABELS: Record<UserRole, string> = {
  artisan: 'Lakshmi Devi (Artisan)',
  handler: 'Ramesh (Handler)',
  operator: 'Srinivas (JanAI Café)',
  buyer: 'Boutique Buyer',
  judge: 'Judge Jury',
};

export function AppShell({
  activeScreen,
  onNavigate,
  role,
  onRoleChange,
  language,
  onLanguageChange,
  isOffline,
  onToggleOffline,
  children,
}: AppShellProps) {
  const t = TRANSLATIONS[language];

  return (
    <div className="min-h-screen flex flex-col bg-woven-ivory text-[#1B1F2A]">
      {/* Top Bar Contract: [Brand title] — [4-5 nav links] — [1 primary action] */}
      <header className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#1E2A4A]/12 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <button
            type="button"
            onClick={() => onNavigate('landing')}
            className="font-display text-xl font-bold tracking-tight text-[#1E2A4A] whitespace-nowrap shrink-0 cursor-pointer"
          >
            LoomLink
          </button>

          {/* Zone 2: 5 concise single-line nav links */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-[#565B69]"
          >
            <button
              type="button"
              onClick={() => onNavigate('artisan')}
              className={`hover:text-[#1E2A4A] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeScreen === 'artisan' ? 'text-[#1E2A4A] underline underline-offset-4' : ''
              }`}
            >
              Artisan Home
            </button>
            <button
              type="button"
              onClick={() => onNavigate('voice')}
              className={`hover:text-[#1E2A4A] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeScreen === 'voice' ? 'text-[#1E2A4A] underline underline-offset-4' : ''
              }`}
            >
              Voice Intake
            </button>
            <button
              type="button"
              onClick={() => onNavigate('marketplace')}
              className={`hover:text-[#1E2A4A] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeScreen === 'marketplace' || activeScreen === 'pdp'
                  ? 'text-[#1E2A4A] underline underline-offset-4'
                  : ''
              }`}
            >
              Marketplace
            </button>
            <button
              type="button"
              onClick={() => onNavigate('janai')}
              className={`hover:text-[#1E2A4A] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeScreen === 'janai' ? 'text-[#1E2A4A] underline underline-offset-4' : ''
              }`}
            >
              JanAI Café
            </button>
            <button
              type="button"
              onClick={() => onNavigate('judge')}
              className={`hover:text-[#1E2A4A] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeScreen === 'judge' ? 'text-[#1E2A4A] underline underline-offset-4' : ''
              }`}
            >
              Judge Metrics
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('script')}
              className="min-h-[40px] px-4 py-2 rounded-xl bg-[#C2593F] text-white text-xs sm:text-sm font-semibold hover:bg-[#A6462F] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              3-Min Demo Script
            </button>
          </div>
        </div>
      </header>

      {/* Scrollable Workspace Utility Strip (below header, non-sticky so mobile sticky height stays <= 15%) */}
      <div className="border-b border-[#1E2A4A]/10 bg-[#F2ECE1]/75 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <label htmlFor="role-switcher" className="font-semibold text-[#1E2A4A]">
              Role:
            </label>
            <select
              id="role-switcher"
              value={role}
              onChange={(e) => onRoleChange(e.target.value as UserRole)}
              className="min-h-[36px] px-2.5 py-1 rounded-lg bg-white border border-[#1E2A4A]/20 text-xs font-semibold text-[#1E2A4A]"
            >
              {(Object.keys(ROLE_LABELS) as UserRole[]).map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABELS[r]}
                </option>
              ))}
            </select>

            <label htmlFor="lang-switcher" className="font-semibold text-[#1E2A4A] ml-1">
              Lang:
            </label>
            <select
              id="lang-switcher"
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
              className="min-h-[36px] px-2.5 py-1 rounded-lg bg-white border border-[#1E2A4A]/20 text-xs font-semibold text-[#1E2A4A]"
            >
              <option value="te">తెలుగు (Telugu)</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="kn">ಕನ್ನಡ (Kannada)</option>
              <option value="en">English</option>
            </select>

            {/* Compact All-14-Screens selector for mobile jump to any view */}
            <label htmlFor="all-screen-switcher" className="sr-only md:hidden">
              Jump to Screen
            </label>
            <select
              id="all-screen-switcher"
              value={activeScreen}
              onChange={(e) => onNavigate(e.target.value as ScreenId)}
              className="md:hidden min-h-[36px] px-2.5 py-1 rounded-lg bg-white border border-[#1E2A4A]/20 text-xs font-semibold text-[#1E2A4A]"
            >
              <option value="landing">1. Role Selection</option>
              <option value="artisan">2. Artisan Dashboard</option>
              <option value="voice">3. Voice Intake Wizard</option>
              <option value="evidence">4. Evidence Vault</option>
              <option value="pricing">5. Pricing Studio</option>
              <option value="publish">6. Publication Gate</option>
              <option value="negotiation">7. Buyer Offers</option>
              <option value="bulk">8. Bulk Order Desk</option>
              <option value="janai">9. JanAI Café Ops</option>
              <option value="marketplace">10. Buyer Marketplace</option>
              <option value="pdp">11. Product Detail</option>
              <option value="receipt">12. Value Receipt</option>
              <option value="judge">13. Judge Dashboard</option>
              <option value="script">14. 3-Min Demo Script</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onToggleOffline}
              className={`min-h-[36px] px-2.5 py-1 rounded-lg border text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
                isOffline
                  ? 'bg-[#FEECEB] border-[#B42318]/30 text-[#B42318]'
                  : 'bg-white border-[#1E2A4A]/20 text-[#1E2A4A] hover:bg-[#FAF7F2]'
              }`}
            >
              {isOffline ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>Offline (Draft Saved)</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-[#1F6E43] shrink-0" aria-hidden="true" />
                  <span>2G/3G Sync Ready</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => onNavigate('receipt')}
              className="min-h-[36px] px-3 py-1 rounded-lg bg-[#1E2A4A] text-white text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-[#141D36] cursor-pointer"
            >
              <Receipt className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Value Receipt</span>
            </button>
          </div>
        </div>

        {/* Focused 3-Minute Demo Journey Stepper (Desktop) */}
        <div className="hidden md:flex max-w-7xl mx-auto px-4 sm:px-6 pb-2 items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {(
              [
                ['landing', 'Start'],
                ['voice', '1–2. Telugu Voice & GI'],
                ['evidence', '3. Yarn & Loom Proof'],
                ['pricing', '4. Fair Price'],
                ['publish', '5. Voice-PIN'],
                ['negotiation', '6–8. Offer & Counter'],
                ['janai', '9. JanAI Ops'],
                ['receipt', '10. Value Receipt'],
              ] as [ScreenId, string][]
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => onNavigate(id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                  activeScreen === id
                    ? 'bg-[#1E2A4A] text-white'
                    : 'bg-white/85 text-[#565B69] hover:text-[#1E2A4A] hover:bg-white border border-[#1E2A4A]/10'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Offline Alert Strip when Offline Mode is toggled */}
      {isOffline && (
        <div
          role="alert"
          className="bg-[#FEF4E6] border-b border-[#9A5B13]/25 px-4 py-2.5 text-center text-xs sm:text-sm font-semibold text-[#5D3609] no-print"
        >
          {t.offlineSaved} Changes are queued locally and will sync automatically when 3G/4G returns.
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12">
        {children}
      </main>

      {/* Mobile Thumb Bottom Navigation Bar (56px height -> with 56px top bar = 112px / 844px = 13.2% <= 15% sticky cap) */}
      <nav
        aria-label="Mobile quick navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-14 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#1E2A4A]/15 grid grid-cols-5 items-center no-print"
      >
        {(
          [
            ['artisan', 'Home', Home],
            ['voice', 'Voice', Mic],
            ['evidence', 'Proof', FileCheck2],
            ['marketplace', 'Market', ShoppingBag],
            ['janai', 'JanAI', Truck],
          ] as [ScreenId, string, React.ComponentType<{ className?: string }>][]
        ).map(([id, label, Icon]) => {
          const active = activeScreen === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
              className={`h-full flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold cursor-pointer ${
                active ? 'text-[#C2593F]' : 'text-[#565B69]'
              }`}
            >
              <Icon className="w-5 h-5" aria-hidden="true" />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
