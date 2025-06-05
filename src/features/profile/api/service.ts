import { FirebaseService } from "@/services/firebase/data/FirebaseService";
import { FirestoreCollections } from "@/services/firebase/collections";
import { AuthService } from "@/features/auth/api/service";
import { BaseUserServiceCustomId } from "@/services/base/BaseUserServiceCustomId";
import { Settings, SettingsMapper } from "@common/models/profile/settings";

export class ProfileService extends BaseUserServiceCustomId<Settings> {
  protected firestoreTag: FirestoreCollections.SETTINGS =
    FirestoreCollections.SETTINGS;
  protected mapper = SettingsMapper.map;

  constructor(
    protected readonly firebaseService: FirebaseService,
    protected readonly authService: AuthService
  ) {
    super(firebaseService, authService);
  }

  getId() {
    return this.authService.getCurrentUser()?.uid;
  }
}
