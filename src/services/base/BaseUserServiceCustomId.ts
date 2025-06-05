import { BaseModel } from "@common/models/base/base";
import { FirebaseService } from "../firebase/data/FirebaseService";
import { BaseService, BaseServiceOptions } from "./BaseService";
import { AuthService } from "@/features/auth/api/service";
import { Unsubscribe } from "firebase/firestore";
import { BaseUserService } from "./BaseUserService";

export abstract class BaseUserServiceCustomId<
  T extends BaseModel,
  DTO = any,
  GeneralOptions extends BaseServiceOptions = BaseServiceOptions
> extends BaseUserService<T, DTO, GeneralOptions> {
  constructor(
    protected readonly firebaseService: FirebaseService,
    protected readonly authService: AuthService
  ) {
    super(firebaseService, authService);
  }

  abstract getId(): string;

  public get(
    _?: string | undefined,
    options?: (GeneralOptions & BaseServiceOptions) | undefined
  ) {
    return super.get(this.getId(), options);
  }
  public update(_: string | undefined, data: Partial<T>) {
    return super.update(this.getId(), data);
  }

  public delete() {
    return super.delete(this.getId());
  }

  public subscribeSingle(
    callback: (entity: T) => void,
    onError: (error: Error) => void,
    _: string | undefined,
    options?: (GeneralOptions & BaseServiceOptions) | undefined
  ): Unsubscribe {
    return super.subscribeSingle(callback, onError, this.getId(), options);
  }
}
