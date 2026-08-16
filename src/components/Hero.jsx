import { useUser } from '../context/UserContext';
import LocationBar from './LocationBar';

export default function Hero({ assistantResponse, isVoiceActive, onVoiceStart, onExploreMarket }) {
  const { t } = useUser();

  return (
    <section className="relative text-white pt-28 sm:pt-32 pb-4 px-4 sm:px-6 lg:px-8">
      <div className="relative z-10 mx-auto max-w-4xl text-center">

        {}
        <h1 className="font-devanagari text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-5xl drop-shadow-lg">
          {t('hero.headingLine1')}<br />
          {t('hero.headingLine2')}
        </h1>



        {}
        <div className="mt-5 flex flex-wrap items-start justify-center gap-3">
          {}
          <LocationBar compact={false} />

          {}
          <div className="inline-flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-[#0c2a20]/80 px-4 py-2.5 text-emerald-100 shadow-md backdrop-blur-md self-start">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400 shrink-0" />
            <span className="text-sm font-semibold">{t('hero.marketUpdatedToday')}</span>
          </div>
        </div>

        {}
        {assistantResponse && (
          <div className="mt-4 text-left rounded-2xl border border-emerald-300/50 bg-[#0c2a20]/95 p-4 text-sm font-medium leading-relaxed text-emerald-50 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1.5">
              <img src="/saathi-mic-logo.png" alt="SAATHI Voice" className="h-5 w-5 rounded-full bg-[#fdfbf7] object-contain p-0.5" />
              <span>{t('hero.voiceAnswer') === 'hero.voiceAnswer' ? 'SAATHI AI Answer' : t('hero.voiceAnswer')}</span>
            </div>
            <p className="text-slate-100 font-semibold">{assistantResponse}</p>
          </div>
        )}
      </div>
    </section>
  );
}
