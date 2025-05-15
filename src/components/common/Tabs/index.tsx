import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useTheme } from "../../../theme/context";

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTabId?: string;
  onTabPress?: (tabId: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTabId = tabs[0].id,
  onTabPress,
}) => {
  const { colors, typography } = useTheme();
  const [activeTabIdState, setActiveTabId] = useState(activeTabId);

  const activeTab = tabs.find((tab) => tab.id === activeTabIdState) || tabs[0];

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabIdState;

          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                {
                  backgroundColor: isActive
                    ? colors.primary.main
                    : colors.background.paper,
                },
              ]}
              onPress={() => {
                onTabPress?.(tab.id);
                setActiveTabId(tab.id);
              }}
            >
              <Text
                style={[
                  typography.labelLarge,
                  {
                    color: isActive ? colors.text.light : colors.text.secondary,
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.content}>{activeTab.content}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    padding: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    padding: 16,
  },
});
