import { createBrowserRouter } from "react-router";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import MyWork from "./pages/MyWork";
import Teams from "./pages/Teams";
import Filters from "./pages/Filters";
import Calendar from "./pages/Calendar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPasswordEmailMessage from "./pages/ResetPasswordEmailMessage";
import ResetPassword from "./pages/ResetPassword";
import Settings from "./pages/Settings";
import Message from "./pages/Message";
import Notifications from "./pages/Notifications";
import ErrorBoundary from "./Components/ErrorBoundary";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/signup",
    element: <Signup />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/reset-password-sent",
    element: <ResetPasswordEmailMessage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/",
    element: <Dashboard />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/projects",
    element: <Projects />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/my-work",
    element: <MyWork />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/teams",
    element: <Teams />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/filters",
    element: <Filters />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/calendar",
    element: <Calendar />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/settings",
    element: <Settings />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/message",
    element: <Message />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/notifications",
    element: <Notifications />,
    errorElement: <ErrorBoundary />,
  },
]);
