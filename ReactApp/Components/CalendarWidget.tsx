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
    <div style={{ width: 372, paddingTop: 24, paddingBottom: 24, paddingLeft: 24, paddingRight: 24, background: '#171717', boxShadow: '0px 0px 6px rgba(0,0,0,0.25)', borderRadius: 30, display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Month navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div onClick={goToPrevMonth} style={{ cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center' }}>
          <ChevronLeft size={20} />
        </div>
        <div style={{ color: 'white', fontSize: 20, fontFamily: 'Poppins', fontWeight: '500', letterSpacing: 0.60, wordWrap: 'break-word' }}>
          {MONTH_NAMES[month]} {selectedDay}, {year}
        </div>
        <div onClick={goToNextMonth} style={{ cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center' }}>
          <ChevronRight size={20} />
        </div>
      </div>

      {/* Year navigation */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16 }}>
        <div onClick={() => onYearChange(year - 1)} style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.60)', display: 'flex', alignItems: 'center' }}>
          <ChevronLeft size={16} />
        </div>
        <div style={{ color: 'rgba(255,255,255,0.60)', fontSize: 13, fontFamily: 'Poppins', fontWeight: '400', letterSpacing: 0.39 }}>
          {year}
        </div>
        <div onClick={() => onYearChange(year + 1)} style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.60)', display: 'flex', alignItems: 'center' }}>
          <ChevronRight size={16} />
        </div>
      </div>

      {/* Day-of-week headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {DAY_LABELS.map(d => (
          <div key={d} style={{ height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 13, fontFamily: 'Poppins', fontWeight: '400', letterSpacing: 0.39 }}>
            {d}
          </div>
        ))}
      </div>

      {/* Date cells */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', rowGap: 4 }}>
        {cells.map((cell, i) => {
          const isSelected = cell.type === 'current' && cell.day === selectedDay;
          const isOther = cell.type !== 'current';
          return (
            <div
              key={i}
              onClick={() => { if (!isOther) onDaySelect(cell.day); }}
              style={{
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isOther ? 'default' : 'pointer',
              }}
            >
              <div style={{
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                background: isSelected ? '#60B8FF' : 'transparent',
                color: isSelected ? 'white' : isOther ? 'rgba(255,255,255,0.30)' : 'white',
                fontSize: 14,
                fontFamily: 'Poppins',
                fontWeight: '400',
                letterSpacing: 0.42,
                transition: 'background 0.15s',
              }}>
                {cell.day}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}