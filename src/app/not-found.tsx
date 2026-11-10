import { ButtonLink, Container } from "@/components/ui";

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-brand">404</p>
      <h1 className="mt-2 font-display text-4xl font-semibold text-ink">Page not found</h1>
      <p className="mx-auto mt-4 max-w-md text-muted">That page moved or never existed. Try the home page or the irrigation schedule.</p>
      <div className="mt-8 flex justify-center gap-3">
        <ButtonLink href="/">Home</ButtonLink>
        <ButtonLink href="/irrigation" variant="secondary">Irrigation schedule</ButtonLink>
      </div>
    </Container>
  );
}
