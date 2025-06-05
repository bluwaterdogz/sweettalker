import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAppDispatch, useAppSelector } from "@/store";
import { translateText } from "../store/thunks";
import { useToast } from "@/common/components/Toast";
import { useCallback } from "react";
import { common, styleConsts } from "@/common/styles";
import { MultiSelect } from "@/common/components/MultiSelect";
import { translationModalities, translationToneOptions } from "../consts";
import { mockUserMessages } from "../mocks";
import { useTranslation } from "@/i18n/hooks/useTranslation";

import {
  Modality,
  ModalityIdentifier,
} from "@common/models/translation/translation-modality";
import { setModalities, setTone, setFilters } from "../store/slice";
import { Pill } from "@/common/components/Pill";
import { useTheme } from "@/common/theme/hooks/useTheme";
import { InterpretationControls } from "@/features/interpretation/components/InterpretationControls";
import { ContentDropdown, ListControls } from "@/common/components";
import { useThemeBorders } from "@/features/interpretation/hooks/useThemeBorders";

interface TranslationControlsProps {
  initialMessage?: string;
}

export const TranslationControls: React.FC<TranslationControlsProps> = ({
  initialMessage = "",
}) => {
  const { status, modalities, tone, filters } = useAppSelector(
    (state) => state.translation
  );

  const { search = "", showOnlyFavorites = false } = filters;
  const [inputText, setInputText] = useState(initialMessage);
  const { showToast } = useToast();
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const { t } = useTranslation();

  const handleSetSearch = useCallback(
    (search: string) => {
      dispatch(setFilters({ ...filters, search }));
    },
    [dispatch, filters]
  );

  const handleSetShowOnlyFavorites = useCallback(
    (showOnlyFavorites: boolean) => {
      dispatch(setFilters({ ...filters, showOnlyFavorites }));
    },
    [dispatch, filters]
  );
  const handleTranslate = useCallback(async () => {
    try {
      await dispatch(
        translateText({
          input: inputText,
        })
      );
    } catch (error) {
      showToast({
        type: "error",
        message: error as string,
      });
    }
  }, [dispatch, showToast, inputText]);

  const mockInput = useCallback(() => {
    setInputText(
      mockUserMessages[Math.floor(Math.random() * mockUserMessages.length)]
    );
  }, [setInputText]);

  const inputThemeStyles = useThemeBorders();

  const toneColor = useMemo(() => {
    return colors.listItemColors[
      Math.floor(Math.random() * colors.listItemColors.length)
    ];
  }, [colors.listItemColors]);

  const modalityColorMap = useMemo(() => {
    return Object.values(translationModalities).reduce(
      (acc, modality) => ({
        ...acc,
        [modality.id]:
          colors.listItemColors[
            Math.floor(Math.random() * colors.listItemColors.length)
          ],
      }),
      {} as Record<ModalityIdentifier, string>
    );
  }, [colors.listItemColors, translationModalities]);

  const optionPills = useMemo(() => {
    return [
      {
        key: "tone",
        label: tone,
        isSelected: tone != null,
        value: tone,
        color: toneColor,
        onClick: () => dispatch(setTone(undefined)),
      },
      ...modalities.map((modality) => ({
        key: modality.id,
        label: modality.label,
        isSelected: true,
        value: modality,
        color: modalityColorMap[modality.id as ModalityIdentifier],
        onClick: () =>
          dispatch(setModalities(modalities.filter((m) => m !== modality))),
      })),
    ];
  }, [colors.listItemColors, modalities, tone, dispatch]);

  const filtersColorMap = useMemo(() => {
    return Object.entries(filters).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]:
          colors.listItemColors[
            Math.floor(Math.random() * colors.listItemColors.length)
          ],
      }),
      {} as Record<string, string>
    );
  }, [colors.listItemColors, Object.entries(filters).length]);

  const activeFilters = useMemo(() => {
    return Object.entries(filters).filter(
      ([key, value]) => value != null && value != ""
    );
  }, [filters]);

  const filterPills = useMemo(() => {
    return activeFilters.map(([key, value]) => ({
      key: key,
      isSelected: true,
      value: value,
      label: `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`,
      color: filtersColorMap[key],
      onClick: () => dispatch(setFilters({ ...filters, [key]: undefined })),
    }));
  }, [filters, filtersColorMap, dispatch]);

  return (
    <InterpretationControls
      direction={t("translation.direction")}
      direction2={t("translation.direction2")}
      buttonTitle={t("common.translate")}
      onInterpretation={handleTranslate}
      loading={status === "loading"}
      onMock={mockInput}
      input={inputText}
      setInput={setInputText}
    >
      <ContentDropdown label={t("common.controls")}>
        <View style={[common.row, styles.controlRow]}>
          <MultiSelect
            style={inputThemeStyles}
            dropdownStyle={inputThemeStyles}
            options={translationToneOptions}
            selectedValues={tone ? [tone] : []}
            onSelectionChange={(itemValue) => dispatch(setTone(itemValue[0]))}
            placeholder={t("common.selectTone")}
            mode="single"
          />
        </View>
        <View style={[common.row, styles.controlRow]}>
          <MultiSelect<Modality>
            options={Object.values(translationModalities).map((modality) => ({
              label: modality.label,
              value: modality,
            }))}
            dropdownStyle={inputThemeStyles}
            style={inputThemeStyles}
            selectedValues={modalities}
            placeholder={t("common.selectModalities")}
            onSelectionChange={(itemValue) =>
              dispatch(setModalities(itemValue))
            }
          />
        </View>
        <View style={[common.row, styles.controlRow]}>
          <ListControls
            searchStyle={inputThemeStyles}
            setSearch={handleSetSearch}
            search={search}
            setShowOnlyFavorites={handleSetShowOnlyFavorites}
            showOnlyFavorites={showOnlyFavorites}
          />
        </View>
      </ContentDropdown>
      {(tone || modalities.length > 0) && (
        <View style={[common.wrapRow, styles.controlRow]}>
          <Text style={{ color: colors.text.secondary }}>Options:</Text>
          {optionPills.map((pill) => (
            <Pill {...(pill as any)} />
          ))}
        </View>
      )}
      {activeFilters.length > 0 && (
        <View style={[common.wrapRow, styles.controlRow]}>
          <Text style={{ color: colors.text.secondary }}>Filters:</Text>
          {filterPills.map((pill) => (
            <Pill {...pill} />
          ))}
        </View>
      )}
    </InterpretationControls>
  );
};

const styles = StyleSheet.create({
  controlRow: {
    marginBottom: styleConsts.rowMarginBottom,
  },
});
