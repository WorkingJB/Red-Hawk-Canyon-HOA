import type { Metadata } from "next";
import { CalendarPlus, Download } from "lucide-react";
import { site } from "@/content/site";
import { calendarLinks, getEvents } from "@/lib/calendar";
import { EventList } from "@/components/EventList";
import { ButtonLink, Card, Container, JsonLd, PageHeader, SectionHeading } from "@/components/ui";

export const revalidate = 900; // seconds; keep in sync with sources.revalidateSeconds

export const metadata: Metadata = {
  title: "Event Calendar",
  description: "Upcoming Red Hawk Canyon HOA board meetings, the yearly homeowners meeting, and neighborhood events.",
  alternates: { canonical: "/calendar" },
};

export default async function CalendarPage() {
  const { upcoming, past, ok } = await getEvents();

  return (
    <>
      <PageHeader
        eyebrow="Calendar"
        title="Event calendar"
        intro="Board meetings, the yearly homeowners meeting, and neighborhood events. Subscribe to get new events on your phone automatically."
      >
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href={calendarLinks.google} external>
            <CalendarPlus className="h-4 w-4" aria-hidden /> Add to Google Calendar
          </ButtonLink>
          <ButtonLink href={calendarLinks.webcal} variant="secondary">
            <CalendarPlus className="h-4 w-4" aria-hidden /> Subscribe (Apple / Outlook)
          </ButtonLink>
          <ButtonLink href={calendarLinks.ics} variant="secondary" external>
            <Download className="h-4 w-4" aria-hidden /> .ics feed
          </ButtonLink>
        </div>
      </PageHeader>

      <Container className="py-12">
        <section aria-labelledby="upcoming">
          <SectionHeading id="upcoming" title="Upcoming" />
          {upcoming.length ? (
            <EventList events={upcoming} />
          ) : (
            <Card>
              <p className="text-muted">
                {ok
                  ? "Nothing is scheduled right now. New meetings and events will show up here as soon as the board adds them."
                  : "The calendar couldn't be loaded right now. The full calendar below may still work."}
              </p>
            </Card>
          )}
        </section>

        <section aria-labelledby="full" className="mt-16">
          <SectionHeading id="full" title="Full calendar" />
          <div className="overflow-hidden rounded-2xl border border-line bg-white">
            <iframe
              src={calendarLinks.embedMonth}
              title={`${site.name} Google Calendar`}
              className="hidden h-[640px] w-full md:block"
              loading="lazy"
            />
            <iframe
              src={calendarLinks.embed}
              title={`${site.name} Google Calendar (agenda view)`}
              className="h-[520px] w-full md:hidden"
              loading="lazy"
            />
          </div>
        </section>

        {past.length ? (
          <section aria-labelledby="past" className="mt-16">
            <SectionHeading id="past" title="Past events" />
            <EventList events={past.slice(0, 6)} muted />
          </section>
        ) : null}
      </Container>

      {upcoming.filter((e) => !e.recurringUnexpanded).length ? (
        <JsonLd
          data={upcoming
            .filter((e) => !e.recurringUnexpanded)
            .slice(0, 10)
            .map((e) => ({
              "@context": "https://schema.org",
              "@type": "Event",
              name: e.title,
              startDate: e.start,
              endDate: e.end,
              eventStatus: "https://schema.org/EventScheduled",
              eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
              location: {
                "@type": "Place",
                name: e.location ?? `Red Hawk Canyon, ${site.city}, ${site.state}`,
                address: `${e.location ? `${e.location}, ` : ""}${site.city}, ${site.state}`,
              },
              organizer: { "@id": `${site.url}/#organization` },
              description: e.description,
            }))}
        />
      ) : null}
    </>
  );
}
