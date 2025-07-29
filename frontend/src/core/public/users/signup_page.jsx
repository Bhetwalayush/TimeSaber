import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../../../components/footer';
import Navbar from '../../../components/navbar';
import OTPModal from '../users/OTPModal';

const Signup = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    country: 'Nepal',
    region_state: '',
    password: '',
    confirm_password: '',
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const {
      first_name,
      last_name,
      email,
      phone,
      address,
      region_state,
      password,
      confirm_password,
    } = formData;

    if (!first_name || !last_name || !email || !phone || !address || !region_state || !password || !confirm_password) {
      setError('All required fields must be filled out.');
      return false;
    }

    if (password !== confirm_password) {
      setError("Passwords do not match.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Signup failed');

      setUserEmail(formData.email);
      setShowOtpModal(true);
      // toast.success('Signup successful! Redirecting to login...');
      // setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.message);
      toast.error('Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-cyan-200 to-white px-4 py-10">
        <div className="flex flex-col md:flex-row bg-white rounded-3xl shadow-lg w-full max-w-5xl overflow-hidden">
          {/* Left Logo Section */}
          <div className="md:w-1/2 flex flex-col items-center justify-center bg-gradient-to-br from-cyan-200 to-white p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Time Saber</h1>
            <img
              src="../src/assets/images/logo1.png"
              alt="Time Saber Logo"
              className="w-40 h-auto object-contain"
            />
          </div>

          {/* Right Form Section */}
          <div className="md:w-1/2 flex items-center justify-center  p-8">
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-md space-y-4"
            >
              <h2 className="text-xl font-semibold text-center text-gray-800">Create Account</h2>
              <p className="text-center text-gray-600 text-sm">Fill in the form to register</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <input
                  type="text"
                  name="first_name"
                  placeholder="First Name *"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="p-2 border rounded-xl w-full"
                />
                <input
                  type="text"
                  name="last_name"
                  placeholder="Last Name *"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="p-2 border rounded-xl w-full"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={handleChange}
                  className="p-2 border rounded-xl w-full col-span-1 md:col-span-2"
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number *"
                  value={formData.phone}
                  onChange={handleChange}
                  className="p-2 border rounded-xl w-full"
                />
                <input
                  type="text"
                  name="region_state"
                  placeholder="State/Region *"
                  value={formData.region_state}
                  onChange={handleChange}
                  className="p-2 border rounded-xl w-full"
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Address *"
                  value={formData.address}
                  onChange={handleChange}
                  className="p-2 border rounded-xl w-full col-span-1 md:col-span-2"
                />
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={formData.country}
                  onChange={handleChange}
                  className="p-2 border rounded-xl w-full col-span-1 md:col-span-2"
                />
                <div className="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password *"
                    value={formData.password}
                    onChange={handleChange}
                    className="p-2 border rounded-xl w-full"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 cursor-pointer text-sm"
                  >
                    {showPassword ? '😉' : '😌'}
                  </span>
                </div>
                <div className="relative w-full">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirm_password"
                    placeholder="Confirm Password *"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    className="p-2 border rounded-xl w-full"
                  />
                  <span
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 cursor-pointer text-sm"
                  >
                    {showConfirmPassword ? '😉' : '😌'}
                  </span>
                </div>
              </div>

              {error && <p className="text-red-500 text-center text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-600 text-white text-sm py-2 rounded-xl font-medium"
              >
                {loading ? 'Signing up...' : 'Sign Up'}
              </button>

              <p className="text-center text-xs mt-2">
                Already have an account?{' '}
                <a href="/login" className="text-cyan-600 hover:underline">Log in</a>
              </p>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
      <Footer />
       {showOtpModal && (
  <OTPModal
    email={userEmail}
    onSuccess={() => {
      toast.success('OTP verified. Redirecting to login...');
      setShowOtpModal(false);
      setTimeout(() => navigate('/login'), 3000);
    }}
  />
)}
    </div>
  );
};

export default Signup;
