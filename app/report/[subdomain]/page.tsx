"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ReportPage() {
  const params = useParams();
  const subdomain = params.subdomain as string;

  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subdomain, reporterEmail: email, reason }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
      } else {
        setDone(true);
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center px-6">
        <div className="max-w-sm w-full text-center">
          <div className="text-4xl mb-4">✅</div>
          <h1 className="text-xl font-bold mb-2">Report submitted</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6">
            Thank you. We&apos;ll review it shortly.
          </p>
          <Link href="/" className="text-sm text-green-600 hover:underline">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors mb-8 block">
          ← Back
        </Link>
        <h1 className="text-2xl font-bold mb-1">Report abuse</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-8">
          Reporting{" "}
          <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">
            {subdomain}.from-mm.dev
          </span>
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium mb-2">
              Your email <span className="text-zinc-400">(optional)</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Reason</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              placeholder="Describe the abuse..."
              required
              minLength={10}
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-400 resize-none"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-red-600 text-white px-6 py-3 font-semibold disabled:opacity-50 hover:bg-red-700 transition-colors"
          >
            {submitting ? "Submitting…" : "Submit report"}
          </button>
        </form>
      </div>
    </div>
  );
}
