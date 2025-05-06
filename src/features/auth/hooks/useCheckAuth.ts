import { useAppDispatch, useAppSelector } from "@/store";
import { useCallback, useEffect } from "react";
import { logout } from "@/features/auth/reducers";
import { attemptRefresh, fetchUser } from "../functions";
import { setTokens, setUser } from "../slice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { REFRESH_KEY } from "../consts";
import { TOKEN_KEY } from "../consts";

interface JwtPayload {
  exp: number;
  [key: string]: any;
}

export function useCheckAuth() {
  const dispatcher = useAppDispatch();
  const tokenState = useAppSelector((state) => state.auth.token);
  const refreshState = useAppSelector((state) => state.auth.refresh);
  const doCheckToken = useCallback(async () => {
    try {
      // Get token from storage
      const [storedToken, storedRefresh] = await Promise.all([
        AsyncStorage.getItem(TOKEN_KEY),
        AsyncStorage.getItem(REFRESH_KEY),
      ]);

      const token = storedToken || tokenState;
      const refresh = storedRefresh || refreshState;

      if (!token) {
        console.warn("No token found");
        dispatcher(logout());
        return;
      }
      if (storedToken != null && storedRefresh != null && tokenState == null) {
        dispatcher(setTokens({ token: storedToken, refresh: storedRefresh }));
      }

      try {
        const decoded = jwtDecode<JwtPayload>(token);
        const tokenIsExpired = decoded.exp * 1000 < Date.now();

        if (tokenIsExpired) {
          if (!refresh) {
            console.warn("Token expired but no refresh token available");
            dispatcher(logout());
            return;
          }

          try {
            const newTokens = await attemptRefresh(refresh);
            // TODO better Error handling
            if (!newTokens) {
              return;
            }
            // Update both storage and state
            await Promise.all([
              AsyncStorage.setItem(TOKEN_KEY, newTokens.token),
              AsyncStorage.setItem(REFRESH_KEY, newTokens.refresh),
            ]);
            dispatcher(setTokens(newTokens));
          } catch (refreshError) {
            console.error("Token refresh error:", refreshError);
            dispatcher(logout());
            return;
          }
        }

        // use token
        const user = await fetchUser(token);
        if (!user) {
          console.warn("User fetch failed");
          dispatcher(logout());
          return;
        }

        dispatcher(setUser({ user }));
      } catch (decodeError) {
        console.error("Invalid token format:", decodeError);
        dispatcher(logout());
      }
    } catch (error) {
      console.error("Token check failed:", error);
      dispatcher(logout());
    }
  }, [dispatcher, tokenState, refreshState]);

  useEffect(() => {
    doCheckToken();
  }, [doCheckToken]);
}
