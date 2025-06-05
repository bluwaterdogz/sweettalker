import { TranslationService } from "@/features/translation/api/service";
import { ProfileService } from "@/features/profile/api/service";
import { BillingService } from "@/features/billing/api/BillingService";
import { AuthService } from "@/features/auth/api/service";
import { AdsService } from "@/features/advertisement/api/service";
import { CheckInService } from "@/features/check-in/api/CheckInService";
import { ConversationService } from "@/features/conversation/api/ConversationService";
import { MessageService } from "@/features/conversation/api/MessageService";
import { ConnectionService } from "@/features/contacts/api/ConnectionService";
import { ContactService } from "@/features/contacts/api/ContactService";

export interface Services {
  translationService: TranslationService;
  profileService: ProfileService;
  // billingService: BillingService;
  adsService: AdsService;
  authService: AuthService;
  checkInService: CheckInService;
  conversationService: ConversationService;
  messageService: MessageService;
  connectionService: ConnectionService;
  contactService: ContactService;
}
