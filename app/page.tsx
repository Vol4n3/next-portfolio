"use client";
import { NextPage } from "next";
import { Button } from "./commons/components/button/button";
import { Article } from "./commons/components/article/article";
import { Card } from "./commons/components/card/card";
import { TextField } from "./commons/components/fields/text-field";
import { Flex } from "./commons/components/flex/flex";

const IndexPage: NextPage = () => {
  return (
    <Article centered={true}>
      <Flex width={["100%", "50%"]}>
        <Card>
          <Button>Hello world</Button>
          <TextField value={""} onChange={() => {}} />
        </Card>
      </Flex>
    </Article>
  );
};
export default IndexPage;
