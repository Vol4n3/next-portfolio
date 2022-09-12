// inspired from https://github.com/terkelg/deakins/blob/master/src/index.ts
import { IPoint2 } from "../../commons/utils/point.utils";
import { Point2 } from "./point2";

interface Scale {
  origin: IPoint2;
  strength: number;
}

export class Camera extends Point2 {
  scale: Scale = { strength: 1, origin: { x: 0, y: 0 } };
  private mouseOffset: IPoint2 | null = null;
  private screen: IPoint2 = { x: 0, y: 0 };

  constructor(position: IPoint2 = { x: 0, y: 0 }) {
    super(position.x, position.y);
    this.addListeners();
  }

  apply(ctx: CanvasRenderingContext2D) {
    this.applyScale(ctx);
    this.applyTranslation(ctx);
  }

  lookAt(
    position: Partial<IPoint2> | null,
    scale?: { origin: IPoint2; strength: number }
  ) {
    if (position) {
      if (typeof position.x === "number") {
        this.x = position.x;
      }
      if (typeof position.y === "number") {
        this.y = position.y;
      }
    }

    if (typeof scale !== "undefined" && scale.strength > 0) {
      this.scale = scale;
    }
  }

  screenToWorld(point: IPoint2): IPoint2 {
    const x =
      (point.x - this.x - this.scale.origin.x) / this.scale.strength +
      this.x +
      this.scale.origin.x -
      this.x;
    const y =
      (point.y - this.y - this.scale.origin.y) / this.scale.strength +
      this.y +
      this.scale.origin.y -
      this.y;
    return { x, y };
  }

  private applyScale(context: CanvasRenderingContext2D) {
    context.translate(
      this.x + this.scale.origin.x,
      this.y + this.scale.origin.y
    );
    context.scale(this.scale.strength, this.scale.strength);
    context.translate(
      -this.x - this.scale.origin.x,
      -this.y - this.scale.origin.y
    );
  }

  private applyTranslation(context: CanvasRenderingContext2D) {
    context.translate(this.x, this.y);
  }

  private addListeners() {
    window.addEventListener("mousedown", (e) => {
      this.mouseOffset = { x: e.x, y: e.y };
    });
    window.addEventListener("mouseleave", () => {
      this.mouseOffset = null;
    });
    window.addEventListener("mouseup", () => {
      this.mouseOffset = null;
    });
    window.addEventListener("mousemove", (e) => {
      if (this.mouseOffset === null) return;
      const x = this.x - (this.mouseOffset.x - e.x) / 20;
      const y = this.y - (this.mouseOffset.y - e.y) / 20;
      this.lookAt({ x, y });
    });
    window.addEventListener(`wheel`, (e) => {
      if (e.ctrlKey) {
        const x = this.x + e.deltaX * 2;
        const y = this.y + e.deltaY * 2;
        this.lookAt({ x, y });
      }
    });

    window.addEventListener(`keydown`, (e) => {
      if (e.key === "r") {
        this.lookAt({ x: 0, y: 0 });
      }
    });
  }
}
