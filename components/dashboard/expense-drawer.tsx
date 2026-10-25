"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Loader2, Paperclip } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

type Item = {
  id: string;
  date: string;
  description: string;
  amount: number;
  account?: { code: string; name: string } | null;
  receiptFileName?: string | null;
};

type Claim = {
  id: string;
  title: string;
  status: string;
  currencyCode: string;
  totalAmount: number;
  items: Item[];
};

const money = (cents: number, cur: string) =>
  new Intl.NumberFormat("en", { style: "currency", currency: cur }).format(cents / 100);

/**
 * The claim behind a reconciled line, without leaving the statement: reconciling
 * is a run of similar decisions and a navigation loses the place in it.
 */
export function ExpenseDrawer({
  claimId,
  orgId,
  onClose,
}: {
  claimId: string | null;
  orgId: string | null;
  onClose: () => void;
}) {
  const [claim, setClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!claimId || !orgId) return;
    let live = true;
    setLoading(true);
    setClaim(null);
    fetch(`/api/v1/expenses/${claimId}`, { headers: { "x-organization-id": orgId } })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => live && setClaim(data?.expenseClaim ?? null))
      .catch(() => live && setClaim(null))
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, [claimId, orgId]);

  return (
    <Sheet open={Boolean(claimId)} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{claim?.title ?? "Expense claim"}</SheetTitle>
        </SheetHeader>

        {loading ? (
          <p className="flex items-center gap-2 px-4 text-xs text-muted-foreground">
            <Loader2 className="size-3.5 animate-spin" /> Loading the claim…
          </p>
        ) : !claim ? (
          <p className="px-4 text-xs text-muted-foreground">This claim could not be loaded.</p>
        ) : (
          <div className="space-y-4 px-4 pb-6">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">
                {claim.items.length} item{claim.items.length === 1 ? "" : "s"}
              </span>
              <span className="text-lg font-semibold tabular-nums">
                {money(claim.totalAmount, claim.currencyCode)}
              </span>
            </div>

            <div className="divide-y rounded-lg border">
              {claim.items.map((item) => (
                <div key={item.id} className="px-3 py-2">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-xs font-medium">{item.description}</span>
                    <span className="shrink-0 text-xs tabular-nums">
                      {money(item.amount, claim.currencyCode)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {item.date}
                    {item.account && ` · ${item.account.code} ${item.account.name}`}
                    {item.receiptFileName && (
                      <span className="ml-1 inline-flex items-center gap-0.5">
                        <Paperclip className="size-2.5" /> {item.receiptFileName}
                      </span>
                    )}
                  </p>
                </div>
              ))}
            </div>

            <Button asChild variant="outline" size="sm" className="w-full justify-between">
              <Link href={`/purchases/expenses/${claim.id}`}>
                Open the full claim <ArrowUpRight className="size-3.5" />
              </Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
