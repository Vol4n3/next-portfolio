"use client";
import "./app.style.scss";
import { PropsWithChildren } from "react";
import { Header } from "./features/header/header";

export default function MyAppLayout({ children }: PropsWithChildren) {
  return (
    <html lang={"fr"}>
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
