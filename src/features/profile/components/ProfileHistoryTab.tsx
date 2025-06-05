import { Tabs } from "@/common/components";
import { TranslationList } from "@/features/translation/components/TranslationList";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import { View, StyleSheet } from "react-native";

export const HistoryTab = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Tabs
        variant="secondary"
        contentContainerStyle={[styles.container]}
        tabs={[
          {
            id: "Translations",
            label: t("profile.translation"),
            content: <TranslationList />,
          },
          // {
          //   id: "Reframings",
          //   label: t("profile.reframing"),
          //   content: <ReframingList />,
          // },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
