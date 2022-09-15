import { loadImage } from "../../commons/utils/load-image";
import { CreateDebounce } from "../../commons/utils/commons-utils";
import { RequireAtLeastOne } from "../../commons/types/utils-type";
import {
  createEasing,
  Easing,
  EasingCallback,
} from "../../commons/utils/easing.utils";
import { Camera2 } from "./camera2";

export interface Item2Scene {
  isUpdated: boolean;
  onResize?: (canvasWidth: number, canvasHeight: number) => void;
  scenePriority: number;

  destroy(): void;

  draw2d(scene: Scene2d, time: number): void;

  update(scene: Scene2d, time: number): void;
}

type FillOrStroke = RequireAtLeastOne<{
  fillStyle: string | CanvasGradient | CanvasPattern;
  strokeStyle: string | CanvasGradient | CanvasPattern;
}>;
export type canvasWriteTextConfig = {
  textAlign?: CanvasTextAlign;
  textBaseline?: CanvasTextBaseline;
  direction?: CanvasDirection;
  text: string;
  font?: { type: string; size: number };
  x: number;
  y: number;
  lineWidth?: number;
} & FillOrStroke;

export class Scene2d {
  public readonly canvas: HTMLCanvasElement;
  public readonly ctx: CanvasRenderingContext2D;
  fpsInterval;
  camera: Camera2;
  height: number = 0;
  width: number = 0;
  private elapsed: number = 0;
  private forceUpdate: boolean = true;
  private loopTime: number = 0;
  private now: number = 0;
  private startTime: number = 0;
  private then: number = 0;
  private tickAnimation: number = 0;
  private resizeObs = new ResizeObserver(this.debouncedResize.bind(this));
  private debounce = CreateDebounce(this.resize.bind(this), 300);
  private easingCameraDistance: EasingCallback | null = null;
  private easingCameraX: EasingCallback | null = null;
  private easingCameraY: EasingCallback | null = null;

  constructor(private container: HTMLDivElement, fps: number = 60) {
    this.fpsInterval = 1000 / fps;
    this.then = window.performance.now();
    this.startTime = this.then;
    this.canvas = document.createElement("canvas");
    this.canvas.style.top = "0";
    this.canvas.style.left = "0";
    this.canvas.style.display = "block";
    this.canvas.style.position = "absolute";
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    container.appendChild(this.canvas);
    this.resizeObs.observe(this.container);
    const rect = this.container.getBoundingClientRect();
    this.camera = new Camera2({ x: rect.width, y: rect.height });
    this.resize();
    this.tickAnimation = requestAnimationFrame(this.animate.bind(this));
  }

  private _items: Item2Scene[] = [];

  get items(): Item2Scene[] {
    return this._items;
  }

  set items(value: Item2Scene[]) {
    this.cleanItems();
    value.forEach((item) => this.addItem(item));
  }

  addItem(item: Item2Scene) {
    this.forceUpdate = true;
    this._items.push(item);
    this._items = this._items.sort((a, b) => a.scenePriority - b.scenePriority);
  }

  addMultipleItem(items: Item2Scene[]) {
    items.forEach((i) => this.addItem(i));
  }

  animate(newTime: DOMHighResTimeStamp) {
    this.tickAnimation = requestAnimationFrame(this.animate.bind(this));
    this.now = newTime;
    this.elapsed = this.now - this.then;
    if (this.elapsed > this.fpsInterval) {
      this.then = this.now - (this.elapsed % this.fpsInterval);
      this.calcCamera();
      if (!this.forceUpdate && !this._items.some((i) => i.isUpdated)) {
        return;
      }
      this.forceUpdate = false;
      this.loopTime++;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this._items.forEach((d) => {
        this.ctx.save();
        // move camera
        this.camera.apply(this.ctx);
        // draw first
        d.draw2d(this, this.loopTime);
        this.ctx.restore();
        // set updated too false because draw
        d.isUpdated = false;
        d.update(this, this.loopTime);
      });
    }
  }

  cleanItems(): void {
    this._items = [];
  }

  async createTexture(
    url: string,
    repetition: string | null = null,
    matrix?: DOMMatrix
  ): Promise<CanvasPattern | null> {
    const image = await loadImage(url);
    const pattern = this.ctx.createPattern(image, repetition);
    if (pattern && matrix) {
      pattern.setTransform(matrix);
    }
    return pattern;
  }

  destroy() {
    this.container.removeChild(this.canvas);
    this._items.forEach((i) => i.destroy());
    this.debounce.abort();
    this.resizeObs.disconnect();
    window.cancelAnimationFrame(this.tickAnimation);
  }

  moveCamera(camera: { x?: number; y?: number; distance?: number }) {
    if (camera.distance) {
      this.easingCameraDistance = createEasing([
        {
          easing: Easing.easeOutCubic,
          startValue: this.camera.distance,
          endValue: camera.distance,
          time: 50,
        },
      ]);
    }
    if (camera.x) {
      this.easingCameraX = createEasing([
        {
          easing: Easing.easeOutCubic,
          startValue: this.camera.lookAtVector.x,
          endValue: camera.x,
          time: 50,
        },
      ]);
    }
    if (camera.y) {
      this.easingCameraY = createEasing([
        {
          easing: Easing.easeOutCubic,
          startValue: this.camera.lookAtVector.y,
          endValue: camera.y,
          time: 50,
        },
      ]);
    }
  }

  removeItem(item: Item2Scene): void {
    this._items = this._items.filter((f) => f !== item);
    this.forceUpdate = true;
  }

  resize() {
    const rect = this.container.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.camera.resize(this.width, this.height);
    this.forceUpdate = true;
    this._items.forEach((item) => {
      if (item.onResize) {
        item.onResize(this.width, this.height);
      }
    });
  }

  writeText(config: canvasWriteTextConfig) {
    this.ctx.save();
    if (config.textAlign) this.ctx.textAlign = config.textAlign;
    if (config.direction) this.ctx.direction = config.direction;
    if (config.textBaseline) this.ctx.textBaseline = config.textBaseline;
    if (config.lineWidth) this.ctx.lineWidth = config.lineWidth;
    this.ctx.font = config.font
      ? `${config.font.size}px ${config.font.type}`
      : "26px Raleway";
    if (config.fillStyle) {
      this.ctx.fillStyle = config.fillStyle;
      this.ctx.fillText(config.text, config.x, config.y);
    }
    if (config.strokeStyle) {
      this.ctx.strokeStyle = config.strokeStyle;
      this.ctx.strokeText(config.text, config.x, config.y);
    }

    this.ctx.restore();
  }

  private calcCamera() {
    if (this.easingCameraDistance) {
      this.easingCameraDistance(
        (strength) => {
          this.camera.zoomTo(strength);
          this.forceUpdate = true;
        },
        () => (this.easingCameraDistance = null)
      );
    }
    if (this.easingCameraX) {
      this.easingCameraX(
        (x) => {
          this.camera.lookAt({ x });
          this.forceUpdate = true;
        },
        () => (this.easingCameraX = null)
      );
    }
    if (this.easingCameraY) {
      this.easingCameraY(
        (y) => {
          this.camera.lookAt({ y });
          this.forceUpdate = true;
        },
        () => (this.easingCameraY = null)
      );
    }
  }

  private debouncedResize() {
    this.debounce.call();
  }
}
