import React, { useCallback } from "react";
import { View } from "react-native";
import { Reframing } from "../api/models";
import { useAppDispatch } from "@/store";
import { useToast } from "@/lib/toast";
import { useServices } from "@/services/context";
import { updateReframing } from "../thunks";
import { InterpretationCardHeader } from "@/features/common-interpretation/components/InterpretationCardHeader";
import { ReframingCardContent } from "./ReframingCardContent";
import { UserMessage } from "@/features/common-interpretation/api/models";

interface ReframingCardProps {
  reframing: Reframing;
  userMessage: UserMessage;
}

export const ReframingCard: React.FC<ReframingCardProps> = ({
  reframing,
  userMessage,
}) => {
  const { showToast } = useToast();
  const { reframingService } = useServices();
  const dispatch = useAppDispatch();

  const onUpdateReframing = useCallback(
    async (id: string, data: Partial<Reframing>) => {
      try {
        await dispatch(
          updateReframing({
            id,
            ...data,
          })
        );
        showToast({ type: "success", message: "Reframing saved" });
      } catch (error) {
        console.error("Rating error:", error);
      }
    },
    [reframingService, showToast]
  );

  return (
    <View>
      <InterpretationCardHeader
        title={reframing.title || reframing.modality.label}
        entity={reframing}
        updateInterpretation={onUpdateReframing}
      />
      <ReframingCardContent reframing={reframing} userMessage={userMessage} />
    </View>
  );
};
