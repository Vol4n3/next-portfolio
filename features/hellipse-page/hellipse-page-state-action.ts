import { Cercle, Role } from "../notion/notion-api-type";
import { Scene2d } from "../canvas2d/scene2d";

type SetSelectedCercleAction = {
  type: "setSelectedCercle";
  cercle: Cercle | null;
};
type SetSelectedRoleAction = {
  type: "setSelectedRole";
  role: Role | null;
};
type SetSelectedSceneAction = {
  type: "setSelectedScene";
  scene: Scene2d | null;
};
type ToggleAnimationAction = {
  type: "toggleAnimation";
};
export type PageState = {
  selectedCercle?: Cercle | null;
  selectedRole?: Role | null;
  currentScene?: Scene2d | null;
};
export type pageStateAction =
  | SetSelectedCercleAction
  | SetSelectedRoleAction
  | SetSelectedSceneAction
  | ToggleAnimationAction;

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
    case "toggleAnimation":
      if (!current.currentScene) break;
      current.currentScene.pauseAnimation =
        !current.currentScene.pauseAnimation;
      return current;
  }
  return current;
}
