"use client";

import { useMemo, useRef, useState } from "react";
import { animate, AnimatePresence, motion } from "framer-motion";
import { Play, Pause, RotateCcw, Flame, Droplets } from "lucide-react";
import { buildFoldBands, faultClipPolygon } from "@/lib/geology/paths";
import { ROCKS } from "@/lib/geology/palette";
import { SCENE_W, SCENE_H, SKY_H, LAYER_H } from "./StrataScene";
import { Slider, StatusChip } from "@/components/ui/Controls";

type Stage = {
  id: string;
  label: string;
  en: string;
  forces: ("内" | "外")[];
  desc: string;
};

const STAGES: Stage[] = [
  { id: "sediment", label: "沉积形成", en: "SEDIMENT", forces: ["外"], desc: "泥沙逐层沉积，形成水平岩层：新在上、老在下。" },
  { id: "uplift", label: "地壳抬升", en: "UPLIFT", forces: ["内"], desc: "地壳运动使地层整体抬升，海水逐渐退去。" },
  { id: "fold", label: "挤压褶皱", en: "FOLDING", forces: ["内"], desc: "水平挤压力使岩层弯曲，形成背斜与向斜。" },
  { id: "fault", label: "断裂错动", en: "FAULTING", forces: ["内"], desc: "应力超过岩层强度，发生断裂，一侧地块沿断面错动。" },
  { id: "erosion", label: "风化侵蚀", en: "EROSION", forces: ["外"], desc: "风化、流水把高处削低，褶皱顶部开始被剥蚀。" },
  { id: "river", label: "河流切割", en: "RIVER CUT", forces: ["外"], desc: "河流沿薄弱带下切，V 形谷加深，剖面出露。" },
  { id: "modern", label: "现代地貌", en: "MODERN LANDSCAPE", forces: ["内", "外"], desc: "内、外力长期共同作用的结果：背斜谷与残丘并存。" },
];

/** 每阶段连续演化参数 */
const P = [
  { pres: 0.05, seaY: 128, erosion: 0, fault: 0, river: 0 },    // 沉积（水下）
  { pres: 0.2, seaY: 88, erosion: 0, fault: 0, river: 0 },       // 抬升（海退）
  { pres: 0.95, seaY: -1, erosion: 0, fault: 0, river: 0 },      // 褶皱
  { pres: 0.62, seaY: -1, erosion: 0, fault: 1, river: 0 },      // 断层
  { pres: 0.62, seaY: -1, erosion: 58, fault: 1, river: 0.3 },   // 侵蚀
  { pres: 0.62, seaY: -1, erosion: 102, fault: 1, river: 1 },    // 河流
  { pres: 0.62, seaY: -1, erosion: 136, fault: 1, river: 0.95 }, // 现代
];

function lerp(a: number, b: number, f: number) {
  return a + (b - a) * f;
}

