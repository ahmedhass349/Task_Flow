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
  { id: "account-protection", title: "Account Protection" },
  { id: "recommended-controls", title: "Recommended Controls" },
  { id: "data-protection", title: "Data Protection" },
  { id: "reporting-concerns", title: "Reporting Concerns" },
];

export default function Security() {
  return (
    <LegalPageLayout
      title="Security"
      updatedLabel="Last updated: April 7, 2026"
      intro="This page summarizes the practical security controls and habits that help keep TaskFlow accounts and data protected."
      sections={sections}
      activePolicy="security"
    >
      <Section id="account-protection" title="Account Protection">
        <p>Use a strong, unique password and keep your credentials private. Sign out on shared devices and review active sessions regularly.</p>
      </Section>

      <Section id="recommended-controls" title="Recommended Controls">
        <p>Enable two-factor authentication when it is available, and keep your browser and operating system up to date to reduce exposure to common threats.</p>
      </Section>

      <Section id="data-protection" title="Data Protection">
        <p>TaskFlow uses authentication and secure transport for app traffic. You should still avoid sharing sensitive information unnecessarily and review who can access your workspace.</p>
      </Section>

      <Section id="reporting-concerns" title="Reporting Concerns">
        <p>If you notice suspicious account activity, contact your workspace administrator or TaskFlow support immediately so access can be reviewed.</p>
      </Section>
    </LegalPageLayout>
  );
}
