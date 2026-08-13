"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AdminShell, { type Tab } from "@/components/admin/AdminShell";
import GalleryManager from "@/components/admin/GalleryManager";
import RequestInbox from "@/components/admin/RequestInbox";
import TestimonialManager from "@/components/admin/TestimonialManager";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("gallery");
  const [email, setEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    // Every path is async so no setState runs synchronously in the effect body.
    (async () => {
      if (!isSupabaseConfigured()) {
        if (!cancelled) setIsAdmin(false);
        return;
      }

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (cancelled) return;
      setEmail(user?.email ?? null);

      if (!user?.email) {
        setIsAdmin(false);
        return;
      }

      // The allowlist row is readable only by its owner (see RLS policy), so a
      // returned row means this account has admin rights.
      const { data } = await supabase
        .from("admins")
        .select("email")
        .ilike("email", user.email)
        .maybeSingle();

      if (!cancelled) setIsAdmin(Boolean(data));
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (isAdmin === null) {
    return (
      <div className="grid min-h-dvh place-items-center px-4">
        <p className="text-sm text-text-secondary">Loading…</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="grid min-h-dvh place-items-center px-4">
        <div className="max-w-md rounded-2xl border border-border-subtle bg-surface p-8 text-center">
          <h1 className="text-xl font-bold text-foreground">Access not enabled</h1>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary">
            {email ? (
              <>
                You&apos;re signed in as <strong className="text-foreground">{email}</strong>, but
                that account hasn&apos;t been granted owner access yet. Add it in
                Supabase by running:
              </>
            ) : (
              <>Sign in with an account that has been granted owner access.</>
            )}
          </p>
          {email && (
            <pre className="mt-4 overflow-x-auto rounded-lg bg-surface-raised p-3 text-left text-xs text-foreground">
              {`insert into public.admins (email)\nvalues ('${email}');`}
            </pre>
          )}
          <Link
            href="/admin/login"
            className="mt-6 inline-block rounded-full border border-border-strong px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface-raised"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <AdminShell active={tab} onChange={setTab} email={email}>
      {tab === "gallery" && <GalleryManager />}
      {tab === "testimonials" && <TestimonialManager />}
      {tab === "requests" && <RequestInbox />}
    </AdminShell>
  );
}
