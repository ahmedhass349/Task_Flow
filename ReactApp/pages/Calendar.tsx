import { CSSProperties } from "react";

type DayCell = {
  day: string;
  color: string;
  dots: string[];
  selected?: boolean;
  inMonth?: boolean;
};

type AgendaItem = {
  dot: string;
  time: string;
  title: string;
  link?: string;
};

type DaySection = {
  label: string;
  date: string;
  weather: string;
  weatherType: "sun" | "cloud";
  banners?: { text: string; bg: string }[];
  items?: AgendaItem[];
};

type EventCard = {
  left: number;
  top: number;
  width: number;
  height: number;
  bg: string;
  border: string;
  text: string;
  dotBg: string;
  dotFg: string;
  time: string;
  title: string;
  showDotIcon?: boolean;
};

const weekdayLabels = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const miniCalendarRows: DayCell[][] = [
  [
    { day: "31", color: "#71717A", dots: [] },
    { day: "1", color: "white", dots: ["#3B82F6", "#A855F7", "#2DD4BF"] },
    { day: "2", color: "white", dots: ["#3B82F6", "#A855F7", "#2DD4BF"] },
    { day: "3", color: "white", dots: ["#3B82F6", "#A855F7", "#2DD4BF"] },
    { day: "4", color: "white", dots: ["#3B82F6", "#A855F7", "#2DD4BF"] },
    { day: "5", color: "white", dots: ["#3B82F6", "#A855F7", "#2DD4BF"] },
    { day: "6", color: "white", dots: [] },
  ],
  [
    { day: "7", color: "white", dots: [] },
    { day: "8", color: "white", dots: ["#3B82F6", "#A855F7", "#2DD4BF"] },
    { day: "9", color: "white", dots: ["#3B82F6", "#A855F7", "#2DD4BF"] },
    { day: "10", color: "white", dots: ["#3B82F6", "#A855F7", "#2DD4BF"] },
    { day: "11", color: "white", dots: ["#2DD4BF"] },
    { day: "12", color: "white", dots: ["#3B82F6", "#A855F7", "#2DD4BF"] },
    { day: "13", color: "white", dots: [] },
  ],
  [
    { day: "14", color: "white", dots: ["#A855F7", "#2DD4BF"] },
    { day: "15", color: "white", dots: ["#A855F7"] },
    { day: "16", color: "white", dots: ["#3B82F6", "#A855F7", "#2DD4BF"] },
    { day: "17", color: "white", dots: ["#3B82F6", "#A855F7", "#2DD4BF"] },
    { day: "18", color: "white", dots: ["#3B82F6", "#A855F7", "#2DD4BF"] },
    { day: "19", color: "white", dots: ["#3B82F6", "#A855F7", "#2DD4BF"] },
    { day: "20", color: "white", dots: [] },
  ],
  [
    { day: "21", color: "white", dots: [] },
    { day: "22", color: "white", dots: ["#3B82F6", "#A855F7", "#2DD4BF"] },
    { day: "23", color: "white", dots: ["#3B82F6", "#2DD4BF"] },
    { day: "24", color: "white", dots: ["#3B82F6", "#A855F7", "#2DD4BF"] },
    { day: "25", color: "white", dots: ["#3B82F6", "#A855F7", "#2DD4BF"] },
    { day: "26", color: "white", dots: ["#3B82F6", "#A855F7", "#2DD4BF"] },
    { day: "27", color: "white", dots: ["white"], selected: true },
  ],
  [
    { day: "28", color: "white", dots: ["#3B82F6"] },
    { day: "1", color: "#71717A", dots: ["#A855F7", "#2DD4BF"], inMonth: false },
    { day: "2", color: "#71717A", dots: ["#A855F7"], inMonth: false },
    { day: "3", color: "#71717A", dots: ["#3B82F6", "#A855F7", "#2DD4BF"], inMonth: false },
    { day: "4", color: "#71717A", dots: ["#2DD4BF"], inMonth: false },
    { day: "5", color: "#71717A", dots: ["#3B82F6", "#2DD4BF"], inMonth: false },
    { day: "6", color: "#71717A", dots: [], inMonth: false },
  ],
  [
    { day: "7", color: "#71717A", dots: [], inMonth: false },
    { day: "8", color: "#71717A", dots: ["#3B82F6", "#A855F7", "#2DD4BF"], inMonth: false },
    { day: "9", color: "#71717A", dots: ["#3B82F6", "#2DD4BF"], inMonth: false },
    { day: "10", color: "#71717A", dots: ["#3B82F6", "#A855F7", "#2DD4BF"], inMonth: false },
    { day: "11", color: "#71717A", dots: ["#3B82F6", "#A855F7", "#2DD4BF"], inMonth: false },
    { day: "12", color: "#71717A", dots: ["#3B82F6", "#A855F7"], inMonth: false },
    { day: "13", color: "#71717A", dots: [], inMonth: false },
  ],
];

