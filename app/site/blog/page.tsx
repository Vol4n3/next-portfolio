"use client";

import { CenteredContainer } from "../../commons/components/container/centered-container";
import { InOut } from "../../commons/components/in-out/in-out";

export default function HomePage() {
  return (
    <InOut show={true} starting={true}>
      <header></header>
      <CenteredContainer maxWidth={"1280px"}>
        <iframe
          style={{ width: "100%", height: "350px" }}
          src={"/editor?projectId=webgl"}
        ></iframe>
      </CenteredContainer>
    </InOut>
  );
}
