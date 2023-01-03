"use client";
import { NextPage } from "next";
import { BaseButton } from "./commons/components/base-button";

const IndexPage: NextPage = () => {
  return (
    <div>
      <BaseButton>Hello world</BaseButton>
    </div>
  );
};
export default IndexPage;
