"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { PLAN_LIMITS, PLAN_PRICES, STORAGE_PLANS } from "@/lib/plans";
import { Eyebrow, Heading, Section } from "@/components/landing/ledger";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function fmt(v: number): string {
  if (v === Infinity) return "Unlimited";
  return v.toLocaleString();
}

function fmtStorage(mb: number): string {
  if (mb === Infinity) return "Unlimited";
  if (mb >= 1024) return `${mb / 1024} GB`;
  return `${mb} MB`;
}

function fmtAudit(days: number): string {
  if (days === Infinity) return "Unlimited";
  if (days >= 365) return `${Math.floor(days / 365)} year`;
  return `${days} days`;
}

const annualSaving = Math.round((1 - PLAN_PRICES.pro.annual / PLAN_PRICES.pro.monthly) * 100);

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const plans = [
  {
    key: "free" as const,
    name: "Free",
    audience: "For individuals",
    blurb: "Everything you need for personal bookkeeping. No credit card, no time limit.",
    cta: { label: "Start free", href: "/sign-up" },
    features: [
      `${fmt(PLAN_LIMITS.free.members)} member`,
      `${fmt(PLAN_LIMITS.free.entriesPerMonth)} journal entries / month`,
      `${fmt(PLAN_LIMITS.free.invoicesPerMonth)} invoices / month`,
      `${fmt(PLAN_LIMITS.free.contacts)} contacts`,
      `${fmt(PLAN_LIMITS.free.bankAccounts)} bank account`,
      `${fmt(PLAN_LIMITS.free.projects)} projects`,
      "Trial balance & general ledger",
      "API and MCP access",
      `${fmtStorage(PLAN_LIMITS.free.storageMb)} storage`,
      `${fmtAudit(PLAN_LIMITS.free.auditLogDays)} audit log`,
    ],
  },
  {
    key: "pro" as const,
    name: "Pro",
    audience: "For teams",
    blurb: "Full reporting, multi-currency and your whole team on the same books.",
    cta: { label: "Get Pro", href: "/sign-up?plan=pro" },
    features: [
      `${fmt(PLAN_LIMITS.pro.members)} members`,
      "Unlimited journal entries",
      "Unlimited invoices",
      "Unlimited contacts",
      "Unlimited bank accounts",
      `${fmt(PLAN_LIMITS.pro.projects)} projects`,
      "All financial statements",
      "Multi-currency",
      `${fmtStorage(PLAN_LIMITS.pro.storageMb)} storage`,
      `${fmtAudit(PLAN_LIMITS.pro.auditLogDays)} audit log`,
    ],
  },
];

const storagePlansMeta = [
  { key: "free" as const, name: "Included", description: "With every organization" },
  { key: "starter" as const, name: "Starter", description: "For growing teams" },
  { key: "growth" as const, name: "Growth", description: "For established businesses" },
  { key: "scale" as const, name: "Scale", description: "For large archives" },
];

const limitRows = [
  { label: "Team members", free: fmt(PLAN_LIMITS.free.members), pro: fmt(PLAN_LIMITS.pro.members) },
  { label: "Journal entries / month", free: fmt(PLAN_LIMITS.free.entriesPerMonth), pro: fmt(PLAN_LIMITS.pro.entriesPerMonth) },
  { label: "Contacts", free: fmt(PLAN_LIMITS.free.contacts), pro: fmt(PLAN_LIMITS.pro.contacts) },
  { label: "Invoices / month", free: fmt(PLAN_LIMITS.free.invoicesPerMonth), pro: fmt(PLAN_LIMITS.pro.invoicesPerMonth) },
  { label: "Bank accounts", free: fmt(PLAN_LIMITS.free.bankAccounts), pro: fmt(PLAN_LIMITS.pro.bankAccounts) },
  { label: "Projects", free: fmt(PLAN_LIMITS.free.projects), pro: fmt(PLAN_LIMITS.pro.projects) },
  { label: "Storage (included)", free: fmtStorage(PLAN_LIMITS.free.storageMb), pro: fmtStorage(PLAN_LIMITS.pro.storageMb) },
  { label: "Emails / month", free: fmt(PLAN_LIMITS.free.emailsPerMonth), pro: fmt(PLAN_LIMITS.pro.emailsPerMonth) },
  { label: "Audit log retention", free: fmtAudit(PLAN_LIMITS.free.auditLogDays), pro: fmtAudit(PLAN_LIMITS.pro.auditLogDays) },
  { label: "Backup retention", free: fmtAudit(PLAN_LIMITS.free.backupRetentionDays), pro: fmtAudit(PLAN_LIMITS.pro.backupRetentionDays) },
];

