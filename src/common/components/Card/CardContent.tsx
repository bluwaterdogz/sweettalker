import { useTheme } from "../../theme/hooks/useTheme";
import { View, StyleSheet } from "react-native";
import { ReactNode } from "react";

interface CardContentProps {
  children: ReactNode;
  style?: object;
}

export const CardContent: React.FC<CardContentProps> = ({
  children,
  style,
}) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.content,
        style,
        { backgroundColor: colors.background.primary },
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    // padding: 16,
  },
});
