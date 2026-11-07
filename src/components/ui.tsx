import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import type { Faq } from "@/content/site";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-6xl px-4 sm:px-6 ${className}`}>{children}</div>;
}

export function PageHeader({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="border-b border-line bg-gradient-to-b from-brand-soft/60 to-transparent">
      <Container className="py-12 sm:py-16">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted">
          <ol className="flex items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-brand hover:underline">
                Home
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li aria-current="page" className="text-ink">
              {eyebrow ?? title}
            </li>
          </ol>
        </nav>
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">{title}</h1>
        {intro ? <div className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{intro}</div> : null}
        {children}
      </Container>
    </div>
  );
}

export function SectionHeading({ id, title, description }: { id?: string; title: string; description?: ReactNode }) {
  return (
    <div className="mb-6">
      <h2 id={id} className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
        {title}
      </h2>
      {description ? <p className="mt-2 max-w-2xl text-muted">{description}</p> : null}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-line bg-surface p-6 shadow-sm ${className}`}>{children}</div>;
}

export function FaqList({ items }: { items: Faq[] }) {
  return (
    <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
      {items.map((f) => (
        <details key={f.q} className="group">
          <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left font-medium text-ink hover:bg-surface-2 sm:px-6">
            <h3 className="text-base">{f.q}</h3>
            <ChevronDown className="h-5 w-5 shrink-0 text-muted transition-transform group-open:rotate-180" aria-hidden />
          </summary>
          <div className="px-5 pb-5 leading-relaxed text-muted sm:px-6">{f.a}</div>
        </details>
      ))}
    </div>
  );
}

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe once "<" is escaped.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  external,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  external?: boolean;
}) {
  const cls =
    variant === "primary"
      ? "bg-brand text-white hover:bg-brand-strong dark:text-bg"
      : "border border-line bg-surface text-ink hover:border-brand hover:text-brand";
  const props = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  const className = `inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${cls}`;
  if (external || href.startsWith("mailto:") || href.endsWith(".pdf") || href.startsWith("http") || href.startsWith("webcal")) {
    return (
      <a href={href} className={className} {...props}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