export function EvolutionLab() {
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const animRef = useRef<ReturnType<typeof animate> | null>(null);

  const idx = Math.min(STAGES.length - 1, Math.floor(t));
  const frac = Math.min(1, Math.max(0, t - idx));
  const stage = STAGES[idx];
  const a = P[idx];
  const b = P[Math.min(P.length - 1, idx + 1)];

  // 连续参数（量化到小步长，避免每帧重建几何）
  const pres = Math.round(lerp(a.pres, b.pres, frac) * 40) / 40;
  const seaY = Math.round(lerp(a.seaY, b.seaY, frac));
  const erosion = Math.round(lerp(a.erosion, b.erosion, frac) * 2) / 2;
  const faultOff = Math.round(lerp(a.fault, b.fault, frac) * 36 * 2) / 2;
  const river = Math.round(lerp(a.river, b.river, frac) * 40) / 40;

  const showSea = seaY >= 40 && seaY <= 150;

  const bands = useMemo(
    () =>
      buildFoldBands({
        width: SCENE_W,
        topY: SKY_H,
        thickness: LAYER_H,
        count: 8,
        pressure: pres,
        mode: "anticline",
        amplitude: 82,
        squeeze: 0.14,
        ripple: 1.7,
      }),
    [pres],
  );

  // 侵蚀面
  const surfaceArr = useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i <= 96; i++) {
      const u = i / 96;
      const crest = Math.pow(Math.sin(Math.PI * u), 2);
      const topEdge = SKY_H - crest * 82 * pres;
      const y = topEdge + erosion * crest + 6;
      pts.push({ x: u * SCENE_W, y: Math.max(10, y) });
    }
    return pts;
  }, [erosion, pres]);

  const coverPath = useMemo(() => {
    const s = surfaceArr.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" L ");
    return `M 0 0 L 0 ${surfaceArr[0].y.toFixed(1)} L ${s} L ${surfaceArr[surfaceArr.length - 1].x} 0 Z`;
  }, [surfaceArr]);

  const valley = useMemo(() => {
    let m = surfaceArr[0];
    for (const p of surfaceArr) if (p.y > m.y) m = p;
    return m;
  }, [surfaceArr]);

  // 断层几何（右盘沿断层面错动）
  const FX = 384;
  const DIP = 62;
  const xB = FX + (SCENE_H - SKY_H) / Math.tan((DIP * Math.PI) / 180);
  const fl = Math.hypot(xB - FX, SCENE_H - SKY_H);
  const dx = ((xB - FX) / fl) * faultOff;
  const dy = ((SCENE_H - SKY_H) / fl) * faultOff;
  const showFault = faultOff > 1.5;
  const hangingClip = faultClipPolygon(FX, SKY_H, SCENE_W, SCENE_H, DIP, "right");
  const footwallClip = faultClipPolygon(FX, SKY_H, SCENE_W, SCENE_H, DIP, "left");

  function play() {
    animRef.current?.stop();
    setPlaying(true);
    animRef.current = animate(0, STAGES.length - 1, {
      duration: 15,
      ease: "linear",
      onUpdate: (v) => setT(v),
      onComplete: () => setPlaying(false),
    });
  }

  function reset() {
    animRef.current?.stop();
    setPlaying(false);
    setT(0);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
      {/* 剖面舞台 */}
      <div className="panel relative overflow-hidden">
        <div className="absolute left-4 top-4 z-10 flex flex-wrap items-center gap-2">
          <StatusChip tone="clay">{stage.label}</StatusChip>
          <span className="t-mono inline-flex items-center rounded-full bg-paper-2 px-3 py-1.5 text-[12px] font-bold text-ink-faint">{stage.en}</span>
          {stage.forces.map((f) => (
            <span
              key={f}
              className={
                "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-bold " +
                (f === "内" ? "bg-clay-soft/70 text-clay-deep" : "bg-paper-2 text-water")
              }
            >
              {f === "内" ? <Flame className="size-3" /> : <Droplets className="size-3" />}
              {f}力作用
            </span>
          ))}
        </div>

        <svg viewBox={`0 0 ${SCENE_W} ${SCENE_H}`} className="block h-auto w-full select-none" aria-label="构造演化剖面">
          <defs>
            <linearGradient id="ev-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#2b2820" />
              <stop offset="1" stopColor="#1b1a14" />
            </linearGradient>
            <pattern id="ev-dots" width="30" height="24" patternUnits="userSpaceOnUse">
              <circle cx="6" cy="6" r="1.8" fill="#b8b2a2" opacity="0.45" />
              <circle cx="21" cy="14" r="2.2" fill="#b8b2a2" opacity="0.35" />
            </pattern>
            {showFault && (
              <>
                <clipPath id="ev-fw"><path d={footwallClip} /></clipPath>
                <clipPath id="ev-hg"><path d={hangingClip} /></clipPath>
              </>
            )}
          </defs>
          <rect width={SCENE_W} height={SKY_H} fill="url(#ev-sky)" />

          {/* 岩层（可按需分盘错动） */}
          {showFault ? (
            <g>
              <g clipPath="url(#ev-fw)">
                {bands.map((b) => {
                  const r = ROCKS[b.index];
                  return <path key={b.index} d={b.path} fill={r.dark} stroke={r.darkEdge} strokeWidth="1.4" />;
                })}
                <rect x="0" y={SKY_H + bands.length * LAYER_H} width={SCENE_W} height={SCENE_H} fill="#24221b" />
              </g>
              <g clipPath="url(#ev-hg)">
                <g transform={`translate(${dx.toFixed(1)} ${dy.toFixed(1)})`}>
                  {bands.map((b) => {
                    const r = ROCKS[b.index];
                    return <path key={b.index} d={b.path} fill={r.dark} stroke={r.darkEdge} strokeWidth="1.4" />;
                  })}
                  <rect x="0" y={SKY_H + bands.length * LAYER_H} width={SCENE_W} height={SCENE_H} fill="#2a281f" />
                </g>
              </g>
            </g>
          ) : (
            <g>
              {bands.map((b) => {
                const r = ROCKS[b.index];
                return (
                  <g key={b.index}>
                    <path d={b.path} fill={r.dark} stroke={r.darkEdge} strokeWidth="1.4" strokeLinejoin="round" />
                    {r.dotted && <path d={b.path} fill="url(#ev-dots)" opacity="0.55" />}
                    {r.striated && (
                      <path d={b.centerline} fill="none" stroke={r.darkEdge} strokeWidth="0.9" opacity="0.55" strokeDasharray="3.2 3" />
                    )}
                  </g>
                );
              })}
              <rect x="0" y={SKY_H + bands.length * LAYER_H} width={SCENE_W} height={SCENE_H} fill="#24221b" />
            </g>
          )}

          {/* 断层面 */}
          {showFault && (
            <g>
              <line x1={FX} y1={SKY_H} x2={xB} y2={SCENE_H} stroke="#d9804f" strokeWidth="2.8" />
              <line x1={FX} y1={SKY_H} x2={xB} y2={SCENE_H} stroke="#1b1a14" strokeWidth="1" strokeDasharray="5 5" opacity="0.5" />
              <g>
                <rect x={FX + 28} y={SKY_H + 86} width="96" height="30" rx="15" fill="#1b1a14" opacity="0.9" />
                <text x={FX + 76} y={SKY_H + 106} textAnchor="middle" fontSize="15" fontWeight="800" fill="#e0a875">
                  断层面
                </text>
              </g>
            </g>
          )}

          {/* 海面（沉积→抬升阶段，逐渐退去） */}
          {showSea && (
            <g>
              <rect x="0" y={seaY} width={SCENE_W} height={SCENE_H - seaY} fill="#3c6a85" opacity="0.16" />
              <line x1="0" y1={seaY} x2={SCENE_W} y2={seaY} stroke="#6c9fc0" strokeWidth="2.6" opacity="0.85" />
              <path d={`M ${SCENE_W * 0.42} ${seaY - 6} q 8 10 16 0 M ${SCENE_W * 0.56} ${seaY - 6} q 8 10 16 0`} stroke="#9cc3d6" strokeWidth="1.6" fill="none" opacity="0.8" />
              <g>
                <rect x={SCENE_W * 0.5 - 42} y={seaY - 42} width="84" height="28" rx="14" fill="#1b1a14" opacity="0.85" />
                <text x={SCENE_W * 0.5} y={seaY - 23.5} textAnchor="middle" fontSize="14" fontWeight="800" fill="#9cc3d6">
                  海面
                </text>
              </g>
              {/* 海退箭头 */}
              <g stroke="#9cc3d6" strokeWidth="2.6" fill="none" opacity="0.9">
                <path d={`M ${SCENE_W * 0.78} ${seaY + 12} L ${SCENE_W * 0.82} ${seaY - 16}`} />
                <path d={`M ${SCENE_W * 0.82} ${seaY - 8} L ${SCENE_W * 0.82} ${seaY - 16} L ${SCENE_W * 0.9} ${seaY - 8}`} />
              </g>
            </g>
          )}

          {/* 侵蚀盖层与地形 */}
          {erosion > 2 && (
            <g>
              <path d={coverPath} fill="#1f1d17" />
              <path
                d={`M ${surfaceArr.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" L ")}`}
                fill="none"
                stroke="#99a06e"
                strokeWidth="2.2"
                strokeLinejoin="round"
              />
              <line x1="0" y1={SKY_H} x2={SCENE_W} y2={SKY_H} stroke="#a7a08d" strokeWidth="1.4" strokeDasharray="7 6" opacity="0.4" />
            </g>
          )}

          {/* 河流（连续出现 + 流动动画） */}
          {river > 0.06 && (
            <g opacity={Math.min(1, river * 1.3)}>
              <path
                d={`M ${valley.x - 74} ${valley.y + 8} Q ${valley.x} ${valley.y + 5} ${valley.x + 74} ${valley.y + 8}`}
                stroke="#5d8cad"
                strokeWidth={2 + river * 3}
                fill="none"
                strokeLinecap="round"
              />
              <path
                d={`M ${valley.x - 74} ${valley.y + 8} Q ${valley.x} ${valley.y + 5} ${valley.x + 74} ${valley.y + 8}`}
                stroke="#a7cfe0"
                strokeWidth="1.8"
                fill="none"
                opacity="0.85"
              >
                <animate attributeName="stroke-dashoffset" from="0" to="-44" dur="1.2s" repeatCount="indefinite" />
              </path>
              <path
                d={`M ${valley.x - 74} ${valley.y + 8} Q ${valley.x} ${valley.y + 5} ${valley.x + 74} ${valley.y + 8}`}
                stroke="#a7cfe0"
                strokeWidth="1.4"
                fill="none"
                strokeDasharray="7 15"
                opacity="0.7"
              >
                <animate attributeName="stroke-dashoffset" from="0" to="-22" dur="1.2s" repeatCount="indefinite" />
              </path>
              {river > 0.5 && (
                <g>
                  <rect x={valley.x + 84} y={valley.y - 8} width="52" height="26" rx="13" fill="#1b1a14" opacity="0.85" />
                  <text x={valley.x + 110} y={valley.y + 8.5} textAnchor="middle" fontSize="13.5" fontWeight="800" fill="#a7cfe0">
                    河流
                  </text>
                </g>
              )}
            </g>
          )}

          {/* 沉积阶段：泥沙沉降粒子 */}
          {idx === 0 && (
            <g>
              {[0.2, 0.4, 0.6, 0.8].map((u, i) => (
                <motion.g
                  key={i}
                  animate={{ y: [0, 140], opacity: [0.95, 0.45, 0.1] }}
                  transition={{ duration: 3.2, repeat: Infinity, delay: i * 0.7, ease: "linear" }}
                >
                  <circle cx={u * SCENE_W + 40} cy={26} r="2.4" fill="#c9c0a9" />
                </motion.g>
              ))}
            </g>
          )}

          {/* 挤压褶皱：双向挤压箭头（脉动） */}
          {pres > 0.42 && (
            <motion.g
              animate={{ scaleX: [1, 1.16, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              style={{ originX: 0.5, originY: 0.5 }}
            >
              <g transform={`translate(78 ${SKY_H + (bands.length * LAYER_H) / 2})`} stroke="#e8c9b4" strokeWidth="3.4" fill="none" strokeLinecap="round">
                <path d="M -18 0 L 14 0 M 4 -9 L 14 0 L 4 9" />
              </g>
              <g transform={`translate(${SCENE_W - 78} ${SKY_H + (bands.length * LAYER_H) / 2})`} stroke="#e8c9b4" strokeWidth="3.4" fill="none" strokeLinecap="round">
                <path d="M 18 0 L -14 0 M -4 -9 L -14 0 L -4 9" />
              </g>
              <g>
                <rect x={SCENE_W / 2 - 54} y={SKY_H + bands.length * LAYER_H + 26} width="108" height="30" rx="15" fill="#1b1a14" opacity="0.9" />
                <text x={SCENE_W / 2} y={SKY_H + bands.length * LAYER_H + 46} textAnchor="middle" fontSize="15" fontWeight="800" fill="#e8c9b4">
                  水平挤压
                </text>
              </g>
            </motion.g>
          )}

          {/* 侵蚀阶段：核部剥蚀箭头 + 风化侵蚀标签 */}
          {erosion > 12 && (
            <g>
              {[0.34, 0.5, 0.66].map((u) => (
                <g key={u} transform={`translate(${u * SCENE_W} ${surfaceArr[Math.round(u * 96)].y + 26})`}>
                  <line x1="0" y1="-18" x2="0" y2="12" stroke="#e8c9b4" strokeWidth="3" strokeLinecap="round" />
                  <path d="M -6 4 L 0 12 L 6 4" fill="none" stroke="#e8c9b4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              ))}
              <g>
                <rect x={24} y={54} width="116" height="30" rx="15" fill="#1b1a14" opacity="0.9" />
                <text x={82} y={73.5} textAnchor="middle" fontSize="15" fontWeight="800" fill="#d8d1bd">
                  风化侵蚀
                </text>
              </g>
            </g>
          )}
        </svg>

        {/* 年代标尺 */}
        <div className="flex items-center gap-3 border-t border-line px-5 py-3">
          <span className="t-mono text-[11px] font-bold text-ink-faint">0</span>
          <div className="relative h-2 flex-1 rounded-full bg-paper-3">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full bg-clay"
              animate={{ width: `${(idx / (STAGES.length - 1)) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <span className="t-mono text-[11px] font-bold text-ink-faint">2000 万年</span>
        </div>
      </div>

      {/* 控制与说明 */}
      <div className="panel flex flex-col gap-6 p-6">
        <div>
          <p className="eyebrow mb-2">地质时间机器</p>
          <h3 className="text-[19px] font-extrabold">拖动或播放，看地貌如何一步步形成</h3>
          <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">
            时间轴推进时，岩层连续弯曲、海面退去、断层面错动、河谷加深——每一步都有明确的视觉对应。
          </p>
        </div>

        <Slider
          label="演化阶段"
          value={t}
          min={0}
          max={STAGES.length - 1}
          step={0.02}
          onChange={(v) => {
            animRef.current?.stop();
            setPlaying(false);
            setT(v);
          }}
        />

        <div className="flex flex-wrap items-center gap-2.5">
          {playing ? (
            <button
              className="btn btn-primary"
              onClick={() => {
                animRef.current?.stop();
                setPlaying(false);
              }}
            >
              <Pause className="size-4" /> 暂停
            </button>
          ) : (
            <button className="btn btn-primary" onClick={play}>
              <Play className="size-4" /> 播放演化
            </button>
          )}
          <button className="btn btn-ghost" onClick={reset}>
            <RotateCcw className="size-4" /> 复位
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28 }}
            className="rounded-xl border border-line bg-paper-2/60 p-4"
          >
            <p className="t-mono text-[11px] tracking-wider text-ink-faint">
              {String(idx + 1).padStart(2, "0")} / {STAGES.length} · {stage.en}
            </p>
            <p className="mt-1.5 text-[14.5px] font-semibold leading-relaxed text-ink">{stage.desc}</p>
          </motion.div>
        </AnimatePresence>

        <div className="space-y-2">
          {STAGES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => {
                animRef.current?.stop();
                setPlaying(false);
                setT(i);
              }}
              className={
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors " +
                (i === idx ? "bg-night text-chalk" : "hover:bg-paper-2")
              }
            >
              <span className={"t-mono text-[11px] font-bold " + (i === idx ? "text-clay" : "text-ink-faint")}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={"text-[13.5px] font-semibold " + (i === idx ? "text-chalk" : "text-ink-soft")}>{s.label}</span>
              <span className="ml-auto flex gap-1">
                {s.forces.map((f) => (
                  <span key={f} className={"t-mono rounded px-1.5 py-0.5 text-[10px] font-bold " + (i === idx ? "bg-night-3 text-chalk-dim" : "bg-paper-2 text-ink-faint")}>
                    {f}力
                  </span>
                ))}
              </span>
            </button>
          ))}
        </div>

        <p className="text-[13px] leading-relaxed text-ink-soft">
          <b className="text-ink">核心思想：</b>地貌由<span className="font-bold text-clay">构造、运动、风化、侵蚀、流水</span>长期共同塑造，而不由单次构造决定。
        </p>
      </div>
    </div>
  );
}

