import { Fragment } from "react";
import { useNavigate } from "react-router";
import { ExternalLink } from "lucide-react";

const COLUMNS = [
  {
    heading: "Help & Support",
    links: [
      "Help Center",
      "Getting Started Guide",
      "Video Tutorials",
      "Contact Support",
      "System Status",
      "Report a Bug",
    ],
  },
  {
    heading: "Community",
    links: [
      "Community Forum",
      "Feature Requests",
    ],
  },
  {
    heading: "Product",
    links: [
      "What's New",
      "Integrations",
      "Mobile Apps",
      "API Documentation",
      "Changelog",
      "Roadmap",
    ],
  },
  {
    heading: "Company",
    links: [
      "About Us",
      "Blog",
      "Careers",
      "Press",
      "Investors",
      "Partners",
    ],
  },
];

const BOTTOM_LINKS = ["Terms of Service", "Privacy Policy", "Cookie Policy", "Security"];

const BOTTOM_LINK_ROUTES: Record<string, string> = {
  "Terms of Service": "/terms-of-service",
  "Privacy Policy": "/privacy-policy",
  "Cookie Policy": "/cookie-policy",
  Security: "/security",
};

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer style={{ background: "#F7F7F7", borderTop: "1px solid #DDDDDD", fontFamily: "Roboto, sans-serif" }}>
      {/* Link columns */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 40 }}>
          {COLUMNS.map((col) => (
            <div key={col.heading} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <span
                style={{
                  color: "#222222",
                  fontSize: 14,
                  fontWeight: 800,
                  lineHeight: "18px",
                }}
              >
                {col.heading}
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {col.links.map((text) => (
                  <button
                    key={text}
                    type="button"
                    style={{
                      color: "#222222",
                      fontSize: 14,
                      fontWeight: 400,
                      lineHeight: "18px",
                      cursor: "pointer",
                      background: "none",
                      border: "none",
                      padding: 0,
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.textDecoration = "underline")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.textDecoration = "none")}
                  >
                    {text}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "24px",
          borderTop: "1px solid #DDDDDD",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        {/* Left: copyright + legal links */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ color: "#222222", fontSize: 14, fontWeight: 400, lineHeight: "18px" }}>
            &copy; {new Date().getFullYear()} TaskFlow, Inc.
          </span>
          {BOTTOM_LINKS.map((text) => (
            <Fragment key={text}>
              <span style={{ color: "#222222", fontSize: 14 }} aria-hidden="true">&middot;</span>
              <button
                type="button"
                style={{
                  color: "#222222",
                  fontSize: 14,
                  fontWeight: 400,
                  lineHeight: "18px",
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                  padding: 0,
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.textDecoration = "underline")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.textDecoration = "none")}
                onClick={() => navigate(BOTTOM_LINK_ROUTES[text])}
              >
                {text}
              </button>
            </Fragment>
          ))}
        </div>

        {/* Right: social icons */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" style={{ color: "#222222", display: "flex" }}>
            <ExternalLink size={18} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" style={{ color: "#222222", display: "flex" }}>
            <ExternalLink size={18} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" style={{ color: "#222222", display: "flex" }}>
            <ExternalLink size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
