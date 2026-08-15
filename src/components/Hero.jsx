import { ArrowRightIcon, MicrophoneIcon } from '@heroicons/react/24/outline';
import HeroBackground from './HeroBackground';

const fadeStyle = (delay) => ({
  animation: 'saathiFadeInUp 760ms ease-out forwards',
  animationDelay: delay,
});

const heroTextShadow = 'drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)]';

export default function Hero({ assistantResponse, isVoiceActive, onVoiceStart, onExploreMarket }) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <style>
        {`
          @keyframes saathiFadeInUp {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }

            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .saathi-hero-fade {
              animation: none !important;
              opacity: 1 !important;
              transform: none !important;
            }
          }
        `}
      </style>

      <HeroBackground />

      <div className="relative z-10 flex min-h-screen flex-col justify-center px-5 pb-24 pt-36 text-center sm:px-8 lg:px-16">
        <div className="saathi-hero-fade opacity-0" style={fadeStyle('0.15s')}>
          <p className={`inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold uppercase tracking-wide text-white/85 backdrop-blur ${heroTextShadow}`}>
            Voice-first agricultural market transparency
          </p>
        </div>

        <h1
          className={`saathi-hero-fade mt-6 opacity-0 text-4xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl ${heroTextShadow}`}
          style={fadeStyle('0.3s')}
        >
          अपनी फसल की पूरी यात्रा जानें
        </h1>

        <p
          className={`saathi-hero-fade mt-5 px-1 text-lg font-medium leading-8 text-white/95 opacity-0 sm:text-xl lg:px-24 lg:text-2xl ${heroTextShadow}`}
          style={fadeStyle('0.6s')}
        >
          कीमत, खरीदार और आपूर्ति श्रृंखला - अब अपनी भाषा में
        </p>

        <div
          className="saathi-hero-fade mt-9 flex w-full flex-col items-stretch justify-center gap-3 opacity-0 sm:flex-row sm:items-center"
          style={fadeStyle('0.6s')}
        >
          <button
            aria-label="Ask SAATHI by voice"
            className={`group inline-flex min-h-16 items-center justify-center gap-3 rounded-full bg-white px-7 text-base font-extrabold text-green-700 shadow-2xl shadow-green-500/50 transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/50 sm:w-80 sm:text-lg ${
              isVoiceActive ? 'animate-pulse ring-4 ring-green-300/80' : ''
            }`}
            type="button"
            onClick={onVoiceStart}
          >
            <MicrophoneIcon className="h-6 w-6" />
            <span className="drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)]">बोलकर पूछें</span>
          </button>

          <button
            aria-label="Explore market data"
            className={`group inline-flex min-h-16 items-center justify-center gap-3 rounded-full border border-white/55 bg-white/10 px-7 text-base font-extrabold text-white shadow-2xl shadow-black/20 backdrop-blur transition-transform duration-300 hover:scale-105 hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-white/30 sm:w-80 sm:text-lg ${heroTextShadow}`}
            type="button"
            onClick={onExploreMarket}
          >
            Market देखें
            <ArrowRightIcon className="h-5 w-5 transition group-hover:translate-x-1" />
          </button>
        </div>

        <p className={`saathi-hero-fade mt-5 text-sm font-semibold text-white/75 opacity-0 ${heroTextShadow}`} style={fadeStyle('0.75s')}>
          Press the mic to speak or explore live crop journeys.
        </p>

        {assistantResponse && (
          <div
            className="saathi-hero-fade mx-auto mt-6 max-w-2xl rounded-2xl border border-white/25 bg-white/15 px-5 py-4 text-left text-sm font-bold leading-6 text-white shadow-2xl shadow-black/20 backdrop-blur-md sm:text-base"
            role="status"
            style={fadeStyle('0s')}
          >
            {assistantResponse}
          </div>
        )}
      </div>
    </section>
  );
}
