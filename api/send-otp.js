const DEMO_OTP = '123456';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { mobileNumber } = req.body || {};

  if (!mobileNumber || !/^[6-9]\d{9}$/.test(mobileNumber)) {
    return res.status(400).json({ success: false, message: 'Invalid mobile number' });
  }

  return res.status(200).json({
    success: true,
    message: 'OTP sent successfully',
    devOtp: DEMO_OTP,
  });
}
