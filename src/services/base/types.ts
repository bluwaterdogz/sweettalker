import { TranslationService } from "@/features/translation/api/service";
import { ProfileService } from "@/features/profile/api/service";
import { BillingService } from "@/features/billing/api/service";
import { ReframingService } from "@/features/reframing/api/service";
import { AdsServiceI } from "@/features/advertisement/types";

export interface Services {
  translationService: TranslationService;
  profileService: ProfileService;
  billingService: BillingService;
  reframingService: ReframingService;
  adsService: AdsServiceI;
}
