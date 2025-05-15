import React, { createContext, useContext, useMemo } from "react";
import { Services } from "./base/types";
import { TranslationService } from "@/features/translation/api/service";
import { ReframingService } from "@/features/reframing/api/service";

import { FirebaseService } from "./firebase/service";
import { ProfileService } from "@/features/profile/api/service";
import { BillingService } from "@/features/billing/api/service";
import { AdsService } from "../features/advertisement/api/service";
import { InterpretationClient } from "@/features/common-interpretation/api/client";
import { TranslationApi } from "@/features/translation/api/models";
import { ReframingApi } from "@/features/reframing/api/models";

const ServiceContext = createContext<Services | null>(null);

export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const firebaseService = useMemo(() => new FirebaseService(), []);
  const adsService = useMemo(() => new AdsService(), []);

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
      profileService: new ProfileService(firebaseService),
      billingService: new BillingService(firebaseService),
      adsService,
    }),
    [firebaseService, adsService]
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
