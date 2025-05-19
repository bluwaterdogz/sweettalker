import { ReactNode } from "react";

export interface ShowToastOptions {
  message: ReactNode;
  type?: "success" | "error" | "info";
  title?: string;
}
