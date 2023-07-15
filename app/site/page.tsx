"use client";

import { CenteredContainer } from "../commons/components/container/centered-container";
import { ScrollInOut } from "../commons/components/scroll-in-out/scroll-in-out";
import Image from "next/image";

export default function HomePage() {
  return (
    <CenteredContainer maxWidth={"1280px"}>
      <ScrollInOut defaultEnterFrom={"right"} starting={true}>
        <Image
          alt={"Ours développeur devant un ordinateur "}
          src={"/assets/img/coding-bear.jpeg"}
          width={500}
          height={500}
          placeholder={"empty"}
        />
      </ScrollInOut>
      <ScrollInOut></ScrollInOut>
    </CenteredContainer>
  );
}
