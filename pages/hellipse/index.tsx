import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextPage,
} from "next";
import { useEffect, useRef } from "react";
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
  const refContainer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = refContainer.current;
    if (!container) {
      return;
    }
    const instance = HellipseSceneInit(container, roles, cercles, hellipsiens);

    return () => {
      instance.destroy();
    };
  }, [cercles, roles, hellipsiens]);
  return (
    <Flex width={"100vw"} height={"100vh"}>
      <Flex width={["100%", "100%", "100%"]}>
        <Container ref={refContainer}></Container>
      </Flex>

      <Flex width={["100%", "100%", "0%"]}></Flex>
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
