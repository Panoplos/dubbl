"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, Loader2, Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Transaction } from "../../_components";

type Tx = Transaction;


type Candidate = {
  type: "existing_payment" | "existing_journal" | "transfer" | "existing_expense";
  id: string;
  journalEntryId: string | null;
  date: string;
  description: string;
  amount: number;
};

type Ranked = { candidate: Candidate; confidence: number; reasons: string[] };

/**
 * Ids in imported descriptions are noise to a reader: a statement line and a
 * matched claim should look the same at a glance, not differ by a uuid.
 */
function clean(text: string): string {
  return text
    .replace(/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, "")
    .replace(/\bET-[0-9a-f]{16,}\b/gi, "")
    .replace(/\s*\|\s*(\|\s*)*/g, " · ")
    .replace(/^[\s·]+|[\s·]+$/g, "")
    .replace(/\s{2,}/g, " ");
}

/** "Hetzner · Expense · Genba portion…" reads as payee + detail. */
function split(text: string): { payee: string; detail: string } {
  const parts = clean(text).split(" · ").filter(Boolean);
  if (parts.length <= 1) return { payee: parts[0] || text, detail: "" };
  return { payee: parts[0], detail: parts.slice(1).join(" · ") };
}

const money = (cents: number, cur: string) =>
  new Intl.NumberFormat("en", { style: "currency", currency: cur }).format(cents / 100);

