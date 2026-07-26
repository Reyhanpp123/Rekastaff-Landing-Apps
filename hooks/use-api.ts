import { useState, useCallback } from "react";
import { fetchWithAuth } from "@/lib/api";

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const apiRequest = useCallback(
    async <T>(url: string, options: RequestInit = {}): Promise<T> => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchWithAuth(url, options);
        return data as T;
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred")
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { apiRequest, loading, error };
}
