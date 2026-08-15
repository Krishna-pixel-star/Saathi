import { cloneElement, isValidElement, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AIVoiceModal from './AIVoiceModal';
import PlatformTopNav from './PlatformTopNav';
import { useUser } from '../context/UserContext';

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, preferredLanguage, setLanguage, user } = useUser();
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(location.pathname === '/ai');
  const [voiceAssistantResponse, setVoiceAssistantResponse] = useState('');
  const hasHero = location.pathname === '/' || location.pathname === '/ai';

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

  const enhancedChildren = isValidElement(children)
    ? cloneElement(children, {
        isVoiceModalOpen,
        onVoiceStart: openVoiceModal,
        voiceAssistantResponse,
      })
    : children;

  return (
    <div className="relative min-h-screen bg-transparent">
      <PlatformTopNav
        preferredLanguage={preferredLanguage}
        user={user}
        onLanguageChange={setLanguage}
        onLogout={handleLogout}
        onVoiceStart={openVoiceModal}
      />

      <main className={`relative z-10 min-h-screen w-full pb-14 ${hasHero ? '' : 'px-4 pt-36 sm:px-6 lg:pt-24'}`}>
        {enhancedChildren}
      </main>

      {isVoiceModalOpen && <AIVoiceModal onClose={closeVoiceModal} onResponse={setVoiceAssistantResponse} />}
    </div>
  );
}
