import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowPathIcon,
  ArrowRightIcon,
  BuildingLibraryIcon,
  CheckCircleIcon,
  CurrencyRupeeIcon,
  InformationCircleIcon,
  MapPinIcon,
  MicrophoneIcon,
  PencilSquareIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { useLocationContext } from '../context/LocationContext';
import { mockBuyers, mockCrops, mockPriceHistory, mockSupplyChain } from '../utils/mockData';

const DEMO_LABEL = t('dashboard.demoLabel');
const DEMO_MARKET_LABEL = t('dashboard.priceSource');
const unavailableText = 'जानकारी अभी उपलब्ध नहीं है';

const formatRupees = (value) => (
  Number.isFinite(value) ? `₹${value.toLocaleString('en-IN')}` : unavailableText
);

const cropNameFor = (cropId) => {
  const crop = mockCrops.find((item) => item.id === cropId);
  return crop?.nameHi || crop?.name || unavailableText;
};

const getAddressText = (address) => {
  if (!address) return '';

  const parts = [
    address.locality,
    address.city,
    address.district,
    address.state,
  ].filter(Boolean);

  const uniqueParts = [...new Set(parts)];
  return address.formatted || uniqueParts.join(', ');
};

const getRegionText = (address) => (
  address?.district || address?.city || address?.locality || 'स्थान उपलब्ध नहीं है'
);

