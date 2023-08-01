import styles from "./header.module.scss";
import { TextBlock } from "@components/texts/text-block";
import { CenteredContainer } from "@components/container/centered-container";
import { NavLink } from "./nav-link/nav-link";
import { Hide } from "@components/hide/hide";
import { TextAnimationLoop } from "@components/text-animation/text-animation-loop";

export const Header = () => {
  return (
    <>
      <Hide devices={["xs", "sm"]}>
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
      </Hide>

      <header className={[styles.header, "sticky"].join(" ")}>
        <CenteredContainer maxWidth={"1280px"}>
          <div className={styles.headerNavBar}>
            <NavLink href={"/site"} label={"Accueil"} exact={true} />
            <NavLink href={"/site/blog"} label={"Blog"} />
          </div>
        </CenteredContainer>
      </header>
    </>
  );
};
