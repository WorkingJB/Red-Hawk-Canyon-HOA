import type { Metadata } from "next";
import Link from "next/link";
import { faqs, faqsComingSoon, irrigation, site } from "@/content/site";
import { Container, FaqList, JsonLd, PageHeader, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "HOA FAQs",
  description: "Answers to common Red Hawk Canyon HOA questions, including annual dues and irrigation.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <>
      <PageHeader
        eyebrow="FAQs"
        title="HOA FAQs"
        intro={
          <>
            Quick answers to the questions we hear most. Don&apos;t see yours?{" "}
            <a href={`mailto:${site.email}`} className="font-medium text-brand hover:underline">
              Email the board
            </a>
            .
          </>
        }
      />
      <Container className="py-12">
        <section aria-labelledby="general">
          <SectionHeading id="general" title="General questions" />
          <FaqList items={faqs} />
          {faqsComingSoon ? <p className="mt-4 text-muted">{faqsComingSoon}</p> : null}
        </section>
        <section aria-labelledby="irrigation-faqs" className="mt-16">
          <SectionHeading
            id="irrigation-faqs"
            title="Irrigation questions"
            description={
              <>
                Looking for your watering time? See the{" "}
                <Link href="/irrigation#schedule" className="font-medium text-brand hover:underline">
                  irrigation schedule
                </Link>
                .
              </>
            }
          />
          <FaqList items={irrigation.faqs} />
        </section>
      </Container>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [...faqs, ...irrigation.faqs].filter((f) => !/^coming soon/i.test(f.a)).map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
    </>
  );
}
