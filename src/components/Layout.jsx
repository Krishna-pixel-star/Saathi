import { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import AIVoiceModal from './AIVoiceModal';
import { useTranslation } from '../hooks/useTranslation';
import { useUser } from '../context/UserContext';

const navigationItems = [
  { label: 'Home', path: '/', icon: '🏠' },
  { label: 'Search', path: '/buyers', icon: '🔍' },
  { label: 'Notifications', path: '/notifications', icon: '🔔' },
  { label: 'Profile', path: '/profile', icon: '👤' },
];

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { logout } = useUser();
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(location.pathname === '/ai');

  useEffect(() => {
    setIsVoiceModalOpen(location.pathname === '/ai');
  }, [location.pathname]);

  const openVoiceModal = () => {
    setIsVoiceModalOpen(true);
  };

  const closeVoiceModal = () => {
    setIsVoiceModalOpen(false);

    if (location.pathname === '/ai') {
      navigate('/', { replace: true });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 relative">
      {/* Top right Logout button */}
      <div className="absolute top-4 right-4 z-50">
        <button 
          onClick={handleLogout} 
          className="bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-red-100 transition shadow-sm flex items-center gap-1"
        >
          <span>🚪</span> Logout
        </button>
      </div>

      <main className="mx-auto min-h-screen w-full max-w-5xl px-4 pb-32 pt-16 sm:px-6 sm:pt-20">
        {children}
      </main>

      <button
        type="button"
        onClick={openVoiceModal}
        aria-label="Start voice input"
        aria-haspopup="dialog"
        className="fixed bottom-24 left-1/2 z-30 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-[#2E7D32] text-2xl text-white shadow-lg shadow-green-900/30 transition hover:scale-105 hover:bg-[#256428] focus:outline-none focus:ring-4 focus:ring-green-200"
      >
        🎙️
      </button>

      <nav
        aria-label="Main navigation"
        className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur"
      >
        <div className="mx-auto grid max-w-md grid-cols-5 items-end">
          {navigationItems.slice(0, 2).map((item) => (
            <NavItem key={item.path} item={item} t={t} />
          ))}

          <button
            type="button"
            onClick={() => {
              navigate('/ai');
              setIsVoiceModalOpen(true);
            }}
            aria-label="Open SAATHI AI voice assistant"
            aria-haspopup="dialog"
            className="flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1 text-xs font-medium text-[#F57C00] transition hover:scale-105"
          >
            <span className="text-3xl leading-none">🤖</span>
            <span>{t('AI Bot')}</span>
          </button>

          {navigationItems.slice(2).map((item) => (
            <NavItem key={item.path} item={item} t={t} />
          ))}
        </div>
      </nav>

      {isVoiceModalOpen && <AIVoiceModal onClose={closeVoiceModal} />}
    </div>
  );
}

function NavItem({ item, t }) {
  return (
    <NavLink
      to={item.path}
      end={item.path === '/'}
      className={({ isActive }) =>
        `flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1 text-xs font-medium transition ${
          isActive ? 'text-[#2E7D32]' : 'text-slate-500 hover:text-[#2E7D32]'
        }`
      }
    >
      <span className="text-xl leading-none">{item.icon}</span>
      <span>{t(item.label)}</span>
    </NavLink>
  );
}
