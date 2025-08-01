import {
  AccountBoxOutlined,
  Assessment,
  BarChart,
  Dashboard,
  ExitToApp,
  Home,
  Medication,
  Search,
  Security,
  VerifiedUser
} from "@mui/icons-material"; // Icons
import { ListOrderedIcon } from "lucide-react";
import { Menu, MenuItem, Sidebar, SubMenu } from "react-pro-sidebar";
import { Link, useNavigate } from "react-router-dom"; // For navigation
const Side = ({ sidebarColor = '#23232b', textColor = '#fff', activeColor = '#6366f1' }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Optionally, call a backend logout endpoint if needed
    navigate("/");
  };
  return (
    <Sidebar
      rootStyles={{
        height: "100vh",
        background: sidebarColor,
        color: textColor,
        boxShadow: "2px 0 10px rgba(0, 0, 0, 0.2)",
        borderRight: "1px solid #27272a"
      }}
    >
      {/* Sidebar Header */}
      <div
        style={{
          padding: "24px",
          textAlign: "center",
          borderBottom: "1px solid #27272a",
          background: sidebarColor
        }}
      >
        <h2 style={{ margin: 0, fontSize: "1.7rem", fontWeight: "bold", color: activeColor, letterSpacing: 1 }}>
          TimeSaber Admin
        </h2>
        <p style={{ margin: 0, color: "#a3a3a3", fontSize: "0.95rem" }}>
          Welcome, Admin!
        </p>
      </div>

      {/* Sidebar Menu */}
      <Menu
        menuItemStyles={{
          button: {
            color: textColor,
            background: sidebarColor,
            borderRadius: "0.5rem",
            margin: "0.2rem 0",
            fontWeight: 500,
            fontSize: "1rem",
            transition: "background 0.2s, color 0.2s",
            '&:hover': {
              backgroundColor: '#232346',
              color: activeColor,
            },
            '&.ps-active': {
              backgroundColor: activeColor,
              color: '#fff',
            },
          },
        }}
      >
        {/* Home */}
        <MenuItem icon={<Home />} component={<Link to="/" />}>
          Home
        </MenuItem>
        <MenuItem icon={<Dashboard />} component={<Link to="/admindashboard" />}>
          Dashboard
        </MenuItem>

        {/* Charts Submenu */}
        {/* <SubMenu label="Charts" icon={<BarChart />}>
          <MenuItem icon={<PieChart />} component={<Link to="/admin/piechart" />}>
            Pie Chart
          </MenuItem>
          <MenuItem icon={<Timeline />} component={<Link to="/admin/barchart" />}>
            Bar Chart
          </MenuItem>
        </SubMenu> */}

        {/* add items */}
        <MenuItem icon={<Medication />} component={<Link to="/additems" />}>
          Add Items
        </MenuItem>

        {/* search items */}
        <MenuItem icon={<Search />} component={<Link to="/getitems" />}>
          Search Items
        </MenuItem>
        <MenuItem icon={<VerifiedUser />} component={<Link to="/allusers" />}>
          Users
        </MenuItem>
        <MenuItem icon={<ListOrderedIcon />} component={<Link to="/allorder" />}>
          Orders
        </MenuItem>

        {/* Audit Logs Submenu */}
        <SubMenu label="Audit Logs" icon={<Security />}>
          <MenuItem icon={<Assessment />} component={<Link to="/auditlogs" />}>
            All Logs
          </MenuItem>
          <MenuItem icon={<BarChart />} component={<Link to="/auditstats" />}>
            Statistics
          </MenuItem>
        </SubMenu>

        {/* Divider */}
        <div
          style={{
            margin: "16px 0",
            borderBottom: "1px solid #27272a",
          }}
        />

        {/* Settings */}
        <MenuItem icon={<AccountBoxOutlined />} component={<Link to="/myprofile" />}>
          Profile
        </MenuItem>

        {/* Logout */}
        <MenuItem
          icon={<ExitToApp />}
          component={<Link to="/" />}
          style={{ color: "#ff4444" }}
          onClick={handleLogout}
        >
          Logout
        </MenuItem>
      </Menu>

      {/* Sidebar Footer */}
      <div
        style={{
          padding: "16px",
          textAlign: "center",
          borderTop: "1px solid #27272a",
          position: "absolute",
          bottom: 0,
          width: "100%",
          background: sidebarColor
        }}
      >
        <p style={{ margin: 0, color: "#a3a3a3", fontSize: "0.85rem" }}>
          © 2025 TimeSaber Admin Panel
        </p>
      </div>
    </Sidebar>
  );
};

export default Side;