"use client";

import { useMemo, useRef, useState } from "react";
import { animate } from "framer-motion";
import { Play, RotateCcw, Waves, ArrowDown } from "lucide-react";
import { buildFoldBands, type FoldMode } from "@/lib/geology/paths";
import { ROCKS } from "@/lib/geology/palette";
import { StrataScene, SCENE_W, SKY_H, LAYER_H } from "./StrataScene";
import { Slider, Segmented, StatusChip } from "@/components/ui/Controls";

const BANDS = 8;
const AMP = 76;
const DEPTH = 185;

/** 归一化剥蚀量：背斜在核部最强；向斜在翼部（两侧）最强 */
function removal(u: number, mode: FoldMode): number {
  const crest = Math.pow(Math.sin(Math.PI * u), 2);
  return mode === "anticline" ? 0.18 + 0.82 * crest : 0.85 - 0.72 * crest;
}

export function ErosionLab() {
  const [mode, setMode] = useState<FoldMode>("anticline");
  const [t, setT] = useState(0); // 0..1 时间
  const [playing, setPlaying] = useState(false);
  const animRef = useRef<ReturnType<typeof animate> | null>(null);

  const bands = useMemo(
    () =>
      buildFoldBands({
        width: SCENE_W,
        topY: SKY_H,
        thickness: LAYER_H,
        count: BANDS,
        pressure: 0.96,
        mode,
        amplitude: AMP,
        squeeze: 0.14,
        ripple: 1.6,
      }),
    [mode],
  );

  // 侵蚀面（当前地表）：沿土层表面向下剥蚀
  const surface = useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i <= 96; i++) {
      const u = i / 96;
      const x = u * SCENE_W;
      const crest = Math.pow(Math.sin(Math.PI * u), 2) * AMP * 0.96;
      const topEdge = SKY_H + (mode === "anticline" ? -crest : crest);
      const y = topEdge + DEPTH * removal(u, mode) * easeOut(t);
      pts.push({ x, y: Math.max(8, y) });
    }
    return pts;
  }, [mode, t]);

  const coverPath = useMemo(() => {
    const s = "M 0 0 L 0 " + surface[0].y.toFixed(1);
    const body = surface.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" L ");
    return `${s} L ${body} L ${surface[surface.length - 1].x} 0 Z`;
  }, [surface]);

  const valley = useMemo(() => {
    let m = surface[0];
    for (const p of surface) if (p.y > m.y) m = p;
    return m;
  }, [surface]);

  function easeOut(v: number) {
    return 1 - Math.pow(1 - v, 3);
  }

  const stage =
    t < 0.04 ? "形成" : t < 0.28 ? "100 万年" : t < 0.52 ? "500 万年" : t < 0.76 ? "1000 万年" : "2000 万年";

  function play() {
    animRef.current?.stop();
    setPlaying(true);
    animRef.current = animate(0.02, 1, {
      duration: 7.5,
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

  const anticline = mode === "anticline";

  return (
    <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
      <div className="panel relative overflow-hidden">
        <div className="absolute left-4 top-4 z-10 flex flex-wrap items-center gap-2">
          <StatusChip tone="gold">{stage}</StatusChip>
          <StatusChip tone={t > 0.7 ? (anticline ? "water" : "moss") : "ink"}>
            {anticline ? (t > 0.7 ? "背斜谷" : "背斜山") : t > 0.7 ? "向斜山" : "向斜谷"}
          </StatusChip>
        </div>

        <StrataScene bands={bands} layers={ROCKS} dark showSurface={false}>
          {/* 被剥蚀区（天空覆盖） */}
          <path d={coverPath} fill="url(#skyErosion)" />
          <defs>
            <linearGradient id="skyErosion" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#26241d" />
              <stop offset="1" stopColor="#1f1d17" />
            </linearGradient>
          </defs>

          {/* 现代地表线 */}
          <path
            d={`M ${surface.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" L ")}`}
            fill="none"
            stroke="#99a06e"
            strokeWidth="2.6"
            strokeLinejoin="round"
            opacity="0.95"
          />
          {/* 原始地表面（虚线，示意被剥蚀掉的高度） */}
          <line x1="0" y1={SKY_H} x2={SCENE_W} y2={SKY_H} stroke="#a7a08d" strokeWidth="1.8" strokeDasharray="7 6" opacity={0.45} />

          {/* 风化剥蚀颗粒 */}
          {t > 0.08 && (
            <g>
              {[0.18, 0.34, 0.5, 0.66, 0.82].map((u, i) => {
                const sx = u * SCENE_W;
                const sy = surface[Math.round(u * 96)].y;
                return (
                  <g key={i} opacity={0.55 + 0.2 * Math.sin(i * 2.1)}>
                    <circle cx={sx + 6} cy={sy + 34} r="2.6" fill="#cbc3ad" />
                    <circle cx={sx - 10} cy={sy + 58} r="2" fill="#b6ad95" />
                    <circle cx={sx + 18} cy={sy + 74} r="1.7" fill="#a79d84" />
                  </g>
                );
              })}
            </g>
          )}

          {/* 侵蚀作用箭头 */}
          {t > 0.05 && (
            <g opacity={0.35 + t * 0.55} stroke="#e8c9b4" strokeWidth="2.4">
              {anticline ? (
                <>
                  <g transform={`translate(${SCENE_W * 0.28} ${surface[Math.round(0.28 * 96)].y + 30})`}>
                    <line x1="0" y1="-14" x2="0" y2="12" />
                    <path d="M -6 4 L 0 12 L 6 4" fill="none" />
                  </g>
                  <g transform={`translate(${SCENE_W * 0.72} ${surface[Math.round(0.72 * 96)].y + 30})`}>
                    <line x1="0" y1="-14" x2="0" y2="12" />
                    <path d="M -6 4 L 0 12 L 6 4" fill="none" />
                  </g>
                </>
              ) : (
                <g transform={`translate(${SCENE_W * 0.5} ${surface[48].y - 46})`}>
                  <line x1="0" y1="-12" x2="0" y2="10" />
                  <path d="M -6 2 L 0 10 L 6 2" fill="none" />
                </g>
              )}
            </g>
          )}

          {/* 河流 */}
          {t > 0.55 && anticline && (
            <g>
              <path
                d={`M ${valley.x - 66} ${valley.y + 8} Q ${valley.x} ${valley.y + 6} ${valley.x + 66} ${valley.y + 8}`}
                stroke="#5d8cad"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
                opacity="0.95"
              />
              <path
                d={`M ${valley.x - 66} ${valley.y + 8} Q ${valley.x} ${valley.y + 6} ${valley.x + 66} ${valley.y + 8}`}
                stroke="#a7cfe0"
                strokeWidth="1.6"
                fill="none"
                strokeDasharray="10 9"
                opacity="0.85"
              />
              <text x={valley.x + 82} y={valley.y + 13} fontSize="13" fontWeight="700" fill="#9cc3d6" textAnchor="middle">
                河流
              </text>
            </g>
          )}

          {/* 张力裂隙（背斜顶部早期） */}
          {anticline && t < 0.16 && (
            <g stroke="#e0a875" strokeWidth="2">
              <path d="M 480 16 L 488 28" />
              <path d="M 494 10 L 500 24" />
              <path d="M 508 14 L 513 27" />
              <text x={530} y={26} fontSize="12.5" fontWeight="700" fill="#e0a875">顶部张力 · 易被侵蚀</text>
            </g>
          )}
        </StrataScene>
      </div>

      <div className="panel flex flex-col gap-6 p-6">
        <div>
          <p className="eyebrow mb-2">实验 02 · 长期侵蚀</p>
          <h3 className="text-[19px] font-extrabold">{anticline ? "背斜山会变成背斜谷" : "向斜谷会变成向斜山"}</h3>
          <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">
            推动时间轴，看风化与流水如何改变地表。
          </p>
        </div>

        <Segmented<FoldMode>
          value={mode}
          onChange={(m) => {
            animRef.current?.stop();
            setPlaying(false);
            setMode(m);
            setT(0);
          }}
          options={[
            { value: "anticline", label: "背斜" },
            { value: "syncline", label: "向斜" },
          ]}
        />

        <Slider
          label="地质时间"
          value={t * 100}
          onChange={(v) => {
            animRef.current?.stop();
            setPlaying(false);
            setT(v / 100);
          }}
          markers={[
            { at: 0, label: "形成" },
            { at: 28, label: "100万年" },
            { at: 52, label: "500万年" },
            { at: 76, label: "1000万年" },
            { at: 100, label: "2000万年" },
          ]}
        />

        <div className="flex flex-wrap gap-2.5">
          <button className="btn btn-primary" onClick={play} disabled={playing}>
            <Play className="size-4" /> 开始长期侵蚀
          </button>
          <button className="btn btn-ghost" onClick={reset}>
            <RotateCcw className="size-4" /> 复位
          </button>
        </div>

        {/* 结论 */}
        <div className="rounded-xl border border-line bg-paper-2/60 p-4">
          <p className="t-mono text-[11px] tracking-wider text-ink-faint">发现</p>
          <p className="mt-1 text-[15px] font-bold leading-relaxed">
            {anticline ? (
              <>
                背斜顶部受<span className="text-clay">张力</span>、岩层破碎，被剥蚀成谷地。
              </>
            ) : (
              <>
                向斜核部受<span className="text-moss">挤压</span>、岩层坚硬，残留为相对高耸的 <span className="text-moss">向斜山</span>。
              </>
            )}
          </p>
          <p className="mt-2 flex items-start gap-1.5 text-[12.5px] leading-relaxed text-ink-faint">
            <Waves className="mt-0.5 size-3.5 shrink-0" />
            地貌是内力构造与外力侵蚀长期叠合的结果。
          </p>
        </div>

        <p className="flex items-start gap-1.5 text-[12.5px] leading-relaxed text-ink-faint">
          <ArrowDown className="mt-0.5 size-3.5 shrink-0 text-water" />
          核部比两翼低或高，就分别称背斜谷、向斜山。
        </p>
      </div>
    </div>
  );
}
