import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Eyebrow, Heading, Section, Shot } from "@/components/landing/ledger";
import { backdrops } from "@/components/landing/backdrops";

const steps = [
  {
    n: "01",
    title: "Record",
    body: "Send an invoice, log a bill, import a bank statement. Each one posts a balanced journal entry on its own — you only type debits and credits when you want to.",
    link: { label: "Invoicing guide", href: "/docs/modules/invoicing" },
    shot: { src: "/landing/invoices.webp", alt: "Invoices list with outstanding and overdue totals", backdrop: backdrops.shoreline },
  },
  {
    n: "02",
    title: "Run",
    body: "Deals, projects and stock share the same customers, products and accounts as your books. There is nothing to sync, so nothing drifts out of date.",
    link: { label: "Import from QuickBooks or Xero", href: "/docs/guides/import-export" },
    shot: { src: "/landing/pipeline.webp", alt: "Sales pipeline with deals grouped by stage", backdrop: backdrops.cove },
  },
  {
    n: "03",
    title: "Report",
    body: "Profit and loss, balance sheet, cash flow and 31 reports that are always current. Export to PDF or CSV, or have them emailed on a schedule.",
    link: { label: "Tax filing prep", href: "/docs/guides/tax-filing-prep" },
    shot: { src: "/landing/profit-and-loss.webp", alt: "Profit and loss report with money in and money out", backdrop: backdrops.snowfield },
  },
];

export function Workflow() {
  return (
    <Section className="px-0 sm:px-0 lg:px-0">
      <div className="px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <Eyebrow index="02">How it works</Eyebrow>
        <Heading lead="Record, run, report." className="mt-5 max-w-[20ch]">
          From the first invoice to a filed return.
        </Heading>
      </div>

      {steps.map((step) => (
        <div
          key={step.n}
          className="grid gap-10 border-t border-border px-5 py-14 sm:px-8 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.6fr)] lg:gap-16 lg:px-12 lg:py-20"
        >
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="font-mono text-5xl font-light tracking-[-0.06em] text-muted-foreground/40">{step.n}</p>
            <h3 className="mt-6 text-3xl font-semibold tracking-[-0.04em] text-foreground">{step.title}</h3>
            <p className="mt-4 max-w-[40ch] text-[15px] leading-relaxed text-muted-foreground">{step.body}</p>
            <Link
              href={step.link.href}
              className="group mt-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground"
            >
              {step.link.label}
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <Shot src={step.shot.src} alt={step.shot.alt} backdrop={step.shot.backdrop} className="p-3 sm:p-8 lg:p-10" />
        </div>
      ))}
    </Section>
  );
}
