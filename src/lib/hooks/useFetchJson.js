'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * Loads JSON from `url` on mount, whenever `url` changes, and when `reload()` is called.
 * State is only set from promise callbacks (never synchronously inside the
 * effect), and responses for an outdated url/reload are ignored.
 * `isLoading` is true until the response for the current url/reload arrives;
 * `data` keeps the previous response meanwhile. Pass `null` as the url to skip loading.
 */
export function useFetchJson(url) {
  const [version, setVersion] = useState(0);
  const [result, setResult] = useState({ key: null, data: null, error: null });
  const key = url ? `${version}:${url}` : null;

  useEffect(() => {
    if (!key) return;
    let ignore = false;

    fetch(url)
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (!res.ok) throw new Error(data?.error || 'Request failed');
        return data;
      })
      .then((data) => {
        if (!ignore) setResult({ key, data, error: null });
      })
      .catch((error) => {
        if (!ignore) setResult((prev) => ({ key, data: prev.data, error }));
      });

    return () => { ignore = true; };
  }, [key, url]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);
  const isCurrent = result.key === key;

  return {
    data: result.data,
    error: isCurrent ? result.error : null,
    isLoading: Boolean(key) && !isCurrent,
    reload,
  };
}
