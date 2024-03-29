import { CenteredContainer } from "@components/container/centered-container";
import { ScrollInOut } from "@components/scroll-in-out/scroll-in-out";
import Image from "next/image";
import { CodeEditor } from "@features/editor/code-editor";

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
          priority={false}
        />
      </ScrollInOut>
      <CodeEditor
        defaultValue={{ html: "<h2>testons</h2>", js: "", css: "" }}
      ></CodeEditor>
    </CenteredContainer>
  );
}
