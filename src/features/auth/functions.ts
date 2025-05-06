import { store } from "@/store";
import { setTokens, setUser } from "./slice";
import { Tokens } from "./api/models";
import { logout, refresh } from "./reducers";
import { authApi } from "@/services/axios";

type RefreshCallbacks = {
  onSuccess?: (newTokens: Tokens) => Promise<any>;
  onError?: (refreshError: any) => Promise<any>;
};
export async function attemptRefresh(
  refreshToken: string,
  callbacks?: RefreshCallbacks
) {
  const { onError, onSuccess } = callbacks || {};
  try {
    const newTokens = await refresh(refreshToken);
    store.dispatch(setTokens(newTokens));
    return onSuccess?.(newTokens);
  } catch (refreshError) {
    console.warn("refreshError", refreshError);
    store.dispatch(logout());
    return onError?.(refreshError);
  }
}

export async function fetchUser(token: string) {
  try {
    const response = await authApi.get("/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (e) {
    return undefined;
  }
}
