/**
 * 地质剖面几何：把「岩层」看作一条条中心线，受挤压力发生弯曲，
 * 沿法线方向加厚成封闭带状路径（Catmull-Rom → Bezier 平滑）。
 */

export type FoldMode = "anticline" | "syncline" | "waves";

/** u ∈ [0,1]，返回弯曲位移（正 = 向下），幅值归一化 */
export function foldShape(u: number, mode: FoldMode): number {
  switch (mode) {
    case "anticline":
      return -Math.pow(Math.sin(Math.PI * u), 2);
    case "syncline":
      return Math.pow(Math.sin(Math.PI * u), 2);
    case "waves": {
      const w2 = Math.sin(2 * Math.PI * u);
      const w4 = Math.sin(4 * Math.PI * u + 0.25 * Math.PI);
      return 0.78 * w2 + 0.34 * w4;
    }
  }
}

export type Band = {
  index: number;     // 0 = 最老（最底）
  path: string;      // 闭合带状路径
  centerline: string; // 中心线（层纹）
  midY: number;      // 中性层中心 y
};

export type FoldOpts = {
  width: number;
  topY: number;      // 地层带顶部 y
  thickness: number;
  count: number;
  pressure: number;  // 0..1
  mode: FoldMode;
  amplitude: number; // 最大弯曲幅度 px
  squeeze: number;   // 最大水平压缩比例
  ripple?: number;   // 微起伏
};

const N = 72;

function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d;
}

function reversePath(d: string): string {
  const segs = d
    .replace(/^M\s?/, "")
    .split(/(?=C\s?)/)
    .filter((s) => s.length > 0);
  const first = segs.shift()!.trim().split(" ").map(Number);
  const pts = [first];
  for (const seg of segs) {
    const c = seg.replace(/^C\s?/, "").split(" ").map(Number);
    pts.push([c[4], c[5]]);
  }
  // 反转采样点后重建 Catmull-Rom：得到与原曲线几何一致、方向相反的路径
  return smoothPath(pts.slice().reverse().map(([x, y]) => ({ x, y })));
}

function buildBand(
  layerIndex: number,
  yCenter: number,
  opts: FoldOpts,
): { top: string; bottom: string; mid: string } {
  const { width, pressure, mode, amplitude, squeeze, ripple = 0 } = opts;
  // 分谐波褶皱：浅层形变量大、深层形变量小（更贴近真实地质剖面）
  const ampDepth = amplitude * (0.32 + 0.68 * Math.min(1, layerIndex / Math.max(1, opts.count - 1)));
  const cx = width / 2;
  const half = opts.thickness / 2;

  const k = 2.4 + ((layerIndex * 1.73 + 0.7) % 3.2);
  const phi = (layerIndex * 0.9 + 0.3) * Math.PI;

  const ptsTop: { x: number; y: number }[] = [];
  const ptsMid: { x: number; y: number }[] = [];
  const ptsBot: { x: number; y: number }[] = [];

  for (let i = 0; i <= N; i++) {
    const u = i / N;
    const x0 = u * width;
    const x = cx + (x0 - cx) * (1 - squeeze * pressure);
    const bend = foldShape(u, mode) * ampDepth * pressure;
    const noise = ripple * Math.sin(2 * Math.PI * (k * u + phi));
    const y = yCenter + bend + noise;

    // 前向差分求切线（x 单调递增，不会退化为零向量）
    const uNext = Math.min(N, i + 1) / N;
    const xNext = cx + (uNext * width - cx) * (1 - squeeze * pressure);
    const bendNext = foldShape(uNext, mode) * ampDepth * pressure;
    const noiseNext = ripple * Math.sin(2 * Math.PI * (k * uNext + phi));
    const yNext = yCenter + bendNext + noiseNext;

    let dx = xNext - x;
    let dy = yNext - y;
    const len = Math.hypot(dx, dy);
    if (len < 1e-9) {
      dx = 1;
      dy = 0;
    } else {
      dx /= len;
      dy /= len;
    }
    const nx = -dy;
    const ny = dx;

    ptsTop.push({ x: x + nx * half, y: y + ny * half });
    ptsMid.push({ x, y });
    ptsBot.push({ x: x - nx * half, y: y - ny * half });
  }

  return { top: smoothPath(ptsTop), bottom: smoothPath(ptsBot), mid: smoothPath(ptsMid) };
}

export function buildFoldBands(opts: FoldOpts): Band[] {
  const bands: Band[] = [];
  for (let i = 0; i < opts.count; i++) {
    const yCenter = opts.topY + i * opts.thickness + opts.thickness / 2;
    const { top, bottom, mid } = buildBand(i, yCenter, opts);
    bands.push({
      index: i,
      path: `${bottom} ${reversePath(top)}`,
      centerline: mid,
      midY: yCenter,
    });
  }
  return bands;
}

/* ---------- 断层几何 ---------- */

/** 断层线：从地表 (fx, yTop) 以 dip 度向深部延伸，返回深度 y 处的 x */
export function faultPlaneX(fx: number, yTop: number, y: number, dipDeg: number): number {
  return fx + (y - yTop) / Math.tan((dipDeg * Math.PI) / 180);
}

/** 断层一侧的裁剪多边形（与视口矩形求交） */
export function faultClipPolygon(
  fx: number,
  yTop: number,
  width: number,
  height: number,
  dipDeg: number,
  side: "left" | "right",
): string {
  const yBottom = height;
  const xBottom = faultPlaneX(fx, yTop, yBottom, dipDeg);
  if (side === "right") {
    return `M ${fx} ${yTop} L ${width} ${yTop} L ${width} ${yBottom} L ${xBottom} ${yBottom} Z`;
  }
  return `M 0 ${yTop} L ${fx} ${yTop} L ${xBottom} ${yBottom} L 0 ${yBottom} Z`;
}

/** 三地块边界：中心地块顶/底宽度不同 → 倾角不同的断层边界 */
export function blockBoundaries(
  cx: number,
  topW: number,
  bottomW: number,
): { lt: number; lb: number; rt: number; rb: number } {
  return { lt: cx - topW, lb: cx - bottomW, rt: cx + topW, rb: cx + bottomW };
}

export type SimplePoint = { x: number; y: number };

export function catmullPath(pts: SimplePoint[]): string {
  return smoothPath(pts);
}

/** 稳定伪随机数 */
export function seeded(seed: number, i: number): number {
  const x = Math.sin(seed * 127.1 + i * 311.7) * 43758.5453;
  return x - Math.floor(x);
}
