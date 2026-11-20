import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Play, RotateCcw } from 'lucide-react';
import { GUIDED_DEMO_SCRIPT } from '../data/seedData';
import { ScreenId } from '../types/loomlink';
import { Button, Card } from '../components/ui/Primitives';

interface DemoScriptScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onResetDemo: () => void;
}

export function DemoScriptScreen({
  onNavigate,
  onResetDemo,
}: DemoScriptScreenProps) {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const toggleStep = (num: number) => {
    setCompletedSteps((prev) =>
      prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num]
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#C2593F]">
            Screen 14 · Live Presenter Companion
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#1E2A4A]">
            Guided 3-Minute Demo Script
          </h1>
          <p className="text-sm text-[#565B69] mt-1">
            Follow these timed cues to showcase Lakshmi Devi’s full end-to-end journey from Telugu voice intake to Value Receipt.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setCompletedSteps([]);
            onResetDemo();
          }}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Script & Data</span>
        </Button>
      </div>

      <div className="space-y-3">
        {GUIDED_DEMO_SCRIPT.map((step) => {
          const done = completedSteps.includes(step.stepNumber);
          return (
            <Card
              key={step.stepNumber}
              className={`p-5 transition-colors ${
                done ? 'bg-[#EAF6EE]/45 border-[#1F6E43]/25' : ''
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 text-xs font-mono-num font-semibold text-[#C2593F]">
                    <span>{step.minuteMark}</span>
                    <span aria-hidden="true">·</span>
                    <span>Step {step.stepNumber} of {GUIDED_DEMO_SCRIPT.length}</span>
                  </div>
                  <h2 className="font-display text-lg font-semibold text-[#1E2A4A]">
                    {step.title}
                  </h2>
                  <p className="text-sm text-[#1B1F2A] leading-relaxed">
                    “{step.speakerLine}”
                  </p>
                  <p className="text-xs font-medium text-[#565B69]">
                    Demo Action: {step.actionHint}
                  </p>
                </div>

                <div className="flex sm:flex-col gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="terracotta"
                    onClick={() => {
                      if (!done) toggleStep(step.stepNumber);
                      onNavigate(step.screen);
                    }}
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Open Screen</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleStep(step.stepNumber)}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{done ? 'Completed' : 'Mark Done'}</span>
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
