import React, { useMemo, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Reframing } from "../api/models";
import { UserMessage } from "@/features/common-interpretation/api/models";
import { useSubscribeFirestore } from "@/services/firebase/hooks/useSubscribeFirestore";
import { useServices } from "@/services/context";
import { keyBy } from "lodash";
import {
  ListControls,
  CardList,
  Loader,
  ErrorMessage,
} from "@/components/common";
import { ReframingCard } from "./ReframingCard";
import Fuse from "fuse.js";
import { EmptyStateMessage } from "@/components/app";

const fuseOptions = {
  keys: ["text", "description", "title", "modality", "userMessage.text"],
  threshold: 0.4,
};

export const ReframingList: React.FC = () => {
  const { reframingService } = useServices();
  const [search, setSearch] = useState("");
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const {
    result: reframings,
    loading: loadingReframings,
    error: reframingsError,
  } = useSubscribeFirestore<Reframing[]>((...args) =>
    reframingService.subscribeToReframings(...args)
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

  const formattedReframings = useMemo(() => {
    return reframings?.map((reframing) => {
      return {
        ...reframing,
        userMessage: userMessagesHashmap[reframing.userMessageId],
      };
    });
  }, [reframings, userMessagesHashmap]);

  const filteredReframings = useMemo(() => {
    let items = formattedReframings || [];
    if (showOnlyFavorites) {
      items = items.filter((t) => t.favorite);
    }
    if (search.trim()) {
      const fuse = new Fuse(items, fuseOptions);
      return fuse.search(search).map((r: any) => r.item);
    }
    return items;
  }, [formattedReframings, search, showOnlyFavorites]);

  // if (reframingsError || userMessagesError) {
  //   return <ErrorMessage error={reframingsError || userMessagesError} />;
  // }

  return (
    <View style={[styles.container]}>
      <ListControls
        setSearch={setSearch}
        search={search}
        setShowOnlyFavorites={setShowOnlyFavorites}
        showOnlyFavorites={showOnlyFavorites}
      />
      {loadingReframings || loadingUserMessages ? (
        <Loader />
      ) : (
        <CardList
          data={filteredReframings || []}
          emptyListContent={<EmptyStateMessage />}
          renderItem={(reframing) => (
            <ReframingCard
              reframing={reframing}
              userMessage={reframing.userMessage}
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
