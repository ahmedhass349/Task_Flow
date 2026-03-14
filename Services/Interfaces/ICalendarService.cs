using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using taskflow.DTOs.Calendar;

namespace taskflow.Services.Interfaces
{
    public interface ICalendarService
    {
        Task<IEnumerable<CalendarEventDto>> GetEventsAsync(int userId, DateTime? from, DateTime? to);
        Task<CalendarEventDto> CreateEventAsync(int userId, CreateCalendarEventRequest request);
        Task<CalendarEventDto> UpdateEventAsync(int userId, int eventId, UpdateCalendarEventRequest request);
        Task DeleteEventAsync(int userId, int eventId);
    }
}
