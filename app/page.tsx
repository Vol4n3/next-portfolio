"use client";
import { CenteredContainer } from "./commons/components/container/centered-container";
import { TextBlock } from "./commons/components/texts/text-block";
import { Button } from "./commons/components/button/button";
import { TextAnimationLoop } from "./features/text-animation/text-animation-loop";
import styles from "./page.module.scss";

export default function HomePage() {
  return (
    <CenteredContainer maxWidth={"1280px"}>
      <TextBlock type={"H1"} className={styles.overflowLimit}>
        <TextAnimationLoop
          textes={[
            "Julien Coeurvolan",
            "Développeur web",
            "Front End",
            "Grand Passionné",
            "Ninja du code",
          ]}
        />
      </TextBlock>
      <Button>Home</Button>
    </CenteredContainer>
  );
}
