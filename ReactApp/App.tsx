/*
  FILE: ReactApp/App.tsx
  PHASE: Phase 1
  CHANGES:
    - Added AppContent component that blocks RouterProvider until
      isInitialized is true
    - Prevents any component from mounting (and fetching) before
      auth state is loaded from storage
*/

import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ToastProvider } from "./context/ToastContext";

function AppContent() {
  const { isInitialized } = useAuth();

  if (!isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
