import styles from "./header.module.scss";
import { TextBlock } from "../../commons/components/texts/text-block";
import { TextAnimationLoop } from "../text-animation/text-animation-loop";
import { CenteredContainer } from "../../commons/components/container/centered-container";
import { TopSticky } from "../../commons/components/sticky/top-sticky";
import { Flex } from "../../commons/components/flex/flex";
import { NavLink } from "./nav-link/nav-link";

export const Header = () => {
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
            <NavLink href={"/"} label={"Accueil"} />
            <NavLink href={"/blog"} label={"Blog"} />
          </Flex>
        </TopSticky>
      </CenteredContainer>
    </header>
  );
};
