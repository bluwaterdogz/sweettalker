import React, { createContext, useContext, useEffect, useState } from "react";
import { useServices } from "@/services/provider";
import { BillingProduct, BillingState, DEFAULT_PRODUCTS } from "../api/models";
import { useToast } from "@/lib/toast";

interface BillingContextType extends BillingState {
  purchaseProduct: (productId: string) => Promise<void>;
  refreshCredits: () => Promise<void>;
}

const BillingContext = createContext<BillingContextType | undefined>(undefined);

export const BillingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { billingService } = useServices();
  const { showToast } = useToast();
  const [state, setState] = useState<BillingState>({
    products: DEFAULT_PRODUCTS,
    credits: 0,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    initializeBilling();
  }, []);

  const initializeBilling = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      await billingService.initialize();
      const products = await billingService.loadProducts();
      const credits = await billingService.getCredits();
      setState((prev) => ({
        ...prev,
        products,
        credits,
        isLoading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to initialize billing",
      }));
    }
  };

  const purchaseProduct = async (productId: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      const result = await billingService.purchaseProduct(productId);

      if (result.success) {
        const credits = await billingService.getCredits();
        setState((prev) => ({
          ...prev,
          credits,
          isLoading: false,
        }));

        if (result.credits) {
          showToast({
            type: "success",
            message: `Successfully purchased ${result.credits} credits!`,
          });
        } else {
          showToast({
            type: "success",
            message: "Subscription activated successfully!",
          });
        }
      } else {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: result.error || "Purchase failed",
        }));
        showToast({
          type: "error",
          message: result.error || "Purchase failed",
        });
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Purchase failed",
      }));
      showToast({
        type: "error",
        message: "Failed to complete purchase",
      });
    }
  };

  const refreshCredits = async () => {
    try {
      const credits = await billingService.getCredits();
      setState((prev) => ({
        ...prev,
        credits,
      }));
    } catch (error) {
      console.error("Error refreshing credits:", error);
    }
  };

  return (
    <BillingContext.Provider
      value={{
        ...state,
        purchaseProduct,
        refreshCredits,
      }}
    >
      {children}
    </BillingContext.Provider>
  );
};

export const useBilling = () => {
  const context = useContext(BillingContext);
  if (context === undefined) {
    throw new Error("useBilling must be used within a BillingProvider");
  }
  return context;
};
