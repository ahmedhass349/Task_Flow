import { ChevronLeft, ChevronRight } from 'lucide-react';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface CalendarWidgetProps {
  year: number;
  month: number;
  selectedDay: number;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
  onDaySelect: (day: number) => void;
}

export default function CalendarWidget({ year, month, selectedDay, onYearChange, onMonthChange, onDaySelect }: CalendarWidgetProps) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7; // Mon=0, Sun=6

  const goToPrevMonth = () => {
    if (month === 0) { onYearChange(year - 1); onMonthChange(11); }
    else onMonthChange(month - 1);
    onDaySelect(1);
  };

  const goToNextMonth = () => {
    if (month === 11) { onYearChange(year + 1); onMonthChange(0); }
    else onMonthChange(month + 1);
    onDaySelect(1);
  };

  // Build 42-cell grid (6 rows × 7 cols)
  const cells: { day: number; type: 'prev' | 'current' | 'next' }[] = [];
  for (let i = firstWeekday - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, type: 'prev' });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, type: 'current' });
  }
  let nd = 1;
  while (cells.length < 42) cells.push({ day: nd++, type: 'next' });

  return (
    <div className="w-[372px] p-6 bg-[#171717] shadow-[0_0_6px_rgba(0,0,0,0.25)] rounded-[30px] flex flex-col gap-3.5">

      {/* Month navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={goToPrevMonth}
          className="text-white flex items-center cursor-pointer"
          aria-label="Previous month"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="text-white text-xl font-['Poppins'] font-medium tracking-[0.6px]">
          {MONTH_NAMES[month]} {selectedDay}, {year}
        </span>
        <button
          onClick={goToNextMonth}
          className="text-white flex items-center cursor-pointer"
          aria-label="Next month"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Year navigation */}
      <div className="flex justify-center items-center gap-4">
        <button
          onClick={() => onYearChange(year - 1)}
          className="text-white/60 flex items-center cursor-pointer"
          aria-label="Previous year"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-white/60 text-[13px] font-['Poppins'] font-normal tracking-[0.39px]">
          {year}
        </span>
        <button
          onClick={() => onYearChange(year + 1)}
          className="text-white/60 flex items-center cursor-pointer"
          aria-label="Next year"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7">
        {DAY_LABELS.map(d => (
          <div
            key={d}
            className="h-9 flex items-center justify-center text-white text-[13px] font-['Poppins'] font-normal tracking-[0.39px]"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Date cells */}
      <div className="grid grid-cols-7 gap-y-1" role="grid" aria-label="Calendar dates">
        {cells.map((cell, i) => {
          const isSelected = cell.type === 'current' && cell.day === selectedDay;
          const isOther = cell.type !== 'current';

          const innerClasses = [
            'w-9 h-9 flex items-center justify-center rounded-full text-sm font-[\'Poppins\'] font-normal tracking-[0.42px] transition-colors duration-150',
            isSelected ? 'bg-[#60B8FF] text-white' : '',
            !isSelected && isOther ? 'text-white/30' : '',
            !isSelected && !isOther ? 'text-white hover:bg-white/10' : '',
          ].join(' ');

          if (isOther) {
            return (
              <div key={i} className="h-9 flex items-center justify-center" aria-hidden="true">
                <div className={innerClasses}>{cell.day}</div>
              </div>
            );
          }

          return (
            <button
              key={i}
              type="button"
              onClick={() => onDaySelect(cell.day)}
              className="h-9 flex items-center justify-center cursor-pointer bg-transparent border-0 p-0"
              aria-label={`${MONTH_NAMES[month]} ${cell.day}`}
              aria-pressed={isSelected}
            >
              <div className={innerClasses}>{cell.day}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
