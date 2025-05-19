import { TranslationList } from "@/features/translation/components/TranslationList";
import { ProfileSettings } from "./ProfileSettings";
import { Tabs } from "@/common/components";
import { ReframingList } from "@/features/reframing/components/ReframingList";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

export const ProfileTabs = () => {
  const { t } = useTranslation();
  return (
    <Tabs
      contentContainerStyle={[styles.container]}
      tabs={[
        {
          id: "Settings",
          label: t("profile.settings"),
          content: <ProfileSettings />,
        },
        {
          id: "Translations",
          label: t("profile.translation"),
          content: <TranslationList />,
        },
        {
          id: "Reframings",
          label: t("profile.reframing"),
          content: <ReframingList />,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    paddingVertical: 16,
  },
});
