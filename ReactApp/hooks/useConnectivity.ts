// ── useConnectivity Hook ────────────────────────────────────────────────────
//
// Tracks MongoDB reachability and exposes a manual online/offline toggle.
// State is initialised from the backend and kept in sync via custom DOM events
// dispatched by useNotificationHub when SignalR connectivity events arrive.

import { useState, useEffect, useCallback, useRef } from "react";
import { useToast } from "../context/ToastContext";
import { getApiBaseUrl } from "../config/api";
import { getAuthToken } from "../services/api";

export interface ConnectivityStatus {
  isOnline: boolean;
  isManualOffline: boolean;
  isEffectivelyOnline: boolean;
  pendingSyncCount: number;
  lastCheckedAt: string | null;
}

interface SyncProgress {
  synced: number;
  total: number;
}

interface UseConnectivityReturn {
  isOnline: boolean;
  isManualOffline: boolean;
  isEffectivelyOnline: boolean;
  isSyncing: boolean;
  syncProgress: SyncProgress;
  pendingSyncCount: number;
  toggleManualOffline: () => Promise<void>;
}

export const useConnectivity = (): UseConnectivityReturn => {
  const { addToast } = useToast();

  const [isOnline, setIsOnline] = useState(true);
  const [isManualOffline, setIsManualOffline] = useState(false);
  const [isEffectivelyOnline, setIsEffectivelyOnline] = useState(true);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState<SyncProgress>({ synced: 0, total: 0 });

  // Ref to avoid stale closure in toggleManualOffline
  const isManualOfflineRef = useRef(isManualOffline);
  isManualOfflineRef.current = isManualOffline;

  // ── Fetch initial status ─────────────────────────────────────────────────

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const baseUrl = getApiBaseUrl() || "";
        const token = getAuthToken();
        if (!token) return;

        const res = await fetch(`${baseUrl}/api/connectivity/status`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) return;

        const json = await res.json();
        const data: ConnectivityStatus = json.data;

        setIsOnline(data.isOnline);
        setIsManualOffline(data.isManualOffline);
        setIsEffectivelyOnline(data.isEffectivelyOnline);
        setPendingSyncCount(data.pendingSyncCount);
      } catch {
        // Silently ignore — defaults stay as-is
      }
    };

    fetchStatus();
  }, []);

  // ── Custom event listeners (dispatched by useNotificationHub) ────────────

  useEffect(() => {
    const onConnectivityChanged = (e: Event) => {
      const online = (e as CustomEvent<boolean>).detail;
      setIsOnline(online);
      setIsEffectivelyOnline(online && !isManualOfflineRef.current);

      addToast({
        title: online ? "Connected" : "Offline",
        message: online
          ? "Cloud connection restored."
          : "Working offline. Changes will sync when reconnected.",
        type: online ? "success" : "warning",
        duration: 5000,
      });
    };

    const onSyncStarted = (e: Event) => {
      const total = (e as CustomEvent<number>).detail;
      setIsSyncing(true);
      setSyncProgress({ synced: 0, total });
    };

    const onSyncProgress = (e: Event) => {
      const { synced, total } = (e as CustomEvent<{ synced: number; total: number }>).detail;
      setSyncProgress({ synced, total });
    };

    const onSyncCompleted = (e: Event) => {
      const { synced } = (e as CustomEvent<{ synced: number; failed: number }>).detail;
      setIsSyncing(false);
      setSyncProgress({ synced: 0, total: 0 });
      setPendingSyncCount(prev => Math.max(0, prev - synced));
    };

    window.addEventListener("taskflow:connectivity-changed", onConnectivityChanged);
    window.addEventListener("taskflow:sync-started", onSyncStarted);
    window.addEventListener("taskflow:sync-progress", onSyncProgress);
    window.addEventListener("taskflow:sync-completed", onSyncCompleted);

    return () => {
      window.removeEventListener("taskflow:connectivity-changed", onConnectivityChanged);
      window.removeEventListener("taskflow:sync-started", onSyncStarted);
      window.removeEventListener("taskflow:sync-progress", onSyncProgress);
      window.removeEventListener("taskflow:sync-completed", onSyncCompleted);
    };
  }, [addToast]);

  // ── Manual toggle ────────────────────────────────────────────────────────

  const toggleManualOffline = useCallback(async () => {
    const forceOffline = !isManualOfflineRef.current;

    try {
      const baseUrl = getApiBaseUrl() || "";
      const token = getAuthToken();
      if (!token) return;

      const res = await fetch(`${baseUrl}/api/connectivity/mode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ forceOffline }),
      });

      if (!res.ok) return;

      const json = await res.json();
      const data: ConnectivityStatus = json.data;

      setIsManualOffline(data.isManualOffline);
      setIsEffectivelyOnline(data.isEffectivelyOnline);

      addToast({
        title: forceOffline ? "Offline Mode" : "Online Mode",
        message: forceOffline
          ? "Manually switched to offline. MongoDB writes will queue."
          : "Reconnected to cloud.",
        type: forceOffline ? "warning" : "success",
        duration: 4000,
      });
    } catch {
      // Silently ignore toggle failures
    }
  }, [addToast]);

  return {
    isOnline,
    isManualOffline,
    isEffectivelyOnline,
    isSyncing,
    syncProgress,
    pendingSyncCount,
    toggleManualOffline,
  };
};
