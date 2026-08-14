import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useTranslation } from '../hooks/useTranslation';

const languageOptions = ['Hindi', 'Punjabi', 'Marathi', 'English'];

export default function Profile() {
  const navigate = useNavigate();
  const { user, location, preferredLanguage, setLanguage, logout } = useUser();
  const { t } = useTranslation();
  const [profile, setProfile] = useState({
    name: user.name,
    mobile: user.mobile,
    village: location.village,
    block: location.block,
    district: location.district,
  });
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isVoiceAlwaysOn, setIsVoiceAlwaysOn] = useState(false);

  const updateProfileField = (event) => {
    const { name, value } = event.target;
    setProfile((currentProfile) => ({ ...currentProfile, [name]: value }));
  };

  const selectLanguage = (language) => {
    setLanguage(language);
    setIsLanguageModalOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/onboarding', { replace: true });
  };

  return (
    <section className="mx-auto w-full max-w-3xl">
      <header className="rounded-3xl bg-[#2E7D32] p-6 text-white shadow-lg shadow-green-900/15 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-green-100">{t('Farmer profile')}</p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{user.name || t('Your Profile')}</h1>
        <div className="mt-6 inline-flex items-center rounded-2xl bg-white/15 px-4 py-3">
          <span className="text-sm font-medium text-green-100">{t('Farmer ID')}</span>
          <span className="ml-3 text-xl font-extrabold">{user.farmerId || t('Not set')}</span>
        </div>
      </header>

      <section className="mt-7 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
        <h2 className="text-2xl font-bold text-slate-900">{t('Personal details')}</h2>
        <p className="mt-2 text-base text-slate-600">{t('Edit the fields below. Changes are stored on this screen only for now.')}</p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <TextField label={t('Name')} name="name" value={profile.name} onChange={updateProfileField} />
          <TextField label={t('Mobile')} name="mobile" type="tel" value={profile.mobile} onChange={updateProfileField} />
          <TextField label={t('Village')} name="village" value={profile.village} onChange={updateProfileField} />
          <TextField label={t('Block')} name="block" value={profile.block} onChange={updateProfileField} />
          <div className="sm:col-span-2">
            <TextField label={t('District')} name="district" value={profile.district} onChange={updateProfileField} />
          </div>
        </div>
      </section>

      <section className="mt-7 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
        <h2 className="text-2xl font-bold text-slate-900">{t('Settings')}</h2>

        <button
          type="button"
          onClick={() => setIsLanguageModalOpen(true)}
          className="mt-5 flex w-full items-center justify-between rounded-2xl border border-slate-100 px-4 py-4 text-left transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-green-100"
        >
          <span>
            <span className="block text-base font-bold text-slate-900">{t('Change Language')}</span>
            <span className="mt-1 block text-sm text-slate-600">{t('Current language:')} {preferredLanguage}</span>
          </span>
          <span className="text-xl text-[#2E7D32]">›</span>
        </button>

        <div className="mt-3 flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-4">
          <div>
            <p className="text-base font-bold text-slate-900">{t('Voice Mode')}</p>
            <p className="mt-1 text-sm text-slate-600">{isVoiceAlwaysOn ? t('Always-On') : t('Tap-to-Speak')}</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={isVoiceAlwaysOn}
            aria-label="Toggle always-on voice mode"
            onClick={() => setIsVoiceAlwaysOn((currentValue) => !currentValue)}
            className={`relative h-8 w-14 rounded-full transition ${isVoiceAlwaysOn ? 'bg-[#2E7D32]' : 'bg-slate-300'}`}
          >
            <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition ${isVoiceAlwaysOn ? 'left-7' : 'left-1'}`} />
          </button>
        </div>
      </section>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-7 w-full rounded-2xl bg-red-600 px-5 py-4 text-base font-bold text-white transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-200"
      >
        {t('Logout')}
      </button>

      {isLanguageModalOpen && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/40 p-4"
          role="presentation"
          onClick={() => setIsLanguageModalOpen(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="language-dialog-title"
            className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="language-dialog-title" className="text-2xl font-bold text-slate-900">{t('Choose language')}</h2>
            <p className="mt-2 text-sm text-slate-600">{t('Your selected language will be used throughout SAATHI.')}</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {languageOptions.map((language) => (
                <button
                  key={language}
                  type="button"
                  onClick={() => selectLanguage(language)}
                  className={`rounded-xl border-2 px-4 py-4 text-base font-bold transition ${
                    preferredLanguage === language
                      ? 'border-[#2E7D32] bg-green-50 text-[#2E7D32]'
                      : 'border-slate-100 text-slate-700 hover:border-green-200'
                  }`}
                >
                  {language}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setIsLanguageModalOpen(false)}
              className="mt-5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              {t('Cancel')}
            </button>
          </section>
        </div>
      )}
    </section>
  );
}

function TextField({ label, name, value, onChange, type = 'text' }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-[#2E7D32] focus:ring-4 focus:ring-green-100"
      />
    </label>
  );
}
