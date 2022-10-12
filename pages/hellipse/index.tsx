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
import {
  PagesStatesActionsEnum,
  pageStateReducer,
} from "../../features/hellipse-page/hellipse-page-state-action";
import { TextField } from "../../commons/components/fields/text-field";
import { BaseButton } from "../../commons/components/base-button";

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
    { search: "" }
  );
  const { search, instance, selectedCercle, selectedRole, foundRoles } =
    pageState;
  useEffect(() => {
    const container = refContainer.current;
    if (!container) {
      return;
    }
    const localInstance = HellipseSceneInit(
      container,
      roles,
      cercles,
      hellipsiens
    );
    dispatchPageState({
      type: PagesStatesActionsEnum.setSelectedScene,
      instance: localInstance,
    });
    localInstance.onClickRole((role) => {
      dispatchPageState({ type: PagesStatesActionsEnum.setSelectedRole, role });
    });
    localInstance.onClickCercle((cercle) => {
      dispatchPageState({
        type: PagesStatesActionsEnum.setSelectedCercle,
        cercle,
      });
    });
    return () => {
      dispatchPageState({
        type: PagesStatesActionsEnum.setSelectedScene,
        instance: null,
      });
      localInstance.destroy();
    };
  }, [cercles, roles, hellipsiens]);

  function searchAttentes(term: string) {
    if (!roles) {
      return;
    }
    dispatchPageState({ type: PagesStatesActionsEnum.setSearch, term });
    if (term.length < 3) {
      dispatchPageState({
        type: PagesStatesActionsEnum.setFoundRoles,
        roles: null,
      });
      return;
    }
    const normalizedTerm = term.trim().toLowerCase().normalize();
    const matchedRoles = roles.filter((r) =>
      r.attentes.toLowerCase().normalize().match(normalizedTerm)
    );

    dispatchPageState({
      type: PagesStatesActionsEnum.setFoundRoles,
      roles: matchedRoles,
    });
  }

  const onClickFRole = (foundedRole: Role) => {
    if (!instance) {
      return;
    }
    dispatchPageState({
      type: PagesStatesActionsEnum.setSelectedRole,
      role: foundedRole,
    });
    instance.followRole(foundedRole);
  };

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
        <Container>
          <Card>
            <div>
              {instance?.scene && (
                <button
                  onClick={() =>
                    instance.scene
                      ? (instance.scene.pauseAnimation =
                          !instance.scene.pauseAnimation)
                      : undefined
                  }
                >
                  toggle animation
                </button>
              )}
            </div>
            <Flex direction={"column"}>
              <label>
                <span>Chercher dans les attentes</span>
                <br />
                <TextField value={search} onChange={searchAttentes} />
              </label>
              {foundRoles && !!foundRoles.length && (
                <Flex direction={"column"}>
                  {foundRoles.map((fRoles) => (
                    <BaseButton
                      key={fRoles.name}
                      onClick={() => onClickFRole(fRoles)}
                    >
                      {fRoles.name}
                    </BaseButton>
                  ))}
                </Flex>
              )}
            </Flex>

            {selectedCercle && <h2>Cercle :{selectedCercle.name}</h2>}
            {selectedRole && (
              <div>
                <h3>Rôle : {selectedRole.name}</h3>
                {selectedRole.attentes &&
                  selectedRole.attentes
                    .split("\n")
                    .map((line, i) => <div key={i}>{line}</div>)}
              </div>
            )}
          </Card>
        </Container>
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
