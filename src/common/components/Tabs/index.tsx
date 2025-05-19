import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  StyleProp,
  ViewStyle,
} from "react-native";
import { useTheme } from "../../theme/hooks/useTheme";
import { common } from "@/common/styles";

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTabId?: string;
  onTabPress?: (tabId: string) => void;
  disabled?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTabId = tabs[0].id,
  onTabPress,
  disabled = false,
  contentContainerStyle,
}) => {
  const { colors, typography } = useTheme();
  const [activeTabIdState, setActiveTabId] = useState(activeTabId);

  const activeTab = tabs.find((tab) => tab.id === activeTabIdState) || tabs[0];

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabIdState;

          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                {
                  borderColor: colors.background.secondary,
                  backgroundColor: isActive
                    ? undefined
                    : colors.background.secondary,
                  opacity: disabled ? 0.5 : 1,
                },
              ]}
              onPress={() => {
                if (!disabled) {
                  onTabPress?.(tab.id);
                  setActiveTabId(tab.id);
                }
              }}
              disabled={disabled}
            >
              <Text
                style={[
                  typography.labelLarge,
                  styles.tabText,
                  {
                    color: isActive
                      ? colors.text.primary
                      : colors.text.secondary,
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
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
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    borderWidth: 1,
    borderBottomWidth: 0,
    justifyContent: "center",
  },
  tabText: {
    textAlign: "center",
  },
  content: {
    flex: 1,
    padding: 16,
  },
});
