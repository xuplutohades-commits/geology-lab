"use client";

import { useId, type ReactNode } from "react";
import { ROCKS, type Rock } from "@/lib/geology/palette";
import type { Band } from "@/lib/geology/paths";

export const SCENE_W = 1000;
export const SCENE_H = 430;
export const SKY_H = 74;
export const LAYER_H = 42; // 单层厚度

export function bandCountFor(height = SCENE_H) {
  const usable = height - SKY_H - 16;
  return Math.max(3, Math.floor(usable / LAYER_H));
}

/** 岩层带渲染（含纹理），供 StrataScene 默认使用或 fault 场景分组复用 */
export function BandGroup({
  bands,
  layers = ROCKS,
  dark = false,
  dotId,
}: {
  bands: Band[];
  layers?: Rock[];
  dark?: boolean;
  dotId: string;
}) {
  return (
    <g>
      {bands.map((b) => {
        const rock = layers[b.index] ?? ROCKS[b.index % ROCKS.length];
        const fill = dark ? rock.dark : rock.fill;
        const edge = dark ? rock.darkEdge : rock.edge;
        return (
          <g key={b.index}>
            <path d={b.path} fill={fill} stroke={edge} strokeWidth="1.6" strokeLinejoin="round" />
            {rock.dotted && <path d={b.path} fill={`url(#${dotId})`} opacity={dark ? 0.5 : 0.85} />}
            {rock.striated && (
              <path d={b.centerline} fill="none" stroke={edge} strokeWidth="1.1" opacity={dark ? 0.55 : 0.55} strokeDasharray="3.5 3.2" />
            )}
          </g>
        );
      })}
    </g>
  );
}

/**
 * 地质剖面基底：天空 + 分层岩带 + 纹理 + 基线基底。
 * 上层交互（褶皱/断层/地垒）通过 children 叠加；
 * bandOverride 可替换岩带渲染逻辑（如断层分盘裁剪）。
 */
export function StrataScene({
  bands,
  layers = ROCKS,
  dark = false,
  skyH = SKY_H,
  height = SCENE_H,
  width = SCENE_W,
  showSurface = true,
  basement = true,
  bandOverride,
  children,
  className = "",
}: {
  bands: Band[];
  layers?: Rock[];
  dark?: boolean;
  skyH?: number;
  height?: number;
  width?: number;
  showSurface?: boolean;
  basement?: boolean;
  bandOverride?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  const uid = useId().replace(/[:]/g, "");
  const dotId = `dots-${uid}`;
  const grainId = `grain-${uid}`;

  const surfaceY = skyH;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={"block h-auto w-full select-none " + className}
      role="img"
      aria-label="地质剖面图"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id={`sky-${uid}`} x1="0" y1="0" x2="0" y2="1">
          {dark ? (
            <>
              <stop offset="0" stopColor="#26241d" />
              <stop offset="1" stopColor="#1b1a14" />
            </>
          ) : (
            <>
              <stop offset="0" stopColor="#e9e6d8" />
              <stop offset="1" stopColor="#e2ddc9" />
            </>
          )}
        </linearGradient>
        <linearGradient id={`basement-${uid}`} x1="0" y1="0" x2="0" y2="1">
          {dark ? (
            <>
              <stop offset="0" stopColor="#3c372c" />
              <stop offset="1" stopColor="#26241d" />
            </>
          ) : (
            <>
              <stop offset="0" stopColor="#d6cdba" />
              <stop offset="1" stopColor="#c3b8a0" />
            </>
          )}
        </linearGradient>
        {bands.some((b) => layers[b.index]?.dotted) && (
          <pattern id={dotId} width="30" height="24" patternUnits="userSpaceOnUse">
            <circle cx="6" cy="6" r="1.8" fill={dark ? "#b8b2a2" : "#8a8270"} opacity="0.55" />
            <circle cx="21" cy="14" r="2.2" fill={dark ? "#b8b2a2" : "#8a8270"} opacity="0.4" />
            <circle cx="12" cy="20" r="1.4" fill={dark ? "#b8b2a2" : "#8a8270"} opacity="0.5" />
          </pattern>
        )}
        {bands.some((b) => layers[b.index]?.striated) && (
          <pattern id={grainId} width="26" height="26" patternUnits="userSpaceOnUse">
            <path d="M0 6 Q13 2 26 6 M0 19 Q13 15 26 19" stroke={dark ? "#c5bfae" : "#7d7462"} strokeWidth="1" fill="none" opacity="0.3" />
          </pattern>
        )}
      </defs>

      {/* 天空 */}
      <rect x="0" y="0" width={width} height={surfaceY} fill={`url(#sky-${uid})`} />

      {/* 柔性近地表涂层（地表以下浅阴影） */}
      <rect x="0" y={surfaceY} width={width} height="10" fill={dark ? "#00000014" : "#6b5f48"} opacity={dark ? 0.4 : 0.12} />

      {/* 分层岩带 */}
      {bandOverride ? (
        bandOverride
      ) : (
        <BandGroup bands={bands} layers={layers} dark={dark} dotId={dotId} />
      )}

      {/* 基底（非层状深部） */}
      {basement && (
        <g>
          <rect
            x="0"
            y={skyH + bands.length * LAYER_H + 1}
            width={width}
            height={height}
            fill={`url(#basement-${uid})`}
          />
          <path
            d={`M0 ${skyH + bands.length * LAYER_H + 1} Q ${width * 0.3} ${skyH + bands.length * LAYER_H + 3} ${width} ${skyH + bands.length * LAYER_H + 1}`}
            stroke={dark ? "#4a4438" : "#a3947a"}
            strokeWidth="2"
            fill="none"
            opacity="0.8"
          />
        </g>
      )}

      {/* 地表线 */}
      {showSurface && (
        <>
          <line x1="0" y1={surfaceY} x2={width} y2={surfaceY} stroke={dark ? "#6d6857" : "#8d8264"} strokeWidth="2" opacity={0.85} />
          <line x1="0" y1={surfaceY - 0} x2={width} y2={surfaceY} stroke={dark ? "#00000033" : "#ffffff55"} strokeWidth="4" opacity={0.5} />
        </>
      )}

      {children}
    </svg>
  );
}

/** 左侧/右侧的年龄标记（新上老下） */
export function AgeRuler({
  dark = false,
  x = 14,
  yTop = SKY_H + 8,
  yBot = SKY_H + 8 * LAYER_H,
  show = true,
}: {
  dark?: boolean;
  x?: number;
  yTop?: number;
  yBot?: number;
  show?: boolean;
}) {
  if (!show) return null;
  return (
    <g>
      <line x1={x} y1={yTop - 6} x2={x} y2={yBot + 6} stroke={dark ? "#a7a08d" : "#8d8778"} strokeWidth="1.4" strokeDasharray="3 3" />
      <text x={x - 8} y={yTop} textAnchor="end" fontSize="13" fontWeight="700" fill={dark ? "#ede8d9" : "#5c584c"}>
        新
      </text>
      <text x={x - 8} y={yBot + 4} textAnchor="end" fontSize="13" fontWeight="700" fill={dark ? "#ede8d9" : "#5c584c"}>
        老
      </text>
      <path d={`M ${x - 5} ${yTop - 2} L ${x - 1} ${yTop - 6} L ${x + 3} ${yTop - 2}`} fill="none" stroke={dark ? "#ede8d9" : "#5c584c"} strokeWidth="1.4" />
    </g>
  );
}
