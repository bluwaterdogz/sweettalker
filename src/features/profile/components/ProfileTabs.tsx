import { TranslationList } from "@/features/translation/components/TranslationList";
import { ProfileSettings } from "./ProfileSettings";
import { Tabs } from "@/components/common";

export const ProfileTabs = () => {
  return (
    <Tabs
      tabs={[
        { id: "Settings", label: "Settings", content: <ProfileSettings /> },
        {
          id: "Translations",
          label: "Translations",
          content: <TranslationList />,
        },
      ]}
    />
  );
};