const featureRows: { label: string; free: boolean; pro: boolean }[] = [
  { label: "Double-entry bookkeeping", free: true, pro: true },
  { label: "Trial balance & general ledger", free: true, pro: true },
  { label: "Balance sheet & income statement", free: false, pro: true },
  { label: "Profit & loss report", free: false, pro: true },
  { label: "Cash flow statement", free: false, pro: true },
  { label: "Aged receivables & payables", free: false, pro: true },
  { label: "Account transaction reports", free: false, pro: true },
  { label: "API and MCP access", free: PLAN_LIMITS.free.apiAccess, pro: PLAN_LIMITS.pro.apiAccess },
  { label: "CRM & sales pipeline", free: true, pro: true },
  { label: "Invoicing & billing", free: true, pro: true },
  { label: "Bank reconciliation", free: true, pro: true },
  { label: "Multi-currency", free: PLAN_LIMITS.free.multiCurrency, pro: PLAN_LIMITS.pro.multiCurrency },
  { label: "Community support", free: true, pro: true },
  { label: "Email support", free: false, pro: true },
];

const faqs = [
  {
    q: "Can I switch plans?",
    a: "Yes, at any time from billing settings. Upgrades are prorated, so you only pay for the rest of the current period.",
  },
  {
    q: "What happens if I hit a limit?",
    a: "Nothing is deleted or locked. You keep full access to everything you already have — creating new records of that type pauses until you upgrade or the monthly count resets.",
  },
  {
    q: "How does annual billing work?",
    a: `Pro is $${PLAN_PRICES.pro.annual} per seat per month when billed yearly, instead of $${PLAN_PRICES.pro.monthly} — about ${annualSaving}% less.`,
  },
  {
    q: "How does seat pricing work?",
    a: "Every member of the organization counts as one seat. Add or remove people whenever you like and the next invoice adjusts.",
  },
  {
    q: "Can I add storage separately?",
    a: "Yes. Storage and email add-ons are billed on their own and work with either team plan.",
  },
  {
    q: "Is self-hosting really free?",
    a: "Yes. dubbl is Apache 2.0 licensed — self-hosted instances have every feature with no user caps. The cloud plans fund development.",
  },
];

/* ------------------------------------------------------------------ */
/*  Small components                                                   */
/* ------------------------------------------------------------------ */

function Value({ value }: { value: boolean | string }) {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="size-4 text-foreground" strokeWidth={1.75} aria-label="Included" />
    ) : (
      <Minus className="size-4 text-muted-foreground/40" strokeWidth={1.75} aria-label="Not included" />
    );
  }
  return <span className="font-mono text-[13px] tabular-nums text-foreground">{value}</span>;
}

