import React, { useState } from "react";
import { View } from "react-native";
import { useAppDispatch, useAppSelector } from "@/store";
import { translateText } from "../store/thunks";
import { useToast } from "@/common/features/Toast";
import { useCallback } from "react";
import { common } from "@/common/styles";
import { MultiSelect } from "@/common/components/MultiSelect";
import { translationModalities, translationToneOptions } from "../consts";
import { mockUserMessages } from "../mocks";
import { useTranslation } from "react-i18next";
import { InterpretationControls } from "@/features/common/components/InterpretationControls";
import { useThemeBorders } from "@/features/common/hooks/useThemeBorders";
import { Modality } from "../api/models";
import { setModalities, setTone } from "../store/slice";

interface TranslationControlsProps {}

export const TranslationControls: React.FC<TranslationControlsProps> = ({}) => {
  const { status, modalities, tone } = useAppSelector(
    (state) => state.translation
  );
  const [inputText, setInputText] = useState("");
  const { showToast } = useToast();
  const dispatch = useAppDispatch();

  const { t } = useTranslation();

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

  return (
    <InterpretationControls
      onInterpretation={handleTranslate}
      loading={status === "loading"}
      onMock={mockInput}
      input={inputText}
      setInput={setInputText}
    >
      <View style={common.row}>
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
      <View style={common.row}>
        <MultiSelect<Modality>
          options={Object.values(translationModalities).map((modality) => ({
            label: modality.label,
            value: modality,
          }))}
          dropdownStyle={inputThemeStyles}
          style={inputThemeStyles}
          selectedValues={modalities}
          onSelectionChange={(itemValue) => dispatch(setModalities(itemValue))}
        />
      </View>
    </InterpretationControls>
  );
};
