"use client";

import { useMemo, useRef, useState } from "react";
import { animate, motion } from "framer-motion";
import { Play, RotateCcw, Layers, MousePointer2 } from "lucide-react";
import { buildFoldBands, type FoldMode } from "@/lib/geology/paths";
import { ROCKS } from "@/lib/geology/palette";
import { StrataScene, SCENE_W, SCENE_H, SKY_H, LAYER_H, AgeRuler } from "./StrataScene";
import { Slider, Segmented, StatusChip } from "@/components/ui/Controls";

const BANDS = 8;

export function foldStateOf(p: number): { status: string; desc: string } {
  if (p < 0.02) return { status: "水平岩层", desc: "尚未受力。" };
  if (p < 0.28) return { status: "轻微弯曲", desc: "岩层开始弯曲。" };
  if (p < 0.58) return { status: "明显褶皱", desc: "弯曲加深，成褶在即。" };
  return { status: "完整褶皱", desc: "岩层发生弯曲变形、没有明显断裂 → 褶皱。" };
}

export function FoldSimulator({
  mode = "anticline",
  onModeChange,
  compact = false,
}: {
  mode?: FoldMode;
  onModeChange?: (m: FoldMode) => void;
  compact?: boolean;
}) {
  const [pressure, setPressure] = useState(0);
  const [showAge, setShowAge] = useState(false);
  const [showForces, setShowForces] = useState(true);
  const [playing, setPlaying] = useState(false);
  const animRef = useRef<ReturnType<typeof animate> | null>(null);

  const bands = useMemo(
    () =>
      buildFoldBands({
        width: SCENE_W,
        topY: SKY_H,
        thickness: LAYER_H,
        count: BANDS,
        pressure,
        mode,
        amplitude: 86,
        squeeze: 0.16,
        ripple: 1.7,
      }),
    [pressure, mode],
  );

  const st = foldStateOf(pressure);
  // 核部（枢纽）位置：中间层岩带的弯曲顶点
  const coreY =
    mode === "anticline"
      ? SKY_H + (BANDS / 2) * LAYER_H - 58 * pressure
      : mode === "syncline"
        ? SKY_H + (BANDS / 2) * LAYER_H + 58 * pressure
        : SKY_H + (BANDS / 2) * LAYER_H;
  const nameY = mode === "anticline" ? Math.min(coreY + 34, 402) : Math.max(18, coreY - 62);

  function startSqueeze() {
    animRef.current?.stop();
    setPlaying(true);
    animRef.current = animate(0, 1, {
      duration: 3.4,
      ease: [0.4, 0, 0.2, 1],
      onUpdate: (v) => setPressure(v),
      onComplete: () => setPlaying(false),
    });
  }

  function reset() {
    animRef.current?.stop();
    setPlaying(false);
    setPressure(0);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
      {/* ---- 剖面 ---- */}
      <div className="panel relative overflow-hidden">
        <div className="absolute left-4 top-4 z-10 flex flex-wrap items-center gap-2">
          <StatusChip tone={pressure > 0.6 ? "clay" : pressure > 0.28 ? "gold" : "ink"}>{st.status}</StatusChip>
        </div>
        <div className="relative">
          <StrataScene bands={bands} layers={ROCKS} dark height={SCENE_H}>
            <AgeRuler dark show={showAge} />

            {/* 挤压力箭头 */}
            {showForces && (
              <g opacity={0.18 + pressure * 0.82}>
                <g transform={`translate(${SCENE_W / 2} 0)`}>
                  <motion.g
                    animate={{ x: [-14, 10, -14] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <g transform={`translate(${-SCENE_W / 2 + 58} ${SKY_H + BANDS * LAYER_H * 0.5})`}>
                      <path d="M-16 0 L10 0 M2 -8 L10 0 L2 8" fill="none" stroke="#e8c9b4" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
                      <text x="-34" y="5" fontSize="15" fill="#e8c9b4" fontWeight="700" textAnchor="middle">挤压力</text>
                    </g>
                    <g transform={`translate(${SCENE_W / 2 - 58} ${SKY_H + BANDS * LAYER_H * 0.5})`}>
                      <path d="M16 0 L-10 0 M-2 -8 L-10 0 L-2 8" fill="none" stroke="#e8c9b4" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
                      <text x="34" y="5" fontSize="15" fill="#e8c9b4" fontWeight="700" textAnchor="middle">挤压力</text>
                    </g>
                  </motion.g>
                </g>
              </g>
            )}

            {/* 构造名称 */}
            {pressure > 0.22 && (
              <g>
                {mode !== "waves" && (
                  <>
                    <line x1={SCENE_W / 2} y1={nameY < coreY ? nameY + 44 : coreY + 12} x2={SCENE_W / 2} y2={nameY < coreY ? coreY - 8 : coreY + 26} stroke="#e8c9b4" strokeWidth="1.6" strokeDasharray="4 4" opacity="0.7" />
                    <rect x={SCENE_W / 2 - 58} y={nameY} width="116" height="30" rx="9" fill="#c05b2c" />
                    <text x={SCENE_W / 2} y={nameY + 20} textAnchor="middle" fontSize="16" fontWeight="800" fill="#fff">
                      {mode === "anticline" ? "背斜" : "向斜"}
                    </text>
                  </>
                )}
              </g>
            )}

            {/* 核部新老标签 */}
            {pressure > 0.35 && showAge && mode !== "waves" && (
              <g opacity="0.94">
                <circle cx={SCENE_W / 2} cy={coreY} r="13" fill={mode === "anticline" ? "#c9a169" : "#a6977d"} stroke="#ede8d9" strokeWidth="1.5" />
                <text x={SCENE_W / 2} y={coreY + 4.5} textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#1b1a14">
                  {mode === "anticline" ? "老" : "新"}
                </text>
              </g>
            )}
          </StrataScene>
        </div>
      </div>

      {/* ---- 控制台 ---- */}
      <div className="panel flex flex-col gap-6 p-6">
        <div>
          <p className="eyebrow mb-2">实验 01 · 水平挤压</p>
          <h3 className="text-[19px] font-extrabold">拖动滑块，挤压岩层</h3>
          <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">
            水平挤压 → 岩层弯曲 → 褶皱。注意弯曲方向与核部新老。
          </p>
        </div>

        {!compact && (
          <Segmented<FoldMode>
            value={mode}
            onChange={(m) => {
              onModeChange?.(m);
              reset();
            }}
            options={[
              { value: "anticline", label: "背斜 ↗", hint: "岩层向上弯曲" },
              { value: "syncline", label: "向斜 ↘", hint: "岩层向下弯曲" },
            ]}
          />
        )}

        <Slider
          label="水平挤压力"
          value={pressure * 100}
          onChange={(v) => {
            animRef.current?.stop();
            setPlaying(false);
            setPressure(v / 100);
          }}
          markers={[
            { at: 0, label: "0%" },
            { at: 30, label: "30%" },
            { at: 60, label: "60%" },
            { at: 100, label: "100%" },
          ]}
        />

        <div className="flex flex-wrap gap-2.5">
          <button className="btn btn-primary" onClick={startSqueeze} disabled={playing}>
            <Play className="size-4" /> 开始挤压
          </button>
          <button className="btn btn-ghost" onClick={reset}>
            <RotateCcw className="size-4" /> 复位
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            className={"btn btn-sm " + (showAge ? "btn-dark" : "btn-ghost")}
            onClick={() => setShowAge((v) => !v)}
          >
            <Layers className="size-4" /> {showAge ? "隐藏岩层年龄" : "显示岩层年龄"}
          </button>
          <button
            className={"btn btn-sm " + (showForces ? "btn-dark" : "btn-ghost")}
            onClick={() => setShowForces((v) => !v)}
          >
            <MousePointer2 className="size-4" /> 受力方向
          </button>
        </div>

        {/* 实时判断 */}
        <div className="rounded-xl border border-line bg-paper-2/60 p-4">
          <p className="t-mono text-[11px] tracking-wider text-ink-faint">当前状态</p>
          <p className="mt-1 text-[17px] font-extrabold text-clay">{st.status}</p>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">{st.desc}</p>
        </div>
      </div>
    </div>
  );
}
