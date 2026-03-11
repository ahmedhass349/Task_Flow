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
    <div style={{ width: 372, paddingTop: 24, paddingBottom: 24, paddingLeft: 24, paddingRight: 24, background: '#171717', boxShadow: '0px 0px 6px rgba(0,0,0,0.25)', borderRadius: 30, display: 'flex', flexDirection: 'column', gap: 18 }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: 'white', fontSize: 24, fontFamily: 'Poppins', fontWeight: '500', letterSpacing: 0.72 }}>Task Line</div>
        <div style={{ height: 34, padding: '0 14px', background: 'rgba(184,184,184,0.10)', borderRadius: 36, outline: '1px #616161 solid', outlineOffset: '-1px', display: 'flex', alignItems: 'center' }}>
          <span style={{ color: 'white', fontSize: 14, fontFamily: 'Poppins', fontWeight: '400', letterSpacing: 0.42 }}>{dateLabel}</span>
        </div>
      </div>

      {/* Scrollable 24-hour timeline */}
      <div
        ref={scrollRef}
        style={{ maxHeight: 360, overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.15) transparent' }}
      >
        <div style={{ width: '100%', height: TOTAL_HEIGHT, position: 'relative' }}>

          {/* Slot rows – label + dashed divider every 30 min */}
          {SLOTS.map((slot, i) => (
            <div
              key={i}
              style={{ position: 'absolute', top: i * SLOT_HEIGHT, left: 0, right: 0, height: SLOT_HEIGHT }}
            >
              {/* Time label (full hours only), vertically centred */}
              <div style={{ position: 'absolute', left: 0, top: 0, width: LABEL_WIDTH, height: SLOT_HEIGHT, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 8 }}>
                {slot.isFullHour && (
                  <span style={{ color: 'rgba(255,255,255,0.50)', fontSize: 12, fontFamily: 'Poppins', fontWeight: '400', letterSpacing: 0.36 }}>
                    {String(slot.hour).padStart(2, '0')}:00
                  </span>
                )}
              </div>
              {/* Dashed line at vertical centre of slot */}
              <div style={{
                position: 'absolute',
                left: LABEL_WIDTH,
                top: '50%',
                right: 0,
                height: 0,
                borderTop: slot.isFullHour
                  ? '1px dashed rgba(255,255,255,0.22)'
                  : '1px dashed rgba(255,255,255,0.09)',
              }} />
            </div>
          ))}

          {/* Current-time indicator (today only) */}
          {nowY !== null && (
            <div style={{ position: 'absolute', top: nowY, left: 0, right: 0, display: 'flex', alignItems: 'center', zIndex: 10, pointerEvents: 'none' }}>
              <div style={{ width: LABEL_WIDTH, display: 'flex', justifyContent: 'flex-end', paddingRight: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#60B8FF', flexShrink: 0 }} />
              </div>
              <div style={{ flex: 1, borderTop: '1.5px solid #60B8FF' }} />
            </div>
          )}


        </div>
      </div>
    </div>
  );
}
