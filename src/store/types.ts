import { Services } from "@/services/types";
import { AppDispatch, RootState } from "@/store";
import { ShowConfirmationOptions } from "@/common/components/Confirmation/types";
import { ShowToastOptions } from "@/common/components/Toast/types";
import { ThemeLabel } from "@common/types/theme/types";

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

export interface SerializableError {
  message: string;
  name: string;
  stack?: string;
}
