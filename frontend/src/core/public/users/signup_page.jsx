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

  const [passwordStrength, setPasswordStrength] = useState('');
  const [passwordFocused, setPasswordFocused] = useState(false);

  const checkPasswordStrength = (password) => {
    const strengthConditions = [
      /[a-z]/.test(password),
      /[A-Z]/.test(password),
      /[0-9]/.test(password),
      /[^A-Za-z0-9]/.test(password),
      password.length >= 8,
    ];
    const passed = strengthConditions.filter(Boolean).length;
    if (passed <= 2) return 'Weak';
    if (passed === 3 || passed === 4) return 'Medium';
    return 'Strong';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
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
      const response = await fetch('https://localhost:3000/api/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Signup failed');

      setUserEmail(formData.email);
      setShowOtpModal(true);
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
          <div className="md:w-1/2 flex flex-col items-center justify-center bg-gradient-to-br from-cyan-200 to-white p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Time Saber</h1>
            <img
              src="../src/assets/images/logo1.png"
              alt="Time Saber Logo"
              className="w-40 h-auto object-contain"
            />
          </div>

          <div className="md:w-1/2 flex items-center justify-center p-8">
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
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    className="p-2 border rounded-xl w-full"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 cursor-pointer text-sm"
                  >
                    {showPassword ? '😉' : '😌'}
                  </span>
                  {passwordFocused && (
                    <div className="mt-1 text-xs px-2 py-1 bg-gray-100 border rounded border-gray-300">
                      <p>
                        Strength:{' '}
                        <span className={
                          passwordStrength === 'Strong' ? 'text-green-600 font-semibold' :
                          passwordStrength === 'Medium' ? 'text-yellow-600 font-semibold' :
                          'text-red-600 font-semibold'
                        }>
                          {passwordStrength}
                        </span>
                      </p>
                      {passwordStrength !== 'Strong' && (
                        <ul className="list-disc ml-4 text-gray-600">
                          {!/[A-Z]/.test(formData.password) && <li>Atleast one uppercase letters</li>}
                          {!/[a-z]/.test(formData.password) && <li>Atleast one lowercase letters</li>}
                          {!/[0-9]/.test(formData.password) && <li>Include numbers(0-9)</li>}
                          {!/[^A-Za-z0-9]/.test(formData.password) && <li>Use special characters(e.g. @,#,!)</li>}
                          {formData.password.length < 8 && <li>At least 8 characters</li>}
                        </ul>
                      )}
                    </div>
                  )}
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
