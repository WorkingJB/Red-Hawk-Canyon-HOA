import type { Metadata } from "next";
import { Download, ExternalLink, FileText } from "lucide-react";
import { ccrHighlights, documents, sources } from "@/content/site";
import { ButtonLink, Container, PageHeader, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Governing Documents (CC&Rs)",
  description:
    "Red Hawk Canyon CC&Rs (Declaration of Covenants, Conditions & Restrictions) with a plain-language summary of the rules on approvals, fences, parking, pets, and assessments.",
  alternates: { canonical: "/documents" },
};

export default function DocumentsPage() {
  const ccrs = documents[0];
  return (
    <>
      <PageHeader
        eyebrow="Documents"
        title="Governing documents"
        intro="The CC&Rs are the recorded rules every Red Hawk Canyon lot is subject to. Download the full document or skim the highlights below."
      />

      <Container className="py-12">
        <section aria-labelledby="files">
          <h2 id="files" className="sr-only">
            Files
          </h2>
          <ul className="grid gap-4">
            {documents.map((d) => (
              <li key={d.slug} className="flex flex-col gap-5 rounded-2xl border border-line bg-surface p-6 sm:flex-row sm:items-center">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                  <FileText className="h-7 w-7" aria-hidden />
                </span>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-ink">{d.title}</h3>
                  <p className="mt-1 text-sm text-muted">{d.description}</p>
                  <p className="mt-1 text-xs text-muted">{d.sizeLabel}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <ButtonLink href={d.href}>
                    <Download className="h-4 w-4" aria-hidden /> Download
                  </ButtonLink>
                  <ButtonLink href={d.href} variant="secondary" external>
                    <ExternalLink className="h-4 w-4" aria-hidden /> Open
                  </ButtonLink>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="highlights" className="mt-16">
          <SectionHeading
            id="highlights"
            title="CC&R highlights"
            description="A plain-language summary for quick reference. The recorded document controls if anything here differs."
          />
          <div className="grid gap-5 md:grid-cols-2">
            {ccrHighlights.map((h) => (
              <article key={h.title} className="rounded-2xl border border-line bg-surface p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand">{h.section}</p>
                <h3 className="mt-1 text-lg font-semibold text-ink">{h.title}</h3>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted marker:text-brand/60">
                  {h.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="viewer" className="no-print mt-16">
          <SectionHeading id="viewer" title="Read online" />
          <div className="overflow-hidden rounded-2xl border border-line bg-white">
            <iframe
              src={`https://drive.google.com/file/d/${sources.ccrsDriveId}/preview`}
              title={ccrs.title}
              className="h-[80vh] min-h-[480px] w-full"
              loading="lazy"
            />
          </div>
        </section>
      </Container>
    </>
  );
}
