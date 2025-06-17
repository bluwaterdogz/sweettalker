import { PillSelector } from "@/common/components/PillSelector";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import { useTheme } from "@/common/theme/hooks/useTheme";
import { View, Text, StyleSheet } from "react-native";
import { emotionsList, needsList } from "../consts";
import { ScrollContainer } from "@/common/components/ScrollContainer";
import { Emotion, Need } from "@common/models/check-in/check-in";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/common/components/Button";

import { checkIn } from "../store/thunks";
import { useAppDispatch, useAppSelector } from "@/store";
import { useThemeBorders } from "@/common/hooks/useThemeBorders";
import { useNavigation } from "@react-navigation/native";

export const CheckInScreen = () => {
  const { colors, typography } = useTheme();
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { emotions = [], needs = [] } = useAppSelector(
    (state) => state.checkIn
  );
  const emotionColors = useMemo(
    () => colors.listItemColors.map((x) => x),
    [colors.listItemColors]
  );
  const needColors = useMemo(
    () => colors.listItemColors.map((x) => x),
    [colors.listItemColors]
  );
  const [selectedEmotions, setSelectedEmotions] = useState<Emotion[]>(emotions);
  const [selectedNeeds, setSelectedNeeds] = useState<Need[]>(needs);

  useEffect(() => {
    setSelectedEmotions(emotions);
    setSelectedNeeds(needs);
  }, [emotions, needs]);

  const { t } = useTranslation();

  const inputStyles = useThemeBorders();
  const emotionOptions = useMemo(
    () =>
      emotionsList.map((emotion) => ({
        label: emotion.label,
        key: emotion.key,
        value: emotion,
        color: emotionColors.splice(
          Math.floor(Math.random() * emotionColors.length),
          1
        )[0],
      })),
    [emotionColors]
  );

  const needOptions = useMemo(
    () =>
      needsList.map((need) => ({
        label: need.label,
        key: need.key,
        value: need,
        color: needColors.splice(
          Math.floor(Math.random() * needColors.length),
          1
        )[0],
      })),
    [needColors]
  );

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <View style={[styles.section, { paddingTop: 16 }]}>
        <Text
          style={[
            typography.headingLarge,
            styles.direction,
            { color: colors.text.primary },
          ]}
        >
          {t("checkIn.feelingHeader")}
        </Text>
        <ScrollContainer fadeSize={10}>
          <PillSelector<Emotion>
            value={selectedEmotions}
            containerStyle={styles.pillContainer}
            pillStyle={inputStyles}
            pills={emotionOptions}
            showPillX={false}
            setValue={setSelectedEmotions}
          />
        </ScrollContainer>
      </View>
      <View style={styles.section}>
        <Text
          style={[
            typography.headingLarge,
            styles.direction,
            { color: colors.text.primary },
          ]}
        >
          {t("checkIn.supportHeader")}
        </Text>
        <ScrollContainer fadeSize={10}>
          <PillSelector<Need>
            value={selectedNeeds}
            pillStyle={inputStyles}
            containerStyle={styles.pillContainer}
            pills={needOptions}
            setValue={setSelectedNeeds}
          />
        </ScrollContainer>
      </View>
      <View style={[styles.section, styles.buttonSection]}>
        {/* TODO: update if same day rather than continue */}
        <Button
          title={t("common.continue")}
          onPress={() => {
            dispatch(
              checkIn({
                emotions: selectedEmotions,
                needs: selectedNeeds,
              })
            );
            navigation.navigate("Conversations" as never);
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    // alignItems: "center",
    justifyContent: "center",
  },
  pillContainer: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  direction: {
    paddingHorizontal: 16,
    // textAlign: "center",
    marginBottom: 16,
    width: "80%",
  },
  buttonSection: {
    flex: 0,
    display: "flex",
    flexDirection: "row",
    gap: 8,
    paddingVertical: 8,
    paddingBottom: 16,
  },
  section: {
    display: "flex",
    flexDirection: "column",
    padding: 16,
    gap: 16,
    flex: 1,
  },
});
