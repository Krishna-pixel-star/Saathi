import { useMemo, useState } from 'react';
import { useUser } from '../context/UserContext';
import { mockCrops, mockPriceHistory } from '../utils/mockData';

const priceTabs = ['Wholesale', 'Retail', 'Mandi', 'MSP'];

const getPrice = (record, tab) => {
  if (tab === 'Retail') return record.retail;
  if (tab === 'MSP') return record.msp;
  return record.wholesale;
};

const formatRupees = (price) => `₹${price.toLocaleString('en-IN')}`;

const getPriceRange = (price) => {
  const variation = Math.max(50, Math.round((price * 0.05) / 10) * 10);
  return `${formatRupees(price - variation)} – ${formatRupees(price + variation)}`;
};

export default function MarketPrices() {
  const { location } = useUser();
  const [activeTab, setActiveTab] = useState('Wholesale');
  const [firstCropId, setFirstCropId] = useState('');
  const [secondCropId, setSecondCropId] = useState('');

  const priceRows = useMemo(
    () => mockPriceHistory.map((record) => ({
      ...record,
      crop: mockCrops.find((crop) => crop.id === record.cropId),
      modalPrice: getPrice(record, activeTab),
      trend: record.cropId === 3 ? 'down' : 'up',
    })),
    [activeTab],
  );

  const selectedCrops = priceRows.filter(
    (row) => row.cropId === Number(firstCropId) || row.cropId === Number(secondCropId),
  );
  const canCompare = firstCropId && secondCropId && firstCropId !== secondCropId;
  const currentDistrict = location.district || 'Your district';
  const currentMandi = location.district ? `${location.district} Mandi` : 'Nearby Mandi';

  return (
    <section className="mx-auto w-full max-w-4xl">
      <header className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#2E7D32]">Market updates</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Market Prices</h1>
        <div className="mt-4 rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-base text-slate-700 sm:text-lg">
          <span className="font-bold text-[#2E7D32]">📍 {currentDistrict}</span>
          <span className="mx-2 text-slate-300">|</span>
          <span>{currentMandi}</span>
        </div>
      </header>

      <div className="-mx-4 flex overflow-x-auto border-b border-slate-200 px-4 sm:mx-0 sm:px-0" role="tablist" aria-label="Price category">
        {priceTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 border-b-2 px-5 py-3 text-base font-bold transition ${
              activeTab === tab
                ? 'border-[#2E7D32] text-[#2E7D32]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <caption className="sr-only">{activeTab} crop prices</caption>
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4 sm:px-6">Crop</th>
                <th className="px-5 py-4 sm:px-6">Modal Price</th>
                <th className="px-5 py-4 sm:px-6">Price Range</th>
                <th className="px-5 py-4 sm:px-6">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {priceRows.map((row) => (
                <tr key={row.cropId}>
                  <td className="px-5 py-5 text-lg font-bold text-slate-900 sm:px-6">{row.crop.name}</td>
                  <td className="px-5 py-5 text-xl font-extrabold text-[#2E7D32] sm:px-6">{formatRupees(row.modalPrice)}</td>
                  <td className="px-5 py-5 text-base text-slate-600 sm:px-6">{getPriceRange(row.modalPrice)}</td>
                  <td className={`px-5 py-5 text-xl font-bold sm:px-6 ${row.trend === 'up' ? 'text-[#2E7D32]' : 'text-red-600'}`}>
                    {row.trend === 'up' ? '↑' : '↓'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <section className="mt-10 rounded-3xl border border-green-100 bg-white p-5 shadow-sm sm:p-7">
        <h2 className="text-2xl font-bold text-slate-900">Compare Crops</h2>
        <p className="mt-2 text-base text-slate-600">Select two crops to compare their current {activeTab.toLowerCase()} prices.</p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <CropSelect label="First crop" value={firstCropId} onChange={setFirstCropId} />
          <CropSelect label="Second crop" value={secondCropId} onChange={setSecondCropId} />
        </div>

        {canCompare && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {selectedCrops.map((row) => (
              <article key={row.cropId} className="rounded-2xl bg-green-50 p-5">
                <h3 className="text-xl font-bold text-slate-900">{row.crop.name}</h3>
                <p className="mt-4 text-sm font-semibold text-slate-600">Modal Price</p>
                <p className="mt-1 text-3xl font-extrabold text-[#2E7D32]">{formatRupees(row.modalPrice)}</p>
                <p className="mt-4 text-sm text-slate-600">Range: {getPriceRange(row.modalPrice)}</p>
              </article>
            ))}
          </div>
        )}

        {firstCropId && secondCropId && !canCompare && (
          <p className="mt-5 text-sm font-medium text-amber-700">Choose two different crops to compare.</p>
        )}
      </section>
    </section>
  );
}

function CropSelect({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-800 outline-none focus:border-[#2E7D32] focus:ring-4 focus:ring-green-100"
      >
        <option value="">Select a crop</option>
        {mockCrops.map((crop) => (
          <option key={crop.id} value={crop.id}>{crop.name}</option>
        ))}
      </select>
    </label>
  );
}
