import { PropsWithChildren } from "react";
import "./editor-style.scss";

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang={"fr"}>
      <head>
        <title>Editor</title>
        <meta httpEquiv="Content-Type" content="text/html;charset=utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </head>
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
