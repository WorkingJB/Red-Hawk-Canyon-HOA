import type { Metadata } from "next";
import { Mail, UserRound } from "lucide-react";
import { board, site } from "@/content/site";
import { ButtonLink, Card, Container, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Board Members",
  description: "The volunteer board of directors of the Red Hawk Canyon Owners Association and how to reach them.",
  alternates: { canonical: "/board" },
};

export default function BoardPage() {
  return (
    <>
      <PageHeader
        eyebrow="Board"
        title="Board members"
        intro="The association is run by a board of directors made up of volunteer homeowners. The board also appoints the three-member Aesthetic Control Committee that reviews exterior changes."
      />
      <Container className="py-12">
        {board.length ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {board.map((m) => (
              <li key={m.name} className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-5">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sage-soft text-sage">
                  <UserRound className="h-6 w-6" aria-hidden />
                </span>
                <div>
                  <h2 className="font-semibold text-ink">{m.name}</h2>
                  <p className="text-sm text-muted">{m.role}</p>
                  {m.email ? (
                    <a href={`mailto:${m.email}`} className="text-sm font-medium text-brand hover:underline">
                      {m.email}
                    </a>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <Card>
            <h2 className="text-lg font-semibold text-ink">Board roster coming soon</h2>
            <p className="mt-2 text-muted">In the meantime, the fastest way to reach the board is by email.</p>
          </Card>
        )}
        <div className="mt-8">
          <ButtonLink href={`mailto:${site.email}`}>
            <Mail className="h-4 w-4" aria-hidden /> Email the board
          </ButtonLink>
        </div>
      </Container>
    </>
  );
}
