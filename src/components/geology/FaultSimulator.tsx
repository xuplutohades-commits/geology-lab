"use client";

import { useId, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveHorizontal } from "lucide-react";
import { buildFoldBands, faultClipPolygon, faultPlaneX } from "@/lib/geology/paths";
import { ROCKS } from "@/lib/geology/palette";
import { StrataScene, BandGroup, SCENE_W, SCENE_H, SKY_H, LAYER_H } from "./StrataScene";
import { Segmented, StatusChip } from "@/components/ui/Controls";

const BANDS = 8;
const FX = 392;   // 断层出露点
const DIP = 62;   // 倾角
const MAX_D = 40; // 最大位移

type FaultType = "normal" | "reverse" | "strike";

const META: Record<FaultType, { name: string; en: string; desc: string; tone: "clay" | "water" | "gold" }> = {
  normal: { name: "正断层", en: "NORMAL FAULT", desc: "上盘（右）沿断层面相对下滑。常见于地壳拉张区。", tone: "water" },
  reverse: { name: "逆断层", en: "REVERSE FAULT", desc: "上盘（右）沿断层面相对上冲。常见于强烈挤压区。", tone: "clay" },
  strike: { name: "平移断层", en: "STRIKE-SLIP", desc: "两侧地块沿断层面水平错动，岩层发生水平错位。", tone: "gold" },
};

