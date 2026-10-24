import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { organization } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
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

    const currencies = body.currencies ?? ["USD", "GBP"];
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
