import { IPoint2 } from "../../commons/utils/point.utils";

export type CameraViewport = {
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
  scale: IPoint2;
};

export class Camera2 {
  fieldOfView: number;
  margin: LookAtMargins;
  viewport: CameraViewport = {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    width: 0,
    height: 0,
    scale: { x: 1, y: 1 },
  };
  aspectRatio!: number;
  flipAspectRatio = false;
  private canvasSize: IPoint2 = { x: 0, y: 0 };
  private lazy: boolean | undefined;

  constructor(
    canvasSize: IPoint2,
    private _lookAtVector: IPoint2 = { x: 0, y: 0 },
    options: CameraSettings = {}
  ) {
    this.fieldOfView = options.fieldOfView || Math.PI / 4.0;
    this.margin = options.margin || {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    };
    this.flipAspectRatio = !!options.flipAspectRatio;
    this.lazy = options.lazy;
    this.resize(canvasSize.x, canvasSize.y);
    this.lookAt({ x: _lookAtVector.x / 2, y: _lookAtVector.y / 2 });
  }

  private _distance = 5000;

  get distance(): number {
    return this._distance;
  }

  set distance(value: number) {
    if (value < 100) {
      return;
    }
    if (value > 10000) {
      return;
    }
    this._distance = value;
    this.updateViewport();
  }

  get position(): IPoint2 {
    return this._lookAtVector;
  }

  lookAt(point: Partial<IPoint2>, lazy = false) {
    if (typeof point.x !== "undefined") {
      this._lookAtVector.x = point.x;
    }
    if (typeof point.y !== "undefined") {
      this._lookAtVector.y = point.y;
    }
    if (lazy) {
      const pointScreenSpace = this.worldToScreen(this._lookAtVector);
      const left = this.canvasSize.x * this.margin.left;
      const right = this.canvasSize.x - this.canvasSize.x * this.margin.right;
      const top = this.canvasSize.x * this.margin.top;
      const bottom = this.canvasSize.x - this.canvasSize.x * this.margin.bottom;
      if (typeof point.x !== "undefined") {
        if (pointScreenSpace.x < left) {
          this._lookAtVector.x =
            point.x - this.viewport.width * (this.margin.left - 0.5);
        } else if (pointScreenSpace.x > right) {
          this._lookAtVector.x =
            point.x - this.viewport.width * (0.5 - this.margin.right);
        }
      }

      if (typeof point.y !== "undefined") {
        if (pointScreenSpace.y < top) {
          this._lookAtVector.y =
            point.y - this.viewport.height * (this.margin.top - 0.5);
        } else if (pointScreenSpace.y > bottom) {
          this._lookAtVector.y =
            point.y - this.viewport.height * (0.5 - this.margin.bottom);
        }
      }
    }
    this.updateViewport();
  }

  apply(ctx: CanvasRenderingContext2D) {
    this.applyScale(ctx);
    this.applyTranslation(ctx);
  }

  screenToWorld(point: IPoint2): IPoint2 {
    const x = point.x / this.viewport.scale.x + this.viewport.left;
    const y = point.y / this.viewport.scale.y + this.viewport.top;
    return { x, y };
  }

  worldToScreen(point: IPoint2): IPoint2 {
    const x = (point.x - this.viewport.left) * this.viewport.scale.x;
    const y = (point.y - this.viewport.top) * this.viewport.scale.y;
    return { x, y };
  }

  resize(width: number, height: number) {
    this.canvasSize.x = width;
    this.canvasSize.y = height;
    this.updateViewport();
  }
  private applyScale(ctx: CanvasRenderingContext2D) {
    ctx.scale(this.viewport.scale.x, this.viewport.scale.y);
  }

  private applyTranslation(ctx: CanvasRenderingContext2D) {
    ctx.translate(-this.viewport.left, -this.viewport.top);
  }

  private updateViewport() {
    if (this.flipAspectRatio) {
      this.aspectRatio = this.canvasSize.y / this.canvasSize.x;
      this.viewport.height = this._distance * Math.tan(this.fieldOfView);
      this.viewport.width = this.viewport.height / this.aspectRatio;
    } else {
      this.aspectRatio = this.canvasSize.x / this.canvasSize.y;
      this.viewport.width = this._distance * Math.tan(this.fieldOfView);
      this.viewport.height = this.viewport.width / this.aspectRatio;
    }
    this.viewport.left = this._lookAtVector.x - this.viewport.width / 2;
    this.viewport.top = this._lookAtVector.y - this.viewport.height / 2;
    this.viewport.right = this.viewport.left + this.viewport.width;
    this.viewport.bottom = this.viewport.top + this.viewport.height;
    this.viewport.scale.x = this.canvasSize.x / this.viewport.width;
    this.viewport.scale.y = this.canvasSize.y / this.viewport.height;
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
  lazy?: boolean;
};
