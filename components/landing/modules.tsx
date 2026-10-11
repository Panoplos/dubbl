import {
  BookOpen,
  Boxes,
  Briefcase,
  FileText,
  Landmark,
  Receipt,
  Users,
  Wallet,
} from "lucide-react";
import { Eyebrow, Heading, Section } from "@/components/landing/ledger";

const modules = [
  { icon: BookOpen, title: "Accounting", body: "Chart of accounts, journals, fixed assets, loans and period locks." },
  { icon: FileText, title: "Sales", body: "Invoices, quotes, credit notes, recurring billing and payment links." },
  { icon: Receipt, title: "Purchases", body: "Bills, purchase orders, expense claims and approval flows." },
  { icon: Landmark, title: "Banking", body: "Import statements, reconcile line by line, schedule payments." },
  { icon: Boxes, title: "Inventory", body: "Stock levels, locations, transfers, stocktakes and valuation." },
  { icon: Briefcase, title: "Projects", body: "Tasks, budgets and time tracking that turns into invoices." },
  { icon: Wallet, title: "Payroll", body: "Pay runs, payslips, timesheets and leave requests." },
  { icon: Users, title: "CRM", body: "Pipelines and deals attached to the same customers you bill." },
];

export function Modules() {
  return (
    <Section id="product" className="px-0 sm:px-0 lg:px-0">
      <div className="grid gap-8 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_1.2fr] lg:px-12 lg:py-28">
        <div>
          <Eyebrow index="01">Product</Eyebrow>
          <Heading lead="One app." className="mt-5 max-w-[16ch]">
            Every module posts to the same books.
          </Heading>
        </div>
        <p className="max-w-[52ch] self-end text-[17px] leading-relaxed text-muted-foreground lg:justify-self-end">
          No syncing between tools and no month-end exports. An invoice, a bill, a stock movement or a pay run is a
          journal entry the moment it happens — plus tax returns, documents and 31 live reports on top.
        </p>
      </div>

      <div className="grid grid-cols-1 border-t border-border sm:grid-cols-2 lg:grid-cols-4">
        {modules.map((m, i) => (
          <div
            key={m.title}
            className="group relative border-b border-border px-5 py-8 sm:px-8 lg:px-10 lg:py-10 sm:[&:nth-child(odd)]:border-r lg:[&:nth-child(odd)]:border-r-0 lg:[&:not(:nth-child(4n))]:border-r lg:[&:nth-last-child(-n+4)]:border-b-0"
          >
            <div className="flex items-center justify-between">
              <m.icon className="size-[18px] text-foreground" strokeWidth={1.5} />
              <span className="font-mono text-[11px] text-muted-foreground/60">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <h3 className="mt-10 text-[15px] font-semibold tracking-[-0.02em] text-foreground">{m.title}</h3>
            <p className="mt-1.5 max-w-[30ch] text-[13px] leading-relaxed text-muted-foreground">{m.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
