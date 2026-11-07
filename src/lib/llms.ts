import { announcements, board, ccrHighlights, documents, faqs, faqsComingSoon, irrigation, nav, site, spraying } from "@/content/site";
import { getIrrigationSchedule } from "@/lib/irrigation";
import { calendarLinks, formatEventDate, formatEventTime, getEvents } from "@/lib/calendar";

const pageSummaries: Record<string, string> = {
  "/": "Home page: neighborhood news, about the HOA, quick links, upcoming events.",
  "/irrigation": "Irrigation watering schedule by address (one-hour window per home), irrigation FAQs, fall line-blowout services.",
  "/calendar": "Upcoming and past HOA events with subscribe links (Google Calendar, iCal).",
  "/documents": "CC&Rs (Declaration of Covenants, Conditions & Restrictions) PDF and plain-language highlights.",
  "/faq": "Frequently asked questions: annual dues and irrigation (more coming soon).",
  "/board": "Board of directors roster and contact.",
  "/spraying": "Weed and pest spraying services (details coming soon).",
  "/contact": "How to contact the board (email).",
};

/** Short index following the llms.txt convention (https://llmstxt.org). */
export function buildLlmsTxt() {
  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.legalName} is the homeowners association for the Red Hawk Canyon neighborhood in ${site.city}, ${site.county}, ${site.state}. Streets: ${site.streets.join(", ")}. Contact: ${site.email}.`,
    "",
    "Key facts:",
    "- Annual dues: $200 per year, due June 1.",
    "- The HOA owns and maintains the shared irrigation pump and system, the storm water retention pond, and the entry sign and lighting.",
    "- Each home has an assigned one-hour irrigation watering window (see the schedule).",
    "- Exterior changes, fences, and exterior lighting require written approval from the Aesthetic Control Committee.",
    "",
    "## Pages",
    ...nav.map((n) => `- [${n.label}](${site.url}${n.href === "/" ? "" : n.href}): ${pageSummaries[n.href] ?? ""}`),
    "",
    "## Data",
    `- [Full site content as plain text](${site.url}/llms-full.txt): every page's text, the irrigation schedule, FAQs, and CC&R highlights in one file.`,
    `- [Irrigation schedule JSON](${site.url}/api/irrigation-schedule): structured watering times by street and address.`,
    `- [Events JSON](${site.url}/api/events): upcoming and past HOA events.`,
    `- [Calendar feed (iCal)](${calendarLinks.ics})`,
    ...documents.map((d) => `- [${d.title}](${site.url}${d.href}): ${d.description}`),
    "",
  ];
  return lines.join("\n");
}

/** Everything on the site in one Markdown document. */
export async function buildLlmsFullTxt() {
  const [schedule, events] = await Promise.all([getIrrigationSchedule(), getEvents()]);
  const out: string[] = [buildLlmsTxt(), "---", ""];

  out.push("## Neighborhood news", "");
  for (const a of announcements) out.push(`- ${a.date}: **${a.title}**. ${a.body}`);
  out.push("");

  out.push(`## ${schedule.title}`, "");
  if (schedule.updated) out.push(`Last updated: ${schedule.updated}.`, "");
  out.push(irrigation.intro, "");
  for (const s of schedule.sections) {
    out.push(`### ${s.street}`, "", "| Address | Household | Watering time |", "| --- | --- | --- |");
    for (const e of s.entries) out.push(`| ${e.address} | ${e.household ?? ""} | ${e.time} |`);
    if (s.notes.length) out.push("", `Note: ${s.notes.join("; ")}`);
    out.push("");
  }

  out.push("## Irrigation FAQs", "");
  for (const f of irrigation.faqs) out.push(`**${f.q}**`, f.a, "");
  out.push("### Fall line blowout services", "");
  for (const v of irrigation.blowoutVendors) {
    out.push(`- ${v.name}: ${v.phone}${"textOnly" in v && v.textOnly ? " (text only)" : ""}.${v.note ? ` ${v.note}` : ""}${v.cost ? ` Cost: ${v.cost}.` : ""}`);
  }
  out.push("");

  out.push("## Events", "");
  if (events.upcoming.length) {
    out.push("Upcoming:");
    for (const e of events.upcoming) out.push(`- ${e.title}: ${formatEventDate(e)}, ${formatEventTime(e)}${e.location ? `, at ${e.location}` : ""}`);
  } else out.push("No upcoming events are scheduled.");
  if (events.past.length) {
    out.push("", "Recent past events:");
    for (const e of events.past.slice(0, 5)) out.push(`- ${e.title}: ${formatEventDate(e)}${e.location ? `, at ${e.location}` : ""}`);
  }
  out.push("");

  out.push("## HOA FAQs", "");
  for (const f of faqs) out.push(`**${f.q}**`, f.a, "");
  if (faqsComingSoon) out.push(faqsComingSoon, "");

  out.push("## CC&R highlights", "", "Plain-language summary. The recorded CC&Rs control if anything differs.", "");
  for (const h of ccrHighlights) {
    out.push(`### ${h.title} (${h.section})`, ...h.points.map((p) => `- ${p}`), "");
  }

  out.push("## Board", "");
  out.push(board.length ? board.map((m) => `- ${m.name}, ${m.role}`).join("\n") : `Roster coming soon. Contact the board at ${site.email}.`, "");

  out.push("## Spraying", "", spraying.intro, "");
  out.push("## Contact", "", `Email: ${site.email}`, "");
  return out.join("\n");
}
