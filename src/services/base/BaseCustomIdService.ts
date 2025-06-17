import { BaseModel } from "@common/models/base/base";
import { BaseService, BaseServiceOptions } from "./BaseService";
import { Unsubscribe } from "firebase/firestore";

export interface BaseCustomIdServiceInterface<
  T extends BaseModel,
  DTO = any,
  GeneralOptions extends BaseServiceOptions = BaseServiceOptions,
> {
  updatewithCustomId(data: Partial<T>, options?: GeneralOptions): Promise<void>;
  deleteWithCustomId(options?: GeneralOptions): Promise<void> | void;

  subscribeSingleCustomId(
    callback: (entity: T) => void,
    onError: (error: Error) => void,
    options?: GeneralOptions
  ): Unsubscribe;
}

export abstract class BaseCustomIdService<
  T extends BaseModel,
  DTO = any,
  GeneralOptions extends BaseServiceOptions = BaseServiceOptions,
> extends BaseService<T, DTO> {
  protected abstract getId(keyOptions?: GeneralOptions): string;

  public createWithCustomId(
    entity: Omit<T, keyof BaseModel>,
    options?: GeneralOptions
  ): Promise<void> {
    return super.create(entity, options, this.getId());
  }

  public updatewithCustomId(
    data: Omit<Partial<T>, keyof BaseModel>,
    options?: GeneralOptions
  ) {
    return super.update(this.getId(options), data, options);
  }

  public deleteWithCustomId(options?: GeneralOptions) {
    return super.delete(this.getId(options));
  }

  public subscribeSingleCustomId(
    callback: (entity: T) => void,
    onError: (error: Error) => void = () => {},
    options?: GeneralOptions
  ): Unsubscribe {
    return super.subscribeSingle(
      callback,
      onError,
      this.getId(options),
      options
    );
  }

  public subscribeCustomId(
    onData: (entities: T[]) => void,
    onError?: (error: Error) => void,
    options?: GeneralOptions
  ): Unsubscribe {
    return super.subscribe(onData, onError, options);
  }
}
