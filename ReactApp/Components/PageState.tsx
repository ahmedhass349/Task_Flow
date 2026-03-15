// ── Reusable page state components ───────────────────────────────────────
//
// Provides consistent loading, error, and empty states across all pages.
// Usage:
//   <PageLoading />              — full-area spinner
//   <PageError message="..." onRetry={fn} />  — error banner with retry
//   <PageEmpty icon={Inbox} title="..." description="..." action={...} />

import { AlertCircle, type LucideIcon } from "lucide-react";

// ── Loading ──────────────────────────────────────────────────────────────

export function PageLoading({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-gray-500">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500 mb-4" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

// ── Error ────────────────────────────────────────────────────────────────

interface PageErrorProps {
  message?: string;
  onRetry?: () => void;
}

export function PageError({
  message = "Something went wrong. Please try again.",
  onRetry,
}: PageErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-gray-600">
      <div className="bg-red-100 p-4 rounded-full mb-4">
        <AlertCircle className="size-8 text-red-500" />
      </div>
      <p className="text-sm font-medium text-gray-900 mb-1">Error</p>
      <p className="text-sm text-gray-600 mb-4 max-w-md text-center">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  );
}

// ── Empty ────────────────────────────────────────────────────────────────

interface PageEmptyProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function PageEmpty({ icon: Icon, title, description, action }: PageEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-gray-500">
      {Icon && (
        <div className="bg-gray-100 p-4 rounded-full mb-4">
          <Icon className="size-8 text-gray-400" />
        </div>
      )}
      <p className="text-sm font-medium text-gray-900 mb-1">{title}</p>
      {description && (
        <p className="text-sm text-gray-500 mb-4 max-w-md text-center">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
