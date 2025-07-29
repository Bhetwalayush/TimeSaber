import axios from 'axios';
import { useState } from 'react';

const OTPModal = ({ email, onSuccess }) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    try {
      setLoading(true);
      const res = await axios.post('https://localhost:3000/api/users/verify-otp', { email, otp });
      onSuccess();
    } catch (err) {
      setError('Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-80 text-center shadow-lg">
        <h2 className="text-lg font-bold mb-2">Enter OTP</h2>
        <input
          type="text"
          maxLength="6"
          className="border p-2 w-full rounded-md mb-3"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button
          onClick={handleVerify}
          disabled={loading}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </div>
    </div>
  );
};

export default OTPModal;