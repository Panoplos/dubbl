import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { and, eq, ne, isNull, isNotNull } from "drizzle-orm";
import { bankAccount, bankTransaction, organization } from "@/lib/db/schema";
import { notDeleted } from "@/lib/db/soft-delete";
import { getAuthContext } from "@/lib/api/auth-context";
import { requireRole } from "@/lib/api/require-role";
import { handleError } from "@/lib/api/response";
import { backfillRates } from "@/lib/currency/rate-backfill";
import { currencyCodeSchema } from "@/lib/currency/zod";
import { z } from "zod";

const bodySchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  /** Defaults to every pair the organisation already tracks. */
  currencies: z.array(currencyCodeSchema).optional(),
});

export async function POST(request: Request) {
  try {
    const ctx = await getAuthContext(request);
    requireRole(ctx, "manage:settings");

    const body = bodySchema.parse(await request.json().catch(() => ({})));
    const to = body.to ?? new Date().toISOString().slice(0, 10);

    const org = await db.query.organization.findFirst({
      where: eq(organization.id, ctx.organizationId),
    });
    if (!org) return NextResponse.json({ error: "Organization not found" }, { status: 404 });

    // Default to the currencies the books are actually waiting on: anything
    // sitting unreconciled in a currency other than the organisation's own is
    // a posting that cannot happen until its rate exists.
    const currencies =
      body.currencies ??
      (
        await db
          .selectDistinct({ code: bankTransaction.currencyCode })
          .from(bankTransaction)
          .innerJoin(bankAccount, eq(bankTransaction.bankAccountId, bankAccount.id))
          .where(
            and(
              eq(bankAccount.organizationId, ctx.organizationId),
              notDeleted(bankAccount.deletedAt),
              isNull(bankTransaction.journalEntryId),
              isNotNull(bankTransaction.currencyCode),
              ne(bankTransaction.currencyCode, org.defaultCurrency)
            )
          )
      )
        .map((r) => r.code)
        .filter((c): c is string => Boolean(c));
    const result = await backfillRates(ctx.organizationId, org.defaultCurrency, currencies, body.from, to);

    return NextResponse.json({
      baseCurrency: org.defaultCurrency,
      from: body.from,
      to,
      currencies,
      ...result,
    });
  } catch (err) {
    return handleError(err);
  }
}
