import { FirebaseService } from "@/services/firebase/service";
import { FirestoreCollections } from "@/services/firebase/collections";
// import * as InAppPurchases from "expo-in-app-purchases";

import {
  BillingProduct,
  DEFAULT_PRODUCTS,
  PurchaseResult,
  TranslationCredit,
  TranslationCreditApi,
} from "./models";

// TODO: eject from expo and use native module
const InAppPurchases: any = {
  connectAsync: async () => {},
  getProductsAsync: async () => [],
  purchaseItemAsync: async () => ({ responseCode: 0, results: [] }),
};

export class BillingService {
  constructor(private firebaseService: any) {}

  async initialize(): Promise<void> {
    try {
      await InAppPurchases.connectAsync();
      await this.loadProducts();
    } catch (error) {
      console.error("Error initializing billing:", error);
      throw error;
    }
  }

  async loadProducts(): Promise<BillingProduct[]> {
    try {
      const productIds = DEFAULT_PRODUCTS.map((p) => p.productId);
      const { responseCode, results } = await InAppPurchases.getProductsAsync(
        productIds
      );

      if (responseCode === InAppPurchases.IAPResponseCode.OK) {
        // Update prices from store
        return DEFAULT_PRODUCTS.map((product) => {
          const storeProduct = results.find(
            (p: any) => p.productId === product.productId
          );
          if (storeProduct) {
            return {
              ...product,
              price: storeProduct.priceString,
            };
          }
          return product;
        });
      }

      return DEFAULT_PRODUCTS;
    } catch (error) {
      console.error("Error loading products:", error);
      return DEFAULT_PRODUCTS;
    }
  }

  async purchaseProduct(productId: string): Promise<PurchaseResult> {
    try {
      const { responseCode, results } = await InAppPurchases.purchaseItemAsync(
        productId
      );

      if (responseCode === InAppPurchases.IAPResponseCode.OK) {
        const purchase = results[0];
        const product = DEFAULT_PRODUCTS.find((p) => p.productId === productId);

        if (!product) {
          throw new Error("Product not found");
        }

        // Handle the purchase based on product type
        if (product.type === "credits" && product.credits) {
          await this.addCredits(product.credits);
          return {
            success: true,
            credits: product.credits,
          };
        } else if (product.type === "subscription") {
          // Handle subscription
          await this.activateSubscription(product.duration || 30);
          return {
            success: true,
          };
        }

        return {
          success: true,
        };
      }

      return {
        success: false,
        error: "Purchase failed",
      };
    } catch (error) {
      console.error("Error purchasing product:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // async getCredits(): Promise<number> {
  //   try {
  //     const userId = this.firebaseService.getCurrentUserId();
  //     const credits =
  //       await this.firebaseService.getUserCollection<TranslationCreditApi>(
  //         FirestoreCollections.TRANSLATION_CREDITS
  //       );

  //     // Sum up all non-expired credits
  //     const now = new Date();
  //     return credits
  //       .filter((credit) => credit.userId === userId)
  //       .filter(
  //         (credit) => !credit.expiresAt || new Date(credit.expiresAt) > now
  //       )
  //       .reduce((sum, credit) => sum + credit.amount, 0);
  //   } catch (error) {
  //     console.error("Error getting credits:", error);
  //     return 0;
  //   }
  // }

  private async addCredits(amount: number): Promise<void> {
    try {
      const userId = this.firebaseService.getCurrentUserId();
      const credit: Omit<TranslationCredit, "id"> = {
        userId,
        amount,
        createdAt: new Date(),
      };

      await this.firebaseService.addUserDocument(
        FirestoreCollections.TRANSLATION_CREDITS,
        credit
      );
    } catch (error) {
      console.error("Error adding credits:", error);
      throw error;
    }
  }

  private async activateSubscription(durationDays: number): Promise<void> {
    try {
      const userId = this.firebaseService.getCurrentUserId();
      const now = new Date();
      const expiresAt = new Date(
        now.getTime() + durationDays * 24 * 60 * 60 * 1000
      );

      // Add subscription record
      await this.firebaseService.addUserDocument(
        FirestoreCollections.SUBSCRIPTIONS,
        {
          userId,
          startDate: now,
          endDate: expiresAt,
          status: "active",
        }
      );
    } catch (error) {
      console.error("Error activating subscription:", error);
      throw error;
    }
  }

  // async useCredit(): Promise<boolean> {
  //   try {
  //     const userId = this.firebaseService.getCurrentUserId();
  //     const credits =
  //       await this.firebaseService.getUserCollection<TranslationCreditApi>(
  //         FirestoreCollections.TRANSLATION_CREDITS
  //       );

  //     // Find the oldest non-expired credit
  //     const now = new Date();
  //     const availableCredit = credits
  //       .filter((credit) => credit.userId === userId)
  //       .filter(
  //         (credit) => !credit.expiresAt || new Date(credit.expiresAt) > now
  //       )
  //       .sort(
  //         (a, b) =>
  //           new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  //       )[0];

  //     if (!availableCredit || availableCredit.amount <= 0) {
  //       return false;
  //     }

  //     // Update the credit amount
  //     await this.firebaseService.updateUserDocument(
  //       FirestoreCollections.TRANSLATION_CREDITS,
  //       availableCredit.id,
  //       {
  //         amount: availableCredit.amount - 1,
  //       }
  //     );

  //     return true;
  //   } catch (error) {
  //     console.error("Error using credit:", error);
  //     return false;
  //   }
  // }

  async hasActiveSubscription(): Promise<boolean> {
    try {
      const userId = this.firebaseService.getCurrentUserId();
      const subscriptions = await this.firebaseService.getUserCollection(
        FirestoreCollections.SUBSCRIPTIONS
      );

      const now = new Date();
      return subscriptions.some(
        (sub: any) =>
          sub.userId === userId &&
          sub.status === "active" &&
          new Date(sub.endDate) > now
      );
    } catch (error) {
      console.error("Error checking subscription:", error);
      return false;
    }
  }
}
