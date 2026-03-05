import { auth } from "@/auth";
import { db } from "@/db";
import { subdomains } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import Link from "next/link";
import DashboardClient from "./client";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/api/auth/signin");

  const sessionUser = session.user as typeof session.user & { id: string; githubUsername: string };
  const userSubdomains = await db
    .select()
    .from(subdomains)
    .where(eq(subdomains.userId, sessionUser.id));

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto border-b border-zinc-100 dark:border-zinc-800">
        <Link href="/" className="font-bold text-lg tracking-tight">
          <span className="text-green-600">from</span>-mm.dev
        </Link>
        <div className="flex items-center gap-3 text-sm">
          {session.user.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={session.user.image} alt="" className="w-7 h-7 rounded-full" />
          )}
          <span className="text-zinc-500">{sessionUser.githubUsername}</span>
          <Link href="/api/auth/signout" className="text-zinc-400 hover:text-zinc-600 transition-colors">
            Sign out
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Your subdomains</h1>
            <p className="text-zinc-500 text-sm mt-1">
              {userSubdomains.length} / 5 used
            </p>
          </div>
          {userSubdomains.length < 5 && (
            <Link
              href="/register"
              className="rounded-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 px-5 py-2 text-sm font-medium hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors"
            >
              + Add subdomain
            </Link>
          )}
        </div>

        {userSubdomains.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
            <p className="text-zinc-400 mb-4">You don&apos;t have any subdomains yet.</p>
            <Link
              href="/register"
              className="rounded-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 px-6 py-2.5 text-sm font-medium hover:bg-zinc-700 transition-colors"
            >
              Claim your first subdomain
            </Link>
          </div>
        ) : (
          <DashboardClient subdomains={userSubdomains} />
        )}
      </main>
    </div>
  );
}
