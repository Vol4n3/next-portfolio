"use client";

import { CenteredContainer } from "../commons/components/container/centered-container";
import { Button } from "../commons/components/button/button";

export default function HomePage() {
  return (
    <CenteredContainer maxWidth={"1280px"}>
      <Button theme={"primary"}>Hello</Button>
    </CenteredContainer>
  );
}
