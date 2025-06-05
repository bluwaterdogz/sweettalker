import React, { createContext, useContext, useMemo } from "react";
import { Services } from "./types";
import { TranslationDTO } from "@common/models/translation/translation";
import { TranslationService } from "@/features/translation/api/service";
import { FirebaseService } from "./firebase/data/FirebaseService";
import { ProfileService } from "@/features/profile/api/service";
import { BillingService } from "@/features/billing/api/BillingService";
import { AdsService } from "../features/advertisement/api/service";
import { InterpretationClient } from "@/features/interpretation/api/InterpretationClient";
import { FirebaseAuthService } from "./firebase/auth/service";
import { FirebaseAuthClient } from "./firebase/auth/client";
import { AuthService } from "@/features/auth/api/service";
import { ConversationService } from "@/features/conversation/api/ConversationService";
import { CheckInService } from "@/features/check-in/api/CheckInService";
import { MessageService } from "@/features/conversation/api/MessageService";
import { ConnectionService } from "@/features/contacts/api/ConnectionService";
import { ContactService } from "@/features/contacts/api/ContactService";

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

  const conversationService = useMemo(
    () => new ConversationService(firebaseService),
    [firebaseService]
  );

  const services = useMemo(
    () => ({
      translationService: new TranslationService(
        new InterpretationClient<TranslationDTO>(),
        firebaseService,
        authService
      ),
      profileService: new ProfileService(firebaseService, authService),
      billingService: new BillingService(firebaseService),
      adsService: new AdsService(),
      conversationService,
      authService: authService,
      checkInService: new CheckInService(firebaseService, authService),
      messageService: new MessageService(
        firebaseService,
        conversationService,
        authService
      ),
      connectionService: new ConnectionService(firebaseService),
      contactService: new ContactService(firebaseService),
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
