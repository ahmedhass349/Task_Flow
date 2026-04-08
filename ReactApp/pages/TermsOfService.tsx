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
  { id: "use-of-service", title: "Use of the Service" },
  { id: "accounts-security", title: "Accounts and Security" },
  { id: "content-ownership", title: "Content and Ownership" },
  { id: "acceptable-use", title: "Acceptable Use" },
  { id: "changes-contact", title: "Changes and Contact" },
];

export default function TermsOfService() {
  return (
    <LegalPageLayout
      title="Terms of Service"
      updatedLabel="Last updated: April 7, 2026"
      intro="These terms explain how TaskFlow can be used, what you can expect from us, and the responsibilities that apply when you use the product."
      sections={sections}
      activePolicy="terms"
    >
      <Section id="use-of-service" title="Use of the Service">
        <p>You may use TaskFlow to manage tasks, projects, messages, and related productivity features for lawful business or personal use.</p>
        <p>You are responsible for the accuracy of the information you provide and for maintaining the confidentiality of your account credentials.</p>
      </Section>

      <Section id="accounts-security" title="Accounts and Security">
        <p>Keep your password secure, sign out of shared devices, and enable security options offered in the app when available.</p>
        <p>You must not attempt to access another user’s account, interfere with the service, or use TaskFlow in a way that disrupts other users.</p>
      </Section>

      <Section id="content-ownership" title="Content and Ownership">
        <p>You retain ownership of the content you create. By uploading or entering content into TaskFlow, you grant us the limited rights needed to store, process, and display that content to operate the service.</p>
      </Section>

      <Section id="acceptable-use" title="Acceptable Use">
        <p>Do not use TaskFlow to submit malicious content, violate applicable laws, or attempt to reverse engineer, overload, or exploit the platform.</p>
      </Section>

      <Section id="changes-contact" title="Changes and Contact">
        <p>We may update these terms from time to time. Continued use of TaskFlow after an update means you accept the revised terms.</p>
        <p>If you have questions about these terms, contact the TaskFlow support team through the app or your account administrator.</p>
      </Section>
    </LegalPageLayout>
  );
}