function IntervalToggle({
  value,
  onChange,
}: {
  value: "monthly" | "annual";
  onChange: (v: "monthly" | "annual") => void;
}) {
  return (
    <div role="radiogroup" aria-label="Billing interval" className="inline-flex rounded-full border border-border p-1">
      {(["monthly", "annual"] as const).map((v) => (
        <button
          key={v}
          role="radio"
          aria-checked={value === v}
          onClick={() => onChange(v)}
          className={cn(
            "rounded-full px-4 py-1.5 text-[13px] font-medium capitalize transition-colors",
            value === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {v}
          {v === "annual" && (
            <span className={cn("ml-1.5 font-mono text-[11px]", value === v ? "opacity-70" : "text-muted-foreground")}>
              −{annualSaving}%
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function PricingPage() {
  const [interval, setInterval] = useState<"monthly" | "annual">("annual");
  const proPrice = interval === "annual" ? PLAN_PRICES.pro.annual : PLAN_PRICES.pro.monthly;

  return (
    <>
      {/* Hero */}
      <Section rule={false} className="pb-16 pt-20 lg:pb-20 lg:pt-28">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Eyebrow>Pricing</Eyebrow>
            <Heading as="h1" lead="Start free." className="mt-6 max-w-[13ch]">
              Pay when your team grows.
            </Heading>
          </div>
          <div className="flex flex-col gap-5 lg:items-end">
            <p className="max-w-[40ch] text-[17px] leading-relaxed text-muted-foreground lg:text-right">
              Two plans, optional storage add-ons, and every feature free when you self-host.
            </p>
            <IntervalToggle value={interval} onChange={setInterval} />
          </div>
        </div>
      </Section>

      {/* Plans */}
      <Section id="plans" className="px-0 sm:px-0 lg:px-0">
        <div className="grid lg:grid-cols-2">
          {plans.map((plan, i) => {
            const isPro = plan.key === "pro";
            return (
              <div
                key={plan.key}
                className={cn(
                  "flex flex-col px-5 py-12 sm:px-8 lg:px-12 lg:py-16",
                  i > 0 && "border-t border-border lg:border-l lg:border-t-0",
                  isPro && "bg-muted/40"
                )}
              >
                <div className="flex items-baseline justify-between">
                  <h2 className="text-2xl font-semibold tracking-[-0.04em] text-foreground">{plan.name}</h2>
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    {plan.audience}
                  </span>
                </div>

                <div className="mt-10 flex items-baseline gap-2">
                  <span className="text-6xl font-semibold tracking-[-0.06em] tabular-nums text-foreground">
                    ${isPro ? proPrice : 0}
                  </span>
                  <span className="text-sm text-muted-foreground">{isPro ? "per seat / month" : "forever"}</span>
                </div>
                <p className="mt-2 h-4 font-mono text-[11px] text-muted-foreground">
                  {isPro
                    ? interval === "annual"
                      ? `$${proPrice * 12} per seat, billed yearly`
                      : "Billed monthly"
                    : "No credit card required"}
                </p>

                <p className="mt-8 max-w-[44ch] text-[15px] leading-relaxed text-muted-foreground">{plan.blurb}</p>

                <ul className="mt-8 grid flex-1 content-start gap-x-8 border-t border-border sm:grid-cols-2">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2.5 border-b border-border py-3 text-[13px] text-foreground"
                    >
                      <Check className="size-3.5 shrink-0 text-muted-foreground" strokeWidth={2} />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.cta.href}
                  className={cn(
                    "group mt-10 inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition-colors",
                    isPro
                      ? "bg-primary text-primary-foreground hover:bg-primary/85"
                      : "border border-border bg-background text-foreground hover:bg-accent"
                  )}
                >
                  {plan.cta.label}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Storage */}
      <Section className="px-0 sm:px-0 lg:px-0">
        <div className="grid gap-8 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_1.2fr] lg:px-12 lg:py-28">
          <div>
            <Eyebrow index="01">Add-ons</Eyebrow>
            <Heading lead="Storage and email," className="mt-5 max-w-[16ch]">
              as you need them.
            </Heading>
          </div>
          <p className="max-w-[52ch] self-end text-[17px] leading-relaxed text-muted-foreground lg:justify-self-end">
            File storage for documents, receipts and attachments, plus customer emails for invoices and reminders.
            Billed separately from your team plan.
          </p>
        </div>

        <div className="grid border-t border-border sm:grid-cols-2 lg:grid-cols-4">
          {storagePlansMeta.map((meta, i) => {
            const plan = STORAGE_PLANS[meta.key];
            const price = interval === "annual" ? plan.annual : plan.monthly;
            return (
              <div
                key={meta.key}
                className={cn(
                  "flex flex-col px-5 py-10 sm:px-8 lg:px-10",
                  i > 0 && "border-t border-border sm:border-t-0",
                  i % 2 === 1 && "sm:border-l",
                  i >= 2 && "sm:border-t lg:border-t-0",
                  i === 2 && "lg:border-l"
                )}
              >
                <div className="flex items-baseline justify-between">
                  <h3 className="text-[15px] font-semibold text-foreground">{meta.name}</h3>
                  <span className="font-mono text-[11px] text-muted-foreground/70">0{i + 1}</span>
                </div>
                <p className="mt-1 text-[13px] text-muted-foreground">{meta.description}</p>

                <p className="mt-8 flex items-baseline gap-1.5">
                  <span className="text-4xl font-semibold tracking-[-0.05em] tabular-nums text-foreground">${price}</span>
                  <span className="text-[13px] text-muted-foreground">/ month</span>
                </p>

                <dl className="mt-8 border-t border-border font-mono text-[12px]">
                  <div className="flex justify-between border-b border-border py-2.5">
                    <dt className="text-muted-foreground">Files</dt>
                    <dd className="tabular-nums text-foreground">{fmtStorage(plan.filesMb)}</dd>
                  </div>
                  <div className="flex justify-between border-b border-border py-2.5">
                    <dt className="text-muted-foreground">Emails</dt>
                    <dd className="tabular-nums text-foreground">{plan.emailsPerMonth.toLocaleString()} / mo</dd>
                  </div>
                </dl>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Compare */}
      <Section className="py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <Eyebrow index="02">Compare</Eyebrow>
            <Heading lead="Every detail," className="mt-5 max-w-[12ch]">
              side by side.
            </Heading>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-foreground/80">
                <th className="py-3 pr-4 font-mono text-[11px] font-normal uppercase tracking-[0.16em] text-muted-foreground">
                  <span className="sr-only">Feature</span>
                </th>
                <th className="w-28 py-3 text-[13px] font-semibold text-foreground">Free</th>
                <th className="w-28 py-3 text-[13px] font-semibold text-foreground">
                  Pro <span className="ml-1 font-mono text-[11px] font-normal text-muted-foreground">${proPrice}</span>
                </th>
              </tr>
            </thead>
            {[
              { title: "Limits", rows: limitRows },
              { title: "Features & support", rows: featureRows },
            ].map((group) => (
              <tbody key={group.title}>
                <tr>
                  <th
                    colSpan={3}
                    scope="colgroup"
                    className="pb-2 pt-8 font-mono text-[11px] font-normal uppercase tracking-[0.16em] text-muted-foreground"
                  >
                    {group.title}
                  </th>
                </tr>
                {group.rows.map((row) => (
                  <tr key={row.label} className="border-t border-border">
                    <td className="py-3 pr-4 text-[14px] text-foreground">{row.label}</td>
                    <td className="py-3">
                      <Value value={row.free} />
                    </td>
                    <td className="py-3">
                      <Value value={row.pro} />
                    </td>
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
      </Section>

      {/* Self-host */}
      <Section className="px-0 sm:px-0 lg:px-0">
        <div className="grid lg:grid-cols-2">
          <div className="px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
            <Eyebrow index="03">Self-host</Eyebrow>
            <Heading lead="Your servers." className="mt-5 max-w-[14ch]">
              Every feature, no limits.
            </Heading>
          </div>
          <div className="flex flex-col justify-end gap-6 border-t border-border px-5 py-16 sm:px-8 lg:border-l lg:border-t-0 lg:px-12 lg:py-20">
            <p className="max-w-[46ch] text-[15px] leading-relaxed text-muted-foreground">
              dubbl is Apache 2.0 licensed. Run it on your own infrastructure with Docker Compose and PostgreSQL — no
              seat caps, no feature gates.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <Link
                href="/docs/self-hosting"
                className="group inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/85"
              >
                Self-host guide
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href="https://github.com/dubbl-org/dubbl"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-11 items-center gap-1.5 rounded-full border border-border px-5 text-sm text-foreground transition-colors hover:bg-accent"
              >
                GitHub
                <ArrowUpRight className="size-3.5 text-muted-foreground transition-colors group-hover:text-foreground" />
              </a>
            </div>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section className="py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <Eyebrow index="04">Billing FAQ</Eyebrow>
            <Heading lead="Billing," className="mt-5 max-w-[12ch]">
              plainly.
            </Heading>
            <p className="mt-6 max-w-[34ch] text-[15px] leading-relaxed text-muted-foreground">
              Anything else?{" "}
              <a
                href="mailto:team@dubbl.dev"
                className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
              >
                team@dubbl.dev
              </a>
            </p>
          </div>

          <Accordion type="single" collapsible className="border-t border-border">
            {faqs.map((faq, i) => (
              <AccordionItem key={faq.q} value={`faq-${i}`} className="border-border last:border-b">
                <AccordionTrigger className="gap-6 py-5 text-[15px] font-medium tracking-[-0.01em] text-foreground hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="max-w-[60ch] pb-6 text-[15px] leading-relaxed text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>
    </>
  );
}
