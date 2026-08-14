import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const geography = [
  { village: 'Ramgarh', block: 'Patiala', district: 'Patiala', state: 'Punjab' },
  { village: 'Bhadson', block: 'Nabha', district: 'Patiala', state: 'Punjab' },
  { village: 'Khed', block: 'Rajgurunagar', district: 'Pune', state: 'Maharashtra' },
  { village: 'Pimpalgaon', block: 'Niphad', district: 'Nashik', state: 'Maharashtra' },
  { village: 'Bara Gaon', block: 'Mawana', district: 'Meerut', state: 'Uttar Pradesh' },
  { village: 'Bhor Saidan', block: 'Pehowa', district: 'Kurukshetra', state: 'Haryana' },
];

const languageSuggestions = {
  Punjab: ['Punjabi', 'Hindi'],
  Maharashtra: ['Marathi', 'Hindi'],
  'Uttar Pradesh': ['Hindi', 'Urdu'],
  Haryana: ['Hindi', 'Haryanvi'],
};

const initialRegistration = {
  name: '',
  mobile: '',
  farmerId: '',
};

const initialLocation = {
  village: '',
  block: '',
  district: '',
  state: '',
};

const uniqueValues = (entries, key) => [...new Set(entries.map((entry) => entry[key]))];

export default function Onboarding() {
  const navigate = useNavigate();
  const { login, updateLocation, setLanguage } = useUser();
  const [step, setStep] = useState(1);
  const [registration, setRegistration] = useState(initialRegistration);
  const [location, setLocation] = useState(initialLocation);
  const [locationMode, setLocationMode] = useState('permission');
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState('');

  const handleRegistrationChange = (event) => {
    const { name, value } = event.target;
    setRegistration((currentData) => ({ ...currentData, [name]: value }));
  };

  const handleRegistrationNext = (event) => {
    event.preventDefault();
    const mobileIsValid = /^\d{10}$/.test(registration.mobile);
    const farmerIdIsValid = /^[a-zA-Z0-9]+$/.test(registration.farmerId);

    if (!registration.name.trim() || !mobileIsValid || !farmerIdIsValid) {
      setError('Enter your name, a 10-digit mobile number, and an alphanumeric Farmer ID.');
      return;
    }

    login({ ...registration, name: registration.name.trim() });
    setError('');
    setStep(2);
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationMode('manual');
      setError('Location is not supported on this device. Please choose your location manually.');
      return;
    }

    setIsLocating(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      () => {
        const detectedLocation = {
          village: 'Ramgarh',
          block: 'Patiala',
          district: 'Patiala',
          state: 'Punjab',
        };

        setLocation(detectedLocation);
        updateLocation(detectedLocation);
        setLocationMode('detected');
        setIsLocating(false);
      },
      () => {
        setLocationMode('manual');
        setError('Location permission was not granted. Please select your location manually.');
        setIsLocating(false);
      },
      { enableHighAccuracy: false, timeout: 10000 },
    );
  };

  const handleLocationChange = (event) => {
    const village = event.target.value;
    const selectedPlace = geography.find((place) => place.village === village);

    if (!selectedPlace) {
      setLocation(initialLocation);
      return;
    }

    setLocation({ village, block: '', district: '', state: '' });
    setError('');
  };

  const updateManualLocation = (field, value) => {
    setLocation((currentLocation) => {
      const nextLocation = { ...currentLocation, [field]: value };

      if (field === 'block') {
        nextLocation.district = '';
        nextLocation.state = '';
      }

      if (field === 'district') {
        nextLocation.state = '';
      }

      return nextLocation;
    });
    setError('');
  };

  const villageMatches = geography.filter((place) => place.village === location.village);
  const blockOptions = uniqueValues(villageMatches, 'block');
  const districtOptions = uniqueValues(
    villageMatches.filter((place) => place.block === location.block),
    'district',
  );
  const stateOptions = uniqueValues(
    villageMatches.filter(
      (place) => place.block === location.block && place.district === location.district,
    ),
    'state',
  );

  const handleLocationNext = () => {
    if (!location.village || !location.block || !location.district || !location.state) {
      setError('Please complete all location fields to continue.');
      return;
    }

    updateLocation(location);
    setError('');
    setStep(3);
  };

  const handleLanguageSelect = (language) => {
    setLanguage(language);
    navigate('/');
  };

  const suggestedLanguages = languageSuggestions[location.state] || ['Hindi', 'English'];

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 via-white to-white px-4 py-8 sm:flex sm:items-center sm:justify-center sm:p-8">
      <section className="mx-auto w-full max-w-xl rounded-3xl bg-white p-6 shadow-xl shadow-green-900/5 sm:p-10">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2E7D32] text-2xl text-white">
            🌾
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome to SAATHI</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Your trusted companion for better farming decisions.
          </p>
        </div>



        <div className="mt-10">
          {step === 1 && (
            <form onSubmit={handleRegistrationNext} noValidate>
              <div className="mb-7">
                <p className="text-xl font-semibold text-slate-900">Let&apos;s get to know you</p>
                <p className="mt-1 text-sm text-slate-600">Enter your farming profile details.</p>
              </div>

              <div className="space-y-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Full Name</span>
                  <input
                    type="text"
                    name="name"
                    value={registration.name}
                    onChange={handleRegistrationChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#2E7D32] focus:ring-4 focus:ring-green-100"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Mobile Number</span>
                  <input
                    type="tel"
                    name="mobile"
                    value={registration.mobile}
                    onChange={handleRegistrationChange}
                    placeholder="10-digit mobile number"
                    inputMode="numeric"
                    maxLength="10"
                    autoComplete="tel"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#2E7D32] focus:ring-4 focus:ring-green-100"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Farmer ID</span>
                  <input
                    type="text"
                    name="farmerId"
                    value={registration.farmerId}
                    onChange={handleRegistrationChange}
                    placeholder="Enter your alphanumeric Farmer ID"
                    autoComplete="off"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#2E7D32] focus:ring-4 focus:ring-green-100"
                  />
                </label>
              </div>

              {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                className="mt-8 w-full rounded-xl bg-[#2E7D32] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#256428] focus:outline-none focus:ring-4 focus:ring-green-200"
              >
                Next
              </button>
            </form>
          )}

          {step === 2 && (
            <div>
              <div className="mb-7">
                <p className="text-xl font-semibold text-slate-900">Where is your farm?</p>
                <p className="mt-1 text-sm text-slate-600">This helps us provide relevant market and weather information.</p>
              </div>

              {locationMode === 'permission' && (
                <div className="rounded-2xl border border-green-100 bg-green-50 p-5 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl shadow-sm">📍</div>
                  <p className="mt-4 font-semibold text-slate-900">Use your current location</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">We&apos;ll only use it to identify your village and nearby services.</p>
                  <button
                    type="button"
                    onClick={useCurrentLocation}
                    disabled={isLocating}
                    className="mt-5 w-full rounded-xl bg-[#2E7D32] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#256428] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isLocating ? 'Finding location…' : 'Allow Location Access'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLocationMode('manual');
                      setError('');
                    }}
                    className="mt-3 text-sm font-semibold text-[#2E7D32] hover:underline"
                  >
                    Select location manually
                  </button>
                </div>
              )}

              {locationMode === 'detected' && (
                <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
                  <p className="text-sm font-semibold text-[#2E7D32]">Location found</p>
                  <p className="mt-2 text-base font-semibold text-slate-900">{location.village}, {location.block}</p>
                  <p className="mt-1 text-sm text-slate-600">{location.district}, {location.state}</p>
                  <button
                    type="button"
                    onClick={() => setLocationMode('manual')}
                    className="mt-4 text-sm font-semibold text-[#2E7D32] hover:underline"
                  >
                    Change location
                  </button>
                </div>
              )}

              {locationMode === 'manual' && (
                <div className="space-y-5">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Village</span>
                    <select
                      value={location.village}
                      onChange={handleLocationChange}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#2E7D32] focus:ring-4 focus:ring-green-100"
                    >
                      <option value="">Select Village</option>
                      {uniqueValues(geography, 'village').map((village) => (
                        <option key={village} value={village}>{village}</option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Block</span>
                    <select
                      value={location.block}
                      onChange={(event) => updateManualLocation('block', event.target.value)}
                      disabled={!location.village}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#2E7D32] focus:ring-4 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                    >
                      <option value="">Select Block</option>
                      {blockOptions.map((block) => <option key={block} value={block}>{block}</option>)}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">District</span>
                    <select
                      value={location.district}
                      onChange={(event) => updateManualLocation('district', event.target.value)}
                      disabled={!location.block}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#2E7D32] focus:ring-4 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                    >
                      <option value="">Select District</option>
                      {districtOptions.map((district) => <option key={district} value={district}>{district}</option>)}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">State</span>
                    <select
                      value={location.state}
                      onChange={(event) => updateManualLocation('state', event.target.value)}
                      disabled={!location.district}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#2E7D32] focus:ring-4 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                    >
                      <option value="">Select State</option>
                      {stateOptions.map((state) => <option key={state} value={state}>{state}</option>)}
                    </select>
                  </label>
                </div>
              )}

              {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

              {locationMode !== 'permission' && (
                <div className="mt-8 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setError('');
                    }}
                    className="rounded-xl border border-slate-200 px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleLocationNext}
                    className="flex-1 rounded-xl bg-[#2E7D32] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#256428] focus:outline-none focus:ring-4 focus:ring-green-200"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="mb-7">
                <p className="text-xl font-semibold text-slate-900">Choose your language</p>
                <p className="mt-1 text-sm text-slate-600">Recommended for farmers in {location.state}.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {suggestedLanguages.map((language) => (
                  <button
                    key={language}
                    type="button"
                    onClick={() => handleLanguageSelect(language)}
                    className="rounded-2xl border-2 border-green-100 bg-green-50 px-5 py-8 text-xl font-bold text-[#2E7D32] transition hover:border-[#2E7D32] hover:bg-green-100 focus:outline-none focus:ring-4 focus:ring-green-200"
                  >
                    {language}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="mt-8 text-sm font-semibold text-[#2E7D32] hover:underline"
              >
                Back to location
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
