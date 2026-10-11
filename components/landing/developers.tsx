import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Eyebrow, Heading, Section } from "@/components/landing/ledger";

function Code({ label, tag, children }: { label: string; tag: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col">
      <div className="flex items-center justify-between border-b border-border px-5 py-3 sm:px-8 lg:px-10">
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-foreground">{label}</span>
        <span className="font-mono text-[11px] text-muted-foreground">{tag}</span>
      </div>
      <pre className="overflow-x-auto px-5 py-7 font-mono text-[13px] leading-[1.75] text-foreground sm:px-8 lg:px-10">
        {children}
      </pre>
    </div>
  );
}

const Dim = ({ children }: { children: React.ReactNode }) => <span className="text-muted-foreground/70">{children}</span>;

const links = [
  { label: "REST API reference", href: "/docs/api-reference" },
  { label: "Connect an AI agent", href: "/docs/guides/mcp" },
  { label: "Self-hosting guide", href: "/docs/self-hosting" },
];

export function Developers() {
  return (
    <Section id="developers" className="px-0 sm:px-0 lg:px-0">
      <div className="grid gap-8 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_1.2fr] lg:px-12 lg:py-28">
        <div>
          <Eyebrow index="03">Developers</Eyebrow>
          <Heading lead="API-first." className="mt-5 max-w-[16ch]">
            Built for developers and AI agents.
          </Heading>
        </div>
        <p className="max-w-[52ch] self-end text-[17px] leading-relaxed text-muted-foreground lg:justify-self-end">
          Everything in the app is available over a REST API, and through 357 MCP tools so Claude and other agents can
          read and write your books — with the same balancing rules as everyone else.
        </p>
      </div>

      <div className="grid border-t border-border lg:grid-cols-2">
        <Code label="REST API" tag="curl">
          <Dim>$ </Dim>curl https://dubbl.dev/api/v1/invoices \{"\n"}
          {"    "}-H <Dim>&quot;Authorization: Bearer $DUBBL_API_KEY&quot;</Dim> \{"\n"}
          {"    "}-H <Dim>&quot;x-organization-id: $ORG_ID&quot;</Dim>
        </Code>
        <div className="border-t border-border lg:border-l lg:border-t-0">
          <Code label="MCP" tag="Claude Code">
            <Dim>$ </Dim>claude mcp add --transport http dubbl \{"\n"}
            {"    "}https://dubbl.dev/api/mcp{"\n\n"}
            <Dim>&gt; </Dim>Which invoices are more than 30 days overdue?
          </Code>
        </div>
      </div>

      <div className="grid border-t border-border sm:grid-cols-3">
        {links.map((l, i) => (
          <Link
            key={l.href}
            href={l.href}
            className={[
              "group flex items-center justify-between px-5 py-5 text-[13px] font-medium text-foreground transition-colors hover:bg-accent sm:px-8 lg:px-10",
              i > 0 ? "border-t border-border sm:border-l sm:border-t-0" : "",
            ].join(" ")}
          >
            {l.label}
            <ArrowUpRight className="size-3.5 text-muted-foreground transition-transform group-hover:-translate-y-px group-hover:translate-x-px group-hover:text-foreground" />
          </Link>
        ))}
      </div>
    </Section>
  );
}
