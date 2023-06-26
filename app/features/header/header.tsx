import styles from "./header.module.scss";
import { TextBlock } from "../../commons/components/texts/text-block";
import { TextAnimationLoop } from "../text-animation/text-animation-loop";
import { CenteredContainer } from "../../commons/components/container/centered-container";
import { Flex } from "../../commons/components/flex/flex";
import { NavLink } from "./nav-link/nav-link";

export const Header = () => {
  return (
    <>
      <TextBlock className={styles.headerTextBlock} type={"H1"}>
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

      <header className={[styles.header, "sticky"].join(" ")}>
        <CenteredContainer maxWidth={"1280px"}>
          <Flex columnGap={"10px"} rowGap={"10px"}>
            <NavLink href={"/site"} label={"Accueil"} exact={true} />
            <NavLink href={"/site/blog"} label={"Blog"} />
          </Flex>
        </CenteredContainer>
      </header>
    </>
  );
};
