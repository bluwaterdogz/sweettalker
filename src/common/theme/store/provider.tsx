import { createContext, useState } from "react";
import { ThemeLabel } from "../types";

export const ThemeContext = createContext<{
  theme: ThemeLabel;
  setTheme: (theme: ThemeLabel) => void;
}>({
  theme: ThemeLabel.light,
  setTheme: (_theme: ThemeLabel) => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<ThemeLabel>(ThemeLabel.light);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
