import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";
import { site } from "@/content/site";
import { ButtonLink, Card, Container, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact the Red Hawk Canyon HOA board at ${site.email}.`,
  alternates: { canonical: "/contact" },
};

const topics = [
  { subject: "Irrigation issue", body: "Low pressure, a broken line, or a schedule question." },
  { subject: "Architectural approval request", body: "Exterior changes, fences, paint colors, or lighting." },
  { subject: "Dues question", body: "Payment, balance, or a paid-assessment certificate." },
  { subject: "General question", body: "Anything else for the board." },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Contact the board"
        intro="The board is made up of volunteer neighbors. Email is the best way to reach us."
      >
        <div className="mt-6">
          <ButtonLink href={`mailto:${site.email}`}>
            <Mail className="h-4 w-4" aria-hidden /> {site.email}
          </ButtonLink>
        </div>
      </PageHeader>
      <Container className="py-12">
        <h2 className="font-display text-2xl font-semibold text-ink">Start an email about...</h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {topics.map((t) => (
            <li key={t.subject}>
              <a
                href={`mailto:${site.email}?subject=${encodeURIComponent(t.subject)}`}
                className="block h-full rounded-2xl border border-line bg-surface p-5 transition hover:border-brand/50 hover:shadow-md"
              >
                <span className="font-semibold text-ink">{t.subject}</span>
                <span className="mt-1 block text-sm text-muted">{t.body}</span>
              </a>
            </li>
          ))}
        </ul>
        <Card className="mt-8">
          <p className="text-muted">
            You may also find answers on the{" "}
            <Link href="/faq" className="font-medium text-brand hover:underline">
              FAQ page
            </Link>{" "}
            or in the{" "}
            <Link href="/documents" className="font-medium text-brand hover:underline">
              CC&amp;Rs
            </Link>
            .
          </p>
        </Card>
      </Container>
    </>
  );
}
