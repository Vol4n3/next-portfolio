import {
  createContext,
  PropsWithChildren,
  ReactChild,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { notInitializedFn } from "../../commons/utils/commons-utils";
import { Theme, ThemeName } from "./theme-types";
import { ThemeProvider as ThemeStyledProvider } from "styled-components";
import { ThemeHellipse } from "./theme-hellipse";

interface ThemeContextProps {
  changeTheme: (options: ThemeName) => void;
  theme: Theme;
}

const themes: { [key in ThemeName]: Theme } = {
  hellipse: ThemeHellipse,
};
const ThemeContext = createContext<ThemeContextProps>({
  changeTheme: notInitializedFn,
  theme: themes["hellipse"],
});
export const useTheme = () => useContext(ThemeContext);

const keyLocalStorageTheme = "theme";
let isInit = false;

export function ThemeProvider({ children }: PropsWithChildren) {
  const [themeName, setThemeName] = useState<ThemeName>("hellipse");
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
    if (!Object.keys(themes).includes(name || "")) {
      localStorage.removeItem(keyLocalStorageTheme);
      return;
    }
    if (!name && !window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return;
    }
    changeTheme(name || "hellipse");
  }, [changeTheme]);
  return (
    <ThemeContext.Provider value={{ changeTheme, theme: themes[themeName] }}>
      <ThemeStyledProvider theme={themes[themeName]}>
        {children as ReactChild}
      </ThemeStyledProvider>
    </ThemeContext.Provider>
  );
}
