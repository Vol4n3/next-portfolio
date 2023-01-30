"use client";

import { useEffect, useRef } from "react";
import { Item2Scene, Scene2d } from "../features/canvas2d/scene2d";
import { Point2, PointSetX, PointSetY } from "../features/canvas2d/point2";
import { SearchAStar } from "../features/canvas2d/a-star";

interface Position {
  x: number;
  y: number;
}

class Tile implements Position, Item2Scene {
  isUpdated: boolean = true;
  position: Point2 = [0, 0];
  scenePriority: number = 0;

  constructor(
    x: number,
    y: number,
    private color: string,
    private size: number
  ) {
    this.position = [x, y];
  }

  get y(): number {
    return this.position[1];
  }

  set y(value: number) {
    this.position = PointSetY(this.position, value);
  }

  get x(): number {
    return this.position[0];
  }

  set x(value: number) {
    this.position = PointSetX(this.position, value);
  }

  draw2d(scene: Scene2d, time: number): void {
    const { ctx } = scene;
    ctx.beginPath();
    ctx.fillStyle = this.color;

    ctx.rect(this.x, this.y, this.size, this.size);

    ctx.closePath();
    ctx.fill();
  }

  update(scene: Scene2d, time: number): void {}

  destroy(): void {}
}

const samePosition = (p1: Position, p2: Position): boolean => {
  return p1.x === p2.x && p1.y === p2.y;
};
const getPositionInGrid = <T extends Position>(
  x: number,
  y: number,
  grid: T[]
): T | undefined => {
  return grid.find((p) => p.x === x && p.y === y);
};
export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const cellSize = 50;
    const grid: Position[] = [];
    const scene = new Scene2d(container);
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        const even = x % 2 === (y % 2 === 0 ? 0 : 1);
        grid.push({ x, y });
        scene.addItem(
          new Tile(
            x * cellSize,
            y * cellSize,
            even ? "#353535" : "#2a2a2a",
            cellSize
          )
        );
      }
    }
    const first = grid.at(0);
    const last = grid.at(-1);
    if (first && last) {
      scene.addItem(
        new Tile(
          first.x * cellSize + 12.5,
          first.y * cellSize + 12.5,
          "red",
          25
        )
      );
      scene.addItem(
        new Tile(last.x * cellSize + 12.5, last.y * cellSize + 12.5, "red", 25)
      );
      const result = SearchAStar(
        grid.map(({ y, x }) => ({ y, x, height: 1 })),
        first,
        last
      );
      console.log(result);

      scene.addMultipleItem(
        result.map(
          (t) =>
            new Tile(t.x * cellSize + 12.5, t.y * cellSize + 12.5, "blue", 15)
        )
      );
    }
    return () => {
      scene.destroy();
    };
  }, [containerRef]);
  return <div ref={containerRef} style={{ width: 500, height: 500 }}></div>;
}
