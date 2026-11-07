import { sources } from "@/content/site";
import { fallbackScheduleCsv } from "@/content/irrigation-fallback";

export type ScheduleEntry = {
  address: string;
  /** Household name in parentheses on the sheet, if any. */
  household?: string;
  time: string;
};

export type ScheduleSection = {
  street: string;
  slug: string;
  entries: ScheduleEntry[];
  notes: string[];
};

export type IrrigationSchedule = {
  title: string;
  updated?: string;
  sections: ScheduleSection[];
  /** "live" when read from Google Sheets, "snapshot" when the bundled copy was used. */
  source: "live" | "snapshot";
  sheetUrl: string;
};

const sheetUrl = `https://docs.google.com/spreadsheets/d/${sources.irrigationSheetId}`;
const csvUrl = `${sheetUrl}/gviz/tq?tqx=out:csv`;

/** Minimal RFC 4180 CSV parser (handles quotes, escaped quotes, and newlines in cells). */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(cell);
      cell = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else cell += c;
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows.map((r) => r.map((v) => v.trim()));
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/**
 * Turns the sheet into structured data. The sheet layout is:
 *   row 1: title, row 2: "Dated: ...", row 3: column headers,
 *   then street headings ("Yarrow Road:") followed by "Address (Name)", "Time" rows.
 *   Rows starting with "Free Time" are treated as notes for the current street.
 */
export function parseSchedule(csv: string, source: IrrigationSchedule["source"]): IrrigationSchedule {
  const rows = parseCsv(csv).filter((r) => r.some(Boolean));
  let title = "Irrigation Watering Schedule";
  let updated: string | undefined;
  const sections: ScheduleSection[] = [];
  let current: ScheduleSection | undefined;

  for (const [a = "", b = ""] of rows) {
    if (/watering schedule/i.test(a) && !b) {
      title = a
        .toLowerCase()
        .replace(/\b\w/g, (m) => m.toUpperCase());
      continue;
    }
    if (/^dated:/i.test(a)) {
      updated = a.replace(/^dated:\s*/i, "");
      continue;
    }
    if (/^home$/i.test(a)) continue; // header row
    if (/^free time/i.test(a)) {
      const note = a.replace(/\s+/g, " ");
      if (current && !current.notes.includes(note)) current.notes.push(note);
      continue;
    }
    if (a.endsWith(":") && !b) {
      const street = a.replace(/:$/, "").trim();
      current = { street, slug: slugify(street), entries: [], notes: [] };
      sections.push(current);
      continue;
    }
    if (!b) continue;
    const m = a.match(/^(.*?)\s*\((.*)\)\s*$/);
    const entry: ScheduleEntry = {
      address: (m ? m[1] : a).trim(),
      household: m ? m[2].trim() : undefined,
      time: b,
    };
    if (!current) {
      current = { street: "Other", slug: "other", entries: [], notes: [] };
      sections.push(current);
    }
    current.entries.push(entry);
  }

  return { title, updated, sections, source, sheetUrl };
}

export async function getIrrigationSchedule(): Promise<IrrigationSchedule> {
  try {
    const res = await fetch(csvUrl, { next: { revalidate: sources.revalidateSeconds } });
    if (!res.ok) throw new Error(`Sheet responded ${res.status}`);
    const text = await res.text();
    // A private sheet returns an HTML sign-in page instead of CSV.
    if (text.trimStart().startsWith("<")) throw new Error("Sheet is not publicly shared");
    const schedule = parseSchedule(text, "live");
    if (!schedule.sections.length) throw new Error("Sheet had no schedule rows");
    return schedule;
  } catch (err) {
    console.warn("[irrigation] using bundled snapshot:", (err as Error).message);
    return parseSchedule(fallbackScheduleCsv, "snapshot");
  }
}
