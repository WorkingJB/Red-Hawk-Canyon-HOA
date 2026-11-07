import Link from "next/link";
import { Mail } from "lucide-react";
import { nav, site } from "@/content/site";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line bg-surface-2/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5 font-display text-lg font-semibold">
            <Logo className="h-8 w-8 text-brand" />
            {site.name}
          </div>
          <p className="mt-3 max-w-md text-sm text-muted">{site.tagline}</p>
          <a
            href={`mailto:${site.email}`}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-strong dark:text-bg"
          >
            <Mail className="h-4 w-4" aria-hidden />
            {site.email}
          </a>
        </div>
        <nav aria-label="Footer">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Pages</h2>
          <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-ink hover:text-brand hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-muted sm:px-6">
          © {new Date().getFullYear()} {site.legalName}, {site.city}, {site.state}. Run by volunteer board members.
        </p>
      </div>
    </footer>
  );
}
