import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextPage,
} from "next";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import {
  Cercle,
  Hellipsien,
  Role,
} from "../../features/notion/notion-api-type";
import * as Process from "process";
import { Flex } from "../../commons/components/flex/flex";
import { HellipseSceneInit } from "../../features/canvas2d/hellipse/hellipse-scene";
import { Scene2d } from "../../features/canvas2d/scene2d";
import { navyBlue } from "../../features/theme/hellipse-colors";

const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: ${navyBlue};
`;

interface HellipsePageProps {
  hellipsiens: Hellipsien[];
  roles: Role[];
  cercles: Cercle[];
}

const HellipsePage: NextPage<HellipsePageProps> = ({
  cercles,
  roles,
  hellipsiens,
}: HellipsePageProps) => {
  const [instance, setInstance] = useState<Scene2d | null>(null);
  const refContainer = useRef<HTMLDivElement>(null);
  const [getRole, setRole] = useState<Role | null>(null);
  useEffect(() => {
    const container = refContainer.current;
    if (!container) {
      return;
    }
    const instance = HellipseSceneInit(container, roles, cercles, hellipsiens);
    setInstance(instance.instance);
    instance.onClickRole((role) => {
      setRole(role);
    });
    return () => {
      setInstance(null);
      instance.destroy();
    };
  }, [cercles, roles, hellipsiens]);
  return (
    <Flex width={"100vw"} height={"100vh"}>
      <Flex width={["100%", "100%", "70%"]} height={["30%", "30%", "100%"]}>
        <Container ref={refContainer}></Container>
      </Flex>
      <Flex
        style={{ background: navyBlue }}
        width={["100%", "100%", "30%"]}
        height={["70%", "70%", "100%"]}
      >
        <div>
          <button
            onClick={() =>
              instance
                ? (instance.pauseAnimation = !instance.pauseAnimation)
                : null
            }
          >
            pause
          </button>
          {getRole ? (
            <>
              {getRole.name}
              {getRole.attentes}
            </>
          ) : null}
        </div>
      </Flex>
    </Flex>
  );
};

export async function getServerSideProps({
  res,
}: GetServerSidePropsContext): Promise<
  GetServerSidePropsResult<HellipsePageProps>
> {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=3600"
  );
  try {
    const data = await Promise.all([
      fetch(`${Process.env.API_URI}/notion/hellipsien`),
      fetch(`${Process.env.API_URI}/notion/cercle`),
      fetch(`${Process.env.API_URI}/notion/role`),
    ]);
    const dataToJson = await Promise.all(data.map((d) => d.json()));
    return {
      props: {
        hellipsiens: dataToJson[0],
        cercles: dataToJson[1],
        roles: dataToJson[2],
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        hellipsiens: [],
        roles: [],
        cercles: [],
      },
    };
  }
}

export default HellipsePage;
