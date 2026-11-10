"use client";

import { useMemo, useState } from "react";
import { Clock, Search, X } from "lucide-react";
import type { ScheduleSection } from "@/lib/irrigation";

export function ScheduleSearch({ sections }: { sections: ScheduleSection[] }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!q) return sections;
    return sections
      .map((s) => ({
        ...s,
        entries: s.entries.filter((e) =>
          [e.address, e.household ?? "", e.time, s.street].some((v) => v.toLowerCase().includes(q)),
        ),
      }))
      .filter((s) => s.entries.length);
  }, [q, sections]);

  const matches = filtered.reduce((n, s) => n + s.entries.length, 0);

  return (
    <div>
      <div className="no-print sticky top-16 z-10 -mx-4 bg-bg/95 px-4 py-3 backdrop-blur sm:mx-0 sm:px-0">
        <label htmlFor="schedule-search" className="sr-only">
          Search by address, street, or last name
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" aria-hidden />
          <input
            id="schedule-search"
            type="search"
            inputMode="search"
            autoComplete="off"
            placeholder="Search address, street, or name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-full border border-line bg-surface py-3.5 pl-12 pr-12 text-base text-ink shadow-sm placeholder:text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:bg-surface-2"
            >
              <X className="h-4 w-4" aria-hidden />
              <span className="sr-only">Clear search</span>
            </button>
          ) : null}
        </div>
        <p className="mt-2 px-1 text-sm text-muted" aria-live="polite">
          {q ? `${matches} ${matches === 1 ? "home matches" : "homes match"} "${query.trim()}"` : " "}
        </p>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-line bg-surface p-6 text-muted">
          No homes match that search. Try just the house number or street name.
        </p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {filtered.map((s) => (
            <section key={s.slug} aria-labelledby={`street-${s.slug}`} className="overflow-hidden rounded-2xl border border-line bg-surface">
              <h3 id={`street-${s.slug}`} className="border-b border-line bg-surface-2 px-5 py-3 font-semibold text-ink">
                {s.street}
              </h3>
              <table className="w-full text-left text-sm">
                <caption className="sr-only">Watering times for {s.street}</caption>
                <thead className="sr-only">
                  <tr>
                    <th scope="col">Address</th>
                    <th scope="col">Watering time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {s.entries.map((e) => (
                    <tr key={e.address + e.time} className="hover:bg-surface-2/60">
                      <th scope="row" className="px-5 py-3 font-normal">
                        <span className="font-medium text-ink">{e.address}</span>
                        {e.household ? <span className="block text-xs text-muted">{e.household}</span> : null}
                      </th>
                      <td className="whitespace-nowrap px-5 py-3 text-right">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-soft px-3 py-1 font-semibold text-sage">
                          <Clock className="h-3.5 w-3.5" aria-hidden />
                          {e.time}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {s.notes.length ? (
                <p className="border-t border-line bg-brand-soft/40 px-5 py-2.5 text-xs font-medium text-brand-strong">{s.notes.join(" · ")}</p>
              ) : null}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
