import { common } from "@/common/styles";
import { useTheme } from "@/common/theme/hooks/useTheme";
import { useThemeSpecificStyles } from "@/common/theme/hooks/useThemeSpecificStyles";

export const useThemeBorders = () => {
  const { colors } = useTheme();
  const styles = useThemeSpecificStyles({
    dark: {
      color: colors.text.primary,
      borderWidth: 0.2,
      borderColor: colors.text.secondary,
    },
    light: common.shadow,
  });
  return styles;
};
