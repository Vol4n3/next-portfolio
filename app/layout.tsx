"use client";
import "./app.style.scss";
import { PropsWithChildren } from "react";

export default function MyAppLayout({ children }: PropsWithChildren) {
  return (
    <html lang={"fr"}>
      <body>{children}</body>
    </html>
  );
}
