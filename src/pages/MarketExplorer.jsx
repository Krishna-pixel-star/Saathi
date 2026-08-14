import { useState } from 'react';
import { mockCrops, mockSupplyChain } from '../utils/mockData';

const formatRupees = (value) => `₹${value.toLocaleString('en-IN')}`;

export default function MarketExplorer() {
  const [cropQuery, setCropQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [searchError, setSearchError] = useState('');

  const handleSearch = (event) => {
    event.preventDefault();
    const normalizedQuery = cropQuery.trim().toLowerCase();
    const crop = mockCrops.find((item) => item.name.toLowerCase().includes(normalizedQuery));

    if (!normalizedQuery || !crop) {
      setSelectedCrop(null);
      setSearchError('Choose a crop from the available market data to see its price journey.');
      return;
    }

    const supplyChain = mockSupplyChain?.find((item) => item.cropId === crop.id);

    if (!supplyChain) {
      setSelectedCrop(null);
      setSearchError('Supply chain data is currently unavailable for this crop.');
      return;
    }

    setSelectedCrop({ crop, supplyChain });
    setSearchError('');
  };

  const stages = selectedCrop && [
    {
      label: 'Farmer',
      icon: '🌾',
      price: selectedCrop.supplyChain.farmerCost,
      detail: 'Growing cost',
    },
    {
      label: 'Wholesaler',
      icon: '🏪',
      price: selectedCrop.supplyChain.wholesalerCost,
      detail: `Transport: ${formatRupees(selectedCrop.supplyChain.transportCost)}/qtl`,
    },
    {
      label: 'Distributor',
      icon: '🚚',
      price: selectedCrop.supplyChain.distributorCost,
      detail: `Markup: ${formatRupees(selectedCrop.supplyChain.distributorCost - selectedCrop.supplyChain.wholesalerCost)}/qtl`,
    },
    {
      label: 'Retailer',
      icon: '🛒',
      price: selectedCrop.supplyChain.retailerCost,
      detail: `Markup: ${formatRupees(selectedCrop.supplyChain.retailerCost - selectedCrop.supplyChain.distributorCost)}/qtl`,
    },
    {
      label: 'Consumer',
      icon: '👥',
      price: selectedCrop.supplyChain.consumerPrice,
      detail: 'Final market price',
    },
  ];

  const totalIncrease = selectedCrop
    ? selectedCrop.supplyChain.consumerPrice - selectedCrop.supplyChain.farmerCost
    : 0;

  return (
    <section className="mx-auto w-full max-w-5xl">
      <header className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#2E7D32]">Price transparency</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Market Explorer</h1>
        <p className="mt-2 text-base text-slate-600">Follow your crop&apos;s journey from farm to consumer.</p>
      </header>

      <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Search a crop</span>
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
          <input
            type="search"
            value={cropQuery}
            onChange={(event) => setCropQuery(event.target.value)}
            placeholder="Search a crop, for example Wheat"
            className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-base text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#2E7D32] focus:ring-4 focus:ring-green-100"
          />
        </label>
        <button
          type="submit"
          className="rounded-2xl bg-[#2E7D32] px-7 py-4 text-base font-bold text-white transition hover:bg-[#256428] focus:outline-none focus:ring-4 focus:ring-green-200"
        >
          Explore
        </button>
      </form>

      {searchError && <p className="mt-3 text-sm font-medium text-red-600">{searchError}</p>}

      {!selectedCrop && !searchError && (
        <div className="mt-8 rounded-3xl border border-dashed border-green-200 bg-green-50 p-8 text-center">
          <p className="text-lg font-bold text-slate-800">Search a crop to reveal its market journey.</p>
          <p className="mt-2 text-sm text-slate-600">Available crops include Wheat, Paddy, Maize, Mustard, and Chickpea.</p>
        </div>
      )}

      {selectedCrop && (
        <>
          <div className="mt-8 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#2E7D32]">Supply chain for</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">{selectedCrop.crop.name}</h2>
            </div>
            <span className="rounded-xl bg-green-50 px-3 py-2 text-sm font-bold text-[#2E7D32]">
              {selectedCrop.supplyChain.distance} km journey
            </span>
          </div>

          <div className="mt-6 overflow-x-auto pb-3">
            <div className="flex min-w-[850px] items-stretch justify-between gap-0">
              {stages.map((stage, index) => (
                <div key={stage.label} className="flex min-w-0 flex-1 items-center">
                  <article className="w-full rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-sm">
                    <span className="text-3xl">{stage.icon}</span>
                    <h3 className="mt-2 text-base font-bold text-slate-900">{stage.label}</h3>
                    <p className="mt-3 text-xl font-extrabold text-[#2E7D32]">{formatRupees(stage.price)}/qtl</p>
                    <p className="mt-1 text-xs font-medium leading-5 text-slate-600">{stage.detail}</p>
                  </article>
                  {index < stages.length - 1 && (
                    <span className="shrink-0 px-2 text-2xl font-bold text-[#F57C00]" aria-hidden="true">→</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <section className="mt-8 rounded-3xl border border-green-100 bg-green-50 p-6 sm:p-7">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#2E7D32]">Total Cost Breakdown</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">How {selectedCrop.crop.name} increases along the chain</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-white p-4">
                <p className="text-sm font-medium text-slate-600">Farmer&apos;s cost</p>
                <p className="mt-1 text-2xl font-extrabold text-slate-900">{formatRupees(selectedCrop.supplyChain.farmerCost)}</p>
              </div>
              <div className="rounded-2xl bg-white p-4">
                <p className="text-sm font-medium text-slate-600">Transport cost</p>
                <p className="mt-1 text-2xl font-extrabold text-slate-900">{formatRupees(selectedCrop.supplyChain.transportCost)}</p>
              </div>
              <div className="rounded-2xl bg-[#2E7D32] p-4 text-white">
                <p className="text-sm font-medium text-green-100">Farm-to-consumer increase</p>
                <p className="mt-1 text-2xl font-extrabold">+{formatRupees(totalIncrease)}</p>
              </div>
            </div>
            <p className="mt-5 text-base leading-7 text-slate-700">
              The consumer price reaches <strong>{formatRupees(selectedCrop.supplyChain.consumerPrice)}/qtl</strong>, which is {formatRupees(totalIncrease)} above the farmer&apos;s growing cost.
            </p>
          </section>
        </>
      )}
    </section>
  );
}
