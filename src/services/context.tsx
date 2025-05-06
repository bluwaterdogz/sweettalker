import React, { createContext, useContext } from "react";
import { AuthService } from "./auth/service";
import { ChatGPTService } from "./translation/service";
import { AuthClient } from "./auth/client";
import { ChatGPTClient } from "./translation/client";

interface Services {
  auth: AuthService;
  chatGPT: ChatGPTService;
}

const ServicesContext = createContext<Services | null>(null);

export const ServicesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const authClient = new AuthClient();
  const chatGPTClient = new ChatGPTClient();

  const services: Services = {
    auth: new AuthService(authClient),
    chatGPT: new ChatGPTService(chatGPTClient),
  };

  return (
    <ServicesContext.Provider value={services}>
      {children}
    </ServicesContext.Provider>
  );
};

export const useServices = () => {
  const services = useContext(ServicesContext);
  if (!services) {
    throw new Error("useServices must be used within a ServicesProvider");
  }
  return services;
};
