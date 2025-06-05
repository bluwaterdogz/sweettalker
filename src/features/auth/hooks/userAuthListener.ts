import { auth } from "@/app/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { interpretationServiceApi } from "@/services/axios";

export const useUserAuthListener = () => {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      interpretationServiceApi.interceptors.request.use(async (config) => {
        const token = user && (await user.getIdToken());

        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }

        if (user == null) {
          delete interpretationServiceApi.defaults.headers.common[
            "Authorization"
          ];
        }
        return config;
      });
    });

    return () => {
      unsubscribe();
      delete interpretationServiceApi.defaults.headers.common["Authorization"];
    };
  }, []);
};
