import { Services } from "@/services/provider";
import { RootState } from "@/store";

export interface ThunkAPI {
  state: RootState;
  extra: { services: Services };
}
