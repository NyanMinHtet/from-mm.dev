"use client";

import { useState } from "react";
import Link from "next/link";
import type { Subdomain } from "@/db/schema";

const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN ?? "from-mm.dev";

export default function DashboardClient({ subdomains }: { subdomains: Subdomain[] }) {
  const [list, setList] = useState(subdomains);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [openInstructions, setOpenInstructions] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Delete this subdomain? This cannot be undone.")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/subdomains/${id}`, { method: "DELETE" });
      if (res.ok) setList((prev) => prev.filter((s) => s.id !== id));
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {list.map((sub) => {
        const url = `https://${sub.subdomain}.${BASE_DOMAIN}`;
        const docsLink = sub.type === "github_pages" ? "/docs/github-pages" : "/docs/vercel";
        const isOpen = openInstructions === sub.id;

        return (
          <div
            key={sub.id}
            className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold text-green-600">{sub.subdomain}</span>
                  <span className="text-zinc-400 font-mono text-sm">.{BASE_DOMAIN}</span>
                  <span
                    className={`text-xs rounded-full px-2 py-0.5 ${
                      sub.status === "active"
                        ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400"
                        : "bg-red-100 dark:bg-red-900 text-red-700"
                    }`}
                  >
                    {sub.status}
                  </span>
                </div>
                <span className="text-xs text-zinc-400">
                  {sub.type === "github_pages" ? "GitHub Pages" : "Vercel"} · → {sub.target}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigator.clipboard.writeText(url)}
                  className="text-xs border border-zinc-200 dark:border-zinc-700 rounded-full px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  title="Copy URL"
                >
                  Copy URL
                </button>
                <button
                  onClick={() => setOpenInstructions(isOpen ? null : sub.id)}
                  className="text-xs border border-zinc-200 dark:border-zinc-700 rounded-full px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  {isOpen ? "Hide setup" : "Setup guide"}
                </button>
                <button
                  onClick={() => handleDelete(sub.id)}
                  disabled={deleting === sub.id}
                  className="text-xs text-red-500 border border-red-200 dark:border-red-900 rounded-full px-3 py-1.5 hover:bg-red-50 dark:hover:bg-red-950 transition-colors disabled:opacity-50"
                >
                  {deleting === sub.id ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>

            {isOpen && (
              <div className="px-5 pb-5 pt-0 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                <div className="pt-4 flex flex-col gap-3">
                  <p className="text-sm font-medium">
                    {sub.type === "github_pages" ? "🐙 GitHub Pages setup" : "▲ Vercel setup"}
                  </p>
                  {sub.type === "github_pages" ? (
                    <ol className="text-sm text-zinc-600 dark:text-zinc-400 list-decimal list-inside flex flex-col gap-1.5">
                      <li>Create a file named <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">CNAME</code> in your repo root containing: <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">{sub.subdomain}.{BASE_DOMAIN}</code></li>
                      <li>Go to repo <strong>Settings → Pages</strong> and set the custom domain field to <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">{sub.subdomain}.{BASE_DOMAIN}</code></li>
                      <li>Check <strong>Enforce HTTPS</strong></li>
                      <li>Wait a few minutes for DNS to propagate</li>
                    </ol>
                  ) : (
                    <ol className="text-sm text-zinc-600 dark:text-zinc-400 list-decimal list-inside flex flex-col gap-1.5">
                      <li>Go to your Vercel project <strong>Settings → Domains</strong></li>
                      <li>Click <strong>Add</strong> and enter <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">{sub.subdomain}.{BASE_DOMAIN}</code></li>
                      <li>Vercel shows a CNAME value — that value is already set in your DNS</li>
                      <li>HTTPS is automatic once Vercel verifies (usually &lt;5 min)</li>
                    </ol>
                  )}
                  <Link href={docsLink} className="text-sm text-green-600 hover:underline mt-1">
                    Full setup guide →
                  </Link>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
