export const PI = Math.PI;
export const PI2 = PI * 2;
export const HALF_PI = PI / 2;
export const QUART_PI = PI / 4;
export const TENTH_PI = PI / 10;
export const TWENTIETH_PI = PI / 20;

/**
 *
 * @param x 0 => 1
 * @param y
 * @param width example => 300
 * @param height
 *
 */
export function CoordinateRatioToScreen(
  x: number,
  y: number,
  width: number,
  height: number
): { x: number; y: number } {
  return {
    x: Math.round(width * x),
    y: Math.round(height * y),
  };
}

export function AngleRangeLoop(angle: number): number {
  return numberRangeLoop(-PI2, angle, PI2);
}

export function numberClamp(min: number, n: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

export function numberRangeLoop(min: number, n: number, max: number): number {
  if (max < 0) {
    return n > max ? (max % n) + min : n < min ? (min - n + max) % max : n;
  }
  return n > max ? (n % max) + min : n < min ? (n - min + max) % max : n;
}
