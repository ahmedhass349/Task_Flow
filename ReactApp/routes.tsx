import { createBrowserRouter } from "react-router";
import ProtectedRoute from "./Components/ProtectedRoute";
import ErrorBoundary from "./Components/ErrorBoundary";

// ── Public (auth) pages ──────────────────────────────────────────────────
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPasswordEmailMessage from "./pages/ResetPasswordEmailMessage";
import ResetPassword from "./pages/ResetPassword";

// ── Protected (app) pages ────────────────────────────────────────────────
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import MyWork from "./pages/MyWork";
import Teams from "./pages/Teams";
import Filters from "./pages/Filters";
import Calendar from "./pages/Calendar";
import Settings from "./pages/Settings";
import Message from "./pages/Message";
import Notifications from "./pages/Notifications";
import Chatbot from "./pages/Chatbot";

// ── 404 ──────────────────────────────────────────────────────────────────
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
  // ── Public routes (no auth required) ───────────────────────────────────
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

  // ── Protected routes (auth required) ───────────────────────────────────
  {
    element: <ProtectedRoute />,
    errorElement: <ErrorBoundary />,
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/projects", element: <Projects /> },
      { path: "/my-work", element: <MyWork /> },
      { path: "/teams", element: <Teams /> },
      { path: "/filters", element: <Filters /> },
      { path: "/calendar", element: <Calendar /> },
      { path: "/settings", element: <Settings /> },
      { path: "/message", element: <Message /> },
      { path: "/notifications", element: <Notifications /> },
      { path: "/plans", element: <Chatbot /> },
    ],
  },

  // ── Catch-all 404 ─────────────────────────────────────────────────────
  {
    path: "*",
    element: <NotFound />,
  },
]);
