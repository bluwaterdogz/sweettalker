export interface AdsServiceI {
  loadRewardedAd: () => Promise<void>;
  showRewardedAd: () => Promise<boolean>;
  checkAdStatus: () => Promise<boolean>;
  markAdAsWatched: () => Promise<void>;
}
