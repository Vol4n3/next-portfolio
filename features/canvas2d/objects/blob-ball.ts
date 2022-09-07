import { Item2Scene, Scene2d } from "../scene2d";
import { Perlin } from "../../../commons/utils/perlin-utils";
import { PI2 } from "../../../commons/utils/number.utils";
import { Vector2 } from "../vector2";
import { darkBlue } from "../../theme/hellipse-colors";
import { Circle2 } from "../circle2";
import {
  createEasing,
  Easing,
  EasingCallback,
} from "../../../commons/utils/easing.utils";

export class BlobBall extends Circle2 implements Item2Scene {
  isUpdated: boolean = false;
  sceneId: number = 0;
  scenePriority: number = 0;
  definition: number = 20;
  perlinDepth: number = 8;
  perlinStrength: number = 1;
  perlinX: number = 0;
  perlinY: number = 0;
  perlinRotation: number = 0;
  easing: EasingCallback | null = null;
  easingOut: EasingCallback | null = null;
  private perlin = new Perlin();

  bounce = () => {
    if (this.easingOut || this.easing) return;
    this.easing = createEasing(
      Easing.easeInQuad,
      this.perlinStrength,
      this.perlinStrength + 2,
      25
    );
  };

  onResize(canvasWidth: number, canvasHeight: number): void {}

  draw2d(scene: Scene2d, time: number): void {
    const { ctx } = scene;
    ctx.translate(this.x, this.y);
    ctx.beginPath();

    for (let i = 0; i < PI2 * this.definition; i++) {
      const cerclePerlin = Vector2.createFromAngle(
        this.perlinRotation + i / this.definition,
        this.perlinStrength
      );
      const bruit = this.perlin.noise(
        cerclePerlin.x + this.perlinX,
        cerclePerlin.y + this.perlinY
      );
      const vec = Vector2.createFromAngle(
        i / this.definition,
        this.radius + bruit * this.perlinDepth
      );
      if (i === 0) {
        ctx.moveTo(vec.x, vec.y);
      } else {
        ctx.lineTo(vec.x, vec.y);
      }
    }
    ctx.fillStyle = darkBlue;
    ctx.fill();
  }

  update(scene: Scene2d, time: number): void {
    this.isUpdated = true;
    this.perlinY += 0.005;
    this.perlinX += 0.005;
    this.perlinRotation += 0.0005;
    if (this.easing) {
      const val = this.easing();
      if (val === null) {
        this.easing = null;
        this.easingOut = createEasing(
          Easing.easeOutQuad,
          this.perlinStrength,
          this.perlinStrength - 2,
          25
        );
      } else {
        this.perlinStrength = val;
      }
    }
    if (this.easingOut) {
      const val = this.easingOut();
      if (val === null) {
        this.easingOut = null;
      } else {
        this.perlinStrength = val;
      }
    }
  }
}
