import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { member } from "@/lib/db/schema";
import { ACTIVE_ORG_COOKIE } from "@/lib/active-org";

export interface ServerContext {
  userId: string;
  organizationId: string;
  role: string;
}

/**
 * Auth context for server components.
 *
 * The API routes take their context from a request (session cookie or API key,
 * plus the x-organization-id header). A server component has no request object
 * to read, so it resolves the same information from the session cookie and the
 * active-org cookie, and validates membership exactly as the API does. Never
 * trust the cookie on its own — it is a hint about which org to load.
 */
export async function getServerContext(): Promise<ServerContext> {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const organizationId = (await cookies()).get(ACTIVE_ORG_COOKIE)?.value;
  if (!organizationId) redirect("/onboarding");

  const mem = await db.query.member.findFirst({
    where: and(
      eq(member.organizationId, organizationId),
      eq(member.userId, session.user.id)
    ),
  });

  if (!mem) redirect("/onboarding");

  return { userId: session.user.id, organizationId, role: mem.role };
}

/** Same, but returns null instead of redirecting — for optional data. */
export async function tryGetServerContext(): Promise<ServerContext | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  const organizationId = (await cookies()).get(ACTIVE_ORG_COOKIE)?.value;
  if (!organizationId) return null;
  const mem = await db.query.member.findFirst({
    where: and(
      eq(member.organizationId, organizationId),
      eq(member.userId, session.user.id)
    ),
  });
  return mem ? { userId: session.user.id, organizationId, role: mem.role } : null;
}
