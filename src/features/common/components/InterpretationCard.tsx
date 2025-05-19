import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "@/common/theme/hooks/useTheme";
import { Interpretation } from "../api/models";
import { InterpretationCardHeader } from "@/features/common/components/InterpretationCardHeader";
import { CardContent } from "@/common/components/Card/CardContent";

interface InterpretationCardProps {
  item: any;
  children: React.ReactNode;
  onUpdate: (id: string, data: Partial<Interpretation>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const InterpretationCard: React.FC<InterpretationCardProps> = ({
  item,
  children,
  onUpdate,
  onDelete,
}: InterpretationCardProps) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background.primary,
        },
      ]}
    >
      <InterpretationCardHeader
        title={item.title || item.modality.label}
        entity={item}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
      <CardContent
        style={[styles.content, { backgroundColor: colors.background.primary }]}
      >
        {children}
      </CardContent>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    gap: 8,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    display: "flex",
    gap: 8,
    flexDirection: "column",
    justifyContent: "space-between",
  },
});
