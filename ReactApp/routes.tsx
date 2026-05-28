/*
  FILE: ReactApp/routes.tsx
  PHASE: 3
  MISSION: 2-Performance
  CHANGES:
    - Converted all 8 protected app pages to React.lazy() + dynamic import().
      webpack generates a separate async chunk per page; the JS for each page is
      fetched only when the user first navigates to that route.
    - Auth pages (Login, Signup, ForgotPassword, ResetPasswordEmailMessage, ResetPassword),
      legal pages, and NotFound remain eager imports — they are small and frequently
      first-visited before any lazy chunk can pre-fetch.
    - Each lazy route element is wrapped in <Suspense fallback={<PageLoading />}> using
      the existing PageLoading component from Components/PageState.
    - webpack.config.js splitChunks.chunks changed 'initial' → 'all' so vendor node_modules
      are also split into separate chunks for async routes (companion change).
*/
import { lazy, Suspense } from "react";
import { createHashRouter } from "react-router";
import ProtectedRoute from "./Components/ProtectedRoute";
import ErrorBoundary from "./Components/ErrorBoundary";
import { PageLoading } from "./Components/PageState";

// ── Public (auth) pages — eager: first-seen on cold start ───────────────
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPasswordEmailMessage from "./pages/ResetPasswordEmailMessage";
import ResetPassword from "./pages/ResetPassword";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy";
import Security from "./pages/Security";
import NotFound from "./pages/NotFound";

// ── Protected (app) pages — lazy: loaded only on first navigation ────────
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Projects = lazy(() => import("./pages/Projects"));
const MyWork = lazy(() => import("./pages/MyWork"));
const Teams = lazy(() => import("./pages/Teams"));
const Settings = lazy(() => import("./pages/Settings"));
const Message = lazy(() => import("./pages/Message"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Chatbot = lazy(() => import("./pages/Chatbot"));
const CalendarEvents = lazy(() => import("./pages/CalendarEvents"));

const appFallback = <PageLoading />;

export const router = createHashRouter([
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
  {
    path: "/terms-of-service",
    element: <TermsOfService />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicy />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/cookie-policy",
    element: <CookiePolicy />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/security",
    element: <Security />,
    errorElement: <ErrorBoundary />,
  },

  // ── Protected routes (auth required) ───────────────────────────────────
  {
    element: <ProtectedRoute />,
    errorElement: <ErrorBoundary />,
    children: [
      { path: "/",             element: <Suspense fallback={appFallback}><Dashboard /></Suspense> },
      { path: "/projects",     element: <Suspense fallback={appFallback}><Projects /></Suspense> },
      { path: "/my-work",      element: <Suspense fallback={appFallback}><MyWork /></Suspense> },
      { path: "/teams",        element: <Suspense fallback={appFallback}><Teams /></Suspense> },
      { path: "/settings",     element: <Suspense fallback={appFallback}><Settings /></Suspense> },
      { path: "/message",      element: <Suspense fallback={appFallback}><Message /></Suspense> },
      { path: "/notifications",element: <Suspense fallback={appFallback}><Notifications /></Suspense> },
      { path: "/calendar",     element: <Suspense fallback={appFallback}><CalendarEvents /></Suspense> },
      { path: "/plans",        element: <Suspense fallback={appFallback}><Chatbot /></Suspense> },
    ],
  },

  // ── Catch-all 404 ─────────────────────────────────────────────────────
  {
    path: "*",
    element: <NotFound />,
  },
]);
