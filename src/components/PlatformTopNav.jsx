import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  ArrowRightOnRectangleIcon,
  BellIcon,
  CurrencyRupeeIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  MapIcon,
  MicrophoneIcon,
  UserCircleIcon,
  UserGroupIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const navItems = [
  { label: 'Dashboard', mobileLabel: 'Dash', path: '/', icon: HomeIcon },
  { label: 'Market Explorer', mobileLabel: 'Explore', path: '/explorer', icon: MapIcon },
  { label: 'Market Prices', mobileLabel: 'Prices', path: '/prices', icon: CurrencyRupeeIcon },
  { label: 'Buyer Discovery', mobileLabel: 'Buyers', path: '/buyers', icon: UserGroupIcon },
];

const languageOptions = [
  { code: 'en', label: 'ENG', name: 'English' },
  { code: 'hi', label: 'हिंदी', name: 'Hindi' },
  { code: 'mr', label: 'मराठी', name: 'Marathi' },
  { code: 'pa', label: 'ਪੰ', name: 'Punjabi' },
];

const getLanguageCode = (language) => (
  languageOptions.find((option) => option.code === language || option.name === language)?.code || 'en'
);

export default function PlatformTopNav({ preferredLanguage, user, onLanguageChange, onLogout, onVoiceStart }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const selectedLanguage = getLanguageCode(preferredLanguage);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/15 bg-[#063f2a]/92 text-white shadow-xl shadow-emerald-950/15 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-2 px-2 py-2 sm:px-4 lg:flex-row lg:items-center lg:justify-between lg:px-6">
        <div className="flex items-center justify-between gap-2 sm:gap-4 lg:justify-start">
          <Link className="flex min-h-10 shrink-0 items-center gap-1.5 sm:min-h-11 sm:gap-2" to="/" aria-label="SAATHI dashboard">
            <img
              alt="SAATHI logo"
              className="h-9 w-9 rounded-xl border border-white/40 bg-white object-cover shadow-sm sm:h-10 sm:w-10"
              src="/logo.png"
            />
            <span className="leading-none">
              <span className="block text-base font-extrabold tracking-wide sm:text-lg">SAATHI</span>
              <span className="hidden text-[11px] font-semibold text-emerald-100/75 sm:block">
                Aapki Aawaz, Aapka Bazaar
              </span>
            </span>
          </Link>

          <label className="relative hidden shrink lg:block w-36 xl:w-56">
            <span className="sr-only">Search crops, buyers, markets</span>
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/55" />
            <input
              className="h-9 xl:h-10 w-full rounded-full border border-white/15 bg-white/10 pl-9 pr-3 text-xs xl:text-sm font-semibold text-white outline-none transition placeholder:text-white/55 focus:border-white/40 focus:bg-white/15 focus:ring-4 focus:ring-white/15"
              placeholder="Search..."
              type="search"
            />
          </label>
        </div>

        {isSearchOpen && (
          <label className="relative block w-full lg:hidden">
            <span className="sr-only">Search crops, buyers, markets</span>
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/55" />
            <input
              className="h-9 w-full rounded-full border border-white/15 bg-white/10 pl-9 pr-4 text-xs font-semibold text-white outline-none transition placeholder:text-white/55 focus:border-white/40 focus:bg-white/15 focus:ring-4 focus:ring-white/15"
              placeholder="Search crops, buyers, markets"
              type="search"
            />
          </label>
        )}

        <nav className="w-full grid grid-cols-4 gap-1 sm:gap-2 lg:w-auto lg:flex lg:shrink-0 lg:items-center lg:justify-center lg:gap-1.5 xl:gap-3" aria-label="Main platform tabs">
          {navItems.map((item) => (
            <TopNavItem key={item.path} item={item} />
          ))}
        </nav>

        <div className="flex shrink-0 items-center justify-end gap-1.5 sm:gap-2">
          <button
            aria-label={isSearchOpen ? 'Close search' : 'Open search'}
            type="button"
            onClick={() => setIsSearchOpen((currentValue) => !currentValue)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/15 focus:outline-none focus:ring-4 focus:ring-white/20 sm:h-10 sm:w-10 lg:hidden"
          >
            {isSearchOpen ? <XMarkIcon className="h-5 w-5" /> : <MagnifyingGlassIcon className="h-5 w-5" />}
          </button>

          <label className="sr-only" htmlFor="platform-language-select">Language</label>
          <select
            id="platform-language-select"
            aria-label="Language"
            className="h-9 shrink-0 max-w-[4.5rem] rounded-full border border-emerald-100 bg-white px-2 text-[11px] font-extrabold text-[#065f46] outline-none focus:ring-4 focus:ring-white/25 sm:h-10 sm:max-w-28 sm:px-3 sm:text-xs"
            value={selectedLanguage}
            onChange={(event) => onLanguageChange?.(event.target.value)}
          >
            {languageOptions.map((language) => (
              <option key={language.code} value={language.code}>{language.label}</option>
            ))}
          </select>

          <button
            type="button"
            onClick={onVoiceStart}
            className="hidden h-10 shrink-0 items-center gap-2 rounded-full bg-white px-3 text-sm font-bold text-[#065f46] shadow-sm transition hover:scale-[1.02] hover:bg-emerald-50 focus:outline-none focus:ring-4 focus:ring-white/30 sm:inline-flex"
          >
            <MicrophoneIcon className="h-4 w-4" />
            Ask
          </button>

          <Link
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 text-white/85 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-4 focus:ring-white/20 sm:h-10 sm:w-10"
            to="/notifications"
            aria-label="Notifications"
          >
            <BellIcon className="h-5 w-5" />
          </Link>

          <Link
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 text-white/85 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-4 focus:ring-white/20 sm:h-10 sm:w-10 xl:w-auto xl:px-3"
            to="/profile"
            aria-label="Profile"
          >
            <UserCircleIcon className="h-4 w-4" />
            <span className="hidden text-sm font-bold xl:inline">{user?.name || 'Profile'}</span>
          </Link>

          <button
            type="button"
            onClick={onLogout}
            aria-label="Logout"
            className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 text-white/80 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-4 focus:ring-white/20 sm:flex"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

function TopNavItem({ item }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      end={item.path === '/'}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center gap-0.5 rounded-2xl px-1.5 py-1 text-[10px] font-bold leading-tight transition whitespace-nowrap sm:flex-col sm:gap-1 sm:px-2.5 sm:py-1.5 sm:text-xs lg:flex-row lg:gap-1.5 lg:rounded-full lg:px-2.5 lg:py-1.5 lg:text-xs xl:px-3.5 xl:py-2 xl:text-sm ${
          isActive
            ? 'bg-white text-[#065f46] shadow-sm font-extrabold'
            : 'text-white/80 hover:bg-white/10 hover:text-white'
        }`
      }
    >
      <Icon className="h-4 w-4 shrink-0 sm:h-4 sm:w-4 lg:h-4 lg:w-4 xl:h-4.5 xl:w-4.5" />
      <span className="whitespace-nowrap md:hidden">{item.mobileLabel}</span>
      <span className="hidden whitespace-nowrap md:inline">{item.label}</span>
    </NavLink>
  );
}
