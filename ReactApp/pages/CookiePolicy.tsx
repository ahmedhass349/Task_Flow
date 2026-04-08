import LegalPageLayout from "../Components/LegalPageLayout";

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm scroll-mt-24">
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-7 text-gray-700">{children}</div>
    </section>
  );
}

const sections = [
  { id: "cookie-purpose", title: "What We Use Cookies For" },
  { id: "cookie-types", title: "Types of Cookies" },
  { id: "manage-cookies", title: "Managing Cookies" },
  { id: "cookie-updates", title: "Updates" },
];

export default function CookiePolicy() {
  return (
    <LegalPageLayout
      title="Cookie Policy"
      updatedLabel="Last updated: April 7, 2026"
      intro="TaskFlow uses cookies and similar technologies to keep you signed in, remember preferences, and understand how the app is used."
      sections={sections}
      activePolicy="cookie"
    >
      <Section id="cookie-purpose" title="What We Use Cookies For">
        <p>Cookies help us keep your session active, store preferences such as theme or sign-in behavior, and improve the app experience.</p>
      </Section>

      <Section id="cookie-types" title="Types of Cookies">
        <p><strong>Essential cookies</strong> are required for authentication and core app functionality.</p>
        <p><strong>Preference cookies</strong> remember settings like layout and sign-in choices.</p>
        <p><strong>Analytics cookies</strong> help us understand usage patterns and identify performance issues.</p>
      </Section>

      <Section id="manage-cookies" title="Managing Cookies">
        <p>You can control cookies through your browser settings. Disabling essential cookies may prevent some parts of TaskFlow from working correctly.</p>
      </Section>

      <Section id="cookie-updates" title="Updates">
        <p>We may update this policy if we change the way TaskFlow uses cookies or similar technologies.</p>
      </Section>
    </LegalPageLayout>
  );
}
