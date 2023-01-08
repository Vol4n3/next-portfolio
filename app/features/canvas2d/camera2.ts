import { Point2 } from "./point2";

export type CameraViewport = {
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
  scale: Point2;
};

export class Camera2 {
  viewport: CameraViewport = {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    width: 0,
    height: 0,
    scale: [1, 1],
  };
  fieldOfView: number;
  margin: LookAtMargins;
  private _position: Point2 = [0, 0];
  aspectRatio!: number;
  flipAspectRatio = false;

  constructor(
    private canvasWidth: number,
    private canvasHeight: number,
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
    this.updateViewport();
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

  get x(): number {
    return this._position[0];
  }

  get y(): number {
    return this._position[1];
  }

  setPosition([x, y]: Partial<Point2>): void {
    this._position = [
      typeof x !== "undefined" ? x : this._position[0],
      typeof y !== "undefined" ? y : this._position[1],
    ];

    this.updateViewport();
  }

  getPosition(): Point2 {
    return this._position;
  }

  apply(ctx: CanvasRenderingContext2D) {
    this.applyScale(ctx);
    this.applyTranslation(ctx);
  }

  screenToWorld([px, py]: Point2): Point2 {
    return [
      px / this.viewport.scale[0] + this.viewport.left,
      py / this.viewport.scale[1] + this.viewport.top,
    ];
  }

  worldToScreen([px, py]: Point2): Point2 {
    return [
      (px - this.viewport.left) * this.viewport.scale[0],
      (py - this.viewport.top) * this.viewport.scale[1],
    ];
  }

  resize(width: number, height: number) {
    this.canvasWidth = width;
    this.canvasHeight = height;
    this.updateViewport();
  }

  private applyScale(ctx: CanvasRenderingContext2D) {
    ctx.scale(this.viewport.scale[0], this.viewport.scale[1]);
  }

  private applyTranslation(ctx: CanvasRenderingContext2D) {
    ctx.translate(-this.viewport.left, -this.viewport.top);
  }

  private updateViewport() {
    if (this.flipAspectRatio) {
      this.aspectRatio = this.canvasHeight / this.canvasWidth;
      this.viewport.height = this._distance * Math.tan(this.fieldOfView);
      this.viewport.width = this.viewport.height / this.aspectRatio;
    } else {
      this.aspectRatio = this.canvasWidth / this.canvasHeight;
      this.viewport.width = this._distance * Math.tan(this.fieldOfView);
      this.viewport.height = this.viewport.width / this.aspectRatio;
    }
    this.viewport.left = this._position[0] - this.viewport.width / 2;
    this.viewport.top = this._position[1] - this.viewport.height / 2;
    this.viewport.right = this.viewport.left + this.viewport.width;
    this.viewport.bottom = this.viewport.top + this.viewport.height;
    this.viewport.scale[0] = this.canvasWidth / this.viewport.width;
    this.viewport.scale[1] = this.canvasHeight / this.viewport.height;
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
