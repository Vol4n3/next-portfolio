import "../styles/globals.css";
import type { AppProps } from "next/app";
import { TemplateProvider } from "../features/template/template-provider";
import { ThemeProvider } from "../features/theme/theme.provider";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <TemplateProvider>
        <Component {...pageProps}></Component>
      </TemplateProvider>
    </ThemeProvider>
  );
}

export default MyApp;
