// inspired from https://github.com/terkelg/deakins/blob/master/src/index.ts
import { IPoint2 } from "../../commons/utils/point.utils";
import { Point2 } from "./point2";

export class Camera extends Point2 {
  scale = 1;
  scaleOrigin: IPoint2 = {
    x: 0,
    y: 0,
  };
  private mouseOffset: IPoint2 | null = null;

  constructor(position: IPoint2 = { x: 0, y: 0 }) {
    super(position.x, position.y);
    this.addListeners();
  }

  apply(ctx: CanvasRenderingContext2D) {
    this.applyScale(ctx);
    this.applyTranslation(ctx);
  }

  lookAt(position: Partial<IPoint2> | null, zoom?: number, origin?: IPoint2) {
    if (position) {
      if (typeof position.x === "number") {
        this.x = position.x;
      }
      if (typeof position.y === "number") {
        this.y = position.y;
      }
    }

    if (typeof zoom !== "undefined" && zoom > 0) {
      this.scale = zoom;
    }
    if (origin) {
      this.scaleOrigin = {
        x: origin.x,
        y: origin.y,
      };
    }
  }

  screenToWorld(point: IPoint2): IPoint2 {
    const x =
      (point.x - this.scaleOrigin.x) / this.scale + this.scaleOrigin.x - this.x;
    const y =
      (point.y - this.scaleOrigin.y) / this.scale + this.scaleOrigin.y - this.y;
    return { x, y };
  }

  private applyScale(context: CanvasRenderingContext2D) {
    context.translate(this.scaleOrigin.x, this.scaleOrigin.y);
    context.scale(this.scale, this.scale);
    context.translate(-this.scaleOrigin.x, -this.scaleOrigin.y);
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
