// inspired from https://github.com/terkelg/deakins/blob/master/src/index.ts
import { number } from "prop-types";
import { IPoint2 } from "../../commons/utils/point.utils";

export type CameraViewport = {
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
  scale: [number, number];
};
export class Camera {
  distance = 1000;
  fieldOfView: number;
  margin: LookAtMargins;
  viewport: CameraViewport = {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    width: 0,
    height: 0,
    scale: [1, 1],
  };
  aspectRatio!: number;
  flipAspectRatio = false;
  private canvasSize = [0, 0];
  lookAtPoint: IPoint2 = { x: 0, y: 0 };

  constructor(options: CameraSettings = {}) {
    this.fieldOfView = options.fieldOfView || Math.PI / 4.0;
    this.margin = options.margin || {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    };
    this.flipAspectRatio = !!options.flipAspectRatio;
    this.addListeners();
  }

  apply(ctx: CanvasRenderingContext2D) {
    this.applyScale(ctx);
    this.applyTranslation(ctx);
  }

  private applyScale(context: CanvasRenderingContext2D) {
    context.scale(this.viewport.scale[0], this.viewport.scale[1]);
  }

  private applyTranslation(context: CanvasRenderingContext2D) {
    context.translate(-this.viewport.left, -this.viewport.top);
  }

  private updateViewport() {
    if (this.flipAspectRatio) {
      this.aspectRatio = this.canvasSize[1] / this.canvasSize[0];
      this.viewport.height = this.distance * Math.tan(this.fieldOfView);
      this.viewport.width = this.viewport.height / this.aspectRatio;
    } else {
      this.aspectRatio = this.canvasSize[0] / this.canvasSize[1];
      this.viewport.width = this.distance * Math.tan(this.fieldOfView);
      this.viewport.height = this.viewport.width / this.aspectRatio;
    }
    this.viewport.left = this.lookAtPoint.x - this.viewport.width / 2;
    this.viewport.top = this.lookAtPoint.y - this.viewport.height / 2;
    this.viewport.right = this.viewport.left + this.viewport.width;
    this.viewport.bottom = this.viewport.top + this.viewport.height;
    this.viewport.scale[0] = this.canvasSize[0] / this.viewport.width;
    this.viewport.scale[1] = this.canvasSize[1] / this.viewport.height;
  }

  zoomTo(z: number) {
    this.distance = z;
    this.updateViewport();
  }

  lookAt(position: Partial<IPoint2>, lazy = false) {
    if (lazy) {
      const pointScreenSpace = this.worldToScreen({
        x: typeof position.x === "number" ? position.x : this.lookAtPoint.x,
        y: typeof position.y === "number" ? position.y : this.lookAtPoint.y,
      });
      const left = this.canvasSize[0] * this.margin.left;
      const right = this.canvasSize[0] - this.canvasSize[0] * this.margin.right;
      const top = this.canvasSize[0] * this.margin.top;
      const bottom =
        this.canvasSize[0] - this.canvasSize[0] * this.margin.bottom;

      if (typeof position.x === "number") {
        if (pointScreenSpace.x < left) {
          this.lookAtPoint.x =
            position.x - this.viewport.width * (this.margin.left - 0.5);
        } else if (pointScreenSpace.x > right) {
          this.lookAtPoint.x =
            position.x - this.viewport.width * (0.5 - this.margin.right);
        } else {
          this.lookAtPoint.x = position.x;
        }
      }
      if (typeof position.y === "number") {
        if (pointScreenSpace.y < top) {
          this.lookAtPoint.y =
            position.y - this.viewport.height * (this.margin.top - 0.5);
        } else if (pointScreenSpace.y > bottom) {
          this.lookAtPoint.y =
            position.y - this.viewport.height * (0.5 - this.margin.bottom);
        } else {
          this.lookAtPoint.y = position.y;
        }
      }
    } else {
      if (typeof position.x === "number") {
        this.lookAtPoint.x = position.x;
      }
      if (typeof position.y === "number") {
        this.lookAtPoint.y = position.y;
      }
    }

    this.updateViewport();
  }

  screenToWorld(point: IPoint2): IPoint2 {
    const x = point.x / this.viewport.scale[0] + this.viewport.left;
    const y = point.y / this.viewport.scale[1] + this.viewport.top;
    return { x, y };
  }

  worldToScreen(point: IPoint2): IPoint2 {
    const x = (point.x - this.viewport.left) * this.viewport.scale[0];
    const y = (point.y - this.viewport.top) * this.viewport.scale[1];
    return { x, y };
  }

  resize(width: number, height: number) {
    this.canvasSize[0] = width;
    this.canvasSize[1] = height;
    this.updateViewport();
  }

  private addListeners() {
    window.addEventListener(`wheel`, (e) => {
      if (e.ctrlKey) {
        let zoomLevel = this.distance - e.deltaY * 20;
        if (zoomLevel <= 1) {
          zoomLevel = 1;
        }
        this.zoomTo(zoomLevel);
      } else {
        const x = this.lookAtPoint.x + e.deltaX * 2;
        const y = this.lookAtPoint.y + e.deltaY * 2;
        this.lookAt({ x, y });
      }
    });

    window.addEventListener(`keydown`, (e) => {
      if (e.key === "r") {
        this.zoomTo(1000);
        this.lookAt({ x: 0, y: 0 });
      }
    });
  }
}

export type LookAtMargins = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type CameraSettings = {
  fieldOfView?: number;
  margin?: LookAtMargins;
  flipAspectRatio?: boolean;
};
