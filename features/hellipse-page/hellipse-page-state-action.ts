import { Cercle, Role } from "../notion/notion-api-type";
import { HellipseSceneInstance } from "../canvas2d/hellipse/hellipse-scene";

export enum PagesStatesActionsEnum {
  setSelectedCercle = "setSelectedCercle",
  setSelectedRole = "setSelectedRole",
  setSelectedScene = "setSelectedScene",
  setSearch = "setSearch",
  setFoundRoles = "setFoundRoles",
}
type SetSelectedCercleAction = {
  type: PagesStatesActionsEnum.setSelectedCercle;
  cercle: Cercle | null;
};
type SetSelectedRoleAction = {
  type: PagesStatesActionsEnum.setSelectedRole;
  role: Role | null;
};
type SetSelectedSceneAction = {
  type: PagesStatesActionsEnum.setSelectedScene;
  instance: HellipseSceneInstance | null;
};
type SearchAction = {
  type: PagesStatesActionsEnum.setSearch;
  term: string;
};
type foundRolesAction = {
  type: PagesStatesActionsEnum.setFoundRoles;
  roles: Role[] | null;
};
export type PageState = {
  selectedCercle?: Cercle | null;
  selectedRole?: Role | null;
  instance?: HellipseSceneInstance | null;
  search: string;
  foundRoles?: Role[] | null;
};
export type pageStateAction =
  | SetSelectedCercleAction
  | SetSelectedRoleAction
  | SetSelectedSceneAction
  | SearchAction
  | foundRolesAction;

export function pageStateReducer(
  current: PageState,
  action: pageStateAction
): PageState {
  switch (action.type) {
    case PagesStatesActionsEnum.setSelectedCercle:
      return { ...current, selectedCercle: action.cercle };
    case PagesStatesActionsEnum.setSelectedScene:
      return { ...current, instance: action.instance };
    case PagesStatesActionsEnum.setSelectedRole:
      return { ...current, selectedRole: action.role };
    case PagesStatesActionsEnum.setSearch:
      return { ...current, search: action.term };
    case PagesStatesActionsEnum.setFoundRoles:
      return { ...current, foundRoles: action.roles };
  }
  return current;
}
