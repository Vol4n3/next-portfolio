import {
  createEasing,
  Easing,
  EasingCallback,
} from "../../commons/utils/easing.utils";
import { CreateDebounce } from "../../commons/utils/commons-utils";
import { Camera2 } from "./camera2";
import { loadImage } from "../../commons/utils/load-image";
import { RequireAtLeastOne } from "../../commons/types/utils-type";
import { Position2 } from "./point2";

type SceneCallBack = (scene: Scene2d, time: number) => void;

export interface Item2Scene extends Position2 {
  isUpdated: boolean;
  onResize?: (canvasWidth: number, canvasHeight: number) => void;
  scenePriority: number;
  draw2d: SceneCallBack;
  update: SceneCallBack;

  destroy(): void;
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
  maxWidth?: number;
  font?: { type: string; size: number };
  x: number;
  y: number;
  lineWidth?: number;
  lineHeight?: number;
} & FillOrStroke;

export class Scene2d {
  public readonly canvas: HTMLCanvasElement;
  public readonly ctx: CanvasRenderingContext2D;
  fpsInterval;
  camera: Camera2;
  height: number = 0;
  width: number = 0;
  public pauseAnimation: boolean = false;
  follow: Item2Scene | null = null;
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
  private updateListeners: SceneCallBack[] = [];
  private followOffset: Position2 = { position: [0, 0] };

  constructor(private container: HTMLDivElement, fps: number = 60) {
    this.fpsInterval = 1000 / fps;
    this.then = window.performance.now();
    this.startTime = this.then;
    this.container.style.position = "relative";
    this.canvas = document.createElement("canvas");
    this.canvas.style.top = "0";
    this.canvas.style.left = "0";
    this.canvas.style.display = "block";
    this.canvas.style.position = "absolute";
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.ctx.imageSmoothingEnabled = false;

    container.appendChild(this.canvas);
    this.resizeObs.observe(this.container);
    const rect = this.container.getBoundingClientRect();
    this.camera = new Camera2(rect.width, rect.height);
    this.camera.setPosition([rect.width / 2, rect.height / 2]);
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

  addUpdateListener(callBack: SceneCallBack) {
    this.updateListeners = [...this.updateListeners, callBack];
  }

  removeUpdateListener(callBack: SceneCallBack) {
    this.updateListeners = this.updateListeners.filter((f) => f !== callBack);
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
      if (!this.forceUpdate && !this._items.some((i) => i.isUpdated)) {
        return;
      }
      this.forceUpdate = false;
      this.loopTime++;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.save();
      // move camera
      if (
        this.follow &&
        !this.easingCameraDistance &&
        !this.easingCameraX &&
        !this.easingCameraY
      )
        this.camera.setPosition([
          this.follow.position[0] + this.followOffset.position[0],
          this.follow.position[1] + this.followOffset.position[1],
        ]);
      this.camera.apply(this.ctx);

      this._items.forEach((d) => {
        this.ctx.save();
        // draw first
        d.draw2d(this, this.loopTime);
        this.ctx.restore();
        // set updated too false because draw
        if (!this.pauseAnimation) {
          d.isUpdated = false;
          d.update(this, this.loopTime);
        }
      });

      this.ctx.restore();

      this.updateListeners.forEach((ul) => ul(this, this.loopTime));
      this.calcCamera();
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

  moveEaseCamera(camera: { x?: number; y?: number; distance?: number }) {
    if (camera.distance) {
      this.easingCameraDistance = createEasing([
        {
          easing: Easing.easeOutCubic,
          startValue: this.camera.distance,
          endValue: camera.distance,
          time: 20,
        },
      ]);
    }
    if (camera.x) {
      this.easingCameraX = createEasing([
        {
          easing: Easing.easeOutCubic,
          startValue: this.camera.x,
          endValue: camera.x,
          time: 20,
        },
      ]);
    }
    if (camera.y) {
      this.easingCameraY = createEasing([
        {
          easing: Easing.easeOutCubic,
          startValue: this.camera.y,
          endValue: camera.y,
          time: 20,
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
    let text = config.text;
    if (config.textAlign) this.ctx.textAlign = config.textAlign;
    if (config.direction) this.ctx.direction = config.direction;
    if (config.textBaseline) this.ctx.textBaseline = config.textBaseline;
    if (config.lineWidth) this.ctx.lineWidth = config.lineWidth;
    this.ctx.font = config.font
      ? `${config.font.size}px ${config.font.type}`
      : "26px sans-serif";
    if (
      config.maxWidth &&
      this.ctx.measureText(text).width > config.maxWidth * 2
    ) {
      text = text.replace(" ", "\n");
    }
    const lines = text.split("\n");
    lines.forEach((l, i) => {
      const lineHeight = config.lineHeight || config.font?.size || 26;
      const h = config.y + lineHeight * i;
      if (config.fillStyle) {
        this.ctx.fillStyle = config.fillStyle;
        this.ctx.fillText(l, config.x, h);
      }
      if (config.strokeStyle) {
        this.ctx.strokeStyle = config.strokeStyle;
        this.ctx.strokeText(l, config.x, h);
      }
    });

    this.ctx.restore();
  }

  private calcCamera() {
    if (this.easingCameraDistance) {
      this.easingCameraDistance(
        (distance) => {
          this.camera.distance = distance;
          this.forceUpdate = true;
        },
        () => (this.easingCameraDistance = null)
      );
    }
    if (this.easingCameraX) {
      this.easingCameraX(
        (x) => {
          this.camera.setPosition([x]);
          if (this.follow) {
            this.followOffset.position[0] = x - this.follow.position[0];
          }
          this.forceUpdate = true;
        },
        () => (this.easingCameraX = null)
      );
    }
    if (this.easingCameraY) {
      this.easingCameraY(
        (y) => {
          this.camera.setPosition([undefined, y]);
          this.forceUpdate = true;
          if (this.follow) {
            this.followOffset.position[1] = y - this.follow.position[1];
          }
        },
        () => (this.easingCameraY = null)
      );
    }
  }

  private debouncedResize() {
    this.debounce.call();
  }
}
