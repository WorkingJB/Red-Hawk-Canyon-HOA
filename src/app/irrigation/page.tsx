import type { Metadata } from "next";
import { ExternalLink, Phone, MessageSquare, Printer } from "lucide-react";
import { irrigation, site } from "@/content/site";
import { getIrrigationSchedule } from "@/lib/irrigation";
import { ScheduleSearch } from "@/components/ScheduleSearch";
import { ButtonLink, Container, FaqList, JsonLd, PageHeader, SectionHeading } from "@/components/ui";

export const revalidate = 900; // seconds; keep in sync with sources.revalidateSeconds

export const metadata: Metadata = {
  title: "Irrigation Schedule",
  description:
    "Red Hawk Canyon irrigation watering schedule by address, irrigation FAQs, and local services for blowing out sprinkler lines in the fall.",
  alternates: { canonical: "/irrigation" },
};

export default async function IrrigationPage() {
  const schedule = await getIrrigationSchedule();
  const homes = schedule.sections.reduce((n, s) => n + s.entries.length, 0);

  return (
    <>
      <PageHeader eyebrow="Irrigation" title="Irrigation management" intro={irrigation.intro}>
        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <a href="#schedule" className="rounded-full bg-surface px-4 py-2 font-medium text-ink shadow-sm ring-1 ring-line hover:ring-brand">
            Watering schedule
          </a>
          <a href="#faqs" className="rounded-full bg-surface px-4 py-2 font-medium text-ink shadow-sm ring-1 ring-line hover:ring-brand">
            Irrigation FAQs
          </a>
          <a href="#blowout" className="rounded-full bg-surface px-4 py-2 font-medium text-ink shadow-sm ring-1 ring-line hover:ring-brand">
            Fall line blowout
          </a>
        </div>
      </PageHeader>

      <Container className="py-12">
        <section aria-labelledby="schedule">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              id="schedule"
              title={schedule.title}
              description={
                <>
                  {homes} homes across {schedule.sections.length} streets.
                  {schedule.updated ? <> Last updated {schedule.updated}.</> : null}
                </>
              }
            />
            <div className="no-print mb-6 flex flex-wrap gap-2">
              <ButtonLink href={`${schedule.sheetUrl}/edit?usp=sharing`} variant="secondary" external>
                <ExternalLink className="h-4 w-4" aria-hidden /> Open in Google Sheets
              </ButtonLink>
            </div>
          </div>
          {schedule.source === "snapshot" ? (
            <p role="status" className="mb-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-100">
              The live schedule couldn&apos;t be loaded, so a saved copy is shown. Check the Google Sheet for the latest times.
            </p>
          ) : null}
          <ScheduleSearch sections={schedule.sections} />
          <p className="no-print mt-4 flex items-center gap-2 text-sm text-muted">
            <Printer className="h-4 w-4" aria-hidden /> This page prints cleanly if you want a copy for the garage.
          </p>
        </section>

        <section aria-labelledby="faqs" className="mt-16">
          <SectionHeading id="faqs" title="Irrigation FAQs" />
          <FaqList items={irrigation.faqs} />
        </section>

        <section aria-labelledby="blowout" className="mt-16">
          <SectionHeading
            id="blowout"
            title="Blowing out your lines in the fall"
            description="After the pump is shut off for the season, have your sprinkler lines blown out to prevent freeze damage. Neighbors have used these local services:"
          />
          <ul className="grid gap-4 md:grid-cols-3">
            {irrigation.blowoutVendors.map((v) => {
              const tel = v.phone.replace(/\D/g, "");
              return (
                <li key={v.name} className="flex flex-col rounded-2xl border border-line bg-surface p-5">
                  <h3 className="text-lg font-semibold text-ink">{v.name}</h3>
                  {v.note ? <p className="mt-1 text-sm text-muted">{v.note}</p> : null}
                  {v.cost ? (
                    <p className="mt-3 text-sm">
                      <span className="font-medium text-ink">Cost:</span> <span className="text-muted">{v.cost}</span>
                    </p>
                  ) : null}
                  <div className="mt-auto flex flex-wrap gap-2 pt-4">
                    {"textOnly" in v && v.textOnly ? (
                      <a href={`sms:+1${tel}`} className="inline-flex items-center gap-2 rounded-full bg-sage-soft px-4 py-2 text-sm font-semibold text-sage hover:ring-1 hover:ring-sage">
                        <MessageSquare className="h-4 w-4" aria-hidden /> Text {v.phone}
                      </a>
                    ) : (
                      <a href={`tel:+1${tel}`} className="inline-flex items-center gap-2 rounded-full bg-sage-soft px-4 py-2 text-sm font-semibold text-sage hover:ring-1 hover:ring-sage">
                        <Phone className="h-4 w-4" aria-hidden /> {v.phone}
                      </a>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-sm text-muted">
            These are neighbor recommendations, not HOA endorsements. Know another good option? Email{" "}
            <a href={`mailto:${site.email}`} className="font-medium text-brand hover:underline">
              {site.email}
            </a>
            .
          </p>
        </section>
      </Container>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: irrigation.faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
    </>
  );
}
