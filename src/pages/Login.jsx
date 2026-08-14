import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function Login() {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(45);
  const navigate = useNavigate();
  const { login } = useUser();

  // Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem('token') || localStorage.getItem('user')) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    let interval;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const handleGetOtp = async () => {
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5001/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber: mobile }),
      });
      const data = await response.json();
      
      if (data.success) {
        setOtpSent(true);
        setTimer(45);
        setOtp(['', '', '', '', '', '']);
      } else {
        setError(data.message || 'Failed to send OTP.');
      }
    } catch (err) {
      setError('Network error. Backend server may not be running.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!otpSent) {
      handleGetOtp();
      return;
    }

    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) {
      setError('Please enter the complete 6-digit OTP.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:5001/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber: mobile, otp: enteredOtp }),
      });
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('token', data.token);
        login(data.user);
        navigate('/');
      } else {
        setError(data.message || 'Invalid OTP.');
      }
    } catch (err) {
      setError('Network error during verification.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const prevInput = document.getElementById(`otp-input-${index - 1}`);
        if (prevInput) prevInput.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;
    
    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      if (i < 6) newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    
    // Auto-focus next empty or last input
    const nextIndex = Math.min(pastedData.length, 5);
    const nextInput = document.getElementById(`otp-input-${nextIndex === 6 ? 5 : nextIndex}`);
    if (nextInput) nextInput.focus();
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1592982537447-6f23f71eb339?q=80&w=2940&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Dark Overlay & Blur */}
      <div className="absolute inset-0 bg-green-900/50 backdrop-blur-sm z-0" />

      {/* Header Bar */}
      <header className="relative z-10 bg-[#064E3B] text-white px-6 py-4 flex flex-col md:flex-row justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          {/* Brand Logo */}
          <img src="/logo.png" alt="SAATHI Logo" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
          <span className="text-xl font-bold tracking-wide">SAATHI</span>
          <span className="hidden md:inline text-sm text-green-200 border-l border-green-700 pl-3 ml-2 italic">
            "Aapki Aawaz, Aapka Bazaar, Aapka SAATHI."
          </span>
        </div>

        <nav className="hidden md:flex gap-6 text-sm font-medium mt-4 md:mt-0 items-center">
          <a href="#" className="hover:text-green-300 transition">Features</a>
          <a href="#" className="hover:text-green-300 transition">Mandi Prices</a>
          <a href="#" className="hover:text-green-300 transition">Support</a>
          <button className="border border-green-500 px-4 py-1.5 rounded-md hover:bg-green-700 transition">
            English
          </button>
        </nav>
      </header>

      {/* Main Content: Split Container (Glassmorphism) */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <div className="w-full max-w-5xl flex flex-col lg:flex-row rounded-2xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-md border border-white/20">

          {/* Left Panel: Feature Card */}
          <div className="lg:w-1/2 p-8 lg:p-12 text-white bg-[#064E3B]/80 flex flex-col justify-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-8">Empowering Your Farming Journey</h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <span className="text-3xl bg-white/10 p-2 rounded-lg">🔍</span>
                <div className="mt-1">
                  <h3 className="text-xl font-semibold">खरीदार खोजें</h3>
                  <p className="text-slate-200 text-sm mt-1">Find Direct Buyers</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <span className="text-3xl bg-white/10 p-2 rounded-lg">📈</span>
                <div className="mt-1">
                  <h3 className="text-xl font-semibold">बाज़ार भाव जानें</h3>
                  <p className="text-slate-200 text-sm mt-1">Live Mandi Prices</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <span className="text-3xl bg-white/10 p-2 rounded-lg">🚚</span>
                <div className="mt-1">
                  <h3 className="text-xl font-semibold">बाज़ार से ग्राहक तक</h3>
                  <p className="text-slate-200 text-sm mt-1">Farm-to-Market Logistics</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <span className="text-3xl bg-white/10 p-2 rounded-lg">🏛️</span>
                <div className="mt-1">
                  <h3 className="text-xl font-semibold">सरकारी जानकारी</h3>
                  <p className="text-slate-200 text-sm mt-1">Govt. Schemes & Support</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-3xl bg-white/10 p-2 rounded-lg">🎙️</span>
                <div className="mt-1">
                  <h3 className="text-xl font-semibold">SAATHI AI सहायक</h3>
                  <p className="text-slate-200 text-sm mt-1">Voice-Enabled AI Assistant</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: OTP Login Card */}
          <div className="lg:w-1/2 p-8 lg:p-12 bg-white flex flex-col justify-center">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <img src="/logo.png" alt="SAATHI Mascot" className="w-20 h-20 rounded-full shadow-md border-4 border-green-50" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800">Welcome to SAATHI</h1>
              <div className="inline-block mt-3 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-sm font-medium text-green-700">
                "Aapki Aawaz, Aapka Bazaar, Aapka SAATHI."
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Quick OTP Login</h3>

                <div className="flex gap-2">
                  <div className="relative">
                    <select className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-3 pl-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15803D] focus:border-transparent cursor-pointer font-medium" disabled={otpSent}>
                      <option>+91</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                  </div>

                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    className={`flex-1 bg-gray-50 border ${error ? 'border-red-500' : 'border-gray-300'} text-gray-700 py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15803D] focus:border-transparent font-medium disabled:opacity-60 disabled:cursor-not-allowed`}
                    value={mobile}
                    onChange={(e) => { setMobile(e.target.value); setError(''); }}
                    maxLength="10"
                    disabled={otpSent}
                  />

                  {otpSent && (
                    <button 
                      type="button" 
                      disabled={timer > 0 || loading}
                      className="text-blue-600 font-semibold text-sm whitespace-nowrap px-2 hover:text-blue-800 transition bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed" 
                      onClick={handleGetOtp}
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              </div>

              {otpSent && (
                <div className="space-y-3">
                  <div className="flex justify-between gap-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-input-${index}`}
                        type="text"
                        maxLength="1"
                        className="w-10 h-12 md:w-12 md:h-14 text-center text-xl font-bold bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15803D] focus:border-transparent transition-all"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        disabled={loading}
                      />
                    ))}
                  </div>

                  <div className="flex justify-between items-center text-sm font-medium px-1">
                    <span className="text-orange-500">
                      {timer > 0 ? `Expires in 00:${timer.toString().padStart(2, '0')}s` : 'OTP Expired'}
                    </span>
                    <a href="#" className="text-[#15803D] hover:underline hover:text-[#064E3B] transition">Get OTP via WhatsApp or Call</a>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#15803D] text-white py-3.5 rounded-lg font-bold text-lg hover:bg-[#115e2e] transition shadow-lg shadow-green-900/20 flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading && (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {otpSent ? 'Verify OTP & Login' : 'Get OTP'} {!loading && <span>→</span>}
              </button>
            </form>

            <div className="mt-8 text-center text-gray-600 font-medium">
              <button onClick={() => navigate('/register')} className="hover:text-[#15803D] transition underline underline-offset-4 decoration-gray-300 hover:decoration-[#15803D]">
                New User? Register Profile
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-slate-900/90 backdrop-blur-md text-slate-300 text-sm py-4 px-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left border-t border-slate-700/50">
        <p className="font-medium">Copyright © 2026 SAATHI. All rights reserved.</p>
        <p className="mt-2 md:mt-0 flex items-center gap-2 font-medium bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
          Toll-free Kisan Support: <span className="text-white">1800-XXX-XXXX</span>
        </p>
      </footer>
    </div>
  );
}
