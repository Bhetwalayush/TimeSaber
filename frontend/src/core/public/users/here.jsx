import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../../../components/footer';
import Navbar from '../../../components/navbar';

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

      toast.success('Signup successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000);
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
      <div className="flex flex-col md:flex-row h-screen bg-gradient-to-br from-cyan-200 to-white">
        {/* Left Image Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-10">
          <h1 className="text-5xl font-bold mb-4 text-gray-800">Time Saber</h1>
          <img src="../src/assets/images/logo1.png" alt="Luxe" className="max-w-xs md:max-w-md" />
        </div>

        {/* Right Form Section */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-10 bg-white rounded-l-3xl shadow-xl">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-xl space-y-4"
          >
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Create Account</h2>
            <p className="text-center text-gray-600 mb-4">Fill in the form to register</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="first_name"
                placeholder="First Name *"
                value={formData.first_name}
                onChange={handleChange}
                className="p-3 border rounded-xl w-full"
              />
              <input
                type="text"
                name="last_name"
                placeholder="Last Name *"
                value={formData.last_name}
                onChange={handleChange}
                className="p-3 border rounded-xl w-full"
              />
              <input
                type="email"
                name="email"
                placeholder="Email *"
                value={formData.email}
                onChange={handleChange}
                className="p-3 border rounded-xl w-full col-span-1 md:col-span-2"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number *"
                value={formData.phone}
                onChange={handleChange}
                className="p-3 border rounded-xl w-full"
              />
              <input
                type="text"
                name="region_state"
                placeholder="State/Region *"
                value={formData.region_state}
                onChange={handleChange}
                className="p-3 border rounded-xl w-full"
              />
              <input
                type="text"
                name="address"
                placeholder="Address *"
                value={formData.address}
                onChange={handleChange}
                className="p-3 border rounded-xl w-full col-span-1 md:col-span-2"
              />
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={formData.country}
                onChange={handleChange}
                className="p-3 border rounded-xl w-full col-span-1 md:col-span-2"
              />
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password *"
                  value={formData.password}
                  onChange={handleChange}
                  className="p-3 border rounded-xl w-full"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 cursor-pointer"
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
                  className="p-3 border rounded-xl w-full"
                />
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3.5 cursor-pointer"
                >
                  {showConfirmPassword ? '😉' : '😌'}
                </span>
              </div>
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 text-white text-lg py-3 rounded-xl mt-2 font-semibold"
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>

            <p className="text-center text-sm mt-3">
              Already have an account?{" "}
              <a href="/login" className="text-cyan-600 hover:underline">Log in</a>
            </p>
          </form>
        </div>
      </div>
      <ToastContainer />
      <Footer />
    </div>
  );
};

export default Signup;
