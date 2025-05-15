import { useState, useEffect, useCallback } from "react";
import { useServices } from "@/services/context";

export const useRewardedAd = () => {
  const { adsService } = useServices();
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadAd = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await adsService.loadRewardedAd();
      setIsReady(true);
    } catch (err) {
      setError(err as Error);
      setIsReady(false);
    } finally {
      setIsLoading(false);
    }
  }, [adsService]);

  const showAd = useCallback(async () => {
    if (!isReady) {
      throw new Error("Ad is not ready");
    }

    try {
      setIsLoading(true);
      setError(null);
      const success = await adsService.showRewardedAd();
      setIsReady(false);
      return success;
    } catch (err) {
      setError(err as Error);
      setIsReady(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [adsService, isReady]);

  useEffect(() => {
    loadAd();
  }, [loadAd]);

  return {
    isLoading,
    isReady,
    error,
    loadAd,
    showAd,
  };
};
