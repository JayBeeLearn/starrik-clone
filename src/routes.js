
import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
import UserProfile from "views/examples/UserProfile";
// import Maps from "views/examples/Maps.js";
import Maps from "views/examples/UserPlaceOrder";
import Register from "views/examples/Register.js";
import RiderReg from "views/examples/RiderReg";
import RiderReg2 from "views/examples/RidReg2";
import UserReg from "views/examples/UserReg";
import Login from "views/examples/Login.js";
import Tables from "views/examples/RiderOrders";
import UserTrackorders from "views/examples/UserTrackorders";
import RiderRunningOrders from "views/examples/RiderRunningOrders";
import Icons from "views/examples/Icons.js";

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/admin",
  },
  {
    path: "/maps",
    name: "Place Order",
    icon: "ni ni-pin-3 text-orange",
    component: <Maps />,
    layout: "/user",
  },
  {
    path: "/trackorder",
    name: "Track Order",
    icon: "ni ni-pin-3 text-orange",
    component: <  UserTrackorders />,
    layout: "/user",
  },
  {
    path: "/tables",
    name: "View Orders",
    icon: "ni ni-bullet-list-67 text-red",
    component: <Tables />,
    layout: "/admin",
  },
  {
    path: "/runningorder",
    name: "My Active Order",
    icon: "ni ni-pin-3 text-orange",
    component: <RiderRunningOrders />,
    layout: "/admin",
  },
  {
    path: "/rider-profile",
    name: "Rider Profile",
    icon: "ni ni-single-02 text-yellow",
    component: <Profile />,
    layout: "/admin",
  },

  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: <UserProfile />,
    layout: "/user",
  },


  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: <Login />,
    layout: "/auth",
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: <Register />,
    layout: "/auth",
  },
  {
    path: "/ridereg",
    name: "RiderReg",
    icon: "ni ni-circle-08 text-pink",
    component: <RiderReg />,
    layout: "/auth",
  },
  {
    path: "/ridereg2",
    name: "RiderReg2",
    icon: "ni ni-circle-08 text-pink",
    component: <RiderReg2 />,
    layout: "/auth",
  },
  {
    path: "/usereg",
    name: "UserReg",
    icon: "ni ni-circle-08 text-pink",
    component: <UserReg />,
    layout: "/auth",
  },
];
export default routes;
