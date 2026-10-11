import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Heading, Section, Shot } from "@/components/landing/ledger";
import { backdrops } from "@/components/landing/backdrops";

const facts = [
  { figure: "Dr = Cr", label: "Every entry balances", note: "Unbalanced entries are rejected — from the UI, the API and AI agents." },
  { figure: "12", label: "Modules, one ledger", note: "Sales, purchases, banking, inventory, payroll, CRM and more." },
  { figure: "357", label: "MCP tools", note: "Claude and other agents can work your books directly." },
  { figure: "Apache 2.0", label: "Open source", note: "Self-host it for free, forever. Or use our cloud." },
];

export function Hero() {
  return (
    <>
      <Section rule={false} className="pb-16 pt-20 sm:pt-28">
        <a
          href="https://github.com/dubbl-org/dubbl"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 rounded-full border border-border py-1 pl-1 pr-3 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <span className="rounded-full bg-foreground px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-background">
            Open source
          </span>
          Self-host the whole platform
          <ArrowUpRight className="size-3 transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
        </a>

        <Heading as="h1" className="mt-8 max-w-[15ch]">
          Your whole business, on one balanced ledger.
        </Heading>

        <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <p className="max-w-[46ch] text-[17px] leading-relaxed text-muted-foreground">
            dubbl is open-source accounting with invoicing, bills, banking, inventory, projects, payroll and CRM built
            in. Everything you do posts a balanced double entry, so your books are always right.
          </p>

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href="/sign-up"
                className="group inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/85"
              >
                Start free
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/docs/self-hosting"
                className="inline-flex h-11 items-center rounded-full border border-border px-5 text-sm text-foreground transition-colors hover:bg-accent"
              >
                Self-host guide
              </Link>
            </div>
            <p className="font-mono text-[11px] tracking-[0.04em] text-muted-foreground">
              Free plan · No credit card · Free to self-host
            </p>
          </div>
        </div>
      </Section>

      <Section rule={false} className="pb-20">
        <Shot
          src="/landing/dashboard.webp"
          alt="The dubbl dashboard showing revenue, expenses, receivables and an aging summary"
          priority
          backdrop={backdrops.lakeRange}
          className="p-3 sm:p-8 lg:p-16"
        />
      </Section>

      <Section className="px-0 sm:px-0 lg:px-0">
        <dl className="grid grid-cols-2 lg:grid-cols-4">
          {facts.map((fact, i) => (
            <div
              key={fact.label}
              className={[
                "border-border px-5 py-8 sm:px-8 lg:px-10 lg:py-10",
                i % 2 === 1 ? "border-l" : "",
                i >= 2 ? "border-t lg:border-t-0" : "",
                i === 2 ? "lg:border-l" : "",
              ].join(" ")}
            >
              <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{fact.label}</dt>
              <dd className="mt-3 font-mono text-3xl font-medium tracking-[-0.04em] text-foreground sm:text-4xl">
                {fact.figure}
              </dd>
              <dd className="mt-3 max-w-[28ch] text-[13px] leading-relaxed text-muted-foreground">{fact.note}</dd>
            </div>
          ))}
        </dl>
      </Section>
    </>
  );
}
