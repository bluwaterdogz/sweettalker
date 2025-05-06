import { useState, useEffect } from "react";

export function useFetchFirestore<TResult>(
  serviceFn: () => Promise<TResult>,
  deps: any[] = []
) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TResult | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    serviceFn()
      .then((res) => {
        if (isMounted) setResult(res);
      })
      .catch((err) => {
        if (isMounted) setError(err?.message || "Unknown error");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { loading, error, result, setResult };
}
