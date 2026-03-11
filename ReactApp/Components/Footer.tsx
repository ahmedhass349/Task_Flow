import { Link } from "react-router";
import { Github, Twitter, Linkedin } from "lucide-react";

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

export default function Footer() {
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
                  <Link
                    key={text}
                    to="#"
                    style={{
                      color: "#222222",
                      fontSize: 14,
                      fontWeight: 400,
                      lineHeight: "18px",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                    onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
                  >
                    {text}
                  </Link>
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
            © {new Date().getFullYear()} TaskFlow, Inc.
          </span>
          {BOTTOM_LINKS.map((text) => (
            <>
              <span key={`dot-${text}`} style={{ color: "#222222", fontSize: 14 }}>·</span>
              <Link
                key={text}
                to="#"
                style={{
                  color: "#222222",
                  fontSize: 14,
                  fontWeight: 400,
                  lineHeight: "18px",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
              >
                {text}
              </Link>
            </>
          ))}
        </div>

        {/* Right: social icons */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <a href="https://github.com" target="_blank" rel="noreferrer" style={{ color: "#222222", display: "flex" }}>
            <Github size={18} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" style={{ color: "#222222", display: "flex" }}>
            <Twitter size={18} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={{ color: "#222222", display: "flex" }}>
            <Linkedin size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
