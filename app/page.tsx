"use client";
import { CenteredContainer } from "./commons/components/container/centeredContainer";
import { TextBlock } from "./commons/components/texts/text-block";
import { TextInline } from "./commons/components/texts/text-inline";
import { Hide } from "./commons/components/hide/hide";

export default function HomePage() {
  return (
    <CenteredContainer maxWidth={"1280px"}>
      <Hide devices={["xs"]}>
        <TextBlock type={"H1"}>Julien Coeurvolan</TextBlock>
      </Hide>

      <TextInline type={"Body"}>Inline</TextInline>
      <TextInline type={"H1"}>Suite</TextInline>
    </CenteredContainer>
  );
}
