import { Item2Scene, Scene2d } from "../scene2d";
import { Perlin } from "../../../commons/utils/perlin-utils";
import { PI2 } from "../../../commons/utils/number.utils";
import { Vector2 } from "../vector2";
import { darkBlue, lightBlue } from "../../theme/hellipse-colors";
import { Circle2 } from "../circle2";
import { EasingCallback } from "../../../commons/utils/easing.utils";
import { Segment2 } from "../segment2";

export class BlobBall extends Circle2 implements Item2Scene {
  isUpdated: boolean = false;
  sceneId: number = 0;
  scenePriority: number = 0;
  definition: number = 20;
  perlinDepth: number = this.radius / 5;
  perlinStrength: number = 1;
  perlinRotation: number = 0;
  perlinMovement: Segment2 = new Segment2();
  easing: EasingCallback | null = null;
  hover: boolean = false;
  private perlin = new Perlin();

  constructor(x: number, y: number, r: number, public name: string) {
    super(x, y, r);
  }

  destroy(): void {}

  bounce = () => {};

  onResize(canvasWidth: number, canvasHeight: number): void {}

  draw2d(scene: Scene2d, time: number): void {
    const { ctx } = scene;

    ctx.translate(this.x, this.y);

    ctx.beginPath();
    for (let i = 0; i < PI2 * this.definition; i++) {
      const circlePerlin = Vector2.createFromAngle(
        this.perlinRotation + i / this.definition,
        this.perlinStrength
      );
      const bruit = this.perlin.noise(
        circlePerlin.x + this.perlinMovement.p2.x,
        circlePerlin.y + this.perlinMovement.p2.y
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
    ctx.fillStyle = this.hover ? lightBlue : darkBlue;
    ctx.fill();
    scene.writeText({
      text: this.name,
      x: 0,
      textAlign: "center",
      fillStyle: "white",
      textBaseline: "middle",
      y: 0,
      font: { size: this.radius / 4, type: "Raleway" },
    });
  }

  update(scene: Scene2d, time: number): void {
    this.isUpdated = true;
    this.perlinMovement.operation("add", { x: 0.01, y: -0.01 });
    this.perlinMovement.p2.rotateFrom(
      this.perlinMovement.p1,
      (this.perlinRotation -= 0.0001)
    );
    if (this.easing) {
      this.easing(
        (val) => (this.radius = val),
        () => (this.easing = null)
      );
    }
  }
}
