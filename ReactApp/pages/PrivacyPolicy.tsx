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
  { id: "information-collected", title: "Information We Collect" },
  { id: "how-we-use", title: "How We Use Information" },
  { id: "sharing-disclosure", title: "Sharing and Disclosure" },
  { id: "retention-security", title: "Data Retention and Security" },
  { id: "your-choices", title: "Your Choices" },
];

export default function PrivacyPolicy() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      updatedLabel="Last updated: April 7, 2026"
      intro="This policy describes the information TaskFlow collects, how we use it, and the choices you have over your data."
      sections={sections}
      activePolicy="privacy"
    >
      <Section id="information-collected" title="Information We Collect">
        <p>We collect the information you provide directly, such as account details, tasks, messages, settings, and other content you choose to store in TaskFlow.</p>
        <p>We may also collect technical information like device type, browser data, and usage diagnostics to keep the product working reliably.</p>
      </Section>

      <Section id="how-we-use" title="How We Use Information">
        <p>We use your information to provide the service, authenticate your account, sync your workspace, send notifications, and improve performance and reliability.</p>
      </Section>

      <Section id="sharing-disclosure" title="Sharing and Disclosure">
        <p>We do not sell your personal data. We may share information with service providers that help us operate TaskFlow, or when required by law.</p>
      </Section>

      <Section id="retention-security" title="Data Retention and Security">
        <p>We keep data only as long as needed to deliver the service and meet legal obligations. We use reasonable safeguards to protect your information, but no system is completely secure.</p>
      </Section>

      <Section id="your-choices" title="Your Choices">
        <p>You can update your account settings, manage sign-in preferences, and review privacy-related controls in the Settings area of the app.</p>
      </Section>
    </LegalPageLayout>
  );
}
