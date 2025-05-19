import React, { useCallback, useMemo, useState } from "react";
import { Reframing } from "../api/models";
import { UserMessage } from "@/features/common/api/models";
import { useSubscribeFirestore } from "@/services/firebase/hooks/useSubscribeFirestore";
import { useServices } from "@/services/context";
import { keyBy } from "lodash";
import { InterpretationList } from "@/features/common/components/InterpretationList";
import { useErrorLoadingUi } from "@/common/hooks/useErrorLoadingUi";
import { InterpretationCard } from "@/features/common/components/InterpretationCard";
import { deleteReframing } from "../store/thunks";
import { useToast } from "@/common/features/Toast";
import { useAppDispatch } from "@/store";
import { updateReframing } from "../store/thunks";
import { ReframingCard } from "./ReframingCard";
interface PopulatedReframing extends Reframing {
  userMessage: UserMessage;
}

export const ReframingList: React.FC = () => {
  const { reframingService } = useServices();
  const { showToast } = useToast();
  const dispatch = useAppDispatch();

  const {
    result: reframings = [],
    loading: loadingReframings,
    error: reframingsError,
  } = useSubscribeFirestore<Reframing[]>((...args) =>
    reframingService.subscribe(...args)
  );

  const {
    result: userMessages,
    loading: loadingUserMessages,
    error: userMessagesError,
  } = useSubscribeFirestore<UserMessage[]>((...args) =>
    reframingService.subscribeToUserMessages(...args)
  );

  const userMessagesHashmap = useMemo(() => {
    return keyBy(userMessages, "id");
  }, [userMessages]);

  const populatedReframings: PopulatedReframing[] = useMemo(() => {
    return (reframings || []).map((reframing) => {
      return {
        ...reframing,
        userMessage: userMessagesHashmap[reframing.userMessageId],
      };
    });
  }, [reframings, userMessagesHashmap]);

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
        showToast({ type: "error", message: "Failed to save reframing" });
      }
    },
    [reframingService, showToast]
  );

  const onDeleteReframing = useCallback(async (id: string) => {
    try {
      await dispatch(deleteReframing(id));
    } catch (error) {
      showToast({ type: "error", message: "Failed to delete reframing" });
    }
  }, []);

  return (
    <InterpretationList<PopulatedReframing>
      searchKeys={[
        "text",
        "description",
        "notes",
        "edits.text",
        "title",
        "userMessage.text",
      ]}
      items={populatedReframings}
      renderItem={(item) => (
        <ReframingCard
          key={item.id}
          onUpdate={onUpdateReframing}
          onDelete={onDeleteReframing}
          reframing={item}
          userMessage={item.userMessage}
        />
      )}
    />
  );
};
