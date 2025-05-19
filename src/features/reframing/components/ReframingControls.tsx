import React, { useCallback, useState } from "react";
import { reframeText } from "../store/thunks";
import { useAppDispatch, useAppSelector } from "@/store";
import { mockReframing } from "../api/mocks";
import { InterpretationControls } from "@/features/common/components/InterpretationControls";
import { setModality } from "../store/slice";
import { View, Text } from "react-native";
import { ReframingModality } from "../api/models";
import { MultiSelect } from "@/common/components/MultiSelect";
import { common } from "@/common/styles";
import { reframingModalities } from "../consts";
import { useThemeBorders } from "@/features/common/hooks/useThemeBorders";

export const ReframingControls: React.FC = () => {
  const { status, modality } = useAppSelector((state) => state.reframing);
  const [inputText, setInputText] = useState("");

  const dispatch = useAppDispatch();

  const handleReframe = useCallback(() => {
    if (inputText.trim()) {
      dispatch(reframeText({ input: inputText, options: { modality } }));
    }
  }, [dispatch, inputText]);

  const handleMock = useCallback(
    () =>
      setInputText(
        mockReframing[Math.floor(Math.random() * mockReframing.length)]
      ),
    [dispatch]
  );

  const inputStyles = useThemeBorders();

  return (
    <InterpretationControls
      onInterpretation={handleReframe}
      // loading={status === "loading"}
      onMock={handleMock}
      input={inputText}
      setInput={setInputText}
    >
      <View style={common.row}>
        <MultiSelect<ReframingModality>
          options={Object.values(reframingModalities).map((modality) => ({
            label: modality.label,
            value: modality,
          }))}
          dropdownStyle={inputStyles}
          style={inputStyles}
          mode="single"
          selectedValues={[modality]}
          onSelectionChange={(itemValue) => dispatch(setModality(itemValue[0]))}
        />
      </View>
    </InterpretationControls>
  );
};