export function FaultSimulator() {
  const [type, setType] = useState<FaultType>("normal");
  const uid = useId().replace(/[:]/g, "");
  const fwId = `fw-${uid}`;
  const hgId = `hg-${uid}`;

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
        ripple: 1.5,
      }),
    [],
  );

  const footwall = faultClipPolygon(FX, SKY_H, SCENE_W, SCENE_H, DIP, "left");
  const hanging = faultClipPolygon(FX, SKY_H, SCENE_W, SCENE_H, DIP, "right");

  const xB = faultPlaneX(FX, SKY_H, SCENE_H, DIP);
  const len = Math.hypot(xB - FX, SCENE_H - SKY_H);
  const ux = (xB - FX) / len;
  const uy = (SCENE_H - SKY_H) / len;

  const disp =
    type === "normal"
      ? { x: ux * MAX_D, y: uy * MAX_D }
      : type === "reverse"
        ? { x: -ux * MAX_D, y: -uy * MAX_D }
        : { x: 34, y: 0 };

  const meta = META[type];
  const strike = type === "strike";
  const basementBottom = SKY_H + BANDS * LAYER_H;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
      <div className="panel relative overflow-hidden">
        <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
          <StatusChip tone={meta.tone}>{meta.name}</StatusChip>
          <span className="t-mono inline-flex items-center rounded-full bg-paper-2 px-3 py-1.5 text-[12px] font-bold text-ink-faint">
            {meta.en}
          </span>
        </div>

        <StrataScene bands={bands} layers={ROCKS} dark basement={false} showSurface={false}
          bandOverride={
            <>
              <defs>
                <clipPath id={fwId}>
                  <path d={footwall} />
                </clipPath>
                <clipPath id={hgId}>
                  <path d={hanging} />
                </clipPath>
                <pattern id={`dots-a-${uid}`} width="30" height="24" patternUnits="userSpaceOnUse">
                  <circle cx="6" cy="6" r="1.8" fill="#b8b2a2" opacity="0.5" />
                  <circle cx="21" cy="14" r="2.2" fill="#b8b2a2" opacity="0.4" />
                  <circle cx="12" cy="20" r="1.4" fill="#b8b2a2" opacity="0.5" />
                </pattern>
                <pattern id={`dots-b-${uid}`} width="30" height="24" patternUnits="userSpaceOnUse">
                  <circle cx="6" cy="6" r="1.8" fill="#b8b2a2" opacity="0.5" />
                  <circle cx="21" cy="14" r="2.2" fill="#b8b2a2" opacity="0.4" />
                  <circle cx="12" cy="20" r="1.4" fill="#b8b2a2" opacity="0.5" />
                </pattern>
                <pattern id={`grain-a-${uid}`} width="26" height="26" patternUnits="userSpaceOnUse">
                  <path d="M0 6 Q13 2 26 6 M0 19 Q13 15 26 19" stroke="#c5bfae" strokeWidth="1" fill="none" opacity="0.3" />
                </pattern>
                <pattern id={`grain-b-${uid}`} width="26" height="26" patternUnits="userSpaceOnUse">
                  <path d="M0 6 Q13 2 26 6 M0 19 Q13 15 26 19" stroke="#c5bfae" strokeWidth="1" fill="none" opacity="0.3" />
                </pattern>
              </defs>
              {/* 下盘（固定） */}
              <g clipPath={`url(#${fwId})`}>
                <BandGroup bands={bands} layers={ROCKS} dark dotId={`dots-a-${uid}`}  />
                <rect x="0" y={basementBottom} width={SCENE_W} height={SCENE_H} fill="#2a2821" />
              </g>
              {/* 上盘（移动） */}
              <g clipPath={`url(#${hgId})`}>
                <motion.g
                  initial={false}
                  animate={{ x: disp.x, y: disp.y }}
                  transition={{ type: "spring", stiffness: 90, damping: 19 }}
                >
                  <BandGroup bands={bands} layers={ROCKS} dark dotId={`dots-b-${uid}`}  />
                  <rect x="0" y={basementBottom} width={SCENE_W} height={SCENE_H} fill="#2e2b23" />
                </motion.g>
              </g>
            </>
          }
        >
          {/* 断层面 */}
          <line
            x1={FX}
            y1={SKY_H}
            x2={xB}
            y2={SCENE_H}
            stroke={strike ? "#c9a169" : "#d9804f"}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line x1={FX} y1={SKY_H} x2={xB} y2={SCENE_H} stroke="#1b1a14" strokeWidth="1.2" strokeDasharray="6 5" opacity="0.55" />

          {/* 上盘/下盘标签 */}
          <text x={FX - 18} y={SKY_H + 74} textAnchor="end" fontSize="15" fontWeight="800" fill="#ede8d9">
            下盘
          </text>
          <text x={xB + 18} y={SCENE_H - 28} fontSize="15" fontWeight="800" fill="#ede8d9">
            上盘
          </text>

          {/* 相对运动箭头 */}
          <motion.g
            animate={{ opacity: 1 }}
            initial={{ opacity: 0.4 }}
            transition={{ duration: 0.5 }}
            stroke="#e8c9b4"
            strokeWidth="2.6"
            fill="none"
          >
            {strike ? (
              <>
                <g transform={`translate(${SCENE_W * 0.72} ${SKY_H + BANDS * LAYER_H * 0.42})`}>
                  <path d="M -14 0 L 12 0 M 4 -7 L 12 0 L 4 7" />
                </g>
                <g transform={`translate(${SCENE_W * 0.2} ${SKY_H + BANDS * LAYER_H * 0.58})`}>
                  <path d="M 14 0 L -12 0 M -4 -7 L -12 0 L -4 7" />
                </g>
              </>
            ) : (
              <g transform={`translate(${FX + 118} ${SKY_H + 26})`}>
                <line x1="0" y1="0" x2="0" y2={type === "normal" ? 40 : -40} />
                <path d={type === "normal" ? "M -7 -6 L 0 -13 L 7 -6" : "M -7 6 L 0 13 L 7 6"} />
              </g>
            )}
          </motion.g>

          {/* 顶端力向示意 */}
          {type !== "strike" && (
            <g stroke="#a7a08d" strokeWidth="2.2" opacity="0.75">
              {type === "normal" ? (
                <>
                  <path d="M 18 26 L 62 26 M 54 20 L 62 26 L 54 32" fill="none" />
                  <path d="M 982 26 L 938 26 M 946 20 L 938 26 L 946 32" fill="none" />
                  <text x={SCENE_W / 2} y={24} textAnchor="middle" fontSize="13" fontWeight="700" fill="#a7a08d">拉张</text>
                </>
              ) : (
                <>
                  <path d="M 18 26 L 62 26 M 26 20 L 18 26 L 26 32" fill="none" />
                  <path d="M 982 26 L 938 26 M 974 20 L 982 26 L 974 32" fill="none" />
                  <text x={SCENE_W / 2} y={24} textAnchor="middle" fontSize="13" fontWeight="700" fill="#a7a08d">挤压</text>
                </>
              )}
            </g>
          )}

        </StrataScene>
      </div>

      <div className="panel flex flex-col gap-6 p-6">
        <div>
          <p className="eyebrow mb-2">实验 03 · 岩层断裂</p>
          <h3 className="text-[19px] font-extrabold">选择一种应力方式</h3>
          <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">
            应力超过岩层强度时发生断裂，岩块沿断层面错动。
          </p>
        </div>

        <Segmented<FaultType>
          value={type}
          onChange={setType}
          options={[
            { value: "normal", label: "拉张 → 正断层" },
            { value: "reverse", label: "挤压 → 逆断层" },
            { value: "strike", label: "水平错动" },
          ]}
        />

        <div className="rounded-xl border border-line bg-paper-2/60 p-4">
          <p className="t-mono text-[11px] tracking-wider text-ink-faint">解释</p>
          <p className="mt-1.5 text-[14.5px] font-semibold leading-relaxed text-ink">
            {meta.desc}
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
            {strike
              ? "走向大致平行于观察面的断层，只能看到左右错开。"
              : type === "normal"
                ? "上盘沿断层面下滑，老岩层相对抬出。"
                : "上盘沿断层面向上推挤，老岩层盖到新岩层上。"}
          </p>
        </div>

        <ul className="space-y-2 text-[13.5px] leading-relaxed text-ink-soft">
          <li className="flex gap-2"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-water" />拉力（张应力）使岩层错断下滑 → 正断层</li>
          <li className="flex gap-2"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-clay" />压力（压应力）使岩层错断上冲 → 逆断层</li>
          <li className="flex gap-2"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" />剪切力使地块水平错开 → 平移断层</li>
        </ul>

        <p className="flex items-start gap-1.5 text-[12.5px] leading-relaxed text-ink-faint">
          <MoveHorizontal className="mt-0.5 size-3.5 shrink-0" />
          断层要素：断层面、上盘、下盘。位移方向决定断层类型。
        </p>
      </div>
    </div>
  );
}
