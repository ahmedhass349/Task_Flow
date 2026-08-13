using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using taskflow.Data.Entities;
using taskflow.DTOs.Calendar;
using taskflow.Repositories.Interfaces;
using taskflow.Services.Interfaces;

namespace taskflow.Services
{
    public class CalendarService : ICalendarService
    {
        private readonly IGenericRepository<CalendarEvent> _calendarRepository;
        private readonly IMapper _mapper;
        private readonly IMirrorService _mirror;
        private readonly IUserRepository _userRepository;

        public CalendarService(IGenericRepository<CalendarEvent> calendarRepository, IMapper mapper, IMirrorService mirror, IUserRepository userRepository)
        {
            _calendarRepository = calendarRepository;
            _mapper = mapper;
            _mirror = mirror;
            _userRepository = userRepository;
        }

        public async Task<IEnumerable<CalendarEventDto>> GetEventsAsync(int userId, DateTime? from, DateTime? to)
        {
            // Fix #7: Filter dates in DB query instead of in-memory
            var query = _calendarRepository.Query().Where(e => e.OwnerId == userId);

            if (from.HasValue)
            {
                query = query.Where(e => e.EndAt >= from.Value);
            }

            if (to.HasValue)
            {
                query = query.Where(e => e.StartAt <= to.Value);
            }

            var events = await query.OrderBy(e => e.StartAt).ToListAsync();

            return _mapper.Map<IEnumerable<CalendarEventDto>>(events);
        }

        public async Task<CalendarEventDto> CreateEventAsync(int userId, CreateCalendarEventRequest request)
        {
            // Phase 2: look up owner email for cross-device MongoDB pull queries
            var owner = await _userRepository.GetByIdAsync(userId);

            var calendarEvent = new CalendarEvent
            {
                OwnerId = userId,
                OwnerEmail = owner?.Email,  // Phase 2
                Title = request.Title,
                Description = request.Description,
                StartAt = request.StartAt,
                EndAt = request.EndAt,
                Color = request.Color,
                MeetingLink = request.MeetingLink,
                CreatedAt = DateTime.UtcNow
            };

            await _calendarRepository.AddAsync(calendarEvent);
            await _calendarRepository.SaveChangesAsync();
            _mirror.Mirror("calendar_events", calendarEvent.Id, calendarEvent);

            return _mapper.Map<CalendarEventDto>(calendarEvent);
        }

        public async Task<CalendarEventDto> UpdateEventAsync(int userId, int eventId, UpdateCalendarEventRequest request)
        {
            var calendarEvent = await _calendarRepository.GetByIdAsync(eventId);
            if (calendarEvent == null)
                throw new KeyNotFoundException($"Calendar event with ID {eventId} not found.");

            // Ownership check (#2)
            if (calendarEvent.OwnerId != userId)
                throw new UnauthorizedAccessException("You do not have permission to update this event.");

            calendarEvent.Title = request.Title;
            calendarEvent.Description = request.Description;
            calendarEvent.StartAt = request.StartAt;
            calendarEvent.EndAt = request.EndAt;
            calendarEvent.Color = request.Color;
            calendarEvent.MeetingLink = request.MeetingLink;

            _calendarRepository.Update(calendarEvent);
            await _calendarRepository.SaveChangesAsync();
            _mirror.Mirror("calendar_events", calendarEvent.Id, calendarEvent);

            return _mapper.Map<CalendarEventDto>(calendarEvent);
        }

        public async Task DeleteEventAsync(int userId, int eventId)
        {
            var calendarEvent = await _calendarRepository.GetByIdAsync(eventId);
            if (calendarEvent == null)
                throw new KeyNotFoundException($"Calendar event with ID {eventId} not found.");

            // Ownership check (#2)
            if (calendarEvent.OwnerId != userId)
                throw new UnauthorizedAccessException("You do not have permission to delete this event.");

            _calendarRepository.Remove(calendarEvent);
            await _calendarRepository.SaveChangesAsync();
            // Phase 2: use EraseSync(SyncId) because CalendarEvent is now ISyncableEntity
            // — its MongoDB _id is the SyncId GUID, not the integer PK.
            _mirror.EraseSync("calendar_events", calendarEvent.SyncId);
        }
    }
}
