// inspired from https://github.com/terkelg/deakins/blob/master/src/index.ts
import { IPoint2 } from "../../commons/utils/point.utils";
import { Point2 } from "./point2";

export class Camera extends Point2 {
  scale = 1;

  constructor(position: IPoint2 = { x: 0, y: 0 }) {
    super(position.x, position.y);
    this.addListeners();
  }

  apply(ctx: CanvasRenderingContext2D) {
    this.applyScale(ctx);
    this.applyTranslation(ctx);
  }

  zoomTo(z: number) {
    this.scale = z;
  }

  lookAt(position: Partial<IPoint2>) {
    if (typeof position.x === "number") {
      this.x = position.x;
    }
    if (typeof position.y === "number") {
      this.y = position.y;
    }
  }

  screenToWorld(point: IPoint2): IPoint2 {
    const x = point.x / this.scale - this.x;
    const y = point.y / this.scale - this.y;
    return { x, y };
  }

  worldToScreen(point: IPoint2): IPoint2 {
    const x = (point.x + this.x) * this.scale;
    const y = (point.y + this.y) * this.scale;
    return { x, y };
  }

  private applyScale(context: CanvasRenderingContext2D) {
    context.translate(
      -this.x + context.canvas.width / 2,
      -this.y + context.canvas.height / 2
    );
    context.scale(this.scale, this.scale);
    context.translate(
      this.x - context.canvas.width / 2,
      this.y - context.canvas.height / 2
    );
  }

  private applyTranslation(context: CanvasRenderingContext2D) {
    context.translate(this.x, this.y);
  }

  private addListeners() {
    window.addEventListener(`wheel`, (e) => {
      if (e.ctrlKey) {
        let zoomLevel = this.scale - e.deltaY * 0.1;
        if (zoomLevel < 0) {
          zoomLevel = 0;
        }
        this.zoomTo(zoomLevel);
      } else {
        const x = this.x + e.deltaX * 2;
        const y = this.y + e.deltaY * 2;
        this.lookAt({ x, y });
      }
    });

    window.addEventListener(`keydown`, (e) => {
      if (e.key === "r") {
        this.zoomTo(1);
        this.lookAt({ x: 0, y: 0 });
      }
    });
  }
}
