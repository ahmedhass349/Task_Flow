import { ChevronRight, ShieldCheck, FileText, Cookie } from "lucide-react";
import { Link } from "react-router";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

interface LegalPageLayoutProps {
  title: string;
  updatedLabel: string;
  intro: string;
  sections: { id: string; title: string }[];
  activePolicy: "terms" | "privacy" | "cookie" | "security";
  children: React.ReactNode;
}

const POLICY_NAV = [
  { id: "terms", label: "Terms of Service", path: "/terms-of-service", icon: <FileText className="size-4" /> },
  { id: "privacy", label: "Privacy Policy", path: "/privacy-policy", icon: <ShieldCheck className="size-4" /> },
  { id: "cookie", label: "Cookie Policy", path: "/cookie-policy", icon: <Cookie className="size-4" /> },
  { id: "security", label: "Security", path: "/security", icon: <ShieldCheck className="size-4" /> },
] as const;

export default function LegalPageLayout({
  title,
  updatedLabel,
  intro,
  sections,
  activePolicy,
  children,
}: LegalPageLayoutProps) {
  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto w-full px-6 py-8">
            <div className="grid grid-cols-[260px_minmax(0,1fr)_260px] gap-6 items-start">
              <aside className="sticky top-6 bg-white border border-gray-200 rounded-2xl p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500 px-2 mb-3">Legal Navigation</p>
                <nav className="flex flex-col gap-1">
                  {POLICY_NAV.map((item) => {
                    const active = item.id === activePolicy;
                    return (
                      <Link
                        key={item.id}
                        to={item.path}
                        className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                          active
                            ? "bg-blue-50 text-blue-700 border border-blue-100"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <span className="inline-flex items-center gap-2">
                          {item.icon}
                          {item.label}
                        </span>
                        <ChevronRight className="size-4" />
                      </Link>
                    );
                  })}
                </nav>
              </aside>

              <section className="bg-white border border-gray-200 rounded-2xl p-8">
                <div className="max-w-3xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">TaskFlow legal</p>
                  <h1 className="mt-3 text-4xl font-bold text-gray-900 tracking-tight">{title}</h1>
                  <p className="mt-3 text-sm text-gray-500">{updatedLabel}</p>
                  <p className="mt-6 text-base text-gray-700 leading-7">{intro}</p>
                </div>

                <div className="mt-10 grid gap-5">
                  {children}
                </div>
              </section>

              <aside className="sticky top-6 bg-white border border-gray-200 rounded-2xl p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500 px-2 mb-3">On This Page</p>
                <nav className="flex flex-col gap-1">
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="px-3 py-2 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      {section.title}
                    </a>
                  ))}
                </nav>
              </aside>
            </div>

            <div className="mt-8">
              <Footer />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