const agendaSections: DaySection[] = [
  {
    label: "TODAY",
    date: "2/27/2021",
    weather: "55º/40º",
    weatherType: "sun",
    banners: [{ text: "All-Hands Company Meeting", bg: "#A855F7" }],
    items: [
      { dot: "#3B82F6", time: "8:30 - 9:00 AM", title: "Monthly catch-up" },
      { dot: "#3B82F6", time: "8:30 - 9:00 AM", title: "Quarterly review", link: "https://zoom.us/i/1983475281" },
    ],
  },
  {
    label: "TOMORROW",
    date: "2/28/2021",
    weather: "55º/40º",
    weatherType: "sun",
    items: [
      { dot: "#EC4899", time: "8:30 - 9:00 AM", title: "Visit to discuss improvements", link: "https://zoom.us/i/1983475281" },
      { dot: "#3B82F6", time: "8:30 - 9:00 AM", title: "Presentation of new products and cost structure" },
    ],
  },
  {
    label: "MONDAY",
    date: "3/1/2021",
    weather: "55º/40º",
    weatherType: "cloud",
    items: [{ dot: "#EC4899", time: "8:30 - 9:00 AM", title: "City Sales Pitch", link: "https://zoom.us/i/1983475281" }],
  },
  {
    label: "TUESDAY",
    date: "3/2/2021",
    weather: "55º/40º",
    weatherType: "sun",
    items: [{ dot: "#FBBF24", time: "8:30 - 9:00 AM", title: "Visit to discuss improvements" }],
  },
  {
    label: "WEDNESDAY",
    date: "3/3/2021",
    weather: "55º/40º",
    weatherType: "cloud",
    items: [
      { dot: "#3B82F6", time: "8:30 - 9:00 AM", title: "Meeting to talk about Ross contract." },
      { dot: "#3B82F6", time: "8:30 - 9:00 AM", title: "Meeting to discuss the new proposal" },
    ],
  },
  {
    label: "THURSDAY",
    date: "3/4/2021",
    weather: "55º/40º",
    weatherType: "sun",
    items: [{ dot: "#EC4899", time: "8:30 - 9:00 AM", title: "Monthly catch-up", link: "https://zoom.us/i/1983475281" }],
  },
  {
    label: "FRIDAY",
    date: "3/5/2021",
    weather: "55º/40º",
    weatherType: "sun",
    items: [
      { dot: "#FBBF24", time: "8:30 - 9:00 AM", title: "Follow up proposal" },
      { dot: "#3B82F6", time: "8:30 - 9:00 AM", title: "City Sales Pitch" },
    ],
  },
  {
    label: "SATURDAY",
    date: "3/6/2021",
    weather: "55º/40º",
    weatherType: "sun",
    banners: [{ text: "Spring Break 2021!", bg: "#22C55E" }],
  },
  {
    label: "SUNDAY",
    date: "3/7/2021",
    weather: "55º/40º",
    weatherType: "sun",
    banners: [{ text: "Spring Break 2021!", bg: "#22C55E" }],
  },
  {
    label: "MONDAY",
    date: "3/8/2021",
    weather: "55º/40º",
    weatherType: "sun",
    banners: [{ text: "Spring Break 2021!", bg: "#22C55E" }],
    items: [
      { dot: "#3B82F6", time: "8:30 - 9:00 AM", title: "Meeting to talk about Ross contract." },
      { dot: "#3B82F6", time: "8:30 - 9:00 AM", title: "Meeting to talk about Ross contract." },
    ],
  },
  {
    label: "TUESDAY",
    date: "3/9/2021",
    weather: "55º/40º",
    weatherType: "sun",
    banners: [{ text: "Spring Break 2021!", bg: "#22C55E" }],
    items: [{ dot: "#3B82F6", time: "8:30 - 9:00 AM", title: "Quarterly review" }],
  },
];

