import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { subdomains } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { deleteCnameRecord } from "@/lib/cloudflare";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const sessionUser = session.user as typeof session.user & { id: string };

  const record = await db
    .select()
    .from(subdomains)
    .where(and(eq(subdomains.id, id), eq(subdomains.userId, sessionUser.id)))
    .limit(1);

  if (!record[0]) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (record[0].cfRecordId) {
    await deleteCnameRecord(record[0].cfRecordId);
  }

  await db.delete(subdomains).where(eq(subdomains.id, id));

  return NextResponse.json({ success: true });
}
