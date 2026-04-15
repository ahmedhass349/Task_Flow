// FILE: ReactApp/Components/ConnectivityBar.tsx  PHASE: 3  CHANGE: new component — fixed bar indicating offline/syncing state
import React from "react";
import { Wifi, WifiOff, RefreshCw, CloudOff, Cloud } from "lucide-react";
import { useConnectivity } from "../hooks/useConnectivity";

/**
 * A slim fixed banner that appears at the top of the viewport when the app is
 * offline (MongoDB unreachable) or actively syncing a queued outbox.
 * Hidden when fully online and idle — zero visual footprint in the happy path.
 */
export default function ConnectivityBar() {
  const {
    isEffectivelyOnline,
    isManualOffline,
    isSyncing,
    syncProgress,
    pendingSyncCount,
    toggleManualOffline,
  } = useConnectivity();

  // Nothing to show when online and not syncing
  if (isEffectivelyOnline && !isSyncing) return null;

  const syncPercent =
    isSyncing && syncProgress.total > 0
      ? Math.round((syncProgress.synced / syncProgress.total) * 100)
      : 0;

  const isOffline = !isEffectivelyOnline;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`
        fixed top-0 left-0 right-0 z-[9999]
        flex items-center justify-between gap-3
        px-4 py-2 text-sm font-medium
        transition-all duration-300
        ${isOffline
          ? "bg-amber-500 text-white"
          : "bg-blue-600 text-white"
        }
      `}
      style={{ minHeight: 40 }}
    >
      {/* Left: icon + status message */}
      <div className="flex items-center gap-2 min-w-0">
        {isOffline ? (
          <WifiOff className="size-4 shrink-0" aria-hidden />
        ) : (
          <RefreshCw className="size-4 shrink-0 animate-spin" aria-hidden />
        )}

        <span className="truncate">
          {isOffline && !isSyncing && (
            <>
              Working offline
              {pendingSyncCount > 0 && (
                <span className="ml-1 opacity-80">
                  — {pendingSyncCount} change{pendingSyncCount !== 1 ? "s" : ""} pending
                </span>
              )}
            </>
          )}
          {isSyncing && (
            <>
              Syncing{" "}
              {syncProgress.total > 0
                ? `${syncProgress.synced} / ${syncProgress.total}`
                : "…"}
            </>
          )}
        </span>
      </div>

      {/* Middle: progress bar (only while syncing) */}
      {isSyncing && syncProgress.total > 0 && (
        <div className="flex-1 max-w-xs hidden sm:block">
          <div className="h-1.5 rounded-full bg-white/30 overflow-hidden">
            <div
              className="h-full rounded-full bg-white transition-all duration-300"
              style={{ width: `${syncPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Right: manual offline toggle */}
      <button
        onClick={toggleManualOffline}
        className="
          shrink-0 flex items-center gap-1.5
          rounded px-2.5 py-1
          bg-white/20 hover:bg-white/30
          transition-colors text-xs font-semibold
          focus:outline-none focus-visible:ring-2 focus-visible:ring-white
        "
        title={isManualOffline ? "Reconnect to cloud" : "Switch to offline mode"}
      >
        {isManualOffline ? (
          <>
            <Cloud className="size-3.5" aria-hidden />
            Go Online
          </>
        ) : (
          <>
            <CloudOff className="size-3.5" aria-hidden />
            Go Offline
          </>
        )}
      </button>
    </div>
  );
}
