import { TranslationService } from "@/features/translation/api/service";
import { ProfileService } from "@/features/profile/api/service";
import { BillingService } from "@/features/billing/api/service";
import { ReframingService } from "@/features/reframing/api/service";
import { AuthService } from "@/features/auth/api/service";
import { AdsService } from "@/features/advertisement/api/service";

export interface Services {
  translationService: TranslationService;
  profileService: ProfileService;
  billingService: BillingService;
  reframingService: ReframingService;
  adsService: AdsService;
  authService: AuthService;
}
