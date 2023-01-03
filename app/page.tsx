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
      <Flex width={["100%", "50%"]} wraps={"nowrap"}>
        <Card>
          <Button>Hello world</Button>
          <TextField value={""} onChange={() => {}} />
        </Card>
        <Card>
          <Button>Hello world</Button>
          <TextField value={""} onChange={() => {}} />
        </Card>
      </Flex>
      <Flex width={["100%", "30%"]}>
        <Card>
          <Button>Hello world</Button>
          <TextField value={""} onChange={() => {}} />
        </Card>
      </Flex>
    </Article>
  );
};
export default IndexPage;
