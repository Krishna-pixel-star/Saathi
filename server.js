import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory OTP store: Map<mobileNumber, { otp: string, expiresAt: number }>
const otpStore = new Map();

// Helper to generate 6-digit OTP
const generateOtp = () => {
  return '123456'; // Hardcoded for easy testing
};

app.post('/api/send-otp', (req, res) => {
  const { mobileNumber } = req.body;

  if (!mobileNumber || !/^[6-9]\d{9}$/.test(mobileNumber)) {
    return res.status(400).json({ success: false, message: 'Invalid mobile number' });
  }

  const otp = generateOtp();
  // Set expiry to 5 minutes from now
  const expiresAt = Date.now() + 5 * 60 * 1000;

  otpStore.set(mobileNumber, { otp, expiresAt });

  console.log(`[DEV] OTP for ${mobileNumber} is ${otp}`);

  // In a real app, integrate with SMS gateway like Twilio or MSG91 here

  return res.status(200).json({ success: true, message: 'OTP sent successfully' });
});

app.post('/api/verify-otp', (req, res) => {
  const { mobileNumber, otp } = req.body;

  if (!mobileNumber || !otp) {
    return res.status(400).json({ success: false, message: 'Mobile number and OTP are required' });
  }

  const storedData = otpStore.get(mobileNumber);

  if (!storedData) {
    return res.status(400).json({ success: false, message: 'No OTP requested for this number' });
  }

  if (Date.now() > storedData.expiresAt) {
    otpStore.delete(mobileNumber);
    return res.status(400).json({ success: false, message: 'OTP has expired' });
  }

  if (storedData.otp !== otp) {
    return res.status(400).json({ success: false, message: 'Invalid OTP' });
  }

  // OTP is valid
  otpStore.delete(mobileNumber);
  return res.status(200).json({ 
    success: true, 
    message: 'OTP verified successfully',
    token: 'mock-jwt-token-789',
    user: {
      name: 'Ramesh Kumar',
      farmerId: 'FARM-' + Math.floor(1000 + Math.random() * 9000),
      mobile: mobileNumber
    }
  });
});

app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  const lowerMsg = message?.toLowerCase() || '';

  let reply = 'Namaste Kisan Bhai! Main SAATHI, aapka krishi sahayak hoon. Aap kaunsi fasal ya mandi ke baare mein jaanna chahte hain?';

  if (lowerMsg.includes('mandi') || lowerMsg.includes('price') || lowerMsg.includes('bhav') || lowerMsg.includes('rate')) {
    reply = 'Namaste! Aaj gehu (wheat) ka mandi bhav ₹2,200/quintal chal raha hai. Aap kis mandi ya rajya ki jaankari chahte hain?';
  } else if (lowerMsg.includes('fertilizer') || lowerMsg.includes('khad') || lowerMsg.includes('urea') || lowerMsg.includes('crop')) {
    reply = 'Namaste! Fasal mein khad daalne se pehle Soil Health Card zaroor check karein. Urea ka istemaal zaroorat ke hisaab se hi karein. Aapki fasal kaunsi hai?';
  } else if (lowerMsg.includes('weather') || lowerMsg.includes('mausam') || lowerMsg.includes('rain')) {
    reply = 'Namaste Kisan Bhai. Agle 2 din mein halki barish ki sambhavna hai. Apni fasal ki sinchai (irrigation) rok dein. Aapka zila (district) kaunsa hai?';
  } else if (lowerMsg.includes('scheme') || lowerMsg.includes('kisan') || lowerMsg.includes('yojana')) {
    reply = 'Namaste! PM-KISAN yojana ke tehat aap ₹6,000 saalana prapt kar sakte hain. Kya aapne apna e-KYC pura kar liya hai?';
  } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('namaste')) {
    reply = 'Namaste Kisan Bhai / Behan! Main SAATHI hoon. Aapki kheti aur mandi ki jaankari ke liye main hamesha taiyar hoon. Boliye, main aapki kya madad karoon?';
  }

  // Simulate API delay
  setTimeout(() => {
    return res.status(200).json({ success: true, reply });
  }, 1000);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
