"use client";

import { useMemo, useRef, useState } from "react";
import { animate, AnimatePresence, motion } from "framer-motion";
import { Play, RotateCcw, Flame, Droplets } from "lucide-react";
import { buildFoldBands } from "@/lib/geology/paths";
import { ROCKS } from "@/lib/geology/palette";
import { StrataScene, SCENE_W, SCENE_H, SKY_H, LAYER_H } from "./StrataScene";
import { Slider, StatusChip } from "@/components/ui/Controls";

type Stage = {
  id: string;
  label: string;
  en: string;
  pres: number;      // 褶皱程度
  erosion: number;   // 剥蚀量 px（0 = 不剥蚀）
  fault: boolean;
  river: boolean;
  uplift: boolean;
  forces: ("内" | "外")[];
  desc: string;
};

const STAGES: Stage[] = [
  { id: "sediment", label: "沉积形成", en: "SEDIMENT", pres: 0, erosion: 0, fault: false, river: false, uplift: false, forces: ["外"], desc: "泥沙逐层沉积，形成水平岩层：新在上、老在下。" },
  { id: "uplift", label: "地壳抬升", en: "UPLIFT", pres: 0.12, erosion: 0, fault: false, river: false, uplift: true, forces: ["内"], desc: "地壳运动使地层整体抬升出水。" },
  { id: "fold", label: "挤压褶皱", en: "FOLDING", pres: 0.95, erosion: 0, fault: false, river: false, uplift: false, forces: ["内"], desc: "水平挤压力使岩层弯曲，形成背斜与向斜。" },
  { id: "fault", label: "断裂错动", en: "FAULTING", pres: 0.55, erosion: 0, fault: true, river: false, uplift: false, forces: ["内"], desc: "应力超过岩层强度，发生断裂，两侧地块错动。" },
  { id: "erosion", label: "风化侵蚀", en: "EROSION", pres: 0.55, erosion: 62, fault: true, river: false, uplift: false, forces: ["外"], desc: "风化、流水把高处削低，褶皱顶部开始被剥蚀。" },
  { id: "river", label: "河流切割", en: "RIVER CUT", pres: 0.55, erosion: 96, fault: true, river: true, uplift: false, forces: ["外"], desc: "河流沿薄弱带下切，V 形谷加深，剖面出露。" },
  { id: "modern", label: "现代地貌", en: "MODERN LANDSCAPE", pres: 0.55, erosion: 128, fault: true, river: true, uplift: false, forces: ["内", "外"], desc: "内、外力长期共同作用的结果：背斜谷与残丘并存。" },
];

function easeOut(v: number) { return 1 - Math.pow(1 - v, 3); }

