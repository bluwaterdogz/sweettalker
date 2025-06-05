import { BaseModel } from "@common/models/base/base";
import { BaseService, BaseServiceOptions } from "./BaseService";
import { FirebaseService } from "../firebase/data/FirebaseService";
import { AuthService } from "@/features/auth/api/service";

export class BaseUserService<
  T extends BaseModel,
  DTO = any,
  GeneralOptions extends BaseServiceOptions = BaseServiceOptions
> extends BaseService<T, DTO, GeneralOptions> {
  constructor(
    protected readonly firebaseService: FirebaseService,
    protected readonly authService: AuthService
  ) {
    super(firebaseService);
  }

  protected addUserPathPrefix(subCollection: string) {
    const user = this.authService.getCurrentUser();
    return `users/${user.uid}/${subCollection}`;
  }

  protected getPathPrefix(options?: GeneralOptions): string {
    return this.addUserPathPrefix(this.firestoreTag);
  }
}
