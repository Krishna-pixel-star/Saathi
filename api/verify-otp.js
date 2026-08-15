const DEMO_OTP = '123456';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { mobileNumber, otp } = req.body || {};

  if (!mobileNumber || !otp) {
    return res.status(400).json({ success: false, message: 'Mobile number and OTP are required' });
  }

  if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
    return res.status(400).json({ success: false, message: 'Invalid mobile number' });
  }

  if (otp !== DEMO_OTP) {
    return res.status(400).json({ success: false, message: 'Invalid OTP' });
  }

  return res.status(200).json({
    success: true,
    message: 'OTP verified successfully',
    token: 'mock-jwt-token-789',
    user: {
      name: 'Ramesh Kumar',
      farmerId: `FARM-${Math.floor(1000 + Math.random() * 9000)}`,
      mobile: mobileNumber,
    },
  });
}
