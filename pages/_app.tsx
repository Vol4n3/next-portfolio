import "../styles/globals.css";
import type { AppProps } from "next/app";
import { TemplateProvider } from "../features/template/template-provider";
import { ThemeProvider } from "../features/theme/theme-provider";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  html,
  body {
    padding: 0;
    margin: 0;
    font-family: "Raleway", sans-serif;
    font-size: 16px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text.base};
    position: relative;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  * {
    box-sizing: border-box;
  }
`;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <GlobalStyle />
      <TemplateProvider>
        <Component {...pageProps}></Component>
      </TemplateProvider>
    </ThemeProvider>
  );
}

export default MyApp;
