'use client';

import React, { useEffect } from 'react';
import { Ban } from 'lucide-react';
import { Button } from './Button';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  statsSummary?: string;
  buttonLabel: string;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  statsSummary,
  buttonLabel,
}) => {
  // Web Audio Alert Siren effect
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined' && 'AudioContext' in window) {
      try {
        const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(880, audioCtx.currentTime + 0.3);
        osc.frequency.linearRampToValueAtTime(440, audioCtx.currentTime + 0.6);

        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.7);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.7);
      } catch (err) {
        console.warn('Audio alert not allowed without user interaction', err);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        role="alertdialog"
        aria-modal="true"
        className="w-full max-w-lg bg-[#111827] border-2 border-danger rounded-2xl p-7 text-center shadow-dangerGlow flex flex-col items-center"
      >
        <div className="w-16 h-16 rounded-full bg-danger/15 flex items-center justify-center text-danger mb-4">
          <Ban size={36} />
        </div>

        <h3 className="text-xl font-bold text-danger mb-2.5">{title}</h3>
        <p className="text-sm text-[#d1d5db] leading-relaxed mb-4">{description}</p>

        {statsSummary && (
          <div className="w-full py-2.5 px-4 bg-black/30 border border-white/10 rounded-lg text-xs font-mono text-white/90 mb-6">
            {statsSummary}
          </div>
        )}

        <Button variant="danger" size="md" onClick={onClose} fullWidth>
          {buttonLabel}
        </Button>
      </div>
    </div>
  );
};
