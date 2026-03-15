import type React from "react";
import { CheckSquare, AtSign, FolderKanban, Clock } from "lucide-react";

export interface NotificationItem {
  id: number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
}

export const SEED_NOTIFICATIONS: NotificationItem[] = [
  { id: 1, icon: CheckSquare,  iconBg: "bg-green-100",  iconColor: "text-green-600",  title: "Task completed",      body: 'Sarah Chen completed "Design system update"',       time: "2 min ago",  unread: true  },
  { id: 2, icon: AtSign,       iconBg: "bg-blue-100",   iconColor: "text-blue-600",   title: "You were mentioned",  body: 'Mike Johnson mentioned you in "API Service"',        time: "14 min ago", unread: true  },
  { id: 3, icon: FolderKanban, iconBg: "bg-purple-100", iconColor: "text-purple-600", title: "New project created", body: 'Alex Kim created project "Mobile Redesign"',         time: "1 hr ago",   unread: true  },
  { id: 4, icon: Clock,        iconBg: "bg-orange-100", iconColor: "text-orange-600", title: "Deadline tomorrow",   body: 'Task "Fix checkout flow" is due tomorrow',           time: "3 hr ago",   unread: false },
  { id: 5, icon: CheckSquare,  iconBg: "bg-green-100",  iconColor: "text-green-600",  title: "Task assigned",       body: 'Emily Rodriguez assigned "Write unit tests" to you', time: "Yesterday",  unread: false },
];
