/**
 * use Sorted algo for same radius point
 * use All for few item
 * binaryTree and QuadraticTree are not wet implemented
 */
import { IPoint2 } from "../../commons/utils/point.utils";

export type AlgorithmType = "sorted" | "all" | "binaryTree" | "quadraticTree";

interface ColliderGroup<T> {
  algorithmType: AlgorithmType;
  id: number;
  item: T;
  confrontId?: number;
}

export interface CanCollide extends IPoint2 {
  isCollide(item: CanCollide): boolean;
}

export class Collider {
  private groups: ColliderGroup<CanCollide[]>[] = [];
  private uid = 0;

  addGroup(algorithmType: AlgorithmType): number {
    this.groups = [...this.groups, { item: [], id: ++this.uid, algorithmType }];
    return this.uid;
  }

  addItemToGroup(item: CanCollide, groupId: number) {
    this.groups = this.groups.map((group) =>
      group.id === groupId
        ? {
            ...group,
            item: [...group.item, item],
          }
        : group
    );

    const findGroup = this.groups.findIndex((f) => f.id === groupId);
    if (findGroup >= 0) {
      this.groups[findGroup].item.push(item);
      return;
    }
    throw new Error("impossible de trouver le groupe pour ajouter un item");
  }

  getCollisions(): CanCollide[][] {
    let collides: CanCollide[][] = [];
    this.groups.forEach((group) => {
      switch (group.algorithmType) {
        case "sorted":
          const copy = group.item.sort((a, b) => {
            return a.x !== b.x ? a.x - b.x : a.y - b.y;
          });
          for (let i = 0; i < copy.length; i++) {
            const current = copy[i];
            const next = copy[i + 1];
            if (!next) {
              return;
            }
            if (current.isCollide(next)) {
              collides = [...collides, [current, next]];
            }
          }
          break;
        default:
        case "all":
          for (let i = 0; i < group.item.length; i++) {
            const item1 = group.item[i];
            for (let j = i + 1; j < group.item.length; j++) {
              const item2 = group.item[j];
              item1.isCollide(item2);
              collides = [...collides, [item1, item2]];
            }
          }
      }
    });
    return collides;
  }

  removeGroup(index: number): void {
    this.groups = this.groups.filter((group) => group.id !== index);
  }

  removeItemFromGroup(item: CanCollide, groupIndex: number): void {
    this.groups = this.groups.map((group) =>
      group.id === groupIndex
        ? {
            ...group,
            item: group.item.filter((f) => f !== item),
          }
        : group
    );
  }
}
