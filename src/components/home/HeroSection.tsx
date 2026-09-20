"use client";

import { useEffect, useMemo, useState } from "react";
import { animate, motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buildFoldBands } from "@/lib/geology/paths";
import { ROCKS } from "@/lib/geology/palette";
import { SCENE_W, SCENE_H, SKY_H, LAYER_H } from "@/components/geology/StrataScene";

const BANDS = 8;

export function HeroSection() {
  const [p, setP] = useState(0.62);

  useEffect(() => {
    const ctl = animate(0.45, 0.96, {
      duration: 5.5,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "reverse",
      onUpdate: (v) => setP(Math.round(v * 100) / 100),
    });
    return () => ctl.stop();
  }, []);

  const bands = useMemo(
    () =>
      buildFoldBands({
        width: SCENE_W,
        topY: SKY_H,
        thickness: LAYER_H,
        count: BANDS,
        pressure: p,
        mode: "anticline",
        amplitude: 86,
        squeeze: 0.15,
        ripple: 1.8,
      }),
    [p],
  );

  return (
    <section className="relative overflow-hidden bg-night text-chalk">
      {/* 背景网格 */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(#ffffff22 1px, transparent 1px), linear-gradient(90deg, #ffffff22 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <div className="shell relative grid items-center gap-10 py-14 lg:grid-cols-[1.05fr_1fr] lg:py-20">
        {/* 文案 */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="t-mono mb-5 inline-flex items-center gap-2 rounded-full border border-night-3 bg-night-2 px-3.5 py-1.5 text-[12px] font-semibold tracking-[0.18em] text-clay"
          >
            <span className="size-1.5 animate-pulse rounded-full bg-clay" />
            高中地理 · 内力作用与地表形态
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="t-display"
          >
            地质构造
            <br />
            实验室
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18 }}
            className="mt-5 max-w-md text-[17px] leading-relaxed text-chalk-dim"
          >
            看见岩层如何运动，理解地貌如何形成。不是背结论，而是亲自挤压、拉张、侵蚀、钻探，
            让地层自己说话。
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link href="/fold" className="btn btn-primary btn-lg">
              进入褶皱实验室 <ArrowRight className="size-4.5" />
            </Link>
            <Link href="/quiz" className="btn btn-dark btn-lg">
              判读训练
            </Link>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 grid max-w-md grid-cols-3 gap-4"
          >
            {[
              ["06", "个互动实验"],
              ["08", "层地质剖面"],
              ["2000万年", "演化时间轴"],
            ].map(([v, k]) => (
              <div key={k} className="border-l border-night-3 pl-3">
                <dt className="t-mono text-[22px] font-extrabold text-chalk">{v}</dt>
                <dd className="mt-0.5 text-[12px] text-chalk-dim">{k}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* 动态剖面 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-2xl border border-night-3 bg-night-2 shadow-2xl shadow-black/40">
            <div className="pointer-events-none absolute left-4 top-4 z-10">
              <span className="t-mono rounded-full bg-night-3/90 px-3 py-1.5 text-[11px] font-semibold text-clay">
                LIVE · 水平挤压
              </span>
            </div>
            <svg viewBox={`0 0 ${SCENE_W} ${SCENE_H}`} className="block h-auto w-full">
              <defs>
                <linearGradient id="heroSky" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#2b2820" />
                  <stop offset="1" stopColor="#1b1a14" />
                </linearGradient>
                <pattern id="heroDots" width="30" height="24" patternUnits="userSpaceOnUse">
                  <circle cx="6" cy="6" r="1.8" fill="#b8b2a2" opacity="0.4" />
                  <circle cx="21" cy="14" r="2.2" fill="#b8b2a2" opacity="0.3" />
                  <circle cx="12" cy="20" r="1.4" fill="#b8b2a2" opacity="0.4" />
                </pattern>
              </defs>
              <rect x="0" y="0" width={SCENE_W} height={SKY_H} fill="url(#heroSky)" />
              <rect x="0" y={SKY_H} width={SCENE_W} height="10" fill="#000" opacity="0.35" />
              {bands.map((b) => {
                const rock = ROCKS[b.index];
                return (
                  <g key={b.index}>
                    <path d={b.path} fill={rock.dark} stroke={rock.darkEdge} strokeWidth="1.5" strokeLinejoin="round" />
                    {rock.dotted && <path d={b.path} fill="url(#heroDots)" opacity="0.6" />}
                    {rock.striated && (
                      <path d={b.centerline} fill="none" stroke={rock.darkEdge} strokeWidth="1" opacity="0.55" strokeDasharray="3.2 3" />
                    )}
                  </g>
                );
              })}
              <rect x="0" y={SKY_H + BANDS * LAYER_H} width={SCENE_W} height={SCENE_H} fill="#24221b" />
              <line x1="0" y1={SKY_H} x2={SCENE_W} y2={SKY_H} stroke="#6d6857" strokeWidth="2" opacity="0.7" />

              {/* 挤压箭头（循环） */}
              <motion.g
                animate={{ scaleX: [1, 1.18, 1] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                style={{ originX: 0.5, originY: 0.5 }}
              >
                <g transform={`translate(72 ${SKY_H + (BANDS * LAYER_H) / 2})`} stroke="#e8c9b4" strokeWidth="3.2" fill="none" strokeLinecap="round">
                  <path d="M -18 0 L 14 0 M 4 -9 L 14 0 L 4 9" />
                </g>
                <g transform={`translate(${SCENE_W - 72} ${SKY_H + (BANDS * LAYER_H) / 2})`} stroke="#e8c9b4" strokeWidth="3.2" fill="none" strokeLinecap="round">
                  <path d="M 18 0 L -14 0 M -4 -9 L -14 0 L -4 9" />
                </g>
              </motion.g>

              {/* 标注 */}
              <g>
                <rect x={SCENE_W / 2 - 52} y={SKY_H + 26} width="104" height="30" rx="9" fill="#c05b2c" />
                <text x={SCENE_W / 2} y={SKY_H + 46} textAnchor="middle" fontSize="16" fontWeight="800" fill="#fff">
                  背斜
                </text>
              </g>
            </svg>

            {/* 悬浮颗粒（地表风化） */}
            {[
              [12, 64], [30, 30], [74, 52], [88, 18], [55, 70],
            ].map(([x, d], i) => (
              <motion.span
                key={i}
                className="pointer-events-none absolute size-1.5 rounded-full bg-clay/70"
                style={{ left: `${x}%` }}
                animate={{ y: [0, d, 0], opacity: [0.2, 0.7, 0.2] }}
                transition={{ duration: 6 + i * 0.7, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
              />
            ))}
          </div>

          <div className="absolute -bottom-5 -right-4 hidden rounded-xl border border-night-3 bg-night-2 px-4 py-3 text-[12.5px] text-chalk-dim shadow-xl md:block">
            <span className="t-mono font-bold text-clay">↓</span> 挤压持续作用中——拖动滑块可以亲手控制
          </div>
        </motion.div>
      </div>
    </section>
  );
}
