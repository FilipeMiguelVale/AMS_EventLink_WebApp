/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
import Maps from "views/examples/Maps_Page.js";
import Register from "views/examples/Register.js";
import Login from "views/Login.js";
import Events from "views/examples/Events.js";
import EventDetails from "views/examples/EventDetails";
import Edit_profile from "views/examples/Edit_profile";
import Users_table from "views/examples/Users_table";
import Create_event from "./views/examples/Create_event";
import Inventory from "./views/examples/Inventory";
import TicketLine from "./views/examples/Ticket";

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: Index,
    layout: "/admin"
  },
  {
    path: "/event_details/:id",
    name: "event Details",
    icon: "ni ni-planet text-blue",
    component: EventDetails,
    layout: "/admin"
  },
   {
    path: "/maps",
    name: "Maps",
    icon: "ni ni-pin-3 text-orange",
    component: Maps,
    layout: "/admin"
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: Profile,
    layout: "/admin"
  },
  {
    path: "/events",
    name: "Events",
    icon: "far fa-calendar-alt text-purple",
    component: Events,
    layout: "/admin"
  },
  {
    path: "/create_event/",
    name: "Create Event",
    icon: "fas fa-calendar-plus text-green",
    component: Create_event,
    layout: "/admin"
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: Login,
    layout: "/auth"
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: Register,
    layout: "/auth"
  },
  {
    path: "/edit_profile",
    name: "Edit Profile",
    icon: "ni ni-single-02 text-yellow",
    component: Edit_profile,
    layout: "/admin"
  },
  {
    path: "/users_table",
    name: "Users Table",
    icon: "ni ni-single-02 text-yellow",
    component: Users_table,
    layout: "/admin"
  },
  {
    path: "/inventory",
    name: "Inventory",
    icon: "fas fa-warehouse text-blue",
    component: Inventory,
    layout: "/admin"
  },
    {
    path: "/ticketline",
    name: "TicketLine",
    icon: "fas fa-ticket-alt",
    component: TicketLine,
    layout: "/admin"
  },
];
export default routes;
