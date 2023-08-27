import { CenteredContainer } from "@components/container/centered-container";
import { ScrollInOut } from "@components/scroll-in-out/scroll-in-out";
import Image from "next/image";
import { IframeEditor } from "@features/editor/iframe-editor";

export default function HomePage() {
  return (
    <CenteredContainer maxWidth={"1600px"}>
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
      <IframeEditor
        defaultValue={{ html: "<h2>testons</h2>", js: "", css: "" }}
      ></IframeEditor>
    </CenteredContainer>
  );
}
