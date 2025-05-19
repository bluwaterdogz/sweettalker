import { Services } from "@/services/types";
import { AppDispatch, RootState } from "@/store";
import { ThemeLabel } from "@/common/theme/types";
import { ShowConfirmationOptions } from "@/common/features/Confirmation/types";
import { ShowToastOptions } from "@/common/features/Toast/types";

export interface InjectedFunctions {
  setTheme: (theme: ThemeLabel) => void;
  confirm: (options: ShowConfirmationOptions) => void;
  showToast: (options: ShowToastOptions) => void;
}
export interface ThunkAPI {
  state: RootState;
  dispatch: AppDispatch;
  rejectValue: Error;
  extra: {
    services: Services;
    functions: InjectedFunctions;
  };
}
