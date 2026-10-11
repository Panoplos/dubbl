import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Heading, Section } from "@/components/landing/ledger";

export function CTASection() {
  return (
    <Section className="py-24 lg:py-36">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <Heading lead="Balanced books," className="max-w-[14ch] lg:text-7xl">
          starting today.
        </Heading>
        <div className="flex flex-col gap-3 lg:items-end">
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/sign-up"
              className="group inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/85"
            >
              Start free
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="mailto:team@dubbl.dev"
              className="inline-flex h-11 items-center rounded-full border border-border px-5 text-sm text-foreground transition-colors hover:bg-accent"
            >
              Talk to us
            </a>
          </div>
          <p className="font-mono text-[11px] tracking-[0.04em] text-muted-foreground">
            Open source · Self-hostable · Free forever
          </p>
        </div>
      </div>
    </Section>
  );
}
