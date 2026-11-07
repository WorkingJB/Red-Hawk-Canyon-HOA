import { Clock, MapPin, Repeat } from "lucide-react";
import { type CalendarEvent, eventDateParts, formatEventDate, formatEventTime } from "@/lib/calendar";

export function EventList({ events, muted = false }: { events: CalendarEvent[]; muted?: boolean }) {
  return (
    <ul className="grid gap-3">
      {events.map((e) => {
        const { month, day } = eventDateParts(e);
        return (
          <li key={e.id} className={`flex gap-4 rounded-2xl border border-line bg-surface p-4 sm:p-5 ${muted ? "opacity-80" : ""}`}>
            <div
              className={`flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl ${muted ? "bg-surface-2 text-muted" : "bg-brand-soft text-brand-strong"}`}
              aria-hidden
            >
              <span className="text-xs font-semibold uppercase tracking-wider">{month}</span>
              <span className="font-display text-2xl font-semibold leading-none">{day}</span>
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-ink">{e.title}</h3>
              <p className="mt-0.5 text-sm text-muted">
                <time dateTime={e.start}>{formatEventDate(e)}</time>
              </p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4" aria-hidden />
                  {formatEventTime(e)}
                </span>
                {e.location ? (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" aria-hidden />
                    {e.location}
                  </span>
                ) : null}
                {e.recurringUnexpanded ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Repeat className="h-4 w-4" aria-hidden />
                    Repeats (see full calendar)
                  </span>
                ) : null}
              </div>
              {e.description ? <p className="mt-2 whitespace-pre-line text-sm text-muted">{e.description}</p> : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
