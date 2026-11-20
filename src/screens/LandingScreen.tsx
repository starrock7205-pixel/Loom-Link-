import React from 'react';
import { ArrowRight, Play, ShieldCheck, UserCheck } from 'lucide-react';
import { ASSETS, DEMO_PERSONAS } from '../data/seedData';
import { LanguageCode, ScreenId, UserRole } from '../types/loomlink';
import { Button, Card, ResilientImage, SimulatedTag } from '../components/ui/Primitives';
import { TRANSLATIONS } from '../data/translations';

interface LandingScreenProps {
  activeRole: UserRole;
  language: LanguageCode;
  onSelectRole: (role: UserRole, targetScreen: ScreenId) => void;
  onSelectLanguage: (lang: LanguageCode) => void;
  onStartDemo: () => void;
}

const ROLE_DEFAULT_SCREEN: Record<UserRole, ScreenId> = {
  artisan: 'artisan',
  handler: 'evidence',
  operator: 'janai',
  buyer: 'marketplace',
  judge: 'judge',
};

export function LandingScreen({
  activeRole,
  language,
  onSelectRole,
  onSelectLanguage,
  onStartDemo,
}: LandingScreenProps) {
  const t = TRANSLATIONS[language];

  return (
    <div className="space-y-8">
      {/* Hero Split — Balanced stretch columns */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 bg-woven-indigo text-white rounded-3xl p-6 sm:p-10 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#F2ECE1]/85 font-medium">
              <span>Tech4Bharat: GAVS Hackathon 2026</span>
              <span aria-hidden="true">·</span>
              <span>Gadwal & Narayanpet Clusters</span>
              <span aria-hidden="true">·</span>
              <SimulatedTag label="SIMULATED PROTOTYPE" />
            </div>

            <h1 className="font-display text-3xl sm:text-5xl font-semibold leading-tight tracking-tight">
              AI creates market power. The artisan retains final authority.
            </h1>

            <p className="text-base sm:text-lg text-[#F2ECE1]/90 max-w-2xl leading-relaxed">
              {t.promiseBanner}
            </p>
            <p className="text-sm text-[#F2ECE1]/75 max-w-xl leading-relaxed">
              Voice-first Telugu, Hindi, and Kannada saree listing, zero-hallucination provenance verification, transparent deterministic pricing, and Voice-PIN control on entry-level Android phones.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ['te', 'తెలుగు (Telugu)'],
                  ['hi', 'हिन्दी (Hindi)'],
                  ['kn', 'ಕನ್ನಡ (Kannada)'],
                  ['en', 'English'],
                ] as [LanguageCode, string][]
              ).map(([code, label]) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => onSelectLanguage(code)}
                  className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    language === code
                      ? 'bg-[#C2593F] text-white'
                      : 'bg-white/12 text-white hover:bg-white/20'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3">
              <Button
                variant="terracotta"
                size="lg"
                onClick={onStartDemo}
                className="w-full sm:w-auto"
              >
                <Play className="w-5 h-5 shrink-0" />
                <span>Start 3-Minute Demo</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => onSelectRole('buyer', 'marketplace')}
                className="w-full sm:w-auto"
              >
                <span>Explore Marketplace</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative rounded-3xl overflow-hidden border border-[#1E2A4A]/15 min-h-[300px]">
          <ResilientImage
            src={ASSETS.loomPitloom}
            alt="Master handloom weaver working on a traditional wooden pit loom in Gadwal"
            className="w-full h-full object-cover min-h-[300px]"
            fallbackTitle="Gadwal Handloom Pit Loom"
          />
          <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-[#141D36]/95 via-[#141D36]/65 to-transparent text-white">
            <p className="text-xs font-semibold text-[#F2ECE1]/85">
              Zero-Hallucination Provenance · Voice-PIN Governance
            </p>
            <p className="font-display text-lg font-semibold mt-0.5">
              66.9% of retail price retained by the weaver
            </p>
          </div>
        </div>
      </section>

      {/* Role Selection Grid */}
      <section aria-labelledby="role-selection-heading" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2
              id="role-selection-heading"
              className="font-display text-2xl font-semibold text-[#1E2A4A]"
            >
              Choose Role to Enter Workspace
            </h2>
            <p className="text-sm text-[#565B69] mt-1">
              Test strict Human-in-the-Loop boundaries across Artisan, Handler, JanAI Café Operator, Buyer, and Judge views.
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1F6E43]">
            <ShieldCheck className="w-4 h-4" aria-hidden="true" />
            <span>Every critical action requires Artisan Voice-PIN</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEMO_PERSONAS.map((persona) => {
            const isCurrent = activeRole === persona.role;
            return (
              <Card
                key={persona.id}
                className={`p-5 flex flex-col justify-between gap-4 transition-colors ${
                  isCurrent ? 'ring-2 ring-[#C2593F]' : ''
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-[#C2593F]">
                        {persona.roleLabel}
                      </p>
                      <h3 className="font-display text-xl font-semibold text-[#1E2A4A] mt-0.5">
                        {persona.name}
                      </h3>
                    </div>
                    {persona.role === 'artisan' && (
                      <ResilientImage
                        src={ASSETS.lakshmiPortrait}
                        alt="Lakshmi Devi portrait"
                        className="w-12 h-12 rounded-xl object-cover border border-[#1E2A4A]/15 shrink-0"
                        fallbackTitle="LD"
                      />
                    )}
                  </div>

                  <p className="text-xs text-[#565B69]">
                    {persona.village} · {persona.cluster}
                  </p>
                  <p className="text-sm text-[#1B1F2A] leading-relaxed">
                    {persona.summary}
                  </p>
                  <p className="text-xs font-medium text-[#1E2A4A] bg-[#FAF7F2] border border-[#1E2A4A]/10 rounded-xl p-2.5">
                    {persona.permissions}
                  </p>
                </div>

                <Button
                  variant={persona.role === 'artisan' ? 'primary' : 'outline'}
                  className="w-full justify-between"
                  onClick={() =>
                    onSelectRole(persona.role, ROLE_DEFAULT_SCREEN[persona.role])
                  }
                >
                  <span className="inline-flex items-center gap-2">
                    <UserCheck className="w-4 h-4" aria-hidden="true" />
                    <span>Enter as {persona.name.split(' ')[0]}</span>
                  </span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Button>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
