"use client";
import "./app.style.scss";
import { PropsWithChildren } from "react";
import { Header } from "../features/header/header";
import { IntersectionObserverProvider } from "../commons/components/intersection-observer/intersection-observer";

export default function MyAppLayout({ children }: PropsWithChildren) {
  return (
    <html lang={"fr"}>
      <body>
        <Header />
        <IntersectionObserverProvider>{children}</IntersectionObserverProvider>
      </body>
    </html>
  );
}
