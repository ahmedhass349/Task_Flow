// ── GanttView: horizontal timeline chart ────────────────────────────────
//
// Displays tasks as horizontal bars on a week-based timeline grid.
// Static seed data; will be driven by props once API is ready.

interface GanttCategory {
  key: string;
  color: string;
  textColor: string;
}

interface GanttRow {
  id: string;
  title: string;
  category: string;
  durationLabel: string;
  barLeft: number;
  barWidth: number;
  isMilestone?: boolean;
}

const CATEGORIES: Record<string, GanttCategory> = {
  "Data Collection":      { key: "Data Collection",      color: "#2B7FFF", textColor: "#1447E6" },
  "Data Analysis":        { key: "Data Analysis",        color: "#AD46FF", textColor: "#8200DB" },
  "Strategy Development": { key: "Strategy Development", color: "#00BC7D", textColor: "#007A55" },
  "Final Delivery":       { key: "Final Delivery",       color: "#FE9A00", textColor: "#BB4D00" },
  "Milestone":            { key: "Milestone",            color: "#0A0A0A", textColor: "#C70036" },
};

const WEEK_LABELS = ["Jan 19", "Jan 26", "Feb 2", "Feb 9", "Feb 16", "Feb 23", "Mar 2", "Mar 9", "Mar 16", "Mar 23"];

const GANTT_ROWS: GanttRow[] = [
  { id: "g-01", title: "Extended Survey Distribution",            category: "Data Collection",      durationLabel: "3 weeks", barLeft: 0,      barWidth: 240 },
  { id: "g-02", title: "Stakeholder Interviews",                  category: "Data Collection",      durationLabel: "1 day",   barLeft: 34.28,  barWidth: 11.43 },
  { id: "g-03", title: "Competitor & Market Research",            category: "Data Collection",      durationLabel: "1 week",  barLeft: 0,      barWidth: 91.43 },
  { id: "g-04", title: "Prepare Data for Analysis",               category: "Data Analysis",        durationLabel: "1 week",  barLeft: 240,    barWidth: 80 },
  { id: "g-05", title: "Thematic & Statistical Analysis",         category: "Data Analysis",        durationLabel: "4 weeks", barLeft: 240,    barWidth: 320 },
  { id: "g-06", title: "Midterm Presentation",                    category: "Milestone",            durationLabel: "1 day",   barLeft: 308.56, barWidth: 11.43, isMilestone: true },
  { id: "g-07", title: "Draft AI-Driven L&D Adoption Strategies", category: "Strategy Development", durationLabel: "4 days",  barLeft: 548.56, barWidth: 45.71 },
  { id: "g-08", title: "Stakeholder Feedback Session",            category: "Strategy Development", durationLabel: "1 day",   barLeft: 571.43, barWidth: 11.43 },
  { id: "g-09", title: "Review & Final Editing",                  category: "Final Delivery",       durationLabel: "1 week",  barLeft: 628.56, barWidth: 91.43 },
  { id: "g-10", title: "Final Report Submission",                 category: "Milestone",            durationLabel: "1 day",   barLeft: 720,    barWidth: 11.43, isMilestone: true },
];

const LEGEND_ITEMS = [
  "Data Collection",
  "Data Analysis",
  "Strategy Development",
  "Final Delivery",
  "Milestone",
];

export default function GanttView() {
  return (
    <div className="bg-white rounded-xl p-8 shadow-sm flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-medium text-gray-900 leading-9">
          Capstone Project Gantt Chart
        </h2>
        <p className="text-base text-gray-500 leading-6">
          Summary View - January to March 2026
        </p>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-6">
        {/* Legend */}
        <div className="border-b border-gray-200 pb-3 flex items-center gap-5 flex-wrap">
          {LEGEND_ITEMS.map((label) => {
            const cat = CATEGORIES[label];
            return (
              <div key={label} className="flex items-center gap-2">
                {label === "Milestone" ? (
                  <div className="size-4 relative overflow-hidden shrink-0">
                    <div
                      className="absolute"
                      style={{
                        width: 11.43,
                        height: 11.43,
                        left: 2.28,
                        top: 2.28,
                        background: "#0A0A0A",
                        outline: "1.14px #0A0A0A solid",
                        outlineOffset: "-0.57px",
                      }}
                    />
                  </div>
                ) : (
                  <div className="size-4 rounded shrink-0" style={{ background: cat.color }} />
                )}
                <span className="text-sm text-gray-700 whitespace-nowrap">{label}</span>
              </div>
            );
          })}
        </div>

        {/* Timeline */}
        <div className="overflow-x-auto">
          <div className="flex flex-col gap-4" style={{ minWidth: 976 }}>
            {/* Week header row */}
            <div style={{ paddingLeft: 256 }} className="flex">
              <div className="flex" style={{ width: 720, borderBottom: "1.6px solid #CAD5E2" }}>
                {WEEK_LABELS.map((wl) => (
                  <div
                    key={wl}
                    className="flex-1 text-center text-sm font-medium text-gray-700 leading-5 pb-2"
                    style={{ borderLeft: "0.8px solid #E2E8F0" }}
                  >
                    {wl}
                  </div>
                ))}
              </div>
            </div>

            {/* Task rows */}
            <div className="flex flex-col gap-2">
              {GANTT_ROWS.map((row) => {
                const cat = CATEGORIES[row.category];
                return (
                  <div key={row.id} className="relative h-12">
                    {/* Label */}
                    <div className="absolute left-0 top-1.5 flex flex-col pr-4" style={{ width: 256 }}>
                      <span className="text-sm font-medium text-gray-900 leading-5 truncate">
                        {row.title}
                      </span>
                      <span className="text-xs leading-4" style={{ color: cat.textColor }}>
                        {row.category} &bull; {row.durationLabel}
                      </span>
                    </div>

                    {/* Timeline track */}
                    <div className="absolute top-0 overflow-hidden" style={{ left: 256, width: 720, height: 48 }}>
                      {/* Grid lines */}
                      <div className="absolute inset-0 flex">
                        {WEEK_LABELS.map((_, i) => (
                          <div key={i} className="flex-1 h-full" style={{ borderLeft: "0.8px solid #F1F5F9" }} />
                        ))}
                      </div>

                      {/* Milestone diamond */}
                      {row.isMilestone && (
                        <div
                          className="absolute flex items-center justify-center shadow-md overflow-hidden"
                          style={{ left: row.barLeft, top: 8, width: 11.43, height: 24 }}
                        >
                          <div
                            style={{
                              width: 9.52,
                              height: 9.52,
                              background: "#0A0A0A",
                              outline: "0.95px #0A0A0A solid",
                              outlineOffset: "-0.48px",
                            }}
                          />
                        </div>
                      )}

                      {/* Duration bar */}
                      {!row.isMilestone && (
                        <div
                          className="absolute flex items-center justify-center overflow-hidden rounded-lg shadow-md"
                          style={{
                            left: row.barLeft,
                            top: 8,
                            width: row.barWidth,
                            height: 32,
                            background: cat.color,
                            outline: `1.6px ${cat.color} solid`,
                            outlineOffset: "-1.6px",
                          }}
                        >
                          {row.barWidth >= 40 && (
                            <span className="text-white text-xs font-medium leading-4 whitespace-nowrap">
                              {row.durationLabel}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 leading-5">
          Current Date: March 14, 2026
        </p>
      </div>
    </div>
  );
}
