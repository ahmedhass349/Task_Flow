import { useEffect, useRef } from 'react';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Height in px for each 30-minute slot */
const SLOT_HEIGHT = 50;
/** Width reserved for the time labels on the left */
const LABEL_WIDTH = 50;

/** 48 half-hour slots: 00:00, 00:30, 01:00 … 23:30 */
const SLOTS = Array.from({ length: 48 }, (_, i) => ({
  hour: Math.floor(i / 2),
  min: i % 2 === 0 ? 0 : 30,
  isFullHour: i % 2 === 0,
}));

const TOTAL_HEIGHT = SLOTS.length * SLOT_HEIGHT; // 48 × 50 = 2400 px

/** Convert a clock time to a pixel offset from the top of the timeline */
const timeToY = (hour: number, min = 0) => (hour * 2 + min / 30) * SLOT_HEIGHT;

interface TaskLineWidgetProps {
  year: number;
  month: number;
  selectedDay: number;
}

export default function TaskLineWidget({ year, month, selectedDay }: TaskLineWidgetProps) {
  const dateLabel = `${selectedDay} ${MONTH_NAMES[month]} ${year}`;
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to 7:30 AM whenever the selected date changes so the demo meetings are visible
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = timeToY(7, 30);
    }
  }, [year, month, selectedDay]);

  // Show a "now" line only when the selected date is today
  const now = new Date();
  const isToday =
    now.getFullYear() === year &&
    now.getMonth() === month &&
    now.getDate() === selectedDay;
  const nowY = isToday ? timeToY(now.getHours(), now.getMinutes()) : null;

  return (
    <div className="w-[372px] p-6 bg-[#171717] shadow-[0_0_6px_rgba(0,0,0,0.25)] rounded-[30px] flex flex-col gap-[18px]">

      {/* Header */}
      <div className="flex justify-between items-center">
        <span className="text-white text-2xl font-['Poppins'] font-medium tracking-[0.72px]">
          Task Line
        </span>
        <div className="h-[34px] px-3.5 bg-white/[0.10] rounded-[36px] outline outline-1 outline-offset-[-1px] outline-[#616161] flex items-center">
          <span className="text-white text-sm font-['Poppins'] font-normal tracking-[0.42px]">
            {dateLabel}
          </span>
        </div>
      </div>

      {/* Scrollable 24-hour timeline */}
      <div
        ref={scrollRef}
        className="max-h-[360px] overflow-y-auto"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.15) transparent' }}
      >
        <div className="w-full relative" style={{ height: TOTAL_HEIGHT }}>

          {/* Slot rows – label + dashed divider every 30 min */}
          {SLOTS.map((slot, i) => (
            <div
              key={i}
              className="absolute left-0 right-0"
              style={{ top: i * SLOT_HEIGHT, height: SLOT_HEIGHT }}
            >
              {/* Time label (full hours only), vertically centred */}
              <div
                className="absolute left-0 top-0 flex items-center justify-end pr-2"
                style={{ width: LABEL_WIDTH, height: SLOT_HEIGHT }}
              >
                {slot.isFullHour && (
                  <span className="text-white/50 text-xs font-['Poppins'] font-normal tracking-[0.36px]">
                    {String(slot.hour).padStart(2, '0')}:00
                  </span>
                )}
              </div>
              {/* Dashed line at vertical centre of slot */}
              <div
                className={`absolute top-1/2 right-0 h-0 ${
                  slot.isFullHour
                    ? 'border-t border-dashed border-white/[0.22]'
                    : 'border-t border-dashed border-white/[0.09]'
                }`}
                style={{ left: LABEL_WIDTH }}
              />
            </div>
          ))}

          {/* Current-time indicator (today only) */}
          {nowY !== null && (
            <div
              className="absolute left-0 right-0 flex items-center z-10 pointer-events-none"
              style={{ top: nowY }}
            >
              <div className="flex justify-end pr-1" style={{ width: LABEL_WIDTH }}>
                <div className="w-2 h-2 rounded-full bg-[#60B8FF] shrink-0" />
              </div>
              <div className="flex-1 border-t-[1.5px] border-solid border-[#60B8FF]" />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
