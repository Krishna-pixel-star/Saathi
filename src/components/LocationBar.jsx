

import { useState } from 'react';
import { MapPinIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useLocationContext } from '../context/LocationContext';
import { useUser } from '../context/UserContext';

export default function LocationBar({ compact = false }) {
  const { t } = useUser();
  const {
    address,
    source,
    permissionStatus,
    loading,
    error,
    lastUpdated,
    requestLocation,
    refreshLocation,
    setManualLocation,
    accuracy,
  } = useLocationContext();

  const [showManualInput, setShowManualInput] = useState(false);
  const [manualText, setManualText] = useState('');

  const handleAllowLocation = () => {
    setShowManualInput(false);
    requestLocation();
  };

  const handleRefresh = () => {
    refreshLocation();
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualText.trim()) {
      setManualLocation(manualText.trim());
      setShowManualInput(false);
      setManualText('');
    }
  };

  const isLowAccuracy = accuracy != null && accuracy > 1000;

  if (permissionStatus === 'idle') {
    return (
      <div className={`inline-flex flex-col items-start gap-2 rounded-2xl border border-emerald-500/20 bg-[#0c2a20]/80 px-4 py-3 text-emerald-50 shadow-md backdrop-blur-md ${compact ? '' : 'w-full sm:w-auto'}`}>
        <div className="flex items-center gap-2">
          <MapPinIcon className="h-4 w-4 text-emerald-400 shrink-0" />
          <span className="text-sm font-semibold text-emerald-200">{t('location.notSet')}</span>
        </div>

        {!compact && (
          <div className="space-y-1 text-xs text-emerald-300/80 pl-6">
            <p>✓ {t('location.benefit1')}</p>
            <p>✓ {t('location.benefit2')}</p>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 pl-6">
          <button
            onClick={handleAllowLocation}
            className="rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-400 transition focus:outline-none focus:ring-2 focus:ring-emerald-300"
          >
            📍 {t('location.useMyLocation')}
          </button>
          <button
            onClick={() => setShowManualInput((v) => !v)}
            className="text-xs font-medium text-emerald-300 underline hover:text-white transition"
          >
            {t('location.enterManually')}
          </button>
        </div>

        {showManualInput && (
          <form onSubmit={handleManualSubmit} className="flex items-center gap-2 pl-6 w-full">
            <input
              type="text"
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              placeholder={t('location.manualLabel')}
              className="flex-1 min-w-0 rounded-xl border border-emerald-500/40 bg-[#061e17] px-3 py-1.5 text-xs text-white placeholder:text-emerald-500/60 outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <button
              type="submit"
              className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition"
            >
              {t('location.useThis')}
            </button>
          </form>
        )}
      </div>
    );
  }

  if (loading || permissionStatus === 'requesting') {
    return (
      <div className="inline-flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-[#0c2a20]/80 px-4 py-2 text-emerald-50 shadow-md backdrop-blur-md">
        <span className="relative flex h-4 w-4 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald-500" />
        </span>
        <span className="text-sm font-semibold text-emerald-200">{t('location.detecting')}</span>
      </div>
    );
  }

  if (permissionStatus === 'granted' && address) {
    const displayText = address.formatted || address.locality || address.city || address.district || t('location.deviceSource');
    const sourceLabel = source === 'manual' ? t('location.manualSource') : t('location.deviceSource');

    return (
      <div className="inline-flex flex-col items-start gap-1 rounded-2xl border border-emerald-500/20 bg-[#0c2a20]/80 px-4 py-2 text-emerald-50 shadow-md backdrop-blur-md">
        <div className="flex items-center gap-2">
          <MapPinIcon className="h-4 w-4 text-emerald-400 shrink-0" />
          <div className="text-left leading-tight">
            <span className="block text-sm font-bold text-white">📍 {displayText}</span>
            <span className="block text-[10px] text-emerald-300 font-normal">{sourceLabel}</span>
          </div>
          {source === 'device' && (
            <button
              onClick={handleRefresh}
              title={t('location.refresh')}
              className="ml-2 flex items-center gap-1 text-[10px] font-bold text-emerald-400 hover:text-white transition"
            >
              <ArrowPathIcon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t('location.refresh')}</span>
            </button>
          )}
          {source === 'manual' && (
            <button
              onClick={() => setShowManualInput((v) => !v)}
              className="ml-2 text-[10px] font-bold text-emerald-400 hover:text-white transition"
            >
              ✏️
            </button>
          )}
        </div>

        {isLowAccuracy && (
          <p className="pl-6 text-[10px] text-amber-300 font-medium">{t('location.lowAccuracy')}</p>
        )}

        {showManualInput && (
          <form onSubmit={handleManualSubmit} className="flex items-center gap-2 pl-6 w-full mt-1">
            <input
              type="text"
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              placeholder={t('location.manualLabel')}
              className="flex-1 min-w-0 rounded-xl border border-emerald-500/40 bg-[#061e17] px-3 py-1.5 text-xs text-white placeholder:text-emerald-500/60 outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <button
              type="submit"
              className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition"
            >
              {t('location.useThis')}
            </button>
          </form>
        )}
      </div>
    );
  }

  const errorMessages = {
    denied: { icon: '🔒', title: t('location.denied'), msg: t('location.deniedMessage') },
    unavailable: { icon: '📡', title: t('location.unavailable'), msg: t('location.unavailableMessage') },
    timeout: { icon: '⏱️', title: t('location.timeout'), msg: t('location.timeoutMessage') },
  };

  const errInfo = errorMessages[permissionStatus] || errorMessages.unavailable;

  return (
    <div className="inline-flex flex-col items-start gap-2 rounded-2xl border border-red-500/30 bg-[#2a0c0c]/80 px-4 py-3 text-red-100 shadow-md backdrop-blur-md">
      <div className="flex items-center gap-2">
        <span className="text-base">{errInfo.icon}</span>
        <span className="text-sm font-bold">{errInfo.title}</span>
      </div>
      <p className="pl-6 text-xs text-red-200/80">{errInfo.msg}</p>
      <div className="flex flex-wrap items-center gap-2 pl-6">
        <button
          onClick={handleAllowLocation}
          className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition"
        >
          {t('location.tryAgain')}
        </button>
        <button
          onClick={() => setShowManualInput((v) => !v)}
          className="text-xs font-medium text-red-200 underline hover:text-white transition"
        >
          {t('location.enterManually')}
        </button>
      </div>

      {showManualInput && (
        <form onSubmit={handleManualSubmit} className="flex items-center gap-2 pl-6 w-full">
          <input
            type="text"
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            placeholder={t('location.manualLabel')}
            className="flex-1 min-w-0 rounded-xl border border-red-500/30 bg-[#1a0606] px-3 py-1.5 text-xs text-white placeholder:text-red-400/50 outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <button
            type="submit"
            className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition"
          >
            {t('location.useThis')}
          </button>
        </form>
      )}
    </div>
  );
}
