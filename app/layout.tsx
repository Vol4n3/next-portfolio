"use client";
import { createGlobalStyle } from "styled-components";
import { ThemeProvider } from "./features/theme/theme-provider";
import { TemplateProvider } from "./features/template/template-provider";
import "./app.style.css";
import { PropsWithChildren } from "react";

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

export default function MyAppLayout({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <html>
        <body>
          <GlobalStyle />
          <TemplateProvider>{children}</TemplateProvider>
        </body>
      </html>
    </ThemeProvider>
  );
}
