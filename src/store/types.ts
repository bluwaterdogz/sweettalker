import { Services } from "@/services/base/types";
import { RootState } from "@/store";

export interface ThunkAPI {
  state: RootState;
  dispatch: any;
  rejectValue: Error;
  extra: { services: Services };
}
