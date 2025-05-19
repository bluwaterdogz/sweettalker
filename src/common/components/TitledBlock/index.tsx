import { View, Text, StyleSheet, TextStyle } from "react-native";
import { useTheme } from "../../theme/hooks/useTheme";

interface TextBlockProps {
  title: string;
  text?: string;
  children?: React.ReactNode;
  titleStyles?: TextStyle[];
  textStyles?: TextStyle[];
}

export const TitledBlock = (props: TextBlockProps) => {
  const { colors, typography } = useTheme();
  const {
    title,
    text,
    titleStyles = [typography.bodyMedium],
    textStyles = [typography.bodySmall],
    children,
  } = props;
  return (
    <View>
      <Text style={[...titleStyles, { color: colors.text.secondary }]}>
        {title}
      </Text>
      {text && (
        <Text
          style={[...textStyles, styles.text, { color: colors.text.primary }]}
        >
          {text}
        </Text>
      )}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    padding: 8,
    paddingTop: 4,
    lineHeight: 24,
  },
  content: {
    paddingTop: 4,
  },
});
