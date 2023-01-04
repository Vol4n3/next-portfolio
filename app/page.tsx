"use client";
import { Button } from "./commons/components/button/button";
import { CenteredContainer } from "./commons/components/container/centeredContainer";
import { Card } from "./commons/components/card/card";
import { TextField } from "./commons/components/text-field/text-field";
import { Flex } from "./commons/components/flex/flex";
import { TextBlock } from "./commons/components/texts/text-block";
import { TextInline } from "./commons/components/texts/text-inline";
import { InOut } from "./commons/components/inout/inout";
import { useState } from "react";

export default function HomePage() {
  const [show, setShow] = useState<boolean>(true);

  return (
    <CenteredContainer maxWidth={"1280px"}>
      <TextBlock type={"H1"}>Julien Coeurvolan</TextBlock>
      <TextInline type={"Body"}>Inline</TextInline>
      <TextInline type={"H1"}>Suite</TextInline>
      <Button onClick={() => setShow(!show)}>
        Hello world {show ? "on" : "off"}
      </Button>
      <InOut show={show} keepContent={true} starting={true}>
        <Flex width={["100%", "50%"]} wraps={"nowrap"}>
          <Card>
            <TextField value={""} onChange={() => {}} />
          </Card>
          <Card>
            <Button>Hello world</Button>
            <TextField value={""} onChange={() => {}} />
          </Card>
        </Flex>
      </InOut>

      <Flex width={["100%", "30%"]}>
        <Card>
          <Button>Hello world</Button>
          <TextField value={""} onChange={() => {}} />
        </Card>
      </Flex>
    </CenteredContainer>
  );
}
