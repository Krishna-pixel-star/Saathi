import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChartBarIcon,
  ClockIcon,
  CurrencyRupeeIcon,
  MicrophoneIcon,
  ShoppingBagIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import Hero from '../components/Hero';
import { useUser } from '../context/UserContext';
import { mockBuyers, mockCrops, mockPriceHistory } from '../utils/mockData';

const stats = [
  {
    id: 'crops',
    label: 'Total Crops Sold',
    value: '1,284 kg',
    trend: '+12% this week',
    icon: ShoppingBagIcon,
  },
  {
    id: 'buyers',
    label: 'Active Buyers',
    value: '47',
    trend: '+8 new buyers',
    icon: UserGroupIcon,
  },
  {
    id: 'price',
    label: 'Average Price',
    value: '₹2,450',
    trend: '+8.4% today',
    icon: CurrencyRupeeIcon,
  },
  {
    id: 'orders',
    label: 'Pending Orders',
    value: '3',
    trend: 'Needs confirmation',
    icon: ClockIcon,
    warning: true,
  },
];

const cropIcons = {
  Wheat: '🌾',
  Paddy: '🍚',
  Maize: '🌽',
  Mustard: '🌿',
  Chickpea: '🫘',
};

const formatRupees = (value) => `₹${value.toLocaleString('en-IN')}`;

export default function Dashboard({ isVoiceModalOpen, onVoiceStart, voiceAssistantResponse }) {
  const navigate = useNavigate();
  const { user } = useUser();
  const farmerName = user?.name?.trim() || 'Ramesh Kumar';

  return (
    <section className="min-h-screen bg-transparent text-gray-800">
      <Hero
        assistantResponse={voiceAssistantResponse}
        isVoiceActive={isVoiceModalOpen}
        onVoiceStart={onVoiceStart || (() => navigate('/ai'))}
        onExploreMarket={() => navigate('/explorer')}
      />

      <section className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
        <LiveMarketTicker />
        <BuyerDemandPreviews onViewBuyers={() => navigate('/buyers')} />
      </section>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <section className="rounded-xl bg-emerald-50 p-5 text-emerald-800 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-green-600 shadow-sm">
                <MicrophoneIcon className="h-6 w-6 animate-pulse" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-emerald-800">बोलकर पूछें</h2>
                <p className="mt-1 text-sm font-semibold text-gray-600 sm:text-base">
                  Press the mic to speak or explore live crop journeys.
                </p>
              </div>
            </div>

            <button
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-green-700 px-5 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-1 hover:bg-emerald-800 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-emerald-100"
              type="button"
              onClick={() => navigate('/ai')}
            >
              <MicrophoneIcon className="h-5 w-5 text-white" />
              Start Voice
            </button>
          </div>
        </section>

        <main className="flex flex-col gap-6">
          <section className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <ChartBarIcon className="h-6 w-6 text-green-700" />
              <h2 className="text-2xl font-extrabold text-gray-800">Live Market Data</h2>
            </div>
            <h3 className="text-3xl font-extrabold text-gray-900">Good evening, {farmerName}</h3>
            <p className="max-w-3xl text-base font-medium leading-7 text-gray-500">
              Real-time buyer demand, mandi price movement, and order health for your farm network.
            </p>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Market statistics">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <article
                  key={stat.id}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-gray-500">{stat.label}</p>
                      {stat.warning ? (
                        <p className="mt-3 inline-flex rounded-xl bg-amber-50 px-3 py-1 text-3xl font-extrabold text-amber-600">
                          {stat.value}
                        </p>
                      ) : (
                        <p className="mt-3 text-3xl font-extrabold text-gray-900">{stat.value}</p>
                      )}
                    </div>
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                        stat.warning ? 'bg-amber-50 text-amber-600' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>

                  <p className={`mt-4 text-sm font-bold ${stat.warning ? 'text-amber-600' : 'text-green-600'}`}>
                    {stat.trend}
                  </p>
                </article>
              );
            })}
          </section>

          <section className="border-l-4 border-amber-500 bg-amber-50 p-5 shadow-sm">
            <p className="text-sm font-bold uppercase text-amber-600">Market Bulletin</p>
            <p className="mt-2 text-base font-bold text-amber-800">
              Varanasi market opens strong for Tomato and Wheat
            </p>
          </section>
        </main>

        <footer className="border-t border-gray-200 pt-5">
          <p className="text-center text-sm font-semibold text-gray-400">
            Voice-first market transparency for every farmer
          </p>
        </footer>
      </div>

    </section>
  );
}

function LiveMarketTicker() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setTick((currentTick) => currentTick + 1);
    }, 3500);

    return () => window.clearInterval(intervalId);
  }, []);

  const tickerItems = useMemo(() => (
    mockPriceHistory.map((record, index) => {
      const crop = mockCrops.find((item) => item.id === record.cropId);
      const shift = ((tick + index) % 3) * 10;
      const price = record.wholesale + shift;

      return {
        id: `${record.cropId}-${tick}`,
        crop: crop?.name || 'Crop',
        icon: cropIcons[crop?.name] || '🌱',
        price: formatRupees(price),
        unit: 'quintal',
      };
    }).sort((firstItem, secondItem) => (
      (firstItem.crop.charCodeAt(0) + tick) % 10 - (secondItem.crop.charCodeAt(0) + tick) % 10
    ))
  ), [tick]);

  const marqueeItems = [...tickerItems, ...tickerItems];

  return (
    <section className="overflow-hidden rounded-xl border border-white/55 bg-white/90 py-3 shadow-md shadow-emerald-950/10 backdrop-blur-md" aria-label="Live market price ticker">
      <div className="flex w-max animate-saathi-marquee items-center gap-8 px-5 motion-reduce:animate-none">
        {marqueeItems.map((item, index) => (
          <span key={`${item.id}-${index}`} className="shrink-0 text-sm font-extrabold text-slate-800 sm:text-base">
            {item.icon} {item.crop} <span className="text-[#15803D]">{item.price}</span>/{item.unit}
          </span>
        ))}
      </div>
    </section>
  );
}

function BuyerDemandPreviews({ onViewBuyers }) {
  return (
    <section aria-labelledby="buyer-demand-preview-title">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-white/80 drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)]">
            Active demand
          </p>
          <h2 id="buyer-demand-preview-title" className="text-2xl font-extrabold text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)]">
            Buyers looking now
          </h2>
        </div>
        <button
          type="button"
          onClick={onViewBuyers}
          className="hidden rounded-full border border-white/40 bg-white/10 px-4 py-2 text-sm font-extrabold text-white backdrop-blur transition hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-white/25 sm:block"
        >
          View all
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {mockBuyers.slice(0, 4).map((buyer) => (
          <article key={buyer.id} className="rounded-xl border border-white/60 border-l-4 border-l-green-500 bg-white p-4 shadow-md shadow-emerald-950/10">
            <p className="text-base font-extrabold text-slate-900">{buyer.name}</p>
            <p className="mt-2 text-sm font-bold text-[#15803D]">{buyer.cropRequired}</p>
            <p className="mt-1 text-sm font-semibold text-slate-600">{buyer.quantityNeeded} qtl needed within {buyer.distance} km</p>
            <button
              type="button"
              onClick={onViewBuyers}
              className="mt-4 inline-flex h-9 items-center rounded-full bg-[#15803D] px-4 text-sm font-extrabold text-white transition hover:bg-[#11632f] focus:outline-none focus:ring-4 focus:ring-green-200"
            >
              View
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
