import { BillingScreen } from "@/features/billing/components/BillingScreen";
import { ProfileScreen } from "@/features/profile/components";
import { ReframingScreen } from "@/features/reframing/components/ReframingScreen";
import { TranslationScreen } from "@/features/translation/components/TranslationScreen";

export const userRoutes = [
  {
    name: "Translation",
    component: TranslationScreen,
    options: { title: "Translation" },
  },
  {
    name: "Profile",
    component: ProfileScreen,
    options: { title: "Profile" },
  },
  // {
  //   name: "Billing",
  //   component: BillingScreen,
  //   options: { title: "Billing" },
  // },
  {
    name: "Reframing",
    component: ReframingScreen,
    options: { title: "Reframing" },
  },
];
