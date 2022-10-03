import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextPage,
} from "next";
import { useEffect, useReducer, useRef } from "react";
import styled from "styled-components";
import {
  Cercle,
  Hellipsien,
  Role,
} from "../../features/notion/notion-api-type";
import * as Process from "process";
import { Flex } from "../../commons/components/flex/flex";
import { HellipseSceneInit } from "../../features/canvas2d/hellipse/hellipse-scene";
import { navyBlue } from "../../features/theme/hellipse-colors";
import { Card } from "../../commons/components/card/card";
import { pageStateReducer } from "../../features/hellipse-page/hellipse-page-state-action";

const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
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
  const refContainer = useRef<HTMLDivElement>(null);
  const [pageState, dispatchPageState] = useReducer<typeof pageStateReducer>(
    pageStateReducer,
    {}
  );
  const { currentScene, selectedCercle, selectedRole } = pageState;
  useEffect(() => {
    const container = refContainer.current;
    if (!container) {
      return;
    }
    const instance = HellipseSceneInit(container, roles, cercles, hellipsiens);
    dispatchPageState({ type: "setSelectedScene", scene: instance.scene });
    instance.onClickRole((role) => {
      dispatchPageState({ type: "setSelectedRole", role });
    });
    return () => {
      dispatchPageState({ type: "setSelectedScene", scene: null });
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
            onClick={() => dispatchPageState({ type: "toggleAnimation" })}
          >
            toggle animation
          </button>
          {selectedRole ? (
            <Card>
              {selectedRole.name}
              {selectedRole.attentes}
            </Card>
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
