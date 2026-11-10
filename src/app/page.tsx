import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CalendarDays, Droplets, FileText, HelpCircle, Megaphone, SprayCan, Users } from "lucide-react";
import { announcements, home, photos, site } from "@/content/site";
import { getEvents } from "@/lib/calendar";
import { EventList } from "@/components/EventList";
import { ButtonLink, Card, Container, SectionHeading } from "@/components/ui";

export const revalidate = 900; // seconds; keep in sync with sources.revalidateSeconds

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const quickLinks = [
  { href: "/irrigation", title: "Irrigation schedule", body: "Find your assigned watering time.", icon: Droplets },
  { href: "/calendar", title: "Event calendar", body: "Board meetings and the yearly HOA meeting.", icon: CalendarDays },
  { href: "/documents", title: "CC&Rs and documents", body: "Read the neighborhood's governing rules.", icon: FileText },
  { href: "/faq", title: "HOA FAQs", body: "Annual dues and common questions.", icon: HelpCircle },
  { href: "/board", title: "Board members", body: "Who runs the association.", icon: Users },
  { href: "/spraying", title: "Spraying services", body: "Weed and pest spraying info.", icon: SprayCan },
];

const dateFmt = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

export default async function HomePage() {
  const today = new Date().toISOString().slice(0, 10);
  const news = announcements.filter((a) => !a.expires || a.expires >= today);
  const { upcoming } = await getEvents();

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <Image
          src={photos.hero.src}
          alt={photos.hero.alt}
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/40 to-black/10" />
        <Container className="flex min-h-[24rem] flex-col justify-end pb-12 pt-16 sm:min-h-[30rem] sm:pb-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-200">
            {site.city}, Washington
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            Red Hawk Canyon Homeowners Association
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/85">{home.welcome}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/irrigation"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-stone-900 hover:bg-orange-50"
            >
              <Droplets className="h-4 w-4" aria-hidden /> Watering schedule
            </Link>
            <a
              href={`mailto:${site.email}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/50 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              Contact the board
            </a>
          </div>
        </Container>
      </section>

      {/* News */}
      {news.length ? (
        <section aria-labelledby="news" className="border-b border-line bg-surface">
          <Container className="py-8">
            <h2 id="news" className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-brand">
              <Megaphone className="h-4 w-4" aria-hidden /> Neighborhood news
            </h2>
            <ul className="mt-4 grid gap-4 md:grid-cols-2">
              {news.map((a) => (
                <li key={a.title + a.date} className="rounded-2xl border border-brand/25 bg-brand-soft/50 p-5">
                  <p className="text-xs font-medium text-muted">
                    Posted <time dateTime={a.date}>{dateFmt.format(new Date(a.date))}</time>
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-ink">{a.title}</h3>
                  <p className="mt-1 text-muted">{a.body}</p>
                  {a.link ? (
                    <Link href={a.link.href} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline">
                      {a.link.label} <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                  ) : null}
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      {/* Quick links */}
      <section aria-labelledby="resources">
        <Container className="py-16">
          <SectionHeading id="resources" title="Resources" description="Everything residents look for most, one tap away." />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quickLinks.map(({ href, title, body, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="group flex h-full items-start gap-4 rounded-2xl border border-line bg-surface p-5 transition hover:-translate-y-0.5 hover:border-brand/50 hover:shadow-md"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sage-soft text-sage">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span>
                    <span className="flex items-center gap-1 font-semibold text-ink group-hover:text-brand">
                      {title}
                      <ArrowRight className="h-4 w-4 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden />
                    </span>
                    <span className="mt-1 block text-sm text-muted">{body}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* About */}
      <section aria-labelledby="about" className="bg-surface-2/60">
        <Container className="grid items-center gap-10 py-16 lg:grid-cols-2">
          <div>
            <SectionHeading id="about" title="About us" />
            {home.about.map((p) => (
              <p key={p.slice(0, 20)} className="mb-4 leading-relaxed text-muted">
                {p}
              </p>
            ))}
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              {home.responsibilities.map((r) => (
                <div key={r.title} className="rounded-xl border border-line bg-surface p-4">
                  <dt className="font-semibold text-ink">{r.title}</dt>
                  <dd className="mt-1 text-sm text-muted">{r.body}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lg">
            <Image
              src={photos.valley.src}
              alt={photos.valley.alt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-[30%_50%]"
            />
          </div>
        </Container>
      </section>

      {/* Events */}
      <section aria-labelledby="events">
        <Container className="py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading id="events" title="Upcoming events" />
            <div className="mb-6">
              <ButtonLink href="/calendar" variant="secondary">
                Full calendar <ArrowRight className="h-4 w-4" aria-hidden />
              </ButtonLink>
            </div>
          </div>
          {upcoming.length ? (
            <EventList events={upcoming.slice(0, 3)} />
          ) : (
            <Card>
              <p className="text-muted">
                No upcoming events are scheduled right now. Board meetings and the yearly homeowners meeting are posted on the{" "}
                <Link href="/calendar" className="font-medium text-brand hover:underline">
                  calendar
                </Link>{" "}
                as soon as they are set.
              </p>
            </Card>
          )}
        </Container>
      </section>
    </>
  );
}