const eventCards: EventCard[] = [
  { left: 509, top: 196, width: 143, height: 68, bg: "rgba(14, 165, 233, 0.10)", border: "#0EA5E9", text: "#0369A1", dotBg: "#0369A1", dotFg: "#E0F2FE", time: "8:00 AM", title: "Monday Wake-Up Hour", showDotIcon: true },
  { left: 509, top: 268, width: 143, height: 68, bg: "rgba(14, 165, 233, 0.10)", border: "#0EA5E9", text: "#0369A1", dotBg: "#0369A1", dotFg: "#E0F2FE", time: "9:00 AM", title: "All-Team Kickoff" },
  { left: 509, top: 340, width: 143, height: 68, bg: "rgba(14, 165, 233, 0.10)", border: "#0EA5E9", text: "#0369A1", dotBg: "#0369A1", dotFg: "#E0F2FE", time: "10:00 AM", title: "Financial Update", showDotIcon: true },
  { left: 509, top: 412, width: 143, height: 140, bg: "rgba(139, 92, 246, 0.10)", border: "#8B5CF6", text: "#6D28D9", dotBg: "#6D28D9", dotFg: "#EDE9FE", time: "11:00 AM", title: "New Employee Welcome Lunch!" },
  { left: 653, top: 628, width: 143, height: 142, bg: "rgba(14, 165, 233, 0.10)", border: "#0EA5E9", text: "#0369A1", dotBg: "#0369A1", dotFg: "#E0F2FE", time: "2:00 PM", title: "Concept Design Review II", showDotIcon: true },
  { left: 1087, top: 772, width: 143, height: 68, bg: "#FFE4E6", border: "#F43F5E", text: "#BE123C", dotBg: "#BE123C", dotFg: "#FFE4E6", time: "4:00 PM", title: "Happy Hour" },
  { left: 725, top: 268, width: 71, height: 68, bg: "rgba(16, 185, 129, 0.10)", border: "#10B981", text: "#047857", dotBg: "#047857", dotFg: "#D1FAE5", time: "9:00 AM", title: "Webinar: Figma..." },
  { left: 798, top: 268, width: 143, height: 68, bg: "rgba(14, 165, 233, 0.10)", border: "#0EA5E9", text: "#0369A1", dotBg: "#0369A1", dotFg: "#E0F2FE", time: "9:00 AM", title: "Coffee Chat", showDotIcon: true },
  { left: 943, top: 556, width: 143, height: 68, bg: "rgba(14, 165, 233, 0.10)", border: "#0EA5E9", text: "#0369A1", dotBg: "#0369A1", dotFg: "#E0F2FE", time: "1:00 PM", title: "Design Review", showDotIcon: true },
  { left: 1087, top: 628, width: 143, height: 68, bg: "rgba(245, 158, 11, 0.10)", border: "#F59E0B", text: "#B45309", dotBg: "#B45309", dotFg: "#FEF3C7", time: "2:00 PM", title: "1:1 with Heather", showDotIcon: true },
  { left: 653, top: 772, width: 143, height: 68, bg: "#FFE4E6", border: "#F43F5E", text: "#BE123C", dotBg: "#BE123C", dotFg: "#FFE4E6", time: "4:00 PM", title: "Design Team Happy Hour" },
];

const controlBtn = (active?: boolean): CSSProperties => ({
  paddingLeft: 16,
  paddingRight: 16,
  paddingTop: 4,
  paddingBottom: 4,
  borderRadius: 8,
  background: active ? "#DC2626" : "transparent",
  color: active ? "white" : "#71717A",
  fontSize: 14,
  fontFamily: "Inter",
  lineHeight: "20px",
});

