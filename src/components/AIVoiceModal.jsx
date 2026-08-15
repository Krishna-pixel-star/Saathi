import { useEffect, useState } from 'react';
import { MicrophoneIcon, XMarkIcon } from '@heroicons/react/24/outline';

const transcriptWords = ['मेरे', 'पास', '500', 'किलो', 'गेहूं', 'है,', 'आज', 'कहाँ', 'बेचूं?'];
const mockAssistantResponse = 'AI Assistant: Best price for wheat is at Varanasi Mandi - ₹2,450/quintal.';

export default function AIVoiceModal({ onClose, onResponse }) {
  const [transcript, setTranscript] = useState('Listening...');

  useEffect(() => {
    let wordIndex = 0;
    let intervalId;

    const startTyping = window.setTimeout(() => {
      setTranscript('');
      intervalId = window.setInterval(() => {
        const nextWord = transcriptWords[wordIndex];

        setTranscript((currentTranscript) => (
          `${currentTranscript}${currentTranscript ? ' ' : ''}${nextWord}`
        ));
        wordIndex += 1;

        if (wordIndex >= transcriptWords.length) {
          window.clearInterval(intervalId);
        }
      }, 260);
    }, 900);

    return () => {
      window.clearTimeout(startTyping);
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const stopListening = () => {
    onResponse?.(mockAssistantResponse);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/55 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="presentation"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-voice-modal-title"
        className="w-full max-w-xl rounded-t-3xl border border-white/60 bg-white/90 p-5 shadow-2xl backdrop-blur-lg sm:rounded-3xl sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#15803D] text-white shadow-lg shadow-green-900/25">
              <MicrophoneIcon className="h-6 w-6" />
            </span>
            <div>
              <h2 id="ai-voice-modal-title" className="text-2xl font-extrabold text-slate-900">SAATHI is listening</h2>
              <p className="mt-1 text-sm font-semibold text-[#15803D]">Voice-first market assistant</p>
            </div>
          </div>

          <button
            aria-label="Cancel voice assistant"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-200"
            type="button"
            onClick={onClose}
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </header>

        <div className="mt-7 rounded-2xl border border-green-100 bg-green-50/80 p-5">
          <div className="flex h-24 items-end justify-center gap-2" aria-hidden="true">
            {[0, 1, 2, 3, 4, 5, 6].map((bar) => (
              <span
                key={bar}
                className="voice-wave-bar block w-3 rounded-full bg-[#15803D] shadow-lg shadow-green-900/10"
                style={{ animationDelay: `${bar * 120}ms` }}
              />
            ))}
          </div>

          <div className="mt-5 rounded-2xl bg-white px-4 py-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Live transcription</p>
            <p className="mt-2 min-h-8 text-lg font-extrabold leading-8 text-slate-900">
              {transcript || 'Listening...'}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl bg-red-600 px-5 text-base font-extrabold text-white transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-200"
            type="button"
            onClick={stopListening}
          >
            Stop Listening
          </button>
          <button
            className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-base font-extrabold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200"
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </section>
    </div>
  );
}
