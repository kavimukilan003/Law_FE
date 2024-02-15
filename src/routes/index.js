import React from "react"
import { Redirect } from "react-router-dom"
// //Projects
import ProjectsOverview from "../pages/Projects/ProjectOverview/projects-overview"

// Authentication related pages
import Logout from "../pages/Authentication/Logout"

//Custom
import RainRegister from "rainComputing/pages/auth/Register"
import RainLogin from "rainComputing/pages/auth/Login"
import UserProfile from "rainComputing/pages/user/Profile"
import AttorneyRegister from "rainComputing/pages/user/AttorneyRegister"
import FirmLanding from "rainComputing/pages/attorney/FirmLanding"
import FirmCreate from "rainComputing/pages/user/FirmCreate"
import AttorneyLanding from "rainComputing/pages/attorney/AttorneyLanding"
import AttorneyDetailsCard from "rainComputing/pages/attorney/attorneyLanding/AttorneyDetailsCard"
import FirmInfo from "rainComputing/pages/attorney/firmLanding/firmInfo"
import ForgetPwd from "rainComputing/pages/auth/forgetPassword"
import VerifyEmailPage from "rainComputing/pages/auth/verifyEmail"
import emailForgetPassword from "rainComputing/pages/auth/emailForgetPassword"
import ForgetPasswordPage from "rainComputing/pages/auth/forgetPassword"
import ChatRc from "rainComputing/pages/chat/Chat"

import AdminLogin from "rainComputing/pages/admin/adminLogin/login"
import Admin from "rainComputing/pages/admin/Admin"
import usersList from "rainComputing/pages/admin/usersList"
import attorneysList from "rainComputing/pages/admin/attorneysList"
import caseList from "rainComputing/pages/admin/caseList"
import UserDetails from "rainComputing/pages/admin/UserDetails"
import AttorneyDetails from "rainComputing/pages/admin/AttorneyDetails"
import CaseDetails from "rainComputing/pages/admin/CaseDetails"

import RequestUser from "rainComputing/pages/user/AppointmentLanding/ReqUser"
import Payment from "rainComputing/pages/user/AppointmentLanding/PaymentPage/Payment"
import PaymentVia from "rainComputing/pages/user/AppointmentLanding/Paymentvia"
// import PaymentStatus from "rainComputing/pages/user/AppointmentLanding/PaymentStatus"
import AppointmentCard from "rainComputing/pages/user/AppointmentLanding/AppointmentStatus"
import PSwrapper from "rainComputing/pages/user/AppointmentLanding/PSwrapper"
import PaymentTranaction from "rainComputing/pages/admin/adminLogin/TransactionDetails"
import Guide from "rainComputing/pages/guide"
import Reminder from "rainComputing/pages/reminder"
import UserReminders from "rainComputing/pages/reminder/UserReminders"
import Calender from "rainComputing/pages/Calendar/Calendar"
import CompletedCase from "rainComputing/components/chat/CompletedCase"
// import Dashboard from "rainComputing/pages/reminder/Dashboard"
import DocketMenu from "rainComputing/pages/docket/DocketMenu"
import CreateEvents from "rainComputing/pages/docket/CreateEvents"
import ManageEvents from "rainComputing/pages/docket/ManageEvents"
import EventByCase from "rainComputing/pages/docket/EventByCase"
import PremiumPage from "rainComputing/pages/user/PremiumPage"
import ManageDomains from "rainComputing/components/chat/ManageDomains"

const authProtectedRoutes = [
  //Projects
  { path: "/projects-overview", component: ProjectsOverview },
  { path: "/projects-overview/:id", component: ProjectsOverview },
  //Blog

  //Custom Pages
  { path: "/profile", component: UserProfile },
  { path: "/attorney-signup", component: AttorneyRegister },
  { path: "/firmcreate", component: FirmCreate },
  { path: "/firmlanding", component: FirmLanding },
  { path: "/reqattorney", component: AttorneyLanding },

  { path: "/attorneydetail", component: AttorneyDetails },
  { path: "/attorneydetail", component: AttorneyDetailsCard },
  { path: "/firminfo", component: FirmInfo },
  { path: "/chat-rc", component: ChatRc },
  { path: "/req-user", component: RequestUser },
  { path: "/payment-page", component: Payment },
  { path: "/payment-status", component: PSwrapper },
  { path: "/payment-via", component: PaymentVia },
  { path: "/appointment-status", component: AppointmentCard },
  { path: "/reminder-data", component: Reminder },
  { path: "/reminders", component: UserReminders },
  { path: "/completedCase", component: CompletedCase },
  // { path: "/reminderDashboard", component: Dashboard },
  { path: "/calendar", component: Calender },
  { path: "/docket", component: DocketMenu },
  { path: "/create_events", component: CreateEvents },
  { path: "/manage_events", component: ManageEvents },
  { path: "/case_events", component: EventByCase },
  { path: "/premiumPage", component: PremiumPage },
{path: "/manage_domains",component: ManageDomains}
]

const publicRoutes = [
  { path: "/logout", component: Logout },
  { path: "/forgot-password", component: ForgetPasswordPage },
  { path: "/verifyemail", component: VerifyEmailPage },
  { path: "/emailforgotPwd", component: emailForgetPassword },
  { path: "/help", component: Guide },

  //CUSTOM COMPONENTS
  { path: "/register", component: RainRegister },
  { path: "/login", component: RainLogin },
  { path: "/admin", component: AdminLogin },
]
const adminRoutes = [
  //Admin Page
  { path: "/admin-page", component: Admin },
  { path: "/userlist-page", component: usersList },
  { path: "/attorneylist-page", component: attorneysList },
  { path: "/caselist-page", component: caseList },
  { path: "/case-Detail", component: CaseDetails },
  { path: "/user-Detail", component: UserDetails },
  { path: "/attorney-Detail", component: AttorneyDetails },
  { path: "/payment-Detail", component: PaymentTranaction },

]
export { authProtectedRoutes, publicRoutes, adminRoutes }