export default function Calendar() {
  const hours = ["7 AM", "8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM"];

  return (
    <div style={{ width: 1440, height: 900, position: "relative", background: "white", overflow: "hidden", margin: "0 auto" }}>
      <div style={{ width: 300, height: 900, padding: 16, left: 0, top: 0, position: "absolute", background: "#18181B", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ width: 12, height: 12, background: "#ED6B60", borderRadius: 9999, border: "1px #D05147 solid" }} />
            <div style={{ width: 12, height: 12, background: "#F5C250", borderRadius: 9999, border: "1px #D6A343 solid" }} />
            <div style={{ width: 12, height: 12, background: "#62C656", borderRadius: 9999, border: "1px #52A842 solid" }} />
          </div>
          <div style={{ padding: "4px 6px", background: "rgba(255,255,255,0.10)", borderRadius: 8, color: "white" }}>▣</div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <div style={{ color: "white", fontSize: 30, fontFamily: "Inter", lineHeight: "40px" }}>February</div>
            <div style={{ color: "#EF4444", fontSize: 30, fontFamily: "Inter", lineHeight: "40px" }}>2021</div>
          </div>
          <div style={{ display: "flex", color: "white", gap: 10 }}>
            <div>◀</div>
            <div>▶</div>
          </div>
        </div>

        <div style={{ width: 268 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
            {weekdayLabels.map((day) => (
              <div key={day} style={{ padding: 4, color: "#71717A", fontSize: 10, fontWeight: 600, fontFamily: "Inter", textAlign: "center" }}>{day}</div>
            ))}
          </div>
          {miniCalendarRows.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
              {row.map((cell, cellIndex) => (
                <div key={`cell-${rowIndex}-${cellIndex}`} style={{ padding: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  {cell.selected ? (
                    <div style={{ padding: 4, background: "#3B82F6", borderRadius: 100, minWidth: 28, textAlign: "center", color: "white", fontSize: 11, fontWeight: 600, fontFamily: "Inter" }}>{cell.day}</div>
                  ) : (
                    <div style={{ color: cell.color, fontSize: 11, fontWeight: 600, fontFamily: "Inter" }}>{cell.day}</div>
                  )}
                  <div style={{ display: "flex", gap: 2, marginTop: 2, minHeight: 4 }}>
                    {cell.dots.map((dot, idx) => (
                      <div key={`dot-${idx}`} style={{ width: 4, height: 4, borderRadius: 9999, background: dot }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div style={{ width: 268, height: 552, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            {agendaSections.map((section, idx) => (
              <div key={`${section.label}-${idx}`} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    <div style={{ color: idx === 0 ? "#3B82F6" : "rgba(255,255,255,0.70)", fontSize: 13, fontFamily: "Inter", fontWeight: 700 }}>{section.label}</div>
                    <div style={{ color: idx === 0 ? "#3B82F6" : "rgba(255,255,255,0.70)", fontSize: 13, fontFamily: "Inter" }}>{section.date}</div>
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.70)", fontSize: 13, fontFamily: "Inter" }}>{section.weather}</div>
                </div>

                {section.banners?.map((banner, bannerIdx) => (
                  <div key={`banner-${bannerIdx}`} style={{ padding: "0 6px", borderRadius: 6, background: banner.bg, display: "inline-flex", color: "white", fontSize: 14, fontFamily: "Inter", lineHeight: "20px" }}>
                    {banner.text}
                  </div>
                ))}

                {section.items?.map((item, itemIdx) => (
                  <div key={`item-${itemIdx}`} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 12, height: 12, borderRadius: 9999, background: item.dot }} />
                      <div style={{ color: "#A1A1AA", fontSize: 11, fontFamily: "Inter", fontWeight: 600 }}>{item.time}</div>
                    </div>
                    <div style={{ paddingLeft: 20, color: "white", fontSize: 12, fontFamily: "Inter", lineHeight: "16px" }}>{item.title}</div>
                    {item.link && <div style={{ paddingLeft: 20, color: "#A1A1AA", fontSize: 11, fontFamily: "Inter" }}>{item.link}</div>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ width: 1140, height: 904, padding: 16, left: 300, top: 0, position: "absolute", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", gap: 1 }}>
            <div style={{ padding: 4, background: "#F4F4F5", borderTopLeftRadius: 6, borderBottomLeftRadius: 6 }}>◀</div>
            <div style={{ padding: "6px 16px", background: "#F4F4F5", fontFamily: "Inter", fontSize: 12 }}>Today</div>
            <div style={{ padding: 4, background: "#F4F4F5", borderTopRightRadius: 6, borderBottomRightRadius: 6 }}>▶</div>
          </div>
          <div style={{ display: "flex" }}>
            <div style={controlBtn(false)}>Day</div>
            <div style={controlBtn(true)}>Week</div>
            <div style={controlBtn(false)}>Month</div>
            <div style={controlBtn(false)}>Year</div>
          </div>
          <div style={{ width: 184, padding: 4, background: "#F4F4F5", borderRadius: 4, color: "#A1A1AA", fontSize: 12, fontFamily: "Inter" }}>Search</div>
        </div>

        <div style={{ height: 878, display: "flex", flexDirection: "column" }}>
          <div style={{ width: 1108, paddingLeft: 48, display: "flex", gap: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 144.57px)" }}>
              {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d, i) => {
                const date = 21 + i;
                const isThu = d === "THU";
                const isWeekend = d === "SUN" || d === "SAT";
                return (
                  <div key={d} style={{ padding: "4px 8px 16px", background: isThu ? "#EFF6FF" : isWeekend ? "#FAFAFA" : "white", boxShadow: "-1px -1px 0px #E0E0E0 inset" }}>
                    <div style={{ color: "#71717A", fontSize: 10, fontWeight: 700, fontFamily: "Inter", lineHeight: "12px" }}>{d}</div>
                    <div style={{ color: "black", fontSize: 22, fontFamily: "Inter", lineHeight: "32px" }}>{date}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ width: 48, color: "#71717A", fontSize: 12, fontFamily: "Inter", lineHeight: "16px" }}>EST<br />GMT-5</div>
          </div>

          {hours.map((hour) => (
            <div key={hour} style={{ width: 1156, display: "inline-flex", gap: 12 }}>
              <div style={{ width: 36, color: "#71717A", fontSize: 12, fontFamily: "Inter", lineHeight: "16px", display: "flex", alignItems: "center" }}>{hour}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 144.57px)" }}>
                {new Array(7).fill(0).map((_, colIdx) => {
                  const weekend = colIdx === 0 || colIdx === 6;
                  const thursday = colIdx === 4;
                  const bg = thursday ? "#EFF6FF" : weekend ? "#FAFAFA" : "white";
                  return <div key={`${hour}-${colIdx}`} style={{ height: 72, background: bg, boxShadow: "-1px -1px 0px #E0E0E0 inset" }} />;
                })}
              </div>
              <div style={{ width: 36, color: "#71717A", fontSize: 12, fontFamily: "Inter", lineHeight: "16px", display: "flex", alignItems: "center" }}>{hour}</div>
            </div>
          ))}
        </div>
      </div>

      {eventCards.map((card, idx) => (
        <div
          key={`event-${idx}`}
          style={{
            width: card.width,
            height: card.height,
            left: card.left,
            top: card.top,
            position: "absolute",
            background: card.bg,
            borderRadius: 4,
            display: "inline-flex",
            overflow: "hidden",
          }}
        >
          <div style={{ width: 3, background: card.border }} />
          <div style={{ flex: "1 1 0", padding: 6, display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ display: "flex", gap: 4, alignItems: "center", color: card.text, fontSize: 12, fontFamily: "Inter", lineHeight: "16px" }}>
              <div>{card.time.split(" ")[0]}</div>
              <div>{card.time.split(" ")[1]}</div>
              {card.showDotIcon && (
                <div style={{ padding: 2, background: card.dotBg, borderRadius: 100, width: 8, height: 8 }}>
                  <div style={{ width: 4, height: 4, borderRadius: 9999, background: card.dotFg }} />
                </div>
              )}
            </div>
            <div style={{ color: card.text, fontSize: 12, fontFamily: "Inter", fontWeight: 600, lineHeight: "16px" }}>{card.title}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
