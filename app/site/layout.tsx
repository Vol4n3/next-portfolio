import "./site.style.scss";
import { PropsWithChildren } from "react";
import { Header } from "@features/header/header";
import { IntersectionObserverProvider } from "@components/intersection-observer/intersection-observer";
import { Roboto } from "next/font/google";
import { Metadata } from "next";
import { ArrayToClassName } from "@commons/utils/utils";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-roboto",
});
export const metadata: Metadata = {
  title: {
    template: "%s | Blog Julien Coeurvolan",
    default: "Blog Julien Coeurvolan",
  },
  colorScheme: "dark",
};
export default function MyAppLayout({ children }: PropsWithChildren) {
  return (
    <html
      lang={"fr"}
      className={ArrayToClassName([roboto.className, roboto.variable])}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/assets/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/assets/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/assets/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/assets/favicon/site.webmanifest" />
      </head>
      <body>
        <IntersectionObserverProvider>
          <Header />
          {children}
        </IntersectionObserverProvider>
      </body>
    </html>
  );
}
