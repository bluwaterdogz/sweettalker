import { logout, refresh as refreshTokens } from "@/features/auth/reducers";
import { authApi, chatGPTApi } from "@/services/axios";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import { setTokens } from "../slice";
import { attemptRefresh } from "../functions";
import { useAppSelector, useAppDispatch, useAppStore } from "@/store";

export function useAuthInterceptors() {
  const dispatcher = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const store = useAppStore();

  useEffect(() => {
    // when token is null?
    // if(store.getState().auth.token){} // TODO set timeout to before auth token expires
    const t = setTimeout(async () => {
      const refreshToken = store.getState().auth.refresh;
      if (refreshToken) {
        try {
          const newTokens = await refreshTokens(refreshToken);
          store.dispatch(setTokens(newTokens));
        } catch (e) {
          dispatcher(logout());
          return Promise.reject(e);
        }
      }
    }, 900000);

    const tokenInterceptor = authApi.interceptors.request.use(
      (config) => {
        const token = store.getState().auth.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const refreshInterceptor = authApi.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        const refreshToken = store.getState().auth.refresh;
        if (
          [401, 403].includes(error.response.status) &&
          !originalRequest._retry &&
          refreshToken != null
        ) {
          originalRequest._retry = true;
          attemptRefresh(refreshToken, {
            onSuccess: (newTokens) => {
              originalRequest.headers.Authorization = `Bearer ${newTokens.token}`;
              return authApi(originalRequest);
            },
            onError: async (refreshError) => await refreshError,
          });
        } else {
          if (error.message) {
            Toast.show({
              type: "error",
              text1: error.message,
              position: "top",
            });
          }
        }
        return Promise.reject(error);
      }
    );
    return () => {
      clearTimeout(t);
      authApi.interceptors.request.eject(tokenInterceptor);
      authApi.interceptors.response.eject(refreshInterceptor);
    };
  }, [token]);
}
