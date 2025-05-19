import React, { createContext, useContext, useMemo } from "react";
import { Services } from "./types";
import { TranslationService } from "@/features/translation/api/service";
import { ReframingService } from "@/features/reframing/api/service";

import { FirebaseService } from "./firebase/data/service";
import { ProfileService } from "@/features/profile/api/service";
import { BillingService } from "@/features/billing/api/service";
import { AdsService } from "../features/advertisement/api/service";
import { InterpretationClient } from "@/features/common";
import { TranslationApi } from "@/features/translation/api/models";
import { ReframingApi } from "@/features/reframing/api/models";
import { FirebaseAuthService } from "./firebase/auth/service";
import { FirebaseAuthClient } from "./firebase/auth/client";
import { AuthService } from "@/features/auth/api/service";

const ServiceContext = createContext<Services | null>(null);

export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const firebaseAuthClient = useMemo(() => new FirebaseAuthClient(), []);
  const firebaseAuthService = useMemo(
    () => new FirebaseAuthService(firebaseAuthClient),
    [firebaseAuthClient]
  );
  const firebaseService = useMemo(
    () => new FirebaseService(firebaseAuthService),
    [firebaseAuthService]
  );

  const authService = useMemo(
    () => new AuthService(firebaseAuthService),
    [firebaseAuthService]
  );

  const services = useMemo(
    () => ({
      translationService: new TranslationService(
        new InterpretationClient<TranslationApi>(),
        firebaseService
      ),
      reframingService: new ReframingService(
        new InterpretationClient<ReframingApi>(),
        firebaseService
      ),
      profileService: new ProfileService(firebaseService, authService),
      billingService: new BillingService(firebaseService),
      adsService: new AdsService(),
      authService: authService,
    }),
    [firebaseService, authService]
  );

  return (
    <ServiceContext.Provider value={services}>
      {children}
    </ServiceContext.Provider>
  );
};

export const useServices = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error("useServices must be used within a ServicesProvider");
  }
  return context;
};
