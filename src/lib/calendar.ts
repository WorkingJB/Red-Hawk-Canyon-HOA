import { site, sources } from "@/content/site";

export type CalendarEvent = {
  id: string;
  title: string;
  start: string; // ISO string (UTC)
  end?: string;
  allDay: boolean;
  location?: string;
  description?: string;
  /** True for repeating events we could not expand (complex rules). */
  recurringUnexpanded?: boolean;
};

const encodedId = encodeURIComponent(sources.calendarId);
export const calendarLinks = {
  ics: `https://calendar.google.com/calendar/ical/${encodedId}/public/basic.ics`,
  webcal: `webcal://calendar.google.com/calendar/ical/${encodedId}/public/basic.ics`,
  google: `https://calendar.google.com/calendar/u/0?cid=${Buffer.from(sources.calendarId).toString("base64").replace(/=+$/, "")}`,
  embed: `https://calendar.google.com/calendar/embed?src=${encodedId}&ctz=${encodeURIComponent(site.timeZone)}&mode=AGENDA&showPrint=0&showTitle=0&showTz=0&color=%23b45309`,
  embedMonth: `https://calendar.google.com/calendar/embed?src=${encodedId}&ctz=${encodeURIComponent(site.timeZone)}&mode=MONTH&showPrint=0&showTitle=0&showTz=0&color=%23b45309`,
};

const unescapeText = (s: string) =>
  s.replace(/\\n/gi, "\n").replace(/\\([,;\\])/g, "$1").trim();

/** Offset (ms) between UTC and the given time zone at a moment. */
function tzOffset(utcMs: number, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(new Date(utcMs));
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
  return asUtc - utcMs;
}

function parseIcsDate(value: string, params: Record<string, string>): { date: Date; allDay: boolean } {
  const m = value.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z)?)?$/);
  if (!m) return { date: new Date(value), allDay: false };
  const [, y, mo, d, h, mi, s, z] = m;
  if (!h) {
    // All-day: anchor at noon in the HOA's zone so the date never shifts.
    const guess = Date.UTC(+y, +mo - 1, +d, 12);
    return { date: new Date(guess - tzOffset(guess, site.timeZone)), allDay: true };
  }
  const wall = Date.UTC(+y, +mo - 1, +d, +h, +mi, +s);
  if (z) return { date: new Date(wall), allDay: false };
  const tz = params.TZID || site.timeZone;
  let utc = wall - tzOffset(wall, tz);
  utc = wall - tzOffset(utc, tz); // second pass handles DST edges
  return { date: new Date(utc), allDay: false };
}

type RawProp = { value: string; params: Record<string, string> };

export function parseIcs(text: string): CalendarEvent[] {
  const lines = text.replace(/\r\n[ \t]/g, "").replace(/\n[ \t]/g, "").split(/\r?\n/);
  const events: CalendarEvent[] = [];
  let cur: Record<string, RawProp> | null = null;

  for (const line of lines) {
    if (line === "BEGIN:VEVENT") {
      cur = {};
      continue;
    }
    if (line === "END:VEVENT" && cur) {
      events.push(...toEvents(cur));
      cur = null;
      continue;
    }
    if (!cur) continue;
    const idx = line.indexOf(":");
    if (idx < 0) continue;
    const [name, ...paramParts] = line.slice(0, idx).split(";");
    const params = Object.fromEntries(paramParts.map((p) => p.split("=") as [string, string]));
    cur[name.toUpperCase()] = { value: line.slice(idx + 1), params };
  }
  return events.sort((a, b) => a.start.localeCompare(b.start));
}

function toEvents(p: Record<string, RawProp>): CalendarEvent[] {
  if (!p.DTSTART || p.STATUS?.value === "CANCELLED") return [];
  const { date: start, allDay } = parseIcsDate(p.DTSTART.value, p.DTSTART.params);
  const end = p.DTEND ? parseIcsDate(p.DTEND.value, p.DTEND.params).date : undefined;
  const base: CalendarEvent = {
    id: p.UID?.value ?? `${p.SUMMARY?.value}-${start.toISOString()}`,
    title: unescapeText(p.SUMMARY?.value ?? "Event"),
    start: start.toISOString(),
    end: end?.toISOString(),
    allDay,
    location: p.LOCATION ? unescapeText(p.LOCATION.value) : undefined,
    description: p.DESCRIPTION ? unescapeText(p.DESCRIPTION.value).replace(/<[^>]+>/g, "") : undefined,
  };
  if (!p.RRULE) return [base];

  // Expand simple repeating rules (FREQ + INTERVAL + COUNT/UNTIL). Anything
  // fancier is listed once and the visitor is pointed at the full calendar.
  const rule = Object.fromEntries(p.RRULE.value.split(";").map((kv) => kv.split("=") as [string, string]));
  if (Object.keys(rule).some((k) => k.startsWith("BY"))) return [{ ...base, recurringUnexpanded: true }];
  const step = Number(rule.INTERVAL ?? 1);
  const count = rule.COUNT ? Number(rule.COUNT) : Infinity;
  const until = rule.UNTIL ? parseIcsDate(rule.UNTIL, {}).date.getTime() : Date.now() + 400 * 864e5;
  const duration = end ? end.getTime() - start.getTime() : 0;
  const out: CalendarEvent[] = [];
  const d = new Date(start);
  for (let i = 0; i < Math.min(count, 120) && d.getTime() <= until; i++) {
    out.push({ ...base, id: `${base.id}-${i}`, start: d.toISOString(), end: end ? new Date(d.getTime() + duration).toISOString() : undefined });
    if (rule.FREQ === "DAILY") d.setUTCDate(d.getUTCDate() + step);
    else if (rule.FREQ === "WEEKLY") d.setUTCDate(d.getUTCDate() + 7 * step);
    else if (rule.FREQ === "MONTHLY") d.setUTCMonth(d.getUTCMonth() + step);
    else if (rule.FREQ === "YEARLY") d.setUTCFullYear(d.getUTCFullYear() + step);
    else break;
  }
  return out;
}

export async function getEvents(): Promise<{ upcoming: CalendarEvent[]; past: CalendarEvent[]; ok: boolean }> {
  try {
    const res = await fetch(calendarLinks.ics, { next: { revalidate: sources.revalidateSeconds } });
    if (!res.ok) throw new Error(`Calendar responded ${res.status}`);
    const events = parseIcs(await res.text());
    const now = Date.now();
    const isUpcoming = (e: CalendarEvent) => new Date(e.end ?? e.start).getTime() >= now || e.recurringUnexpanded;
    return {
      upcoming: events.filter(isUpcoming),
      past: events.filter((e) => !isUpcoming(e)).reverse(),
      ok: true,
    };
  } catch (err) {
    console.warn("[calendar] could not load events:", (err as Error).message);
    return { upcoming: [], past: [], ok: false };
  }
}

const fmt = (opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-US", { timeZone: site.timeZone, ...opts });

export function formatEventDate(e: CalendarEvent) {
  return fmt({ weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(new Date(e.start));
}

export function formatEventTime(e: CalendarEvent) {
  if (e.allDay) return "All day";
  const t = fmt({ hour: "numeric", minute: "2-digit" });
  return e.end ? `${t.format(new Date(e.start))} to ${t.format(new Date(e.end))}` : t.format(new Date(e.start));
}

export function eventDateParts(e: CalendarEvent) {
  const d = new Date(e.start);
  return {
    month: fmt({ month: "short" }).format(d),
    day: fmt({ day: "numeric" }).format(d),
  };
}
