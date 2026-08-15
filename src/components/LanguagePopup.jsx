import React, { useEffect, useState } from 'react';

const languageOptions = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
];

const getLanguageCode = (language) => (
  languageOptions.find((option) => option.code === language || option.name === language)?.code || 'en'
);

export default function LanguagePopup({ currentLanguage, isOpen: controlledIsOpen, onClose, onLanguageSelect }) {
  const [selectedLang, setSelectedLang] = useState('en');
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = typeof controlledIsOpen === 'boolean';
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const notifyLanguageSelect = (languageCode) => {
    if (onLanguageSelect) {
      onLanguageSelect(languageCode);
    }
  };

  const closePopup = () => {
    if (isControlled) {
      onClose?.();
      return;
    }

    setInternalIsOpen(false);
  };

  const closeWithDefaultLanguage = () => {
    localStorage.setItem('saathi_language', 'en');
    notifyLanguageSelect('en');
    closePopup();
  };

  const handleConfirm = () => {
    localStorage.setItem('saathi_language', selectedLang);
    notifyLanguageSelect(selectedLang);
    closePopup();
  };

  const handleSkip = () => {
    if (isControlled) {
      closePopup();
      return;
    }

    closeWithDefaultLanguage();
  };

  useEffect(() => {
    const savedLang = localStorage.getItem('saathi_language');

    if (savedLang || currentLanguage) {
      setSelectedLang(getLanguageCode(currentLanguage || savedLang));
    }

    if (isControlled) {
      return;
    }

    if (!savedLang) {
      setInternalIsOpen(true);
      return;
    }

    notifyLanguageSelect(savedLang);
  }, []);

  useEffect(() => {
    if (controlledIsOpen) {
      setSelectedLang(getLanguageCode(currentLanguage || localStorage.getItem('saathi_language')));
    }
  }, [controlledIsOpen, currentLanguage]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (isControlled) {
          closePopup();
          return;
        }

        closeWithDefaultLanguage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      role="presentation"
      onClick={handleSkip}
    >
      <section
        aria-describedby="language-popup-description"
        aria-labelledby="language-popup-title"
        aria-modal="true"
        className="inset-0 m-auto w-full max-w-[25rem] rounded-2xl bg-white p-5 shadow-2xl sm:max-w-md sm:p-6"
        role="dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-2xl text-[#2E7D32]">
            🌐
          </div>
          <div>
            <h2 id="language-popup-title" className="text-xl font-bold text-gray-800">
              Choose your language
            </h2>
            <p className="mt-0.5 text-sm font-semibold text-gray-700" lang="hi">
              अपनी भाषा चुनें
            </p>
          </div>
        </header>

        <p id="language-popup-description" className="mt-4 text-sm leading-6 text-gray-500">
          SAATHI will respond in your preferred language
          <span className="block" lang="hi">साथी आपकी पसंदीदा भाषा में जवाब देगा</span>
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {languageOptions.map((language) => {
            const isSelected = selectedLang === language.code;

            return (
              <button
                key={language.code}
                aria-pressed={isSelected}
                autoFocus={language.code === 'en'}
                className={`relative min-h-24 rounded-xl border-2 px-3 py-4 text-left transition hover:scale-105 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-green-100 ${
                  isSelected
                    ? 'border-green-500 bg-green-50 text-[#2E7D32] ring-2 ring-green-500'
                    : 'border-gray-100 bg-white text-gray-700 hover:border-green-200'
                }`}
                type="button"
                onClick={() => setSelectedLang(language.code)}
              >
                {isSelected && (
                  <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white">
                    ✓
                  </span>
                )}
                <span className="block pr-5 text-sm font-bold">{language.name}</span>
                <span className="mt-1 block text-lg font-extrabold leading-tight">{language.nativeName}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 space-y-3">
          <button
            className="flex w-full items-center justify-center rounded-xl bg-[#2E7D32] px-5 py-3 text-base font-bold text-white shadow-lg shadow-green-900/20 transition hover:bg-[#256428] focus:outline-none focus:ring-4 focus:ring-green-200"
            type="button"
            onClick={handleConfirm}
          >
            Continue / जारी रखें
          </button>
          <button
            className="w-full text-sm font-semibold text-gray-500 transition hover:text-[#2E7D32] focus:outline-none focus:ring-4 focus:ring-green-100"
            type="button"
            onClick={handleSkip}
          >
            Skip for now / अभी नहीं
          </button>
        </div>
      </section>
    </div>
  );
}
