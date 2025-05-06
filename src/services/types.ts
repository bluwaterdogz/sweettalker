import { TranslationService } from "@/features/translation/api/service";
import { ProfileService } from "@/features/profile/api/service";
import { BillingService } from "@/features/billing/api/service";

export interface Services {
  translationService: TranslationService;
  profileService: ProfileService;
  billingService: BillingService;
}
