import { CenteredContainer } from "@components/container/centered-container";
import { ScrollInOut } from "@components/scroll-in-out/scroll-in-out";
import Image from "next/image";
import { CustomMdxRemote } from "@features/mdx/custom-mdx-remote";

export default function HomePage() {
  return (
    <CenteredContainer maxWidth={"1280px"}>
      <ScrollInOut defaultEnterFrom={"right"} starting={true}>
        <Image
          alt={"Ours développeur devant un ordinateur "}
          src={"/assets/img/coding-bear.jpeg"}
          width={1200}
          height={1200}
          style={{ width: "100%", height: "auto" }}
          placeholder={"empty"}
        />
      </ScrollInOut>

      <ScrollInOut starting={true}>
        <CustomMdxRemote source={""}></CustomMdxRemote>
      </ScrollInOut>
    </CenteredContainer>
  );
}
