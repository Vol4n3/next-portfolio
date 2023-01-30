import { PropsWithChildren } from "react";

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang={"fr"}>
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
