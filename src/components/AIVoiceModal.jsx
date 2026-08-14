import { useEffect, useState, useRef } from 'react';

export default function AIVoiceModal({ onClose }) {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Namaste Kisan Bhai / Behan! Main SAATHI hoon. Aapki kheti aur mandi ki jaankari ke liye main hamesha taiyar hoon. Boliye, main aapki kya madad karoon?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
      });
      const data = await response.json();
      
      if (data.success) {
        setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Maaf karein, network error aayi hai. Kripya thodi der baad prayas karein.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      role="presentation"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-voice-modal-title"
        className="flex flex-col h-[85vh] w-full max-w-lg rounded-3xl bg-white p-5 sm:p-6 shadow-2xl overflow-hidden"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Chat Header */}
        <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2E7D32] text-xl text-white shadow-md">🎙️</span>
            <div>
              <h2 id="ai-voice-modal-title" className="text-xl font-bold text-slate-900 leading-tight">SAATHI AI (साथी)</h2>
              <p className="text-xs text-green-700 font-medium">Online</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition bg-gray-50 hover:bg-gray-100 p-2 rounded-full">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4 pb-2 scrollbar-thin scrollbar-thumb-gray-300">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-[#15803D] text-white rounded-br-sm' : 'bg-green-50/80 text-slate-800 border border-green-100 rounded-bl-sm'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-green-50/80 text-green-800 border border-green-100 rounded-2xl rounded-bl-sm px-5 py-3.5 text-sm flex gap-1 shadow-sm">
                <span className="animate-bounce">.</span><span className="animate-bounce" style={{animationDelay: '0.2s'}}>.</span><span className="animate-bounce" style={{animationDelay: '0.4s'}}>.</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSend} className="mt-3 flex gap-2 items-center bg-gray-50 p-1.5 rounded-2xl border border-gray-200 focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-100 transition-all">
          <button type="button" className="p-2.5 text-gray-400 hover:text-green-700 hover:bg-green-50 rounded-xl transition" title="Voice Input">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
          </button>
          <input 
            type="text"
            className="flex-1 bg-transparent px-2 py-2.5 focus:outline-none text-slate-800 text-[15px]"
            placeholder="Kheti ya mandi se juda sawal poochein..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="p-2.5 bg-[#2E7D32] text-white rounded-xl hover:bg-[#1B5E20] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
             <svg className="w-5 h-5 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
          </button>
        </form>
      </section>
    </div>
  );
}
