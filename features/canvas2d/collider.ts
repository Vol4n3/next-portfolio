/**
 * use Sorted algo for same radius point
 * use All for few item
 * binaryTree and QuadraticTree are not wet implemented
 */
import { IPoint2 } from "../../commons/utils/point.utils";

export type AlgorithmType = "sorted" | "all" | "binaryTree" | "quadraticTree";

interface isCollideResponse<T extends CanCollide> {
  a: T;
  b: T;
}

interface ColliderGroup<T> {
  algorithmType: AlgorithmType;
  id: number;
  items: T;
  confrontId?: number;
}

export interface CanCollide extends IPoint2 {
  isCollide(item: CanCollide): boolean;
}

export class Collider<T extends CanCollide> {
  private groups: ColliderGroup<T[]>[] = [];
  private uid = 0;

  addGroup(algorithmType: AlgorithmType, items: T[] = []): number {
    this.groups = [...this.groups, { items, id: ++this.uid, algorithmType }];
    return this.uid;
  }

  addItemToGroup(item: T, groupId: number) {
    this.groups = this.groups.map((group) =>
      group.id === groupId
        ? {
            ...group,
            items: [...group.items, item],
          }
        : group
    );

    const findGroup = this.groups.findIndex((f) => f.id === groupId);
    if (findGroup >= 0) {
      this.groups[findGroup].items.push(item);
      return;
    }
    throw new Error("impossible de trouver le groupe pour ajouter un item");
  }

  getCollisions(): isCollideResponse<T>[] {
    let collides: isCollideResponse<T>[] = [];
    this.groups.forEach((group) => {
      switch (group.algorithmType) {
        case "sorted":
          const copy = group.items.sort((a, b) => {
            return a.x !== b.x ? a.x - b.x : a.y - b.y;
          });
          for (let i = 0; i < copy.length; i++) {
            const current = copy[i];
            const next = copy[i + 1];
            if (!next) {
              return;
            }
            if (current.isCollide(next)) {
              collides = [...collides, { a: current, b: next }];
            }
          }
          break;
        default:
        case "all":
          for (let i = 0; i < group.items.length; i++) {
            const item1 = group.items[i];
            for (let j = i + 1; j < group.items.length; j++) {
              const item2 = group.items[j];
              if (item1.isCollide(item2)) {
                collides = [...collides, { a: item1, b: item2 }];
              }
            }
          }
      }
    });
    return collides;
  }

  removeGroup(index: number): void {
    this.groups = this.groups.filter((group) => group.id !== index);
  }

  removeItemFromGroup(item: T, groupIndex: number): void {
    this.groups = this.groups.map((group) =>
      group.id === groupIndex
        ? {
            ...group,
            items: group.items.filter((f) => f !== item),
          }
        : group
    );
  }
}
