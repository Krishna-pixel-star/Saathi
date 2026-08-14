import { useMemo, useState } from 'react';
import { mockBuyers } from '../utils/mockData';

const buyerTypes = ['All', 'Wholesaler', 'Retailer', 'Distributor', 'Mandi Buyer', 'Govt Agency'];

export default function BuyerDiscovery() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [sortOrder, setSortOrder] = useState('high-to-low');

  const buyers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return mockBuyers
      .filter((buyer) => {
        const matchesCrop = buyer.cropRequired.toLowerCase().includes(normalizedSearch);
        const matchesType = selectedType === 'All' || buyer.type === selectedType;
        return matchesCrop && matchesType;
      })
      .sort((firstBuyer, secondBuyer) => (
        sortOrder === 'high-to-low'
          ? secondBuyer.pricePerQtl - firstBuyer.pricePerQtl
          : firstBuyer.pricePerQtl - secondBuyer.pricePerQtl
      ));
  }, [searchTerm, selectedType, sortOrder]);

  return (
    <section className="mx-auto w-full max-w-3xl">
      <header className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#2E7D32]">Marketplace</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Buyer Discovery</h1>
        <p className="mt-2 text-base text-slate-600">Find buyers looking for your crop.</p>
      </header>

      <label className="relative block">
        <span className="sr-only">Search by crop</span>
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search by crop, for example Wheat"
          className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-base text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#2E7D32] focus:ring-4 focus:ring-green-100"
        />
      </label>

      <div className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0" aria-label="Buyer type filters">
        {buyerTypes.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setSelectedType(type)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
              selectedType === type
                ? 'bg-[#2E7D32] text-white'
                : 'border border-slate-200 bg-white text-slate-600 hover:border-[#2E7D32] hover:text-[#2E7D32]'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-slate-600">
          {buyers.length} {buyers.length === 1 ? 'buyer' : 'buyers'} found
        </p>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
          <span className="hidden sm:inline">Sort:</span>
          <select
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-[#2E7D32] focus:ring-4 focus:ring-green-100"
          >
            <option value="high-to-low">Price: High-Low</option>
            <option value="low-to-high">Price: Low-High</option>
          </select>
        </label>
      </div>

      <div className="mt-5 space-y-4">
        {buyers.map((buyer) => (
          <article key={buyer.id} className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">{buyer.name}</h2>
                <p className="mt-1 text-sm font-semibold text-[#2E7D32]">{buyer.type} · Needs {buyer.cropRequired}</p>
              </div>
              <span className="rounded-xl bg-green-50 px-3 py-2 text-sm font-bold text-[#2E7D32]">₹{buyer.pricePerQtl.toLocaleString('en-IN')}/qtl</span>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3 border-y border-slate-100 py-4 text-center">
              <div>
                <p className="text-xs font-medium text-slate-500">Distance</p>
                <p className="mt-1 text-base font-bold text-slate-800">{buyer.distance} km</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Quantity</p>
                <p className="mt-1 text-base font-bold text-slate-800">{buyer.quantityNeeded} qtl</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Price</p>
                <p className="mt-1 text-base font-bold text-slate-800">₹{buyer.pricePerQtl.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <a
              href={`tel:${buyer.contact.replace(/\s/g, '')}`}
              className="mt-5 flex w-full items-center justify-center rounded-xl bg-[#2E7D32] px-4 py-3 text-base font-semibold text-white transition hover:bg-[#256428] focus:outline-none focus:ring-4 focus:ring-green-200 sm:w-auto sm:px-6"
            >
              Contact
            </a>
          </article>
        ))}

        {buyers.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <p className="text-lg font-bold text-slate-800">No buyers found</p>
            <p className="mt-2 text-sm text-slate-600">Try another crop name or buyer type.</p>
          </div>
        )}
      </div>
    </section>
  );
}
