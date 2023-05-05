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
            "Front & back end",
            "Expertise Typescript",
            "Passionné converti",
            "Ninja du code",
            "PWA & Responsive design",
            "Canvas2D | Webgl2",
            "Css|Js Animation",
            "Création de mini jeux",
          ]}
        />
      </TextBlock>
      <CenteredContainer maxWidth={"1280px"}>
        <TopSticky>
          <Flex columnGap={"10px"} rowGap={"10px"}>
            <NavLink href={"/site"} label={"Accueil"} exact={true} />
            <NavLink href={"/site/blog"} label={"Blog"} />
          </Flex>
        </TopSticky>
      </CenteredContainer>
    </header>
  );
};
