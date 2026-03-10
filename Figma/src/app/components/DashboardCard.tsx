import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  icon?: LucideIcon;
  action?: {
    label: string;
    onClick: () => void;
  };
  emptyState?: {
    icon: LucideIcon;
    message: string;
    action?: {
      label: string;
      onClick: () => void;
    };
  };
  children?: React.ReactNode;
}

export default function DashboardCard({ title, icon: Icon, action, emptyState, children }: DashboardCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="size-5 text-gray-600" />}
          <h2 className="font-semibold text-gray-900">{title}</h2>
        </div>
        {action && (
          <button
            onClick={action.onClick}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {action.label}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {emptyState && !children ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="size-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <emptyState.icon className="size-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-4">{emptyState.message}</p>
            {emptyState.action && (
              <button
                onClick={emptyState.action.onClick}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {emptyState.action.label}
              </button>
            )}
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}