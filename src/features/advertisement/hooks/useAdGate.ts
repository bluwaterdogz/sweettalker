import { useState, useCallback } from "react";
import { useServices } from "@/services/context";

export const useAdGate = () => {
  const { adsService } = useServices();
  const [hasWatchedAd, setHasWatchedAd] = useState(false);

  const checkAdStatus = useCallback(async () => {
    try {
      const status = await adsService.checkAdStatus();
      setHasWatchedAd(status);
      return status;
    } catch (error) {
      console.error("Error checking ad status:", error);
      return false;
    }
  }, [adsService]);

  const markAdAsWatched = useCallback(async () => {
    try {
      await adsService.markAdAsWatched();
      setHasWatchedAd(true);
    } catch (error) {
      console.error("Error marking ad as watched:", error);
    }
  }, [adsService]);

  return {
    hasWatchedAd,
    checkAdStatus,
    markAdAsWatched,
  };
};
