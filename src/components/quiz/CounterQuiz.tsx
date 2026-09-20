"use client";

import { useEffect, useMemo, useState } from "react";
import { animate, AnimatePresence, motion } from "framer-motion";
import { Check, X, ChevronRight, RotateCcw, Eye, EyeOff } from "lucide-react";
import { buildFoldBands, type FoldMode } from "@/lib/geology/paths";
import { ROCKS } from "@/lib/geology/palette";
import { StatusChip } from "@/components/ui/Controls";

/* ---------- 微型褶皱-侵蚀演示 ---------- */
function MiniErosion({ kind, active }: { kind: "anticline-valley" | "syncline-mountain"; active: boolean }) {
  const [t, setT] = useState(0);
  const mode: FoldMode = kind === "anticline-valley" ? "anticline" : "syncline";

  useEffect(() => {
    if (!active) return;
    const ctl = animate(0, 1, { duration: 1.9, ease: "easeInOut", onUpdate: (v) => setT(v) });
    return () => ctl.stop();
  }, [active, kind]);

  const bands = useMemo(
    () => buildFoldBands({ width: 340, topY: 44, thickness: 22, count: 5, pressure: 0.95, mode, amplitude: 34, squeeze: 0.14, ripple: 1.2 }),
    [mode],
  );

  const surface = useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i <= 64; i++) {
      const u = i / 64;
      const crest = Math.pow(Math.sin(Math.PI * u), 2);
      const topEdge = 44 + (mode === "anticline" ? -crest * 34 * 0.95 : crest * 34 * 0.95);
      const removal = mode === "anticline" ? 0.2 + 0.8 * crest : 0.82 - 0.7 * crest;
      pts.push({ x: u * 340, y: Math.max(8, topEdge + 72 * removal * t) });
    }
    return pts;
  }, [mode, t]);

  const cover = useMemo(() => {
    const s = surface.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" L ");
    return `M 0 0 L 0 ${surface[0].y.toFixed(1)} L ${s} L ${surface[surface.length - 1].x} 0 Z`;
  }, [surface]);

  return (
    <svg viewBox="0 0 340 190" className="w-full">
      <defs>
        <linearGradient id="msky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b2820" /><stop offset="1" stopColor="#1b1a14" />
        </linearGradient>
        <pattern id="mdots" width="24" height="20" patternUnits="userSpaceOnUse">
          <circle cx="5" cy="5" r="1.5" fill="#b8b2a2" opacity="0.4" />
          <circle cx="17" cy="12" r="1.8" fill="#b8b2a2" opacity="0.3" />
        </pattern>
      </defs>
      <rect width="340" height="190" rx="12" fill="url(#msky)" />
      {bands.map((b) => {
        const r = ROCKS[b.index];
        return (
          <g key={b.index}>
            <path d={b.path} fill={r.dark} stroke={r.darkEdge} strokeWidth="1.3" />
            {r.dotted && <path d={b.path} fill="url(#mdots)" opacity="0.6" />}
            {r.striated && <path d={b.centerline} fill="none" stroke={r.darkEdge} strokeWidth="0.9" opacity="0.55" strokeDasharray="3 3" />}
          </g>
        );
      })}
      {t > 0.02 && <path d={cover} fill="#1f1d17" />}
      <path d={`M ${surface.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" L ")}`} fill="none" stroke="#99a06e" strokeWidth="2.2" strokeLinejoin="round"
        style={{ display: t > 0.02 ? "block" : "none" }} />
      {mode === "anticline" && t > 0.5 ? (
        <g>
          <path d={`M 150 108 Q 170 106 190 108`} stroke="#5d8cad" strokeWidth="4" fill="none" strokeLinecap="round" />
          <text x="208" y="112" fontSize="11" fontWeight="800" fill="#9cc3d6">谷</text>
        </g>
      ) : mode === "syncline" && t > 0.5 ? (
        <text x="170" y="26" textAnchor="middle" fontSize="12" fontWeight="800" fill="#e0a875">核部坚硬 → 残留为山</text>
      ) : null}

      {/* 核部标签 */}
      {t > 0.25 && (
        <g>
          <circle cx="170" cy={mode === "anticline" ? Math.max(24, 170 - 90 * t) : Math.min(150, 170 + 40 * t)} r="9" fill={mode === "anticline" ? "#c9a169" : "#a6977d"} />
          <text x="170" y={mode === "anticline" ? Math.max(28, 174 - 90 * t) : Math.min(154, 174 + 40 * t)} textAnchor="middle" fontSize="9" fontWeight="800" fill="#1b1a14">
            {mode === "anticline" ? "老" : "新"}
          </text>
        </g>
      )}
    </svg>
  );
}

