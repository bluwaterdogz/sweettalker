import { FirebaseService } from "@/services/firebase/data/service";
import { FirestoreCollections } from "@/services/firebase/collections";
import { Settings } from "./models";
import { SettingsMapper } from "./mappers";
import { withErrorHandling } from "@/services/base/errors/utils/withErrorHandling";
import { AuthService } from "@/features/auth/api/service";
import { BaseService } from "@/features/common/api/service";

export class ProfileService extends BaseService<Settings, any> {
  constructor(
    protected firebaseService: FirebaseService,
    private authService: AuthService
  ) {
    super(
      {
        firestoreTag: FirestoreCollections.SETTINGS,
        mapper: SettingsMapper.map,
      },
      firebaseService
    );
  }

  public async get(): Promise<Settings> {
    const userId = this.authService.getCurrentUser()?.uid;
    const data = await this.firebaseService.getUserDocument(
      userId,
      this.config.firestoreTag
    );
    return this.config.mapper(data);
  }

  @withErrorHandling({
    errorMessage: "Error updating",
  })
  public async updateSettings(data: Partial<Settings>): Promise<void> {
    const userId = this.authService.getCurrentUser()?.uid;
    await this.firebaseService.updateOrCreateUserDocument(
      this.config.firestoreTag,
      userId,
      data
    );
  }
}
