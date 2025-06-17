import { BaseModel } from "@common/models/base/base";
import { FirebaseService } from "../firebase/data/FirebaseService";
import { BaseServiceOptions } from "./BaseService";
import { AuthService } from "@/features/auth/api/service";
import { BaseUserService } from "./BaseUserService";

export abstract class BaseUserCustomIdService<
  T extends BaseModel,
  DTO = any,
  GeneralOptions extends BaseServiceOptions = BaseServiceOptions,
> extends BaseUserService<T, DTO, GeneralOptions> {
  constructor(
    protected readonly firebaseService: FirebaseService,
    protected readonly authService: AuthService
  ) {
    super(firebaseService, authService);
  }

  /** Override this in child class to return the custom doc ID */
  abstract getId(options?: GeneralOptions): string;

  public create(entity: Omit<T, keyof BaseModel>, options?: GeneralOptions) {
    return super.create(entity, options, this.getId());
  }

  public get(_?: string | undefined, options?: GeneralOptions) {
    return super.get(this.getId(), options);
  }

  public update(
    _: string | undefined,
    data: Partial<T>,
    options?: GeneralOptions
  ) {
    return super.update(this.getId(options), data, options);
  }

  public delete() {
    return super.delete(this.getId());
  }

  public subscribeSingle(
    callback: (entity: T) => void,
    onError: (error: Error) => void,
    _id?: string | undefined,
    options?: GeneralOptions
  ): ReturnType<FirebaseService["subscribeToDocument"]> {
    return super.subscribeSingle(callback, onError, this.getId(), options);
  }

  public subscribe(
    onData: (entities: T[]) => void,
    onError: (error: Error) => void,
    options?: BaseServiceOptions
  ): ReturnType<FirebaseService["subscribeToCollection"]> {
    return super.subscribe(onData, onError, options as any);
  }
}
