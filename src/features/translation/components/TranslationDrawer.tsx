import React, { useMemo, useCallback } from "react";
import { View, StyleSheet, Text } from "react-native";
import { colors } from "@/theme";
import { TranslationDrawerControls } from "./TranslationDrawerControls";
import { Drawer, Tabs } from "@/components/common";
import { clearInputText } from "../slice";
import { mockUserMessages } from "../mocks";
import { setInputText } from "../slice";
import { useAppDispatch } from "@/store";

interface TranslationDrawerProps {}

export const TranslationDrawer: React.FC<TranslationDrawerProps> = (props) => {
  const dispatch = useAppDispatch();

  const mockUserMessage = useCallback(() => {
    if (mockUserMessages.length === 0) return;
    const idx = Math.floor(Math.random() * mockUserMessages.length);
    dispatch(setInputText(mockUserMessages[idx]));
  }, [dispatch]);

  const clearUserMessage = useCallback(() => {
    dispatch(clearInputText());
  }, [dispatch]);

  const tabs = useMemo(
    () => [
      {
        id: "controls",
        label: "Controls",
        content: (
          <TranslationDrawerControls
            {...{ mockUserMessage, clearUserMessage }}
          />
        ),
      },
      {
        id: "filters",
        label: "Filters",
        content: <Text>Filters content goes here</Text>,
      },
    ],
    [mockUserMessage, clearUserMessage]
  );

  return (
    <Drawer>
      <View style={styles.handle} />
      <Tabs tabs={tabs} />
    </Drawer>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background.paper,
    borderTopColor: colors.neutral[200],
    borderTopWidth: 1,
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  content: {
    flex: 1,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.neutral[300],
    borderRadius: 2,
    marginBottom: 8,
  },
});
