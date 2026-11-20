import React from 'react';
import { LoomDostProvider } from '../../context/LoomDostContext';
import { DostContextSnapshot } from '../../types/loomDost';
import { LanguageCode } from '../../types/loomlink';
import { HighlightOverlay } from './HighlightOverlay';
import { LoomDostPanel } from './LoomDostPanel';

interface LoomDostWidgetProps {
  snapshot: DostContextSnapshot;
  onLanguageChange: (lang: LanguageCode) => void;
}

/**
 * Self-contained, read-only Loom Dost companion widget.
 * Observes app context without controlling navigation, prices, or approvals.
 */
export function LoomDostWidget({
  snapshot,
  onLanguageChange,
}: LoomDostWidgetProps) {
  return (
    <LoomDostProvider snapshot={snapshot} onLanguageChange={onLanguageChange}>
      <HighlightOverlay />
      <LoomDostPanel />
    </LoomDostProvider>
  );
}
