"use client";

import { CenteredContainer } from "../commons/components/container/centered-container";
import { Button } from "../commons/components/button/button";
import { ScrollInOut } from "../commons/components/scroll-in-out/scroll-in-out";

export default function HomePage() {
  return (
    <CenteredContainer maxWidth={"1280px"}>
      <Button theme={"primary"}>Hello</Button>
      <ScrollInOut>
        <div style={{ height: "2000px", background: "yellow" }}></div>
      </ScrollInOut>
      <ScrollInOut>
        <main style={{ height: "2000px", background: "pink" }}></main>
      </ScrollInOut>
    </CenteredContainer>
  );
}