export function TransactionsSplit({
  transactions,
  cur,
  orgId,
  onRefetch,
  onCreateExpense,
  onCategorize,
  onExclude,
}: {
  transactions: Tx[];
  cur: string;
  orgId: string | null;
  onRefetch: () => void;
  onCreateExpense: (tx: Tx) => void;
  onCategorize: (tx: Tx) => void;
  onExclude: (txId: string) => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [matches, setMatches] = useState<Ranked[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [linking, setLinking] = useState<string | null>(null);

  // Default to the first line still to do, which is what the screen is for.
  useEffect(() => {
    if (selectedId && transactions.some((t) => t.id === selectedId)) return;
    const first = transactions.find((t) => t.status === "unreconciled") ?? transactions[0];
    setSelectedId(first?.id ?? null);
  }, [transactions, selectedId]);

  const selected = useMemo(
    () => transactions.find((t) => t.id === selectedId) ?? null,
    [transactions, selectedId]
  );

  useEffect(() => {
    if (!selected || !orgId || selected.status !== "unreconciled") {
      setMatches(null);
      return;
    }
    let live = true;
    setLoading(true);
    setMatches(null);
    fetch(`/api/v1/bank-transactions/${selected.id}/match`, {
      headers: { "x-organization-id": orgId },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!live) return;
        const ranked: Ranked[] = (data?.existingMatches ?? [])
          .filter((m: Ranked) => m.confidence >= 45)
          .sort((a: Ranked, b: Ranked) => b.confidence - a.confidence);
        setMatches(ranked);
      })
      .catch(() => live && setMatches([]))
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, [selected, orgId]);

  const link = useCallback(
    async (m: Ranked) => {
      if (!selected || !orgId) return;
      setLinking(m.candidate.id);
      try {
        const body =
          m.candidate.type === "existing_payment"
            ? { matchType: "existing_payment", paymentId: m.candidate.id }
            : { matchType: "journal", journalEntryId: m.candidate.journalEntryId };
        const res = await fetch(`/api/v1/bank-transactions/${selected.id}/match`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-organization-id": orgId },
          body: JSON.stringify(body),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          toast.error(data.error || "Could not link this transaction");
          return;
        }
        toast.success("Linked — this line is reconciled");
        onRefetch();
      } finally {
        setLinking(null);
      }
    },
    [selected, orgId, onRefetch]
  );

  const best = matches?.[0];
  const rest = matches?.slice(1) ?? [];

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
      {/* Left: the statement as a reader sees it */}
      <div className="overflow-hidden rounded-xl border">
        <div className="grid grid-cols-[1fr_auto] items-center gap-3 border-b bg-muted/40 px-4 py-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          <span>Transaction</span>
          <span>Amount</span>
        </div>
        <div className="max-h-[calc(100vh-20rem)] overflow-y-auto">
          {transactions.map((tx) => {
            const { payee, detail } = split(tx.description);
            const isSelected = tx.id === selectedId;
            const done = tx.status !== "unreconciled";
            return (
              <button
                key={tx.id}
                type="button"
                onClick={() => setSelectedId(tx.id)}
                aria-current={isSelected}
                className={cn(
                  "grid w-full grid-cols-[1fr_auto] items-center gap-3 border-b px-4 py-3 text-left transition-colors last:border-b-0",
                  isSelected ? "bg-accent/60" : "hover:bg-accent/30",
                  done && "opacity-60"
                )}
              >
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="truncate text-sm font-medium">{payee}</span>
                    <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
                      {tx.date}
                    </span>
                  </div>
                  {detail && (
                    <p className="truncate text-xs text-muted-foreground">{detail}</p>
                  )}
                </div>
                <span
                  className={cn(
                    "shrink-0 text-sm tabular-nums",
                    tx.amount < 0 ? "text-foreground" : "text-emerald-600"
                  )}
                >
                  {money(tx.amount, cur)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: what you can do with the selected line */}
      <div className="lg:sticky lg:top-4 lg:self-start">
        {!selected ? (
          <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            Pick a transaction to reconcile it.
          </div>
        ) : (
          <div className="space-y-4 rounded-xl border p-4">
            <div>
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm font-semibold">{split(selected.description).payee}</p>
                <p className="shrink-0 text-sm tabular-nums">
                  {money(selected.amount, cur)}
                </p>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {selected.date}
                {split(selected.description).detail && ` · ${split(selected.description).detail}`}
              </p>
            </div>

            {selected.status !== "unreconciled" ? (
              <p className="rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                This line is already {selected.status === "reconciled" ? "reconciled" : "ignored"}.
              </p>
            ) : loading ? (
              <p className="flex items-center gap-2 px-1 text-xs text-muted-foreground">
                <Loader2 className="size-3.5 animate-spin" /> Looking for matches in your books…
              </p>
            ) : best ? (
              <div className="space-y-2">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  {best.confidence >= 70 ? "Suggested match" : "Possible matches"}
                </p>
                {[best, ...rest].map((m, index) => {
                  const confident = m.confidence >= 70;
                  return (
                    <div
                      key={m.candidate.id}
                      className={cn(
                        "rounded-lg border p-3",
                        index === 0 && confident && "border-emerald-600/40 bg-emerald-600/5"
                      )}
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-sm font-medium">
                          {confident && index === 0 && (
                            <Check className="mr-1 inline size-3.5 text-emerald-600" />
                          )}
                          {split(m.candidate.description).payee}
                        </span>
                        <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                          {m.confidence}%
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {m.candidate.date} · {m.reasons.join(", ")}
                      </p>
                      <Button
                        size="sm"
                        variant={confident ? "default" : "outline"}
                        className="mt-2 w-full gap-1.5"
                        loading={linking === m.candidate.id}
                        onClick={() => link(m)}
                      >
                        Reconcile <ArrowRight className="size-3.5" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                Nothing in your books matches this line yet.
              </p>
            )}

            {selected.status === "unreconciled" && (
              <div className="space-y-2 border-t pt-3">
                <Button
                  size="sm"
                  className="w-full justify-start gap-1.5"
                  onClick={() => onCreateExpense(selected)}
                >
                  <Plus className="size-3.5" /> Create an expense{best ? "" : " from this line"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-start gap-1.5"
                  onClick={() => onCategorize(selected)}
                >
                  <Sparkles className="size-3.5" /> Categorize to an account
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full justify-start text-xs text-muted-foreground"
                  onClick={() => onExclude(selected.id)}
                >
                  Ignore this line
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
