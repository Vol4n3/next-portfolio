/**
 * use Sorted algo for same radius point
 * use All for few item
 * binaryTree and QuadraticTree are not wet implemented
 */
import { Position2 } from "./point2";

export type AlgorithmType = "sorted" | "all" | "binaryTree" | "quadraticTree";

interface isCollideResponse<T extends CanCollide> {
  a: T;
  b: T;
}

export interface CanCollide extends Position2 {
  isCollide(item: CanCollide): boolean;
}

export class Collider<T extends CanCollide> {
  constructor(public algorithmType: AlgorithmType, public items: T[] = []) {}

  getCollisions(): isCollideResponse<T>[] {
    let collides: isCollideResponse<T>[] = [];
    switch (this.algorithmType) {
      case "sorted":
        const copy = this.items.sort(
          ({ position: [ax, ay] }, { position: [bx, by] }) => {
            return ax !== bx ? ax - bx : ay - by;
          }
        );
        for (let i = 0; i < copy.length; i++) {
          const current = copy[i];
          const next = copy[i + 1];
          if (!next) {
            break;
          }
          if (current.isCollide(next)) {
            collides = [...collides, { a: current, b: next }];
          }
        }
        break;
      default:
      case "all":
        for (let i = 0; i < this.items.length; i++) {
          const item1 = this.items[i];
          for (let j = i + 1; j < this.items.length; j++) {
            const item2 = this.items[j];
            if (item1.isCollide(item2)) {
              collides = [...collides, { a: item1, b: item2 }];
            }
          }
        }
    }
    return collides;
  }
}
