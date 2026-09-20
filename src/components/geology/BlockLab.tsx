"use client";

import { useId, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownToLine, ArrowUpToLine, RotateCcw } from "lucide-react";
import { buildFoldBands } from "@/lib/geology/paths";
import { ROCKS } from "@/lib/geology/palette";
import { BandGroup, SCENE_W, SCENE_H, SKY_H, LAYER_H } from "./StrataScene";
import { StatusChip } from "@/components/ui/Controls";

type State = "flat" | "horst" | "graben";

const BANDS = 7;
const LT = 320, RT = 680, LB = 250, RB = 750;
const LIFT = 54;

const META: Record<State, { name: string; landform: string; example: string; tone: "clay" | "water" | "ink" }> = {
  flat: { name: "水平岩块", landform: "", example: "先让中间的 B 地块动起来：它和两侧 A、C 之间会发生断层。", tone: "ink" },
  horst: { name: "地垒", landform: "断块山", example: "中间地块相对上升 → 两侧断层崖夹峙的块状山地。如华山、泰山、庐山。", tone: "clay" },
  graben: { name: "地堑", landform: "断陷盆地", example: "中间地块相对下沉 → 盆地或河谷。如渭河平原、汾河谷地、东非大裂谷。", tone: "water" },
};

export function BlockLab() {
  const [state, setState] = useState<State>("flat");
  const uid = useId().replace(/[:]/g, "");

  const bands = useMemo(
    () =>
      buildFoldBands({
        width: SCENE_W,
        topY: SKY_H,
        thickness: LAYER_H,
        count: BANDS,
        pressure: 0,
        mode: "anticline",
        amplitude: 0,
        squeeze: 0,
        ripple: 1.4,
      }),
    [],
  );

  const dy = state === "horst" ? -LIFT : state === "graben" ? LIFT : 0;
  const meta = META[state];
  const basementBottom = SKY_H + BANDS * LAYER_H;

  const clips = {
    left: `M 0 0 L ${LT} 0 L ${LB} ${SCENE_H} L 0 ${SCENE_H} Z`,
    center: `M ${LT} 0 L ${RT} 0 L ${RB} ${SCENE_H} L ${LB} ${SCENE_H} Z`,
    right: `M ${RT} 0 L ${SCENE_W} 0 L ${SCENE_W} ${SCENE_H} L ${RB} ${SCENE_H} Z`,
  };

  const surfaceTop = `M 0 ${SKY_H} L ${LT} ${SKY_H} L ${LT} ${SKY_H + dy} L ${RT} ${SKY_H + dy} L ${RT} ${SKY_H} L ${SCENE_W} ${SKY_H}`;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
      <div className="panel relative overflow-hidden">
        <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
          <StatusChip tone={meta.tone}>{meta.name}</StatusChip>
          {state !== "flat" && <StatusChip tone="moss">{meta.landform}</StatusChip>}
        </div>

        <svg viewBox={`0 0 ${SCENE_W} ${SCENE_H}`} className="block h-auto w-full select-none" aria-label="地垒与地堑实验">
          <defs>
            <linearGradient id={`bsky-${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#26241d" />
              <stop offset="1" stopColor="#1b1a14" />
            </linearGradient>
            <clipPath id={`cl-${uid}`}><path d={clips.left} /></clipPath>
            <clipPath id={`cc-${uid}`}><path d={clips.center} /></clipPath>
            <clipPath id={`cr-${uid}`}><path d={clips.right} /></clipPath>
            <pattern id={`bd-${uid}`} width="30" height="24" patternUnits="userSpaceOnUse">
              <circle cx="6" cy="6" r="1.8" fill="#b8b2a2" opacity="0.5" />
              <circle cx="21" cy="14" r="2.2" fill="#b8b2a2" opacity="0.4" />
              <circle cx="12" cy="20" r="1.4" fill="#b8b2a2" opacity="0.5" />
            </pattern>
            <pattern id={`bg-${uid}`} width="26" height="26" patternUnits="userSpaceOnUse">
              <path d="M0 6 Q13 2 26 6 M0 19 Q13 15 26 19" stroke="#c5bfae" strokeWidth="1" fill="none" opacity="0.3" />
            </pattern>
          </defs>

          <rect x="0" y="0" width={SCENE_W} height={SKY_H} fill={`url(#bsky-${uid})`} />

          {/* A 地块 */}
          <g clipPath={`url(#cl-${uid})`}>
            <BandGroup bands={bands} layers={ROCKS} dark dotId={`bd-${uid}`}  />
            <rect x="0" y={basementBottom} width={SCENE_W} height={SCENE_H} fill="#26241d" />
          </g>

          {/* B 地块（可动） */}
          <motion.g
            clipPath={`url(#cc-${uid})`}
            initial={false}
            animate={{ y: dy }}
            transition={{ type: "spring", stiffness: 110, damping: 20 }}
          >
            <BandGroup bands={bands} layers={ROCKS} dark dotId={`bd-${uid}`}  />
            <rect x="0" y={basementBottom} width={SCENE_W} height={SCENE_H} fill="#312d24" />
          </motion.g>

          {/* C 地块 */}
          <g clipPath={`url(#cr-${uid})`}>
            <BandGroup bands={bands} layers={ROCKS} dark dotId={`bd-${uid}`}  />
            <rect x="0" y={basementBottom} width={SCENE_W} height={SCENE_H} fill="#26241d" />
          </g>

          {/* 断层面 */}
          <line x1={LT} y1={0} x2={LB} y2={SCENE_H} stroke="#d9804f" strokeWidth="2.6" />
          <line x1={RT} y1={0} x2={RB} y2={SCENE_H} stroke="#d9804f" strokeWidth="2.6" />
          <line x1={LT} y1={0} x2={LB} y2={SCENE_H} stroke="#1b1a14" strokeWidth="1" strokeDasharray="5 5" opacity="0.5" />
          <line x1={RT} y1={0} x2={RB} y2={SCENE_H} stroke="#1b1a14" strokeWidth="1" strokeDasharray="5 5" opacity="0.5" />

          {/* 相对运动箭头 */}
          {state !== "flat" && (
            <g stroke="#e8c9b4" strokeWidth="2.4" fill="none" opacity="0.9">
              <g transform={`translate(${(LT + LB) / 2 + 20} ${SCENE_H / 2})`}>
                <path d={state === "horst" ? "M 0 18 L 0 -26 M -7 -19 L 0 -26 L 7 -19" : "M 0 -18 L 0 26 M -7 19 L 0 26 L 7 19"} />
              </g>
              <g transform={`translate(${(RT + RB) / 2 - 20} ${SCENE_H / 2})`}>
                <path d={state === "horst" ? "M 0 18 L 0 -26 M -7 -19 L 0 -26 L 7 -19" : "M 0 -18 L 0 26 M -7 19 L 0 26 L 7 19"} />
              </g>
            </g>
          )}

          {/* 地表线 */}
          <path d={surfaceTop} fill="none" stroke="#99a06e" strokeWidth="2.6" strokeLinejoin="round" />

          {/* 地块标签 */}
          {(["A", "B", "C"] as const).map((label, i) => {
            const x = i === 0 ? 150 : i === 1 ? (LT + RT) / 2 : SCENE_W - 150;
            const y = i === 1 ? SKY_H + dy - 14 : SKY_H - 14;
            return (
              <g key={label}>
                <rect x={x - 20} y={y - 20} width="40" height="26" rx="8" fill="none" stroke="#a7a08d" strokeWidth="1.6" />
                <text x={x} y={y - 2} textAnchor="middle" fontSize="17" fontWeight="800" fill="#ede8d9">{label} 地块</text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="panel flex flex-col gap-6 p-6">
        <div>
          <p className="eyebrow mb-2">实验 04 · 地垒与地堑</p>
          <h3 className="text-[19px] font-extrabold">移动地块，观察地貌</h3>
          <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">
            把地壳分成 A、B、C 三个可移动地块。两条正断层之间，中间地块的升降决定构造名称与地貌。
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          <button className="btn btn-primary" onClick={() => setState("horst")}>
            <ArrowUpToLine className="size-4" /> 中间上升
          </button>
          <button className="btn btn-dark" onClick={() => setState("graben")}>
            <ArrowDownToLine className="size-4" /> 中间下降
          </button>
          <button className="btn btn-ghost" onClick={() => setState("flat")}>
            <RotateCcw className="size-4" /> 复位
          </button>
        </div>

        <div className="rounded-xl border border-line bg-paper-2/60 p-4">
          <p className="t-mono text-[11px] tracking-wider text-ink-faint">结果</p>
          <p className="mt-1 text-[17px] font-extrabold text-clay">{meta.name}{state !== "flat" && <> → <span className="text-moss">{meta.landform}</span></>}</p>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">{meta.example}</p>
        </div>

        <ul className="space-y-2.5 text-[14px] leading-relaxed text-ink-soft">
          <li className="flex gap-2.5">
            <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-md bg-paper-2 text-[12px] font-bold text-clay">E</span>
            两侧地块相对上升，中间地块相对下沉 → 地垒（断块山）
          </li>
          <li className="flex gap-2.5">
            <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-md bg-paper-2 text-[12px] font-bold text-water">D</span>
            中间地块相对下沉，两侧地块相对上升 → 地堑（断陷盆地）
          </li>
          <li className="flex gap-2.5">
            <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-md bg-paper-2 text-[12px] font-bold text-moss">K</span>
            关键在“相对”二字：判断升降只看中间与两侧的相对位置。
          </li>
        </ul>
      </div>
    </div>
  );
}