export function EvolutionLab() {
  const [t, setT] = useState(0);      // 0..6 continuous
  const [playing, setPlaying] = useState(false);
  const animRef = useRef<ReturnType<typeof animate> | null>(null);

  const idx = Math.min(STAGES.length - 1, Math.round(t));
  const stage = STAGES[idx];
  const frac = t - idx; // 0..1 到下一阶段

  const bands = useMemo(
    () =>
      buildFoldBands({
        width: SCENE_W,
        topY: SKY_H,
        thickness: LAYER_H,
        count: 8,
        pressure: 0.95,
        mode: "anticline",
        amplitude: 82,
        squeeze: 0.14,
        ripple: 1.7,
      }),
    [],
  );

  function play() {
    animRef.current?.stop();
    setPlaying(true);
    animRef.current = animate(0, STAGES.length - 1, {
      duration: 13,
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

  // 侵蚀面
  const surfaceArr = useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i <= 96; i++) {
      const u = i / 96;
      const crest = Math.pow(Math.sin(Math.PI * u), 2);
      const topEdge = SKY_H - crest * 82 * 0.95;
      const deep = stage.erosion * easeOut(frac);
      const y = topEdge + deep * crest + 6;
      pts.push({ x: u * SCENE_W, y: Math.max(10, y) });
    }
    return pts;
  }, [stage.erosion, frac]);

  const coverPath = useMemo(() => {
    const s = surfaceArr.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" L ");
    return `M 0 0 L 0 ${surfaceArr[0].y.toFixed(1)} L ${s} L ${surfaceArr[surfaceArr.length - 1].x} 0 Z`;
  }, [surfaceArr]);

  const valley = useMemo(() => {
    let m = surfaceArr[0];
    for (const p of surfaceArr) if (p.y > m.y) m = p;
    return m;
  }, [surfaceArr]);

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

        <StrataScene bands={bands} layers={ROCKS} dark showSurface={false}>
          {/* 侵蚀盖层 */}
          {stage.erosion > 0 && (
            <>
              <path d={coverPath} fill="#1f1d17" />
              <path
                d={`M ${surfaceArr.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" L ")}`}
                fill="none"
                stroke="#99a06e"
                strokeWidth="2.4"
                strokeLinejoin="round"
              />
              <line x1="0" y1={SKY_H} x2={SCENE_W} y2={SKY_H} stroke="#a7a08d" strokeWidth="1.6" strokeDasharray="7 6" opacity="0.4" />
            </>
          )}

          {/* 断层线 */}
          {stage.fault && (
            <g>
              <line x1={382} y1={SKY_H} x2={548} y2={SCENE_H} stroke="#d9804f" strokeWidth="2.6" />
              <line x1={382} y1={SKY_H} x2={548} y2={SCENE_H} stroke="#1b1a14" strokeWidth="1" strokeDasharray="5 5" opacity="0.5" />
            </g>
          )}

          {/* 河流 */}
          {stage.river && (
            <g>
              <path d={`M ${valley.x - 70} ${valley.y + 7} Q ${valley.x} ${valley.y + 5} ${valley.x + 70} ${valley.y + 7}`} stroke="#5d8cad" strokeWidth="5" fill="none" strokeLinecap="round" />
              <path d={`M ${valley.x - 70} ${valley.y + 7} Q ${valley.x} ${valley.y + 5} ${valley.x + 70} ${valley.y + 7}`} stroke="#a7cfe0" strokeWidth="1.5" fill="none" strokeDasharray="9 8" />
              <text x={valley.x + 84} y={valley.y + 12} fontSize="12.5" fontWeight="700" fill="#9cc3d6" textAnchor="middle">河流下切</text>
            </g>
          )}

          {/* 力向箭头 */}
          {stage.id === "fold" && (
            <g stroke="#e8c9b4" strokeWidth="3" fill="none" opacity="0.9">
              <path d="M 54 230 L 96 230 M 88 222 L 96 230 L 88 238" />
              <path d="M 946 230 L 904 230 M 912 222 L 904 230 L 912 238" />
              <text x={SCENE_W / 2} y={216} textAnchor="middle" fontSize="14" fontWeight="800" fill="#e8c9b4">水平挤压</text>
            </g>
          )}
          {stage.id === "uplift" && (
            <g stroke="#e8c9b4" strokeWidth="3" fill="none" opacity="0.85">
              {[0.25, 0.5, 0.75].map((u) => (
                <g key={u} transform={`translate(${u * SCENE_W} ${SKY_H + 44})`}>
                  <path d="M 0 16 L 0 -12 M -7 -4 L 0 -12 L 7 -4" />
                </g>
              ))}
              <text x={SCENE_W / 2} y={SKY_H - 14} textAnchor="middle" fontSize="14" fontWeight="800" fill="#e8c9b4">地壳抬升</text>
            </g>
          )}
          {(stage.id === "erosion" || stage.id === "river" || stage.id === "modern") && (
            <g stroke="#d8d1bd" strokeWidth="2.2" fill="none" opacity="0.6">
              {[0.3, 0.55, 0.78].map((u) => (
                <g key={u} transform={`translate(${u * SCENE_W} ${surfaceArr[Math.round(u * 96)].y + 34})`}>
                  <path d="M 0 -12 L 0 10 M -6 2 L 0 10 L 6 2" />
                </g>
              ))}
              <text x={SCENE_W * 0.86} y={284} fontSize="13" fontWeight="700" fill="#d8d1bd">风化侵蚀</text>
            </g>
          )}
        </StrataScene>

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
          <h3 className="text-[19px] font-extrabold">拖动时间轴，观察地貌形成</h3>
          <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">
            内、外力先后作用，同一个褶皱在不同阶段形态完全不同。
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

        <div className="flex flex-wrap gap-2.5">
          <button className="btn btn-primary" onClick={play} disabled={playing}>
            <Play className="size-4" /> 播放演化
          </button>
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
