import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate } from "react-router-dom";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../../../components/footer";
import Navbar from "../../../components/navbar";
import { useLoginMutation } from "./query";

const RECAPTCHA_SITE_KEY = "6Lcw7pErAAAAAEViXU5I0W0Kq03dg9TyClFmZOn4"; 

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const loginMutation = useLoginMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!recaptchaToken) {
      toast.error("Please verify that you're not a robot.");
      return;
    }

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (response) => {
          const { token } = response.data;
          if (token) {
            localStorage.setItem("token", token);
            try {
              const decodedToken = jwtDecode(token);
              const { userId, name, role } = decodedToken;

              localStorage.setItem("id", userId);
              localStorage.setItem("name", name);
              localStorage.setItem("role", role);

              toast.success("Login successful!");
              ;
              setTimeout(() => navigate(role === "admin" ? "/admindashboard" : "/"), 1000);
            } catch (error) {
              toast.error("Error decoding token");
            }
          } else {
            toast.error("Login failed: No token received");
          }
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || "Invalid email or password");
          setPassword("");
        },
      }
    );
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-10">
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

          {/* Right Side - Login Form */}
          <div className="w-full md:w-1/2 bg-gradient-to-br from-cyan-200 to-white p-10">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">LOGIN</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block mb-1 text-gray-700">Email:</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
                  required
                />
              </div>

              <div className="relative">
                <label className="block mb-1 text-gray-700">Password:</label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-10 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* reCAPTCHA */}
              <div className="flex justify-center">
                <ReCAPTCHA
                  sitekey={RECAPTCHA_SITE_KEY}
                  onChange={(token) => setRecaptchaToken(token)}
                  onExpired={() => setRecaptchaToken(null)}
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={loginMutation.isLoading}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg text-lg w-full max-w-xs mx-auto"
                >
                  {loginMutation.isLoading ? "Logging in..." : "Log in"}
                </button>
              </div>

              <div className="text-center mt-2 text-sm">
                <a href="/forgotpassword" className="text-cyan-600 hover:underline">
                  Forgot Password?
                </a>
              </div>

              <div className="text-center text-sm mt-4">
                <span className="text-gray-700">Don't have an account? </span>
                <a href="/signup" className="text-cyan-600 hover:underline">
                  Sign up here
                </a>
              </div>
            </form>
          </div>
        </div>

        <ToastContainer
          position="top-right"
          autoClose={2500}
          style={{ top: "8rem" }}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          transition={Bounce}
        />
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
