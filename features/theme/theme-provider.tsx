import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { notInitializedFn } from "../../commons/utils/commons-utils";
import { Theme, ThemeName } from "./theme-types";
import { ThemeProvider as ThemeStyledProvider } from "styled-components";
import { ThemeDark } from "./theme-dark";
import { ThemeLight } from "./theme-light";

interface ThemeContextProps {
  changeTheme: (options: ThemeName) => void;
  theme: Theme;
}

const themes: { [key in ThemeName]: Theme } = {
  dark: ThemeDark,
  light: ThemeLight,
};
const ThemeContext = createContext<ThemeContextProps>({
  changeTheme: notInitializedFn,
  theme: themes["light"],
});
export const useTheme = () => useContext(ThemeContext);

const keyLocalStorageTheme = "theme";
let isInit = false;

export function ThemeProvider({ children }: PropsWithChildren) {
  const [themeName, setThemeName] = useState<ThemeName>("light");
  const changeTheme = useCallback(
    (name: ThemeName) => {
      if (themeName === name) {
        return;
      }
      localStorage.setItem(keyLocalStorageTheme, name);
      setThemeName(name);
    },
    [themeName]
  );
  useEffect(() => {
    if (isInit) {
      return;
    }

    isInit = true;
    const name = localStorage.getItem(keyLocalStorageTheme) as ThemeName | null;
    if (!name && !window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return;
    }
    changeTheme(name || "dark");
  }, [changeTheme]);

  return (
    <ThemeContext.Provider value={{ changeTheme, theme: themes[themeName] }}>
      <ThemeStyledProvider theme={themes[themeName]}>
        {children}
      </ThemeStyledProvider>
    </ThemeContext.Provider>
  );
}
