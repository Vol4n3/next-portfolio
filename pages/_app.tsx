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
    background: ${({ theme }) => theme.body.background};
    color: ${({ theme }) => theme.body.font.color};
    font-weight: ${({ theme }) => theme.body.font.weight};
    font-family: ${({ theme }) => theme.body.font.family};
    font-size: ${({ theme }) => theme.body.font.size};
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
