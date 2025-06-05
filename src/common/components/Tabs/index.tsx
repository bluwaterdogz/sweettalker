import React, { useState } from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { useTheme } from "../../theme/hooks/useTheme";
import { Tab } from "./Tab";
import { Tab as TabI } from "./types";
import { SecondaryTab } from "./SecondaryTab";

interface TabsProps {
  tabs: TabI[];
  activeTabId?: string;
  onTabPress?: (tabId: string) => void;
  disabled?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
  variant?: "primary" | "secondary";
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTabId = tabs[0].id,
  onTabPress,
  disabled = false,
  contentContainerStyle,
  variant = "primary",
}) => {
  const { colors } = useTheme();
  const [activeTabIdState, setActiveTabId] = useState(activeTabId);

  const activeTab = tabs.find((tab) => tab.id === activeTabIdState) || tabs[0];

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <View style={styles.tabBar}>
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeTabIdState;

          return variant === "primary" ? (
            <Tab
              key={tab.id}
              tab={tab}
              isActive={isActive}
              disabled={disabled}
              onTabPress={onTabPress}
              setActiveTabId={setActiveTabId}
            />
          ) : (
            <SecondaryTab
              key={tab.id}
              tab={tab}
              isActive={isActive}
              disabled={disabled}
              onTabPress={onTabPress}
              setActiveTabId={setActiveTabId}
              isFirst={index === 0}
              isLast={index === tabs.length - 1}
            />
          );
        })}
      </View>
      <View style={[styles.content, contentContainerStyle]}>
        {activeTab.content}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
});
