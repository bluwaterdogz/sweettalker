import { useEffect, useState } from "react";

export function useSubscribeFirestore<TResult>(
  subscribeFn: (
    onData: (data: TResult) => void,
    onError?: (err: Error) => void
  ) => () => void,
  deps: any[] = []
) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TResult | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const unsubscribe = subscribeFn(
      (data) => {
        setResult(data);
        setLoading(false);
      },
      (err) => {
        setError(err?.message || "Unknown error");
        setLoading(false);
      }
    );
    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { loading, error, result, setResult };
}
