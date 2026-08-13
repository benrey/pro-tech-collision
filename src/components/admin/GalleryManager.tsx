"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRecords } from "@/lib/useRecords";
import type { GalleryItem } from "@/lib/types";

const inputClass =
  "w-full rounded-lg border border-border-subtle bg-surface-raised px-3.5 py-2.5 text-[15px] text-foreground placeholder:text-text-tertiary focus:border-primary focus:outline-none";

const MAX_BYTES = 10 * 1024 * 1024; // 10MB — phone photos are routinely 3–8MB
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

function publicUrl(base: string, path: string) {
  return `${base}/storage/v1/object/public/gallery/${path}`;
}

/** Builds a collision-resistant storage path without needing a uuid library. */
function storagePath(file: File, kind: "before" | "after") {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  return `${kind}/${unique}.${ext}`;
}

export default function GalleryManager() {
  const [busy, setBusy] = useState(false);
  const [title, setTitle] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [description, setDescription] = useState("");
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [beforePreview, setBeforePreview] = useState<string | null>(null);
  const [afterPreview, setAfterPreview] = useState<string | null>(null);

  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

  const fetcher = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("gallery_items")
      .select("*")
      .order("sort_order", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as GalleryItem[];
  }, []);

  const { items, loading, error, reload, setItems, setError } = useRecords(
    fetcher,
    "Could not load photos.",
  );

  // Release object URLs so previews don't leak memory across selections.
  useEffect(() => {
    return () => {
      if (beforePreview) URL.revokeObjectURL(beforePreview);
      if (afterPreview) URL.revokeObjectURL(afterPreview);
    };
  }, [beforePreview, afterPreview]);

  function pickFile(kind: "before" | "after", file: File | null) {
    setError(null);
    if (!file) return;

    if (!ACCEPTED.includes(file.type)) {
      setError(`"${file.name}" isn't a supported image. Use JPG, PNG, WEBP, or HEIC.`);
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(`"${file.name}" is ${(file.size / 1024 / 1024).toFixed(1)}MB. Please keep photos under 10MB.`);
      return;
    }

    const preview = URL.createObjectURL(file);
    if (kind === "before") {
      if (beforePreview) URL.revokeObjectURL(beforePreview);
      setBeforeFile(file);
      setBeforePreview(preview);
    } else {
      if (afterPreview) URL.revokeObjectURL(afterPreview);
      setAfterFile(file);
      setAfterPreview(preview);
    }
  }

  function resetForm() {
    setTitle("");
    setVehicle("");
    setDescription("");
    setBeforeFile(null);
    setAfterFile(null);
    if (beforePreview) URL.revokeObjectURL(beforePreview);
    if (afterPreview) URL.revokeObjectURL(afterPreview);
    setBeforePreview(null);
    setAfterPreview(null);
    if (beforeInputRef.current) beforeInputRef.current.value = "";
    if (afterInputRef.current) afterInputRef.current.value = "";
  }

  async function handleUpload(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!beforeFile || !afterFile) {
      setError("Please choose both a before and an after photo.");
      return;
    }

    setBusy(true);
    const supabase = createClient();
    const beforePath = storagePath(beforeFile, "before");
    const afterPath = storagePath(afterFile, "after");

    try {
      const up1 = await supabase.storage.from("gallery").upload(beforePath, beforeFile, {
        cacheControl: "31536000",
        upsert: false,
      });
      if (up1.error) throw up1.error;

      const up2 = await supabase.storage.from("gallery").upload(afterPath, afterFile, {
        cacheControl: "31536000",
        upsert: false,
      });
      if (up2.error) {
        // Don't strand the first upload if the second fails.
        await supabase.storage.from("gallery").remove([beforePath]);
        throw up2.error;
      }

      const { error: insertError } = await supabase.from("gallery_items").insert({
        title: title.trim() || "Collision repair",
        vehicle: vehicle.trim() || null,
        description: description.trim() || null,
        before_path: beforePath,
        after_path: afterPath,
        published: true,
      });

      if (insertError) {
        await supabase.storage.from("gallery").remove([beforePath, afterPath]);
        throw insertError;
      }

      resetForm();
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function togglePublished(item: GalleryItem) {
    setError(null);
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("gallery_items")
        .update({ published: !item.published })
        .eq("id", item.id);
      if (updateError) throw updateError;
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, published: !i.published } : i)),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update that photo.");
    }
  }

  async function remove(item: GalleryItem) {
    if (!confirm(`Delete "${item.title}"? This removes both photos permanently.`)) return;

    setError(null);
    try {
      const supabase = createClient();
      const { error: deleteError } = await supabase
        .from("gallery_items")
        .delete()
        .eq("id", item.id);
      if (deleteError) throw deleteError;

      await supabase.storage.from("gallery").remove([item.before_path, item.after_path]);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete that photo.");
    }
  }

  return (
    <div className="space-y-8">
      {/* Upload form */}
      <section className="rounded-2xl border border-border-subtle bg-surface p-6">
        <h2 className="text-lg font-bold text-foreground">Add a before &amp; after</h2>
        <p className="mt-1.5 text-sm text-text-secondary">
          Upload two photos of the same repair. They&apos;ll appear on your site
          with a slider customers can drag.
        </p>

        <form onSubmit={handleUpload} className="mt-6 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {(["before", "after"] as const).map((kind) => {
              const preview = kind === "before" ? beforePreview : afterPreview;
              const ref = kind === "before" ? beforeInputRef : afterInputRef;
              return (
                <div key={kind}>
                  <label
                    htmlFor={`${kind}-file`}
                    className="mb-1.5 block text-sm font-medium capitalize text-foreground"
                  >
                    {kind} photo <span className="text-danger">*</span>
                  </label>
                  <div className="relative aspect-4/3 overflow-hidden rounded-xl border border-dashed border-border-strong bg-surface-raised">
                    {preview ? (
                      // Object URL, so next/image optimization doesn't apply.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={preview} alt={`${kind} preview`} className="h-full w-full object-cover" />
                    ) : (
                      <span className="absolute inset-0 grid place-items-center px-4 text-center text-sm text-text-tertiary">
                        Tap to choose a {kind} photo
                      </span>
                    )}
                    <input
                      ref={ref}
                      id={`${kind}-file`}
                      type="file"
                      accept={ACCEPTED.join(",")}
                      onChange={(e) => pickFile(kind, e.target.files?.[0] ?? null)}
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="g-title" className="mb-1.5 block text-sm font-medium text-foreground">
                Title
              </label>
              <input
                id="g-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputClass}
                placeholder="Rear quarter panel repair"
              />
            </div>
            <div>
              <label htmlFor="g-vehicle" className="mb-1.5 block text-sm font-medium text-foreground">
                Vehicle
              </label>
              <input
                id="g-vehicle"
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value)}
                className={inputClass}
                placeholder="2021 Ford F-150"
              />
            </div>
          </div>

          <div>
            <label htmlFor="g-desc" className="mb-1.5 block text-sm font-medium text-foreground">
              Description
            </label>
            <textarea
              id="g-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputClass}
              placeholder="What was damaged and what you did to fix it."
            />
          </div>

          {error && (
            <p role="alert" className="rounded-lg border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-sm text-foreground">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-accent px-6 py-3 text-base font-semibold text-accent-contrast transition-colors hover:bg-accent-hover disabled:opacity-60 sm:w-auto"
          >
            {busy ? "Uploading…" : "Upload Photos"}
          </button>
        </form>
      </section>

      {/* Existing items */}
      <section>
        <h2 className="text-lg font-bold text-foreground">
          Your photos {items.length > 0 && <span className="text-text-tertiary">({items.length})</span>}
        </h2>

        {loading ? (
          <p className="mt-4 text-sm text-text-secondary">Loading…</p>
        ) : items.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-border-strong bg-surface p-6 text-center text-sm text-text-secondary">
            No photos yet. Add your first before &amp; after above.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center gap-4 rounded-xl border border-border-subtle bg-surface p-3"
              >
                <div className="flex gap-1.5">
                  <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-surface-raised">
                    <Image
                      src={publicUrl(base, item.before_path)}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-surface-raised">
                    <Image
                      src={publicUrl(base, item.after_path)}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-foreground">{item.title}</p>
                  {item.vehicle && <p className="truncate text-sm text-text-secondary">{item.vehicle}</p>}
                  <p className="mt-0.5 text-xs text-text-tertiary">
                    {item.published ? "Visible on site" : "Hidden"}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => togglePublished(item)}
                    className="rounded-full border border-border-strong px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-raised"
                  >
                    {item.published ? "Hide" : "Show"}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(item)}
                    className="rounded-full px-3.5 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger/10"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
