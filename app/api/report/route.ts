import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { abuseReports, subdomains } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { randomUUID } from "crypto";

const schema = z.object({
  subdomain: z.string(),
  reporterEmail: z.string().email().optional().or(z.literal("")),
  reason: z.string().min(10, "Please provide at least 10 characters."),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { subdomain, reporterEmail, reason } = parsed.data;

  const record = await db
    .select()
    .from(subdomains)
    .where(eq(subdomains.subdomain, subdomain))
    .limit(1);

  if (!record[0]) {
    return NextResponse.json({ error: "Subdomain not found" }, { status: 404 });
  }

  await db.insert(abuseReports).values({
    id: randomUUID(),
    subdomainId: record[0].id,
    reporterEmail: reporterEmail || null,
    reason,
  });

  return NextResponse.json({ success: true });
}
