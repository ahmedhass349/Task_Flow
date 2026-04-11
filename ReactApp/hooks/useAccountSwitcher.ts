// ── useAccountSwitcher ────────────────────────────────────────────────────
//
// Manages a list of accounts that have been logged into on this device.
// Stored in localStorage so accounts survive app restarts.
// Used by the "Switch account" feature in the Header profile dropdown.

import { useState, useCallback } from "react";
import { setAuthToken } from "../services/api";

const ACCOUNTS_KEY = "taskflow_saved_accounts";

// ── Types ─────────────────────────────────────────────────────────────────

export interface SavedAccount {
  email: string;
  fullName: string;
  token: string;
  avatarUrl?: string;
}

// ── Storage helpers (module-level, no React) ──────────────────────────────

function loadAccounts(): SavedAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    return raw ? (JSON.parse(raw) as SavedAccount[]) : [];
  } catch {
    return [];
  }
}

function persistAccounts(accounts: SavedAccount[]): void {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

/** Upsert an account into the saved list. Call after every successful login/signup. */
export function saveAccount(
  email: string,
  fullName: string,
  token: string,
  avatarUrl?: string
): void {
  const accounts = loadAccounts();
  const idx = accounts.findIndex((a) => a.email === email);
  const entry: SavedAccount = { email, fullName, token, avatarUrl };
  if (idx >= 0) {
    accounts[idx] = entry;
  } else {
    accounts.push(entry);
  }
  persistAccounts(accounts);
}

/** Remove an account from the saved list (e.g. after a session expires). */
export function removeAccount(email: string): void {
  persistAccounts(loadAccounts().filter((a) => a.email !== email));
}

// ── Hook ──────────────────────────────────────────────────────────────────

export function useAccountSwitcher(currentEmail: string | undefined) {
  const [accounts, setAccounts] = useState<SavedAccount[]>(loadAccounts);

  /** Re-read from storage (call after a new login adds an account). */
  const reload = useCallback(() => {
    setAccounts(loadAccounts());
  }, []);

  /** All saved accounts except the currently logged-in one. */
  const otherAccounts = accounts.filter((a) => a.email !== currentEmail);

  /**
   * Switch to a saved account.
   * Sets the stored JWT, calls /api/auth/me via `refreshUser`, and on success
   * the AuthContext user will update automatically.
   * On failure (expired token) the account is removed and `onError` is called.
   */
  const switchTo = useCallback(
    async (
      account: SavedAccount,
      refreshUser: () => Promise<void>,
      onError: (msg: string) => void
    ): Promise<boolean> => {
      setAuthToken(account.token, true);
      try {
        await refreshUser();
        return true;
      } catch {
        // Token expired — remove stale entry
        removeAccount(account.email);
        setAccounts(loadAccounts());
        onError(`Session expired for ${account.fullName}. Please log in again.`);
        return false;
      }
    },
    []
  );

  return { otherAccounts, reload, switchTo };
}
