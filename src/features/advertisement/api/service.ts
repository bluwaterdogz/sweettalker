import { AdsServiceI } from "../types";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AD_STATUS_KEY = "@sweettalker:ad_status";

export class AdsService implements AdsServiceI {
  private adUnitId: string;
  private adLoaded: boolean = false;

  constructor() {
    // Use test ad unit IDs for development
    this.adUnitId = Platform.select({
      ios: "ca-app-pub-3940256099942544/1712485313", // iOS test ad unit ID
      android: "ca-app-pub-3940256099942544/5224354917", // Android test ad unit ID
      default: "",
    });
  }

  async loadRewardedAd(): Promise<void> {
    try {
      // TODO: Implement actual ad loading logic with expo-ads-admob
      this.adLoaded = true;
    } catch (error) {
      console.error("Error loading rewarded ad:", error);
      throw error;
    }
  }

  async showRewardedAd(): Promise<boolean> {
    if (!this.adLoaded) {
      throw new Error("Ad is not loaded");
    }

    try {
      // TODO: Implement actual ad showing logic with expo-ads-admob
      this.adLoaded = false;
      await this.markAdAsWatched();
      return true;
    } catch (error) {
      console.error("Error showing rewarded ad:", error);
      return false;
    }
  }

  async checkAdStatus(): Promise<boolean> {
    try {
      const status = await AsyncStorage.getItem(AD_STATUS_KEY);
      return status === "true";
    } catch (error) {
      console.error("Error checking ad status:", error);
      return false;
    }
  }

  async markAdAsWatched(): Promise<void> {
    try {
      await AsyncStorage.setItem(AD_STATUS_KEY, "true");
    } catch (error) {
      console.error("Error marking ad as watched:", error);
      throw error;
    }
  }
}
