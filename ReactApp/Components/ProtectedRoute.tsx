// ── Protected Route Wrapper ──────────────────────────────────────────────
//
// Wraps routes that require authentication.
// - If auth is still loading, shows a loading spinner
// - If user is not authenticated, redirects to /login
// - Otherwise renders the child route via <Outlet />
// Phase 3: also mounts <ConnectivityBar> once for all protected pages

import React from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import ConnectivityBar from "./ConnectivityBar";

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Preserve the attempted URL so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <>
      {/* Phase 3: offline/syncing status bar — only visible when not effectively online or syncing */}
      <ConnectivityBar />
      <Outlet />
    </>
  );
}
