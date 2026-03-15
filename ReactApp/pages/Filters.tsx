import { useState, useEffect } from "react";
import { Filter, Plus, Clock, Calendar, Users, Tag } from "lucide-react";
import Sidebar from "../Components/Sidebar";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import DashboardCard from "../Components/DashboardCard";
import TaskItem from "../Components/TaskItem";
import { PageLoading, PageError, PageEmpty } from "../Components/PageState";

interface SavedFilter {
  id: string;
  name: string;
  description: string;
  taskCount: number;
  icon: "filter" | "calendar" | "users" | "clock" | "tag";
  colorScheme: "red" | "orange" | "purple" | "blue" | "green";
}

interface FilterTask {
  title: string;
  project: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
}

// ── Seed data (will be replaced by API call) ─────────────────────────────

const SEED_FILTERS: SavedFilter[] = [
  { id: "1", name: "High Priority", description: "All high priority tasks across projects", taskCount: 12, icon: "filter", colorScheme: "red" },
  { id: "2", name: "Due This Week", description: "Tasks with deadlines in the next 7 days", taskCount: 8, icon: "calendar", colorScheme: "orange" },
  { id: "3", name: "Unassigned", description: "Tasks without an assigned team member", taskCount: 5, icon: "users", colorScheme: "purple" },
  { id: "4", name: "Overdue", description: "Tasks that missed their deadline", taskCount: 3, icon: "clock", colorScheme: "red" },
  { id: "5", name: "Design Tasks", description: 'All tasks tagged with "design"', taskCount: 18, icon: "tag", colorScheme: "blue" },
  { id: "6", name: "Development", description: 'All tasks tagged with "development"', taskCount: 24, icon: "tag", colorScheme: "green" },
];

const SEED_FILTER_TASKS: FilterTask[] = [
  { title: "Fix critical bug in payment processing", project: "E-commerce", dueDate: "Mar 08", priority: "high" },
  { title: "Design new landing page", project: "Marketing Site", dueDate: "Today", priority: "high" },
  { title: "Implement authentication flow", project: "User Service", dueDate: "Mar 11", priority: "high" },
  { title: "Complete security audit", project: "API Service", dueDate: "Mar 09", priority: "high" },
  { title: "Design mobile mockups", project: "Mobile App", dueDate: "Mar 15", priority: "high" },
];

const ICON_MAP = {
  filter: Filter,
  calendar: Calendar,
  users: Users,
  clock: Clock,
  tag: Tag,
};

const COLOR_MAP = {
  red:    { iconBg: "bg-red-100",    iconText: "text-red-600",    badgeBg: "bg-red-100",    badgeText: "text-red-700"    },
  orange: { iconBg: "bg-orange-100", iconText: "text-orange-600", badgeBg: "bg-orange-100", badgeText: "text-orange-700" },
  purple: { iconBg: "bg-purple-100", iconText: "text-purple-600", badgeBg: "bg-purple-100", badgeText: "text-purple-700" },
  blue:   { iconBg: "bg-blue-100",   iconText: "text-blue-600",   badgeBg: "bg-blue-100",   badgeText: "text-blue-700"   },
  green:  { iconBg: "bg-green-100",  iconText: "text-green-600",  badgeBg: "bg-green-100",  badgeText: "text-green-700"  },
};

export default function Filters() {
  const [filters, setFilters] = useState<SavedFilter[]>([]);
  const [filterTasks, setFilterTasks] = useState<FilterTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Replace with actual API call
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    const timer = setTimeout(() => {
      if (!cancelled) {
        setFilters(SEED_FILTERS);
        setFilterTasks(SEED_FILTER_TASKS);
        setIsLoading(false);
      }
    }, 0);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    setTimeout(() => {
      setFilters(SEED_FILTERS);
      setFilterTasks(SEED_FILTER_TASKS);
      setIsLoading(false);
    }, 0);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Filters</h1>
                <p className="text-gray-600 mt-1">Save and manage custom task filters</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                <Plus className="size-4" />
                <span>Create Filter</span>
              </button>
            </div>

            {/* Loading / Error / Empty */}
            {isLoading && <PageLoading message="Loading filters..." />}
            {error && <PageError message={error} onRetry={handleRetry} />}
            {!isLoading && !error && filters.length === 0 && (
              <PageEmpty
                icon={Filter}
                title="No saved filters"
                description="Create custom filters to quickly find the tasks that matter most."
                action={{ label: "Create Filter", onClick: () => {} }}
              />
            )}

            {!isLoading && !error && filters.length > 0 && (
              <>
                {/* Saved Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filters.map((filter) => {
                    const IconComp = ICON_MAP[filter.icon];
                    const colors = COLOR_MAP[filter.colorScheme];
                    return (
                      <div
                        key={filter.id}
                        className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                      >
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className={`${colors.iconBg} p-3 rounded-lg`}>
                              <IconComp className={`size-6 ${colors.iconText}`} />
                            </div>
                            <span className={`${colors.badgeBg} ${colors.badgeText} text-xs font-medium px-2 py-1 rounded`}>
                              {filter.taskCount} tasks
                            </span>
                          </div>
                          <h3 className="font-semibold text-gray-900 text-lg mb-2">{filter.name}</h3>
                          <p className="text-sm text-gray-600">{filter.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Filter Results */}
                <DashboardCard
                  title="High Priority Tasks"
                  icon={Filter}
                  action={{ label: "Clear filter", onClick: () => {} }}
                >
                  <div className="space-y-1">
                    {filterTasks.map((task, idx) => (
                      <TaskItem
                        key={idx}
                        title={task.title}
                        project={task.project}
                        dueDate={task.dueDate}
                        priority={task.priority}
                      />
                    ))}
                  </div>
                </DashboardCard>
              </>
            )}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
