"use client";
import { CenteredContainer } from "./commons/components/container/centered-container";
import { TextBlock } from "./commons/components/texts/text-block";
import { LinkButton } from "./commons/components/button/button";
import { TextAnimationLoop } from "./features/text-animation/text-animation-loop";
import styles from "./page.module.scss";
import { TopSticky } from "./commons/components/sticky/top-sticky";
import { Flex } from "./commons/components/flex/flex";
import Link from "next/link";

export default function HomePage() {
  return (
    <header className={styles.header}>
      <TextBlock
        style={{ textAlign: "center" }}
        type={"H1"}
        className={styles.overflowLimit}
      >
        <TextAnimationLoop
          textes={[
            "Julien Coeurvolan",
            "Développeur web",
            "Front End React",
            "Grand Passionné",
            "Ninja du code",
            "Responsive Design",
            "Canvas 2D skills",
          ]}
        />
      </TextBlock>
      <CenteredContainer maxWidth={"1280px"}>
        <TopSticky>
          <Flex columnGap={"10px"} rowGap={"10px"}>
            <div>
              <Link href={"/"} passHref legacyBehavior>
                <LinkButton theme={"underline"} active={true}>
                  Accueil
                </LinkButton>
              </Link>
            </div>
            <div>
              <Link href={"/blog"} passHref legacyBehavior>
                <LinkButton theme={"underline"}>Blog</LinkButton>
              </Link>
            </div>
          </Flex>
        </TopSticky>
      </CenteredContainer>
    </header>
  );
}
