import { useContext, useMemo } from "react";
import { typography } from "../typography/typography";
import { colors } from "../colors";
import { ThemeContext } from "../store/provider";

export const useTheme = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  const themeColors = useMemo(() => {
    return colors[theme];
  }, [theme]);

  return {
    colors: themeColors,
    typography,
    theme,
    setTheme,
  };
};

export { typography };
