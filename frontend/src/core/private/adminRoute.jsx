import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Usage: <AdminRoute><Dashboard /></AdminRoute>
const AdminRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await axios.get("https://localhost:3000/api/users/profile", { withCredentials: true });
        if (res.data.role !== "admin") {
          navigate("/", { replace: true });
        }
      } catch (err) {
        navigate("/login", { replace: true });
      }
    };
    checkAdmin();
    // eslint-disable-next-line
  }, []);

  return children;
};

export default AdminRoute;
