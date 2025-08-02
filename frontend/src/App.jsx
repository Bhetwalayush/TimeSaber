import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminRoute from "./core/private/adminRoute";
import Additems from "./core/private/all items/add_items";
import Allitems from "./core/private/all items/allitems";
import Allorder from "./core/private/all order/allorder";
import Users from "./core/private/all users/allusers";
import AuditLogs from "./core/private/audit logs/auditlogs";
import AuditStats from "./core/private/audit logs/auditstats";
import UserActivity from "./core/private/audit logs/useractivity";
import Barchart from "./core/private/charts/barchart";
import Piechart from "./core/private/charts/piechart";
import Dashboard from "./core/private/dashboard/dashboard";
import Contactus from "./core/public/contackus/contactus";
import FAQ from "./core/public/FAQ/faq";
import Forgotpw from "./core/public/forgotpw/forgotpassword";
import Resetpassword from "./core/public/forgotpw/resetpassword";
import Failure from "./core/public/my cart/failure";
import Ordercart from "./core/public/my cart/mycart";
import Success from "./core/public/my cart/success";
import Myorders from "./core/public/order/myorder";
import Travelbag from "./core/public/product/newarrivals";
import OurFavorites from "./core/public/product/ourfavorites";
import WomanCare from "./core/public/product/popular";
import Officebag from "./core/public/product/this";
import MenWatch from "./core/public/product/watchforman";
import WatchforWomen from "./core/public/product/watchforwomen";
import Wishlist from "./core/public/product/wishlist";
import Profile from "./core/public/profile/profile";
import SearchResults from "./core/public/search/searchresult";

const Home = lazy(() => import("./core/public/home/home"));
const Login = lazy(() => import("./core/public/users/login_page"));
const Signup = lazy(() => import("./core/public/users/signup_page"));
// const FirstAid = lazy(() => import("./core/public/product/travelbags"));
const queryClient = new QueryClient();
function App() {
  const publicRoutes = [
    {
      path: "/login",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <Login />
        </Suspense>
      ),
    },
    {
      path: "/signup",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <Signup />
        </Suspense>
      ),
    },
    {
      path: "/",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <Home />
        </Suspense>
      ),
    },
    {
      path: "/admindashboard",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <AdminRoute>
            <Dashboard />
          </AdminRoute>
        </Suspense>
      ),
    },
    {
      path: "/additems",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <Additems />
        </Suspense>
      ),
    },
    {
      path: "/getitems",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <Allitems />
        </Suspense>
      ),
    },
    {
      path: "/allusers",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <Users />
        </Suspense>
      ),
    },
    {
      path: "/allorder",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <Allorder />
        </Suspense>
      ),
    },
    {
      path: "/myorders",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <Myorders />
        </Suspense>
      ),
    },
    {
      path: "/womenwatch",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <WatchforWomen />
        </Suspense>
      ),
    },
    {
      path: "/popular",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <Officebag />
        </Suspense>
      ),
    },
    {
      path: "/partybags",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <WomanCare />
        </Suspense>
      ),
    },
    {
      path: "/menwatch",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <MenWatch />
        </Suspense>
      ),
    },
    {
      path: "/mycart",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <Ordercart />
        </Suspense>
      ),
    },
    {
      path: "/ourfavorites",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <OurFavorites />
        </Suspense>
      ),
    },
    {
      path: "/newarrivals",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <Travelbag />
        </Suspense>
      ),
    },
    {
      path: "/mycart",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <Ordercart />
        </Suspense>
      ),
    },
    {
      path: "/payment-success",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <Success />
        </Suspense>
      ),
    },
    {
      path: "/payment-failed",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <Failure />
        </Suspense>
      ),
    },
    {
      path: "/search",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <SearchResults />
        </Suspense>
      ),
    },
    {
      path: "/mywishlist",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <Wishlist />
        </Suspense>
      ),
    },
    {
      path: "/myprofile",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <Profile />
        </Suspense>
      ),
    },
    {
      path: "/contactus",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <Contactus />
        </Suspense>
      ),
    },
    {
      path: "/FAQ",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <FAQ />
        </Suspense>
      ),
    },
    {
      path: "/forgotpassword",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <Forgotpw />
        </Suspense>
      ),
    },
    {
      path: "/resetpassword",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <Resetpassword />
        </Suspense>
      ),
    },
    {
      path: "/admin/piechart",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <Piechart />
        </Suspense>
      ),
    },
    {
      path: "/admin/barchart",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <Barchart />
        </Suspense>
      ),
    },
    {
      path: "/auditlogs",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <AuditLogs />
        </Suspense>
      ),
    },
    {
      path: "/auditstats",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <AuditStats />
        </Suspense>
      ),
    },
    {
      path: "/useractivity/:userId",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <UserActivity />
        </Suspense>
      ),
    },
  ];

  // const privateRoutes=[];
  const router = createBrowserRouter(publicRoutes);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </>
  );
}

export default App;