/* ---------- 潜伏断层演示 ---------- */
function MiniHiddenFault({ active }: { active: boolean }) {
  const bands = useMemo(
    () => buildFoldBands({ width: 340, topY: 44, thickness: 24, count: 4, pressure: 0, mode: "anticline", amplitude: 0, squeeze: 0, ripple: 1 }),
    [],
  );
  return (
    <svg viewBox="0 0 340 190" className="w-full">
      <defs>
        <linearGradient id="hsky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b2820" /><stop offset="1" stopColor="#1b1a14" />
        </linearGradient>
        <clipPath id="hfl"><path d="M0 0 L150 0 L135 190 L0 190 Z" /></clipPath>
        <clipPath id="hfr"><path d="M150 0 L340 0 L340 190 L135 190 Z" /></clipPath>
      </defs>
      <rect width="340" height="190" rx="12" fill="url(#hsky)" />
      <g clipPath="url(#hfl)">
        {bands.map((b) => { const r = ROCKS[b.index]; return <path key={b.index} d={b.path} fill={r.dark} stroke={r.darkEdge} strokeWidth="1.3" />; })}
      </g>
      <g clipPath="url(#hfr)">
        <g transform="translate(10 0)">
          {bands.map((b) => { const r = ROCKS[b.index]; return <path key={b.index} d={b.path} fill={r.dark} stroke={r.darkEdge} strokeWidth="1.3" />; })}
        </g>
      </g>
      <line x1="150" y1="20" x2="132" y2="190" stroke="#d9804f" strokeWidth="2.4" />
      <line x1="150" y1="20" x2="132" y2="190" stroke="#1b1a14" strokeWidth="1" strokeDasharray="5 5" opacity="0.5" />

      {/* 覆盖层：回答后淡出 */}
      <motion.rect
        y="16"
        width="340"
        height="50"
        fill="#5f5240"
        stroke="#3a352b"
        initial={{ opacity: 1 }}
        animate={{ opacity: active ? 0.12 : 1 }}
        transition={{ duration: 1.4, delay: active ? 0.35 : 0 }}
      />


      {active && (
        <g>
          <text x="236" y="120" fontSize="12" fontWeight="800" fill="#e0a875" opacity="0.9">断层面</text>
          <text x="238" y="140" fontSize="10.5" fontWeight="700" fill="#a7a08d" opacity="0.85">右侧地块已水平错开</text>
        </g>
      )}
    </svg>
  );
}

