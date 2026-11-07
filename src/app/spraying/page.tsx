import type { Metadata } from "next";
import Image from "next/image";
import { Mail } from "lucide-react";
import { site, spraying } from "@/content/site";
import { ButtonLink, Container, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Spraying Services",
  description: "Information about weed and pest spraying services in the Red Hawk Canyon neighborhood.",
  alternates: { canonical: "/spraying" },
};

export default function SprayingPage() {
  return (
    <>
      <PageHeader eyebrow="Spraying" title="Spraying services" intro={spraying.intro} />
      <Container className="py-12">
        <div className="relative aspect-[16/9] overflow-hidden rounded-3xl shadow-lg">
          <Image
            src="/images/street-sunset-wide.jpg"
            alt="Red Hawk Canyon street and parking strips at sunset"
            fill
            sizes="(min-width: 1152px) 1152px, 100vw"
            className="object-cover"
          />
        </div>
        <div className="mt-8">
          <ButtonLink href={`mailto:${site.email}?subject=Spraying%20question`}>
            <Mail className="h-4 w-4" aria-hidden /> Ask about spraying
          </ButtonLink>
        </div>
      </Container>
    </>
  );
}
