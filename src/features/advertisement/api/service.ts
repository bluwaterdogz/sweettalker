import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { withErrorHandling } from "@/services/base/errors/utils/withErrorHandling";

const AD_STATUS_KEY = "@sweettalker:ad_status";

export class AdsService {
  private adLoaded: boolean = false;

  constructor(
    private adUnitId = Platform.select({
      ios: "ca-app-pub-3940256099942544/1712485313", // iOS test ad unit ID
      android: "ca-app-pub-3940256099942544/5224354917", // Android test ad unit ID
      default: "",
    })
  ) {
    // Use test ad unit IDs for development
  }

  @withErrorHandling({
    errorMessage: "Error loading rewarded ad:",
    maxRetries: 0,
  })
  async loadRewardedAd(): Promise<void> {
    // TODO: Implement actual ad loading logic with expo-ads-admob
    this.adLoaded = true;
  }

  @withErrorHandling({
    errorMessage: "Error showing rewarded ad:",
    maxRetries: 0,
  })
  async showRewardedAd(): Promise<boolean> {
    if (!this.adLoaded) {
      throw new Error("Ad is not loaded");
    }

    // TODO: Implement actual ad showing logic with expo-ads-admob
    this.adLoaded = false;
    await this.markAdAsWatched();
    return true;
  }

  @withErrorHandling({
    errorMessage: "Error checking ad status:",
    maxRetries: 0,
  })
  async checkAdStatus(): Promise<boolean> {
    const status = await AsyncStorage.getItem(AD_STATUS_KEY);
    return status === "true";
  }

  @withErrorHandling({
    errorMessage: "Error marking ad as watched:",
    maxRetries: 0,
  })
  async markAdAsWatched(): Promise<void> {
    await AsyncStorage.setItem(AD_STATUS_KEY, "true");
  }
}
