export interface TranslationCredit {
  id: string;
  userId: string;
  amount: number;
  createdAt: Date;
  expiresAt?: Date;
}

export interface TranslationCreditApi {
  id: string;
  userId: string;
  amount: number;
  createdAt: Date | any; // Firestore Timestamp
  expiresAt?: Date | any; // Firestore Timestamp
}

export interface BillingProduct {
  id: string;
  type: "credits" | "subscription";
  title: string;
  description: string;
  price: string;
  credits?: number;
  duration?: number; // in days
  productId: string; // Store product ID
}

export interface BillingState {
  products: BillingProduct[];
  credits: number;
  isLoading: boolean;
  error: string | null;
}

export interface PurchaseResult {
  success: boolean;
  credits?: number;
  error?: string;
}

// Store product IDs
export const STORE_PRODUCTS = {
  CREDITS_10: "com.sweettalker.credits.10",
  CREDITS_50: "com.sweettalker.credits.50",
  CREDITS_100: "com.sweettalker.credits.100",
  SUBSCRIPTION_MONTHLY: "com.sweettalker.subscription.monthly",
  SUBSCRIPTION_YEARLY: "com.sweettalker.subscription.yearly",
} as const;

// Default products configuration
export const DEFAULT_PRODUCTS: BillingProduct[] = [
  {
    id: "credits-10",
    type: "credits",
    title: "10 Translation Credits",
    description: "Get 10 translation credits for your messages",
    price: "$0.99",
    credits: 10,
    productId: STORE_PRODUCTS.CREDITS_10,
  },
  {
    id: "credits-50",
    type: "credits",
    title: "50 Translation Credits",
    description: "Get 50 translation credits for your messages",
    price: "$4.99",
    credits: 50,
    productId: STORE_PRODUCTS.CREDITS_50,
  },
  {
    id: "credits-100",
    type: "credits",
    title: "100 Translation Credits",
    description: "Get 100 translation credits for your messages",
    price: "$9.99",
    credits: 100,
    productId: STORE_PRODUCTS.CREDITS_100,
  },
  {
    id: "subscription-monthly",
    type: "subscription",
    title: "Monthly Subscription",
    description: "Unlimited translations for $9.99/month",
    price: "$9.99",
    duration: 30,
    productId: STORE_PRODUCTS.SUBSCRIPTION_MONTHLY,
  },
  {
    id: "subscription-yearly",
    type: "subscription",
    title: "Yearly Subscription",
    description: "Unlimited translations for $99.99/year",
    price: "$99.99",
    duration: 365,
    productId: STORE_PRODUCTS.SUBSCRIPTION_YEARLY,
  },
];
