// ── useAccountSwitcher ────────────────────────────────────────────────────
//
// Manages a list of accounts that have been logged into on this device.
// Stored in localStorage so accounts survive app restarts.
// Used by the "Switch account" feature in the Header profile dropdown.

import { useState, useCallback } from "react";

const ACCOUNTS_KEY = "taskflow_saved_accounts";

// ── Types ─────────────────────────────────────────────────────────────────

export interface SavedAccount {
  email: string;
  fullName: string;
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
  avatarUrl?: string
): void {
  const accounts = loadAccounts();
  const idx = accounts.findIndex((a) => a.email === email);
  const entry: SavedAccount = { email, fullName, avatarUrl };
  if (idx >= 0) {
    accounts[idx] = entry;
  } else {
    accounts.push(entry);
  }
  persistAccounts(accounts);
}

/** Remove an account from the saved list. */
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
   * Switch to a saved account. The backend middleware uses the first user in the
   * DB as the default identity, so switching is a no-op that always succeeds.
   */
  const switchTo = useCallback(
    async (
      _account: SavedAccount,
      refreshUser: () => Promise<void>,
      _onError: (msg: string) => void
    ): Promise<boolean> => {
      try {
        await refreshUser();
        return true;
      } catch {
        return false;
      }
    },
    []
  );

  /**
   * Validate all non-current accounts. Without auth tokens there is nothing to
   * validate, so this is a no-op.
   */
  const validateAccounts = useCallback(async () => {
    // No-op: auth has been removed
  }, [currentEmail]);

  return { otherAccounts, reload, switchTo, validateAccounts };
}