const formatTimestamp = (value) => {
  if (!value) return t('prices.notAvailable');

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return t('prices.notAvailable');

  return parsed.toLocaleString('hi-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const distanceKm = (from, to) => {
  if (!from || !to?.latitude || !to?.longitude) return null;

  const toRad = (degrees) => (degrees * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(to.latitude - from.latitude);
  const dLon = toRad(to.longitude - from.longitude);
  const lat1 = toRad(from.latitude);
  const lat2 = toRad(to.latitude);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(earthRadiusKm * c);
};

const journeyStages = [t('explorer.farmerStageTitle'), t('buyer.wholesaler'), t('explorer.stageDistributor'), t('buyer.retailer'), 'ग्राहक'];

export default function Dashboard({ onVoiceStart, voiceAssistantResponse }) {
  const { t } = useUser();
  const navigate = useNavigate();
  const {
    address,
    coordinates,
    source,
    permissionStatus,
    loading,
    lastUpdated,
    requestLocation,
    refreshLocation,
    setManualLocation,
  } = useLocationContext();
  const [manualLocation, setManualLocationText] = useState('');
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [selectedCropId, setSelectedCropId] = useState(mockSupplyChain[0]?.cropId || 1);

  const addressText = getAddressText(address);
  const hasLocation = Boolean(addressText);
  const isDeviceLocation = hasLocation && source === 'device';
  const regionText = getRegionText(address);

  const marketRows = useMemo(() => (
    mockPriceHistory.slice(0, 4).map((record) => ({
      crop: cropNameFor(record.cropId),
      price: formatRupees(record.wholesale),
      market: record.mandi || 'स्थानीय मंडी',
    }))
  ), []);

  const buyerRows = useMemo(() => (
    mockBuyers.slice(0, 3).map((buyer) => ({
      ...buyer,
      computedDistance: distanceKm(coordinates, buyer),
    }))
  ), [coordinates]);

  const cropOptions = useMemo(() => (
    mockSupplyChain.map((item) => ({
      id: item.cropId,
      label: cropNameFor(item.cropId),
    }))
  ), []);

  const selectedJourney = useMemo(() => (
    mockSupplyChain.find((item) => item.cropId === Number(selectedCropId)) || mockSupplyChain[0]
  ), [selectedCropId]);

  const handleLocationRefresh = () => {
    if (hasLocation) {
      refreshLocation();
      return;
    }

    requestLocation();
  };

  const handleManualSubmit = (event) => {
    event.preventDefault();
    const value = manualLocation.trim();

    if (!value) return;

    setManualLocation(value);
    setManualLocationText('');
    setIsManualOpen(false);
  };

  return (
    <div className="relative min-h-screen pb-14 text-slate-900">
      <section className="relative flex min-h-[680px] items-center px-4 pb-10 pt-48 sm:px-6 sm:pt-36 lg:min-h-[700px] lg:px-8 lg:pt-32">
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#f7f3ea] to-transparent" />

        <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded border border-white/25 bg-[#063f2a]/35 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-50 backdrop-blur-sm">
              <CheckCircleIcon className="h-4 w-4" />
              किसान सेवा मंच
            </div>

            <div className="mt-6 max-w-3xl rounded-lg bg-[#062f24]/55 p-5 text-white shadow-2xl shadow-black/20 backdrop-blur-[2px] sm:p-7">
              <h1 className="text-4xl font-semibold leading-tight tracking-normal text-white sm:text-5xl lg:text-6xl">{t('hero.subtitle')}</h1>
              <p className="mt-5 text-base font-medium leading-7 text-emerald-50 sm:text-xl">{t('hero.tagline')}</p>
            </div>
          </div>

          <LocationPanel
            addressText={addressText}
            hasLocation={hasLocation}
            isDeviceLocation={isDeviceLocation}
            isManualOpen={isManualOpen}
            loading={loading}
            manualLocation={manualLocation}
            onLocationRefresh={handleLocationRefresh}
            onManualChange={setManualLocationText}
            onManualSubmit={handleManualSubmit}
            onToggleManual={() => setIsManualOpen((current) => !current)}
            permissionStatus={permissionStatus}
            source={source}
          />
        </div>
      </section>

      <main className="relative z-10 bg-[#f7f3ea] px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <StatusStrip
            lastUpdated={lastUpdated}
            marketAvailable={marketRows.length > 0}
            regionText={regionText}
          />

          <section className="pt-10 sm:pt-12">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-[#8a641d]">
                किसान डैशबोर्ड
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-normal text-[#173f2e] sm:text-4xl">
                आज आपको क्या जानना है?
              </h2>
              <p className="mt-3 text-base leading-7 text-slate-600">
                अपनी फसल और बाजार से जुड़ी जानकारी जल्दी पाएं।
              </p>
            </div>
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]" aria-label="Market and buyer overview">
            <MarketSnapshot rows={marketRows} onOpen={() => navigate('/prices')} />
            <BuyerMatching rows={buyerRows} hasDeviceLocation={isDeviceLocation} onOpen={() => navigate('/buyers')} />
          </section>

          <MarketJourney
            cropOptions={cropOptions}
            selectedCropId={selectedCropId}
            selectedJourney={selectedJourney}
            onCropChange={setSelectedCropId}
            onOpen={() => navigate('/explorer')}
          />

          <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
            <GovernmentInfo onOpen={() => navigate('/government')} />
            <VoiceAssistant
              assistantResponse={voiceAssistantResponse}
              onVoiceStart={onVoiceStart}
            />
          </section>

          <HowSaathiHelps />
        </div>
      </main>
    </div>
  );
}

function LocationPanel({
  addressText,
  hasLocation,
  isDeviceLocation,
  isManualOpen,
  loading,
  manualLocation,
  onLocationRefresh,
  onManualChange,
  onManualSubmit,
  onToggleManual,
  permissionStatus,
  source,
}) {
  const statusText = loading
    ? 'स्थान खोजा जा रहा है'
    : hasLocation
      ? isDeviceLocation
        ? 'ब्राउज़र लोकेशन से'
        : 'आपके द्वारा चुना गया स्थान'
      : 'स्थान उपलब्ध नहीं है';

  return (
    <aside className="rounded-lg border border-white/35 bg-white/95 p-5 text-slate-900 shadow-2xl shadow-black/15 backdrop-blur-md">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#f3ead7] text-[#835b12]">
          <MapPinIcon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#174532]">{t('location.deviceSource')}</p>
          <p className="mt-2 text-lg font-semibold leading-7 text-slate-900">
            {loading ? 'स्थान खोजा जा रहा है...' : hasLocation ? addressText : 'स्थान उपलब्ध नहीं है'}
          </p>
          <p className="mt-1 text-xs font-medium text-slate-500">
            {statusText}
          </p>
        </div>
      </div>

      {permissionStatus === 'denied' && (
        <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-900">
          ब्राउज़र में location permission बंद है। अनुमति देने के बाद Refresh Location दबाएं।
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3 text-sm font-semibold">
        <button
          className="inline-flex items-center gap-2 rounded-md border border-[#b9c9bf] bg-white px-3 py-2 text-[#174532] transition hover:border-[#174532] hover:bg-[#eef5ef] focus:outline-none focus:ring-4 focus:ring-emerald-100"
          type="button"
          onClick={onLocationRefresh}
        >
          <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />{t('location.refresh')}</button>
        <button
          className="inline-flex items-center gap-2 rounded-md px-2 py-2 text-[#174532] transition hover:bg-[#eef5ef] focus:outline-none focus:ring-4 focus:ring-emerald-100"
          type="button"
          onClick={onToggleManual}
        >
          <PencilSquareIcon className="h-4 w-4" />{t('prices.changeLoc')}</button>
      </div>

      {isManualOpen && (
        <form className="mt-4 flex flex-col gap-2 sm:flex-row" onSubmit={onManualSubmit}>
          <label className="sr-only" htmlFor="dashboard-manual-location">स्थान लिखें</label>
          <input
            id="dashboard-manual-location"
            className="min-h-11 flex-1 rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#174532] focus:ring-4 focus:ring-emerald-100"
            placeholder="गांव / शहर / जिला लिखें"
            type="text"
            value={manualLocation}
            onChange={(event) => onManualChange(event.target.value)}
          />
          <button
            className="min-h-11 rounded-md bg-[#174532] px-4 text-sm font-semibold text-white transition hover:bg-[#0f3325] focus:outline-none focus:ring-4 focus:ring-emerald-100"
            type="submit"
          >
            Save
          </button>
        </form>
      )}

      {source === 'manual' && (
        <p className="mt-3 text-xs font-medium text-slate-500">
          यह स्थान आपने चुना है; वास्तविक दूरी के लिए ब्राउज़र लोकेशन refresh करें।
        </p>
      )}
    </aside>
  );
}

function StatusStrip({ lastUpdated, marketAvailable, regionText }) {
  return (
    <section className="mt-0 grid gap-3 rounded-lg border border-[#d8d0bd] bg-[#fffdf6] p-4 shadow-lg shadow-black/5 md:-mt-8 md:grid-cols-3">
      <StatusItem label="आपके क्षेत्र" value={regionText} />
      <StatusItem label="बाजार जानकारी" value={marketAvailable ? DEMO_MARKET_LABEL : 'Unavailable'} />
      <StatusItem label="Last updated" value={formatTimestamp(lastUpdated)} />
    </section>
  );
}

function StatusItem({ label, value }) {
  return (
    <div className="border-b border-[#e7deca] pb-3 last:border-b-0 last:pb-0 md:border-b-0 md:border-r md:pb-0 md:pr-4 md:last:border-r-0">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[#173f2e]">{value}</p>
    </div>
  );
}

function MarketSnapshot({ rows, onOpen }) {
  return (
    <section className="rounded-lg border border-[#d9d1bf] bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">{DEMO_MARKET_LABEL}</p>
          <h3 className="mt-1 text-2xl font-semibold text-[#173f2e]">आज का बाजार भाव</h3>
        </div>
        <CurrencyRupeeIcon className="h-8 w-8 text-[#8a641d]" />
      </div>

      <div className="mt-5 overflow-hidden rounded-md border border-slate-200">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Demo market crop prices</caption>
          <thead className="bg-[#f4f0e6] text-xs uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-3 font-semibold">{t('prices.cropCol')}</th>
              <th className="px-4 py-3 text-right font-semibold">भाव</th>
              <th className="px-4 py-3 font-semibold">बाजार</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length > 0 ? rows.map((row) => (
              <tr key={`${row.crop}-${row.market}`} className="bg-white">
                <td className="px-4 py-3 font-semibold text-slate-900">{row.crop}</td>
                <td className="px-4 py-3 text-right font-semibold text-[#174532]">{row.price}</td>
                <td className="px-4 py-3 text-slate-600">{row.market}</td>
              </tr>
            )) : (
              <tr>
                <td className="px-4 py-5 text-center text-slate-500" colSpan="3">
                  {unavailableText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <button
        className="mt-5 inline-flex items-center gap-2 rounded-md bg-[#174532] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0f3325] focus:outline-none focus:ring-4 focus:ring-emerald-100"
        type="button"
        onClick={onOpen}
      >
        बाजार भाव देखें
        <ArrowRightIcon className="h-4 w-4" />
      </button>
    </section>
  );
}

function BuyerMatching({ rows, hasDeviceLocation, onOpen }) {
  return (
    <section className="rounded-lg border border-[#d9d1bf] bg-[#fbfaf4] p-5 shadow-sm">
      <div className="grid gap-5 lg:grid-cols-[0.78fr_1.22fr]">
        <div className="border-b border-[#ded6c5] pb-4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">{DEMO_LABEL}</p>
          <div className="mt-3 flex h-12 w-12 items-center justify-center rounded-md bg-[#e7f0ea] text-[#174532]">
            <UserGroupIcon className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-2xl font-semibold text-[#173f2e]">{t('buyer.title')}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            अपनी फसल खरीदने वाले नजदीकी व्यापारी और खरीदार खोजें।
          </p>
          {!hasDeviceLocation && (
            <p className="mt-3 text-sm font-medium text-slate-500">
              दूरी दिखाने के लिए browser location की अनुमति दें।
            </p>
          )}
        </div>

        <div className="space-y-3">
          {rows.length > 0 ? rows.map((buyer) => (
            <div key={buyer.id} className="grid gap-3 rounded-md border border-slate-200 bg-white p-4 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <p className="text-base font-semibold text-slate-900">{buyer.name}</p>
                <p className="mt-1 text-sm text-slate-500">{buyer.location || unavailableText}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold">
                  {buyer.verificationType && (
                    <span className="rounded border border-emerald-200 bg-emerald-50 px-2 py-1 text-emerald-800">
                      {buyer.verificationType}
                    </span>
                  )}
                  {buyer.computedDistance != null && (
                    <span className="rounded border border-blue-200 bg-blue-50 px-2 py-1 text-blue-800">
                      {buyer.computedDistance} km
                    </span>
                  )}
                </div>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Offered price</p>
                <p className="mt-1 text-lg font-semibold text-[#174532]">{formatRupees(buyer.pricePerQtl)}</p>
                <p className="text-xs text-slate-500">/ क्विंटल</p>
              </div>
            </div>
          )) : (
            <p className="rounded-md border border-slate-200 bg-white p-4 text-sm font-medium text-slate-500">
              {unavailableText}
            </p>
          )}

          <button
            className="inline-flex items-center gap-2 rounded-md border border-[#174532] bg-white px-4 py-2.5 text-sm font-semibold text-[#174532] transition hover:bg-[#eef5ef] focus:outline-none focus:ring-4 focus:ring-emerald-100"
            type="button"
            onClick={onOpen}
          >{t('explorer.viewBuyerCTA')}<ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

function MarketJourney({ cropOptions, selectedCropId, selectedJourney, onCropChange, onOpen }) {
  const priceSteps = [
    { label: 'किसान का भाव', value: selectedJourney?.farmerCost },
    { label: 'थोक भाव', value: selectedJourney?.wholesalerCost },
    { label: 'खुदरा भाव', value: selectedJourney?.consumerPrice },
  ];

  const movementSteps = [t('explorer.transportArrangement'), 'बाजार', 'ग्राहक'];

  return (
    <section className="mt-6 rounded-lg border border-[#d9d1bf] bg-white p-5 shadow-sm">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">{DEMO_LABEL}</p>
          <h3 className="mt-1 text-2xl font-semibold text-[#173f2e]">फसल का सफर समझें</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            किसान से ग्राहक तक फसल की कीमत, परिवहन और बाजार की भूमिका को एक जगह समझें।
          </p>

          <label className="mt-5 block max-w-xs">
            <span className="mb-2 block text-sm font-semibold text-slate-700">फसल चुनें</span>
            <select
              className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#174532] focus:ring-4 focus:ring-emerald-100"
              value={selectedCropId}
              onChange={(event) => onCropChange(Number(event.target.value))}
            >
              {cropOptions.map((crop) => (
                <option key={crop.id} value={crop.id}>{crop.label}</option>
              ))}
            </select>
          </label>
        </div>

        <div>
          <div className="grid gap-2 sm:grid-cols-5 sm:gap-4">
            {journeyStages.map((stage, index) => (
              <div key={stage} className="relative">
                <div className="flex min-h-14 items-center justify-center rounded-md border border-[#d9d1bf] bg-[#fbfaf4] px-3 text-center text-sm font-semibold text-[#173f2e]">
                  {stage}
                </div>
                {index < journeyStages.length - 1 && (
                  <div className="absolute left-full top-1/2 hidden h-px w-4 bg-[#b8aa8f] sm:block" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {priceSteps.map((step) => (
              <div key={step.label} className="rounded-md border border-slate-200 bg-[#f8fafc] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{step.label}</p>
                <p className="mt-2 text-lg font-semibold text-[#174532]">{formatRupees(step.value)}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2 text-sm font-semibold text-slate-700">
            {movementSteps.map((step) => (
              <span key={step} className="rounded border border-blue-100 bg-blue-50 px-3 py-1.5 text-blue-900">
                {step}
              </span>
            ))}
          </div>

          <button
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-[#8a641d] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6f5017] focus:outline-none focus:ring-4 focus:ring-amber-100"
            type="button"
            onClick={onOpen}
          >
            पूरा सफर देखें
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

function GovernmentInfo({ onOpen }) {
  const categories = [
    {
      title: 'योजनाएं',
      body: 'किसानों के लिए उपलब्ध योजनाएं',
    },
    {
      title: t('prices.tabMSP'),
      body: 'न्यूनतम समर्थन मूल्य',
    },
    {
      title: 'मंडी जानकारी',
      body: 'मंडी और खरीद संबंधी जानकारी',
    },
  ];

  return (
    <section className="rounded-lg border border-[#d9d1bf] bg-[#fffdf6] p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-md bg-blue-50 text-blue-900">
          <BuildingLibraryIcon className="h-6 w-6" />
        </span>
        <div>
          <h3 className="text-2xl font-semibold text-[#173f2e]">सरकारी सहायता</h3>
          <p className="mt-1 text-sm text-slate-600">योजनाएं, MSP और मंडी से जुड़ी जानकारी।</p>
        </div>
      </div>

      <div className="mt-5 divide-y divide-slate-200 border-y border-slate-200">
        {categories.map((item) => (
          <div key={item.title} className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr]">
            <p className="font-semibold text-[#173f2e]">{item.title}</p>
            <p className="text-sm leading-6 text-slate-600">{item.body}</p>
          </div>
        ))}
      </div>

      <button
        className="mt-5 inline-flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-950 transition hover:bg-blue-100 focus:outline-none focus:ring-4 focus:ring-blue-100"
        type="button"
        onClick={onOpen}
      >
        सरकारी जानकारी देखें
        <ArrowRightIcon className="h-4 w-4" />
      </button>
    </section>
  );
}

function VoiceAssistant({ assistantResponse, onVoiceStart }) {
  const examples = [
    t('dashboard.q1'),
    'मेरे पास कौन खरीदार है?',
    'नजदीकी मंडी कहां है?',
  ];

  return (
    <section className="rounded-lg border border-[#d9d1bf] bg-[#173f2e] p-5 text-white shadow-sm">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-md bg-white/10 text-emerald-100">
          <MicrophoneIcon className="h-6 w-6" />
        </span>
        <div>
          <h3 className="text-2xl font-semibold">{t('explorer.askSaathi')}</h3>
          <p className="mt-2 text-sm leading-6 text-emerald-50/85">
            बोलकर पूछें — फसल का भाव, खरीदार या बाजार की जानकारी।
          </p>
        </div>
      </div>

      <button
        className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-white px-4 text-base font-semibold text-[#173f2e] transition hover:bg-emerald-50 focus:outline-none focus:ring-4 focus:ring-white/25 sm:w-auto"
        type="button"
        onClick={onVoiceStart}
      >
        <MicrophoneIcon className="h-5 w-5" />{t('ai.speakButton')}</button>

      <div className="mt-5 space-y-2 border-t border-white/15 pt-4">
        {examples.map((example) => (
          <p key={example} className="text-sm font-medium leading-6 text-emerald-50/80">
            "{example}"
          </p>
        ))}
      </div>

      {assistantResponse && (
        <div className="mt-5 rounded-md border border-white/15 bg-white/10 p-4 text-sm font-medium leading-6 text-white">
          {assistantResponse}
        </div>
      )}
    </section>
  );
}

function HowSaathiHelps() {
  const points = [
    {
      number: '01',
      title: 'सही भाव',
      body: 'अलग-अलग बाजारों के भाव समझें।',
    },
    {
      number: '02',
      title: 'सही खरीदार',
      body: 'अपनी फसल के संभावित खरीदार खोजें।',
    },
    {
      number: '03',
      title: 'सही जानकारी',
      body: 'सरकारी योजनाओं और बाजार की जानकारी एक जगह पाएं।',
    },
  ];

  return (
    <section className="mt-10 rounded-lg border border-[#d9d1bf] bg-[#fbfaf4] p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <InformationCircleIcon className="mt-1 h-6 w-6 shrink-0 text-[#8a641d]" />
        <div>
          <h3 className="text-2xl font-semibold text-[#173f2e]">SAATHI आपके लिए क्या करता है?</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            रोजमर्रा के फैसलों के लिए सरल, भरोसेमंद और उपयोगी जानकारी।
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {points.map((point) => (
          <div key={point.number} className="border-l-2 border-[#c8b893] pl-4">
            <p className="text-sm font-semibold text-[#8a641d]">{point.number}</p>
            <h4 className="mt-2 text-lg font-semibold text-[#173f2e]">{point.title}</h4>
            <p className="mt-2 text-sm leading-6 text-slate-600">{point.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
