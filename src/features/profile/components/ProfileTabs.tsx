import { ProfileSettings } from "./ProfileSettings";
import { Tabs } from "@/common/components";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import { StyleSheet, Text } from "react-native";
import { HistoryTab } from "./ProfileHistoryTab";
import { ScrollContainer } from "@/common/components/ScrollContainer";

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
          id: "History",
          label: t("profile.history"),
          content: <HistoryTab />,
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
