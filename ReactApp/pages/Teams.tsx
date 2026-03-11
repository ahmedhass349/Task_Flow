import { Users, Mail, MoreVertical } from "lucide-react";
import Sidebar from "../Components/Sidebar";
import Footer from "../Components/Footer";
import Header from "../Components/Header";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  email: string;
  status: "online" | "away" | "offline";
  tasksCompleted: number;
  tasksInProgress: number;
}

export default function Teams() {
  const teamMembers: TeamMember[] = [
    {
      id: "1",
      name: "Sarah Chen",
      role: "Product Designer",
      avatar: "SC",
      email: "sarah.chen@company.com",
      status: "online",
      tasksCompleted: 24,
      tasksInProgress: 3,
    },
    {
      id: "2",
      name: "Mike Johnson",
      role: "Frontend Developer",
      avatar: "MJ",
      email: "mike.johnson@company.com",
      status: "online",
      tasksCompleted: 18,
      tasksInProgress: 5,
    },
    {
      id: "3",
      name: "Alex Kim",
      role: "Backend Developer",
      avatar: "AK",
      email: "alex.kim@company.com",
      status: "away",
      tasksCompleted: 32,
      tasksInProgress: 2,
    },
    {
      id: "4",
      name: "Emily Rodriguez",
      role: "UX Researcher",
      avatar: "ER",
      email: "emily.rodriguez@company.com",
      status: "online",
      tasksCompleted: 15,
      tasksInProgress: 4,
    },
    {
      id: "5",
      name: "David Lee",
      role: "DevOps Engineer",
      avatar: "DL",
      email: "david.lee@company.com",
      status: "offline",
      tasksCompleted: 28,
      tasksInProgress: 1,
    },
    {
      id: "6",
      name: "Jessica Taylor",
      role: "Product Manager",
      avatar: "JT",
      email: "jessica.taylor@company.com",
      status: "online",
      tasksCompleted: 20,
      tasksInProgress: 6,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  const getAvatarColor = (index: number) => {
    const colors = [
      "bg-blue-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-sky-500",
      "bg-green-500",
      "bg-orange-500",
    ];
    return colors[index % colors.length];
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
                <h1 className="text-3xl font-bold text-gray-900">Teams</h1>
                <p className="text-gray-600 mt-1">Manage your team members and their workload</p>
              </div>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Invite Members
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Users className="size-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Members</p>
                    <p className="text-2xl font-bold text-gray-900">{teamMembers.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <div className="size-3 bg-green-500 rounded-full" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Online Now</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {teamMembers.filter((m) => m.status === "online").length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <span className="text-xl font-bold text-purple-600">
                      {teamMembers.reduce((acc, m) => acc + m.tasksInProgress, 0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Active Tasks</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {teamMembers.reduce((acc, m) => acc + m.tasksCompleted, 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Members Grid */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="font-semibold text-gray-900">Team Members</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {teamMembers.map((member, index) => (
                  <div
                    key={member.id}
                    className="p-6 flex items-center gap-6 hover:bg-gray-50 transition-colors"
                  >
                    {/* Avatar */}
                    <div className="relative">
                      <div
                        className={`${getAvatarColor(index)} size-12 rounded-full flex items-center justify-center`}
                      >
                        <span className="text-white font-semibold">{member.avatar}</span>
                      </div>
                      <div
                        className={`absolute bottom-0 right-0 ${getStatusColor(member.status)} size-3 border-2 border-white rounded-full`}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900">{member.name}</h3>
                      <p className="text-sm text-gray-600">{member.role}</p>
                      <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                        <Mail className="size-3" />
                        <span className="truncate">{member.email}</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-8">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{member.tasksCompleted}</p>
                        <p className="text-xs text-gray-600">Completed</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{member.tasksInProgress}</p>
                        <p className="text-xs text-gray-600">In Progress</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical className="size-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
