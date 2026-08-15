import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [selectedTags, setSelectedTags] = useState([]);

  const cropTags = [
    { id: 'wheat', label: 'Wheat', icon: '🌾' },
    { id: 'paddy', label: 'Paddy', icon: '🍚' },
    { id: 'maize', label: 'Maize', icon: '🌽' },
    { id: 'potato', label: 'Potato', icon: '🥔' },
    { id: 'cotton', label: 'Cotton', icon: '🌿' },
  ];

  const toggleTag = (id) => {
    if (selectedTags.includes(id)) {
      setSelectedTags(selectedTags.filter(t => t !== id));
    } else {
      setSelectedTags([...selectedTags, id]);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    // In a real app, API call would happen here
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col relative pb-12">
      <div className="absolute inset-0 z-0 bg-slate-950/35 backdrop-blur-[2px]" />

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

      {/* Main Content: Two-Column Glassmorphism Layout */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <div className="w-full max-w-6xl flex flex-col lg:flex-row rounded-2xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-md border border-white/20">
          
          {/* Left Column: Welcome & Benefits Card */}
          <div className="lg:w-5/12 p-8 lg:p-12 text-white bg-[#064E3B]/80 flex flex-col justify-center border-r border-white/10">
            <h2 className="text-3xl lg:text-4xl font-bold mb-8">Join 500,000+ Farmers</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4 bg-green-800/40 p-4 rounded-xl border border-green-700/50">
                <span className="text-2xl">🔍</span>
                <div>
                  <h3 className="text-lg font-semibold">खरीदार खोजें</h3>
                  <p className="text-green-100 text-sm mt-1">Find Direct Buyers</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 bg-green-800/40 p-4 rounded-xl border border-green-700/50">
                <span className="text-2xl">📈</span>
                <div>
                  <h3 className="text-lg font-semibold">बाज़ार भाव जानें</h3>
                  <p className="text-green-100 text-sm mt-1">Live Mandi Prices</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 bg-green-800/40 p-4 rounded-xl border border-green-700/50">
                <span className="text-2xl">🚚</span>
                <div>
                  <h3 className="text-lg font-semibold">बाज़ार से ग्राहक तक</h3>
                  <p className="text-green-100 text-sm mt-1">Farm-to-Market Logistics</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 bg-green-800/40 p-4 rounded-xl border border-green-700/50">
                <span className="text-2xl">🏛️</span>
                <div>
                  <h3 className="text-lg font-semibold">सरकारी जानकारी</h3>
                  <p className="text-green-100 text-sm mt-1">Govt. Schemes & Support</p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-green-800/40 p-4 rounded-xl border border-green-700/50">
                <span className="text-2xl">🎙️</span>
                <div>
                  <h3 className="text-lg font-semibold">SAATHI AI सहायक</h3>
                  <p className="text-green-100 text-sm mt-1">Voice-Enabled AI Assistant</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: New User Registration Form Card */}
          <div className="lg:w-7/12 p-8 lg:p-12 bg-white flex flex-col justify-center">
            <div className="mb-8 flex flex-col items-center md:items-start text-center md:text-left">
              <div className="mb-4">
                <img src="/logo.png" alt="SAATHI Mascot" className="w-16 h-16 rounded-full shadow-md border-4 border-green-50" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800">New Farmer Registration</h1>
              <p className="text-gray-500 mt-2">Enter your details to create your personal farming profile.</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-6">
              
              {/* Field 1: Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter your full name"
                    className="w-full bg-gray-50 border border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15803D] focus:border-transparent font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-100 text-gray-600 font-medium">
                      +91
                    </span>
                    <input 
                      type="tel" 
                      placeholder="10-digit number"
                      className="flex-1 bg-gray-50 border border-gray-300 text-gray-700 py-2.5 px-4 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-[#15803D] focus:border-transparent font-medium"
                      maxLength="10"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Field 2: Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">State</label>
                  <select className="w-full bg-gray-50 border border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15803D] focus:border-transparent font-medium cursor-pointer" required>
                    <option value="">Select State</option>
                    <option value="UP">Uttar Pradesh</option>
                    <option value="MP">Madhya Pradesh</option>
                    <option value="MH">Maharashtra</option>
                    <option value="PB">Punjab</option>
                    <option value="HR">Haryana</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">District / Village</label>
                  <input 
                    type="text" 
                    placeholder="Enter district or village name"
                    className="w-full bg-gray-50 border border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15803D] focus:border-transparent font-medium"
                    required
                  />
                </div>
              </div>

              {/* Field 3: Land & Main Crop */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Farm Land Size (Acres)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 5"
                    step="0.1"
                    className="w-full bg-gray-50 border border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15803D] focus:border-transparent font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Primary Crop</label>
                  <select className="w-full bg-gray-50 border border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15803D] focus:border-transparent font-medium cursor-pointer" required>
                    <option value="">Select Primary Crop</option>
                    <option value="wheat">Wheat</option>
                    <option value="paddy">Paddy</option>
                    <option value="pulses">Pulses</option>
                    <option value="vegetables">Vegetables</option>
                  </select>
                </div>
              </div>

              {/* Field 4: Multi-Select Crop Tags */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Other Crops Grown (Select multiple)</label>
                <div className="flex flex-wrap gap-2">
                  {cropTags.map(tag => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={`px-4 py-2 rounded-full border text-sm font-medium transition-all flex items-center gap-1.5 ${
                        selectedTags.includes(tag.id)
                          ? 'bg-green-100 border-[#15803D] text-[#15803D] shadow-sm'
                          : 'bg-white border-gray-300 text-gray-600 hover:border-[#15803D] hover:text-[#15803D]'
                      }`}
                    >
                      <span>{tag.icon}</span> {tag.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full bg-[#15803D] text-white py-3.5 rounded-lg font-bold text-lg hover:bg-[#115e2e] transition shadow-lg shadow-green-900/20 flex items-center justify-center gap-2"
                >
                  Complete Registration <span>→</span>
                </button>
              </div>
            </form>

            {/* Bottom Navigation */}
            <div className="mt-8 text-center text-gray-600 font-medium">
              <button onClick={() => navigate('/login')} className="hover:text-[#15803D] transition underline underline-offset-4 decoration-gray-300 hover:decoration-[#15803D]">
                Already have an account? Login with OTP
              </button>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
