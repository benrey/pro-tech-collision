"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type State<T> = {
  items: T[];
  loading: boolean;
  error: string | null;
};

/**
 * Loads a list of records on mount, with manual refresh and local mutation.
 *
 * The fetch is kicked off from an effect but every state update happens in an
 * async continuation, never synchronously in the effect body — that's what
 * React 19's set-state-in-effect rule is guarding against, since a synchronous
 * update there forces a second render pass before paint.
 */
export function useRecords<T>(
  fetcher: () => Promise<T[]>,
  errorMessage: string,
) {
  const [state, setState] = useState<State<T>>({
    items: [],
    loading: true,
    error: null,
  });

  // Keep the latest fetcher without making it an effect dependency, so callers
  // don't have to memoize their closure.
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const run = useCallback(async () => {
    try {
      const items = await fetcherRef.current();
      setState({ items, loading: false, error: null });
    } catch (e) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: e instanceof Error ? e.message : errorMessage,
      }));
    }
  }, [errorMessage]);

  useEffect(() => {
    let cancelled = false;

    // Deferred to a microtask: the effect body itself performs no setState.
    void Promise.resolve().then(() => {
      if (!cancelled) return run();
    });

    return () => {
      cancelled = true;
    };
  }, [run]);

  /** Re-fetch, showing the loading state (used by explicit refresh buttons). */
  const refresh = useCallback(() => {
    setState((prev) => ({ ...prev, loading: true }));
    void run();
  }, [run]);

  /** Re-fetch quietly, keeping current items on screen (used after writes). */
  const reload = useCallback(() => run(), [run]);

  const setItems = useCallback((update: (prev: T[]) => T[]) => {
    setState((prev) => ({ ...prev, items: update(prev.items) }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  return {
    items: state.items,
    loading: state.loading,
    error: state.error,
    refresh,
    reload,
    setItems,
    setError,
  };
}
