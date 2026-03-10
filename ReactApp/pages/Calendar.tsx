import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import { useState } from "react";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const events = [
    { date: 10, title: "Design Review", time: "10:00 AM", color: "bg-blue-500" },
    { date: 10, title: "Team Standup", time: "2:00 PM", color: "bg-green-500" },
    { date: 12, title: "Client Meeting", time: "3:00 PM", color: "bg-purple-500" },
    { date: 15, title: "Sprint Planning", time: "9:00 AM", color: "bg-orange-500" },
    { date: 18, title: "Product Demo", time: "1:00 PM", color: "bg-pink-500" },
  ];

  const getEventsForDay = (day: number) => {
    return events.filter(event => event.date === day);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Page Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
              <p className="text-gray-600 mt-1">View and manage your schedule</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Calendar */}
              <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={previousMonth}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="size-5" />
                    </button>
                    <button
                      onClick={nextMonth}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronRight className="size-5" />
                    </button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {/* Day Headers */}
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                      {day}
                    </div>
                  ))}

                  {/* Empty cells for days before month starts */}
                  {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                    <div key={`empty-${index}`} className="aspect-square" />
                  ))}

                  {/* Calendar days */}
                  {Array.from({ length: daysInMonth }).map((_, index) => {
                    const day = index + 1;
                    const dayEvents = getEventsForDay(day);
                    const isToday = 
                      day === new Date().getDate() &&
                      currentDate.getMonth() === new Date().getMonth() &&
                      currentDate.getFullYear() === new Date().getFullYear();

                    return (
                      <div
                        key={day}
                        className={`aspect-square border border-gray-200 rounded-lg p-2 hover:bg-gray-50 cursor-pointer transition-colors ${
                          isToday ? "border-blue-500 bg-blue-50" : ""
                        }`}
                      >
                        <div className={`text-sm font-medium ${isToday ? "text-blue-600" : "text-gray-900"}`}>
                          {day}
                        </div>
                        <div className="mt-1 space-y-1">
                          {dayEvents.map((event, idx) => (
                            <div
                              key={idx}
                              className={`${event.color} h-1.5 rounded-full`}
                              title={`${event.title} - ${event.time}`}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="border-b border-gray-200 px-6 py-4 flex items-center gap-2">
                  <CalendarIcon className="size-5 text-gray-600" />
                  <h2 className="font-semibold text-gray-900">Upcoming Events</h2>
                </div>
                <div className="p-6 space-y-4">
                  {events.map((event, index) => (
                    <div key={index} className="flex gap-3">
                      <div className={`${event.color} size-10 rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <span className="text-white font-semibold text-sm">{event.date}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900">{event.title}</p>
                        <p className="text-sm text-gray-600">{event.time}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {monthNames[currentDate.getMonth()]} {event.date}, {currentDate.getFullYear()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Today's Tasks */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Today's Schedule</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-600 w-20">10:00 AM</div>
                  <div className="h-8 w-1 bg-blue-500 rounded-full" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Design Review</p>
                    <p className="text-sm text-gray-600">Marketing Site Project</p>
                  </div>
                  <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded">
                    In 2 hours
                  </span>
                </div>

                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-600 w-20">2:00 PM</div>
                  <div className="h-8 w-1 bg-green-500 rounded-full" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Team Standup</p>
                    <p className="text-sm text-gray-600">Daily sync meeting</p>
                  </div>
                  <span className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded">
                    Upcoming
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