/* ---------- 题库 ---------- */
const QUES = [
  {
    q: "看到山岭，它就一定是背斜形成的吗？",
    opts: ["一定是", "不一定"],
    correct: 1,
    demo: (active: boolean) => <MiniErosion kind="syncline-mountain" active={active} />,
    conclusion: "山岭也可能由向斜形成：向斜核部受挤压、岩层坚硬，被侵蚀后残留为向斜山。",
  },
  {
    q: "看到谷地，它就一定是向斜吗？",
    opts: ["一定是", "不一定"],
    correct: 1,
    demo: (active: boolean) => <MiniErosion kind="anticline-valley" active={active} />,
    conclusion: "背斜顶部受张力、易被侵蚀，长期剥蚀后成为谷地。判读构造要看新老与弯曲方向，不能只看地形。",
  },
  {
    q: "背斜永远会形成山吗？",
    opts: ["永远会", "不一定"],
    correct: 1,
    demo: (active: boolean) => <MiniErosion kind="anticline-valley" active={active} />,
    conclusion: "不一定。背斜山只是初期形态，长期侵蚀后可能变成背斜谷。",
  },
  {
    q: "向斜永远会形成谷吗？",
    opts: ["永远会", "不一定"],
    correct: 1,
    demo: (active: boolean) => <MiniErosion kind="syncline-mountain" active={active} />,
    conclusion: "不一定。向斜核部岩层坚硬，长期侵蚀后可能残留为向斜山。",
  },
  {
    q: "所有断层在地表都能直接看见吗？",
    opts: ["都能看见", "不一定都能看见"],
    correct: 1,
    demo: (active: boolean) => <MiniHiddenFault active={active} />,
    conclusion: "不一定。断层可能被沉积物、植被或水体覆盖，成为潜伏断层，只有出露地表或错断地貌的才能直接看到。",
  },
];

export function CounterQuiz() {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);

  const q = QUES[i];
  const answered = picked !== null;
  const correct = picked === q.correct;

  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center justify-between border-b border-line px-6 py-4">
        <p className="flex items-center gap-2 text-[14px] font-extrabold">
          <Eye className="size-4 text-gold" /> 反直觉题 · 常见误区纠错
        </p>
        <span className="t-mono text-[12px] font-bold text-ink-faint">{i + 1} / {QUES.length}</span>
      </div>

      <div className="grid gap-0 lg:grid-cols-2">
        <div className="flex flex-col gap-4 border-b border-line p-6 lg:border-b-0 lg:border-r">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <h3 className="text-[19px] font-extrabold leading-snug">{q.q}</h3>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {q.opts.map((o, k) => (
                  <button
                    key={o}
                    onClick={() => answered ? null : setPicked(k)}
                    className={
                      "btn btn-lg " +
                      (answered && k === q.correct ? "btn-primary" : answered && k === picked ? "btn-ghost opacity-60" : "btn-ghost")
                    }
                  >
                    {answered && k === q.correct && <Check className="size-4.5" />}
                    {answered && k === picked && k !== q.correct && <X className="size-4.5 text-clay" />}
                    {o}
                  </button>
                ))}
              </div>

              {answered && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={"mt-5 rounded-xl border p-4 " + (correct ? "border-moss bg-moss/10" : "border-clay bg-clay/10")}
                >
                  <p className={"text-[15px] font-extrabold " + (correct ? "text-moss" : "text-clay")}>
                    {correct ? "✓ 正确！" : "✗ 这是常见误区"}
                  </p>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">{q.conclusion}</p>
                </motion.div>
              )}

              <div className="mt-6 flex items-center justify-between">
                <StatusChip tone="ink" size="sm">{i + 1}/{QUES.length}</StatusChip>
                <button
                  className="btn btn-dark"
                  disabled={!answered}
                  onClick={() => {
                    setPicked(null);
                    if (i + 1 >= QUES.length) { setI(0); setPicked(null); } else setI((v) => v + 1);
                  }}
                >
                  {i + 1 >= QUES.length ? (<><RotateCcw className="size-4" /> 再来一轮</>) : (<>下一题 <ChevronRight className="size-4" /></>)}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 演示区 */}
        <div className="flex flex-col items-center justify-center gap-3 bg-night p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-sm"
            >
              {q.demo(answered)}
            </motion.div>
          </AnimatePresence>
          <p className="flex items-center gap-1.5 text-[12px] text-chalk-dim">
            <EyeOff className="size-3.5" /> 动画演示：{answered ? "结论已揭示" : "回答后播放"}
          </p>
        </div>
      </div>
    </div>
  );
}
