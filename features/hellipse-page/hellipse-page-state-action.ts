import { Cercle, Role } from "../notion/notion-api-type";
import { Scene2d } from "../canvas2d/scene2d";

export enum PagesStatesActionType {
  setSelectedCercle = "setSelectedCercle",
  setSelectedRole = "setSelectedRole",
}
type SetSelectedCercleAction = {
  type: PagesStatesActionType.setSelectedCercle;
  cercle: Cercle | null;
};
type SetSelectedRoleAction = {
  type: PagesStatesActionType.setSelectedRole;
  role: Role | null;
};
type SetSelectedSceneAction = {
  type: "setSelectedScene";
  scene: Scene2d | null;
};
type SearchAction = {
  type: "search";
  term: string;
};
export type PageState = {
  selectedCercle?: Cercle | null;
  selectedRole?: Role | null;
  currentScene?: Scene2d | null;
  search: string;
};
export type pageStateAction =
  | SetSelectedCercleAction
  | SetSelectedRoleAction
  | SetSelectedSceneAction
  | SearchAction;

export function pageStateReducer(
  current: PageState,
  action: pageStateAction
): PageState {
  switch (action.type) {
    case "setSelectedCercle":
      return { ...current, selectedCercle: action.cercle };
    case "setSelectedScene":
      return { ...current, currentScene: action.scene };
    case "setSelectedRole":
      return { ...current, selectedRole: action.role };
    case "search":
      return { ...current, search: action.term };
    case "rolesFind":
      return { ...current };
  }
  return current;
}
