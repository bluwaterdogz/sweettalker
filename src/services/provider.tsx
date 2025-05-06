import React, { createContext, useContext, useMemo } from "react";
import { TranslationService } from "@/features/translation/api/service";
import { TranslationClient } from "@/features/translation/api/client";
import { FirebaseService } from "@/services/firebase/service";
import { ProfileService } from "@/features/profile/api/service";
import { BillingService } from "@/features/billing/api/service";

export interface Services {
  translationService: TranslationService;
  profileService: ProfileService;
  billingService: BillingService;
}

const ServicesContext = createContext<Services | null>(null);

export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const firebaseService = useMemo(() => new FirebaseService(), []);

  const services: Services = useMemo(
    () => ({
      translationService: new TranslationService(
        new TranslationClient(),
        firebaseService
      ),
      profileService: new ProfileService(firebaseService),
      billingService: new BillingService(firebaseService),
    }),
    []
  );

  return (
    <ServicesContext.Provider value={services}>
      {children}
    </ServicesContext.Provider>
  );
};

export const useServices = () => {
  const context = useContext(ServicesContext);
  if (!context) {
    throw new Error("useServices must be used within a ServiceProvider");
  }
  return context;
};
