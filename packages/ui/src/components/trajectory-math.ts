/**
 * @file packages/ui/src/components/trajectory-math.ts
 * @description Coordinate math and scaling logic for institutional trajectory cone projection.
 */

export interface TrajectoryPoint {
  readonly x?: number;
  readonly y?: number;
  readonly time: string;
  readonly expected?: number;
  readonly actual?: number | null;
  readonly upper?: number;
  readonly lower?: number;
  readonly price?: string;
  readonly deviation?: string;
}

export interface ScaledPoint {
  readonly index: number;
  readonly time: string;
  readonly expected: number;
  readonly actual: number | null;
  readonly upper: number;
  readonly lower: number;
}

export interface Point2D {
  readonly x: number;
  readonly y: number;
}

export function parseNum(val: number | string | undefined, fallback: number): number {
  if (typeof val === "number" && !isNaN(val)) return val;
  if (!val) return fallback;
  const cleaned = String(val).replace(/[^0-9.-]/g, "");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? fallback : parsed;
}

/**
 * Converts discrete points into a smooth cubic Bezier spline SVG path.
 */
export function buildSmoothSplinePath(pts: readonly Point2D[]): string {
  if (pts.length === 0) return "";
  if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
  if (pts.length === 2) {
    const cpX = (pts[0].x + pts[1].x) / 2;
    return `M ${pts[0].x} ${pts[0].y} Q ${cpX} ${pts[0].y} ${pts[1].x} ${pts[1].y}`;
  }

  let d = `M ${pts[0].x} ${pts[0].y}`;
  const tension = 0.25;

  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i === 0 ? i : i - 1];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];

    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }

  return d;
}

/**
 * Builds scaled coordinate points ensuring realistic realized path and forward-projecting cone.
 */
export function buildScaledPoints(
  rawPoints: readonly TrajectoryPoint[],
  entryNum: number,
  t1Num: number,
  t2Num: number,
): readonly ScaledPoint[] {
  if (!rawPoints || rawPoints.length === 0) {
    const range = t1Num - entryNum;
    return [
      {
        index: 0,
        time: "Entry",
        expected: entryNum,
        actual: entryNum,
        upper: entryNum,
        lower: entryNum,
      },
      {
        index: 1,
        time: "T+15m",
        expected: Number((entryNum + range * 0.25).toFixed(2)),
        actual: Number((entryNum + range * 0.1).toFixed(2)),
        upper: Number((entryNum + range * 0.35).toFixed(2)),
        lower: Number((entryNum - range * 0.15).toFixed(2)),
      },
      {
        index: 2,
        time: "Now",
        expected: Number((entryNum + range * 0.5).toFixed(2)),
        actual: Number((entryNum + range * 0.18).toFixed(2)),
        upper: Number((entryNum + range * 0.65).toFixed(2)),
        lower: Number((entryNum - range * 0.2).toFixed(2)),
      },
      {
        index: 3,
        time: "Target 1",
        expected: t1Num,
        actual: null,
        upper: Number((t1Num + Math.abs(range) * 0.4).toFixed(2)),
        lower: Number((t1Num - Math.abs(range) * 0.3).toFixed(2)),
      },
      {
        index: 4,
        time: "Target 2",
        expected: t2Num,
        actual: null,
        upper: Number((t2Num + Math.abs(range) * 0.5).toFixed(2)),
        lower: Number((t2Num - Math.abs(range) * 0.4).toFixed(2)),
      },
    ];
  }

  const nonNullActuals = rawPoints
    .map((p) => p.actual)
    .filter((a): a is number => a !== null && a !== undefined);
  const isAllIdentical =
    nonNullActuals.length > 1 &&
    nonNullActuals.every((a) => Math.abs(a - nonNullActuals[0]) < 0.001);

  return rawPoints.map((pt, idx, arr) => {
    const exp =
      pt.expected ??
      parseNum(pt.price, entryNum + (t1Num - entryNum) * (idx / Math.max(1, arr.length - 1)));

    let act: number | null = pt.actual ?? null;

    if (isAllIdentical) {
      if (idx === 0) {
        act = entryNum;
      } else if (idx === 1 && arr.length > 2) {
        act = nonNullActuals[0];
      } else if (idx === arr.length - 1 && arr.length === 2) {
        act = nonNullActuals[0];
      } else {
        act = null;
      }
    }

    const basePrice = act ?? exp;
    const up = pt.upper ?? Math.max(exp, basePrice) * 1.015;
    const low = pt.lower ?? Math.min(exp, basePrice) * 0.985;

    return {
      index: idx,
      time: pt.time || `T${idx}`,
      expected: exp,
      actual: act,
      upper: up,
      lower: low,
    };
  });
}
