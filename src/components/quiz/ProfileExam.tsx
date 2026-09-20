"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ChevronRight, RotateCcw, ScanSearch } from "lucide-react";
import { Segmented, StatusChip } from "@/components/ui/Controls";
import { buildFoldBands } from "@/lib/geology/paths";

type Q = {
  q: string;
  options: string[];
  correct: number;
  explain: string;
};

type Profile = {
  id: string;
  name: string;
  intro: string;
  evidencePrompt: string;
  evidenceOptions: string[];
  evidenceCorrect: number[];
  evidenceExplain: string;
  questions: Q[];
  svg: React.ReactNode;
};

const PROFILES: Profile[] = [
  {
    id: "anticline-valley",
    name: "剖面一",
    intro: "判断构造类型，说明判读依据，再回答新老关系、地貌成因与工程意义。",
    evidencePrompt: "判断背斜的依据是什么？（可多选）",
    evidenceOptions: ["中间岩层较老", "中间岩层较新", "岩层向上弯曲", "岩层向下弯曲", "岩层明显错位", "地表形成山岭", "地表形成谷地"],
    evidenceCorrect: [0, 2, 6],
    evidenceExplain: "核老 + 岩层上弯是最可靠的背斜判据；地表形态只能参考，背斜成谷正是陷阱。",
    questions: [
      { q: "1. 该地质构造属于？", options: ["背斜", "向斜", "地垒", "地堑"], correct: 0, explain: "岩层向上拱起、核老翼新，是典型背斜。" },
      { q: "2. 岩层新老关系正确的是？", options: ["核部老、两翼新", "核部新、两翼老", "上下层序无法判断", "两翼新、核部更新"], correct: 0, explain: "背斜核部是褶皱弯曲最早（最老）的岩层，两翼依次变新。" },
      { q: "3. 当前地表形态属于？", options: ["山岭（背斜山）", "谷地（背斜谷）", "盆地（向斜盆地）", "断块山"], correct: 1, explain: "背斜顶部受张力破碎，遭长期侵蚀后成谷地（背斜谷）。" },
      { q: "4. 该地貌的形成过程是？", options: ["沉积→挤压成褶→顶部侵蚀成谷", "沉积→拉张→断裂下陷", "沉积→挤压→核部熔蚀", "火山喷发→冷凝→侵蚀"], correct: 0, explain: "先内力成褶，后外力侵蚀：沉积→挤压弯曲→顶部风化侵蚀→谷地。" },
      { q: "5. 此构造的实际意义是？", options: ["利于储油储气", "利于地下水汇集", "坝址优选", "两者都错"], correct: 0, explain: "背斜是储油构造（气上油中水下）；向斜才是储水构造。" },
    ],
    svg: <ProfileFoldSVG />,
  },
  {
    id: "horst",
    name: "剖面二",
    intro: "中间地块与两侧地块之间存在两条断裂面，判断构造与地貌。",
    evidencePrompt: "判断地垒的依据是什么？（可多选）",
    evidenceOptions: ["中间地块相对上升", "两侧地块相对上升", "存在两条断层面", "岩层向上弯曲", "地表形成块状山地", "断层面两侧岩层错位"],
    evidenceCorrect: [0, 2, 4, 5],
    evidenceExplain: "中间地块相对上升，两侧发育断层面并错位，地表形成断块山。",
    questions: [
      { q: "1. 该构造组合属于？", options: ["地垒", "地堑", "逆断层", "背斜"], correct: 0, explain: "两断层之间中间地块上升，为地垒。" },
      { q: "2. 对应的地貌类型是？", options: ["断块山", "断陷盆地", "褶皱山", "冲积平原"], correct: 0, explain: "地垒常发育为断块山（如华山、庐山）。" },
      { q: "3. 若在图中修隧道，应？", options: ["避开断层带，在完整岩体中选择", "沿断层带施工以减少爆破", "必须穿越中间地块核部", "选在盆地中部"], correct: 0, explain: "断层带岩体破碎、富水，工程必须绕避。" },
      { q: "4. 该构造最可能由哪种应力形成？", options: ["水平拉张（张应力）", "水平挤压（压应力）", "重力堆积", "岩浆顶托"], correct: 0, explain: "地垒、地堑由拉张应力下的一系列正断层组合而成。" },
      { q: "5. 图中能否直接判断岩层新老关系？", options: ["能：核部老", "能：核部新", "不能：断层已把同层错开，需凭层序化石", "不能：岩层都是水平的"], correct: 2, explain: "断层使同一岩层错位，判断新老要靠原始层序与化石，不能只看位置。" },
    ],
    svg: <ProfileHorstSVG />,
  },
];

function ProfileFoldSVG() {
  // 试卷式剖面：白底、墨线、岩层纹理 + 图例，不标注任何构造名称与新老关系
  const bands = useMemo(
    () =>
      buildFoldBands({
        width: 560,
        topY: 84,
        thickness: 30,
        count: 6,
        pressure: 1,
        mode: "anticline",
        amplitude: 56,
        squeeze: 0.16,
        ripple: 1.0,
      }),
    [],
  );
  const fills = ["#d9d2c2", "#ccc1a8", "#c6b99e", "#d6d0bf", "#c0b195", "#d2c3a7"];
  const edge = "#7c7463";
  const ink = "#3d3a32";
  // 岩性映射：0、3＝石灰岩(点状)，1、4＝页岩(细横纹)，2、5＝砂岩(斜纹)
  const texture = [0, 1, 2, 0, 1, 2];

  // 侵蚀地形线：两翼残留高、核部被切出河谷
  const terr: string[] = ["M 0 80"];
  for (let i = 1; i <= 32; i++) {
    const u = i / 32;
    const x = u * 560;
    const arch = Math.pow(Math.sin(Math.PI * u), 2);
    const topEdge = 84 - 56 * arch;
    const y = topEdge + 118 * arch + 6;
    terr.push(`L ${x.toFixed(1)} ${y.toFixed(1)}`);
  }

  return (
    <svg viewBox="0 0 560 290" className="w-full">
      <defs>
        <pattern id="pf-dots" width="18" height="14" patternUnits="userSpaceOnUse">
          <circle cx="5" cy="5" r="1.6" fill="#7c7463" opacity="0.5" />
          <circle cx="13" cy="11" r="1.3" fill="#7c7463" opacity="0.45" />
        </pattern>
        <pattern id="pf-hatch" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="12" stroke="#7c7463" strokeWidth="1" opacity="0.32" />
        </pattern>
      </defs>
      <rect width="560" height="290" fill="#faf7ee" />
      <rect x="1" y="1" width="558" height="288" fill="none" stroke="#8a8474" strokeWidth="1.5" />
      <text x="18" y="28" fontSize="14.5" fontWeight="800" fill={ink}>图 1　某山区地质剖面示意图</text>
      <text x="540" y="28" fontSize="10.5" fill="#8a8474" textAnchor="end">示意</text>

      {bands.map((b) => {
        const f = fills[b.index];
        const t = texture[b.index];
        return (
          <g key={b.index}>
            <path d={b.path} fill={f} stroke={edge} strokeWidth="1.4" strokeLinejoin="round" />
            {t === 0 && <path d={b.path} fill="url(#pf-dots)" />}
            {t === 2 && <path d={b.path} fill="url(#pf-hatch)" />}
            {/* 层理细纹：中心线 + 一条平行线 */}
            <path id={`pf-cl-${b.index}`} d={b.centerline} fill="none" stroke={edge} strokeWidth="0.9" opacity="0.7" />
            <use href={`#pf-cl-${b.index}`} transform={`translate(0 ${b.index % 2 === 0 ? 8 : -9})`} stroke={edge} strokeWidth="0.8" opacity="0.5" />
            {t === 1 && <use href={`#pf-cl-${b.index}`} transform={`translate(0 ${b.index % 2 === 0 ? -8 : 9})`} stroke={edge} strokeWidth="0.8" opacity="0.5" strokeDasharray="2.5 2.5" />}
          </g>
        );
      })}

      {/* 地形与河流（墨色地形线 + 细蓝河段，均在图内注明） */}
      <path d={terr.join(" ")} fill="none" stroke={ink} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M 236 168 Q 280 165 324 168" fill="none" stroke="#4a7fa5" strokeWidth="1.6" />
      <text x="344" y="172" fontSize="10" fontWeight="700" fill={ink}>河流</text>

      {/* 图例 */}
      <g>
        <rect x="392" y="204" width="150" height="72" rx="4" fill="#ffffff" stroke="#8a8474" strokeWidth="1" />
        <text x="402" y="220" fontSize="10.5" fontWeight="800" fill={ink}>图例</text>
        <rect x="402" y="228" width="14" height="9" fill="#d9d2c2" stroke={edge} strokeWidth="0.8" />
        <path d="M404 231 h2 M408 231 h2 M412 231 h2 M416 231 h2" stroke={edge} strokeWidth="0.7" opacity="0.6" />
        <text x="424" y="236.5" fontSize="10" fill={ink}>石灰岩</text>
        <rect x="402" y="245" width="14" height="9" fill="#ccc1a8" stroke={edge} strokeWidth="0.8" />
        <line x1="403" y1="248" x2="414" y2="248" stroke={edge} strokeWidth="0.7" opacity="0.6" />
        <text x="424" y="253.5" fontSize="10" fill={ink}>页岩</text>
        <rect x="402" y="262" width="14" height="9" fill="#c6b99e" stroke={edge} strokeWidth="0.8" />
        <line x1="404" y1="265" x2="412" y2="266" stroke={edge} strokeWidth="0.7" opacity="0.6" transform="rotate(45 408 265)" />
        <text x="424" y="270.5" fontSize="10" fill={ink}>砂岩</text>
      </g>
    </svg>
  );
}

function ProfileHorstSVG() {
  // 试卷式断块剖面：两盘层理错位、断层面为粗墨线，不标注构造名称
  const ink = "#3d3a32";
  const edge = "#7c7463";
  const fillL = "#efe9da";
  const fillC = "#e6dfc9";
  const fillR = "#efe9da";
  // 断层面：左 (205,88)→(178,288)，右 (355,88)→(382,288)
  return (
    <svg viewBox="0 0 560 290" className="w-full">
      <rect width="560" height="290" fill="#faf7ee" />
      <rect x="1" y="1" width="558" height="288" fill="none" stroke="#8a8474" strokeWidth="1.5" />
      <text x="18" y="28" fontSize="14.5" fontWeight="800" fill={ink}>图 2　某地地质剖面示意图</text>
      <text x="540" y="28" fontSize="10.5" fill="#8a8474" textAnchor="end">示意</text>

      {/* 左地块（下盘） */}
      <polygon points="16,150 196,150 178,288 16,288" fill={fillL} stroke={edge} strokeWidth="1.2" />
      {/* 中心地块（相对上升） */}
      <polygon points="205,88 355,88 382,288 178,288" fill={fillC} stroke={edge} strokeWidth="1.2" />
      {/* 右地块 */}
      <polygon points="364,150 544,150 544,288 382,288" fill={fillR} stroke={edge} strokeWidth="1.2" />

      {/* 层理线：在断层面处错位、中断 */}
      {[186, 222, 256].map((y, i) => (
        <line key={i} x1="20" y1={y} x2={196 - (196 - 178) * ((y - 150) / 138)} y2={y} stroke={edge} strokeWidth="1" opacity="0.75" />
      ))}
      <g stroke={edge} strokeWidth="1" opacity="0.75">
        {[118, 148, 180, 212, 246].map((y) => (
          <line key={y} x1={205 + ((178 - 205) * (y - 88)) / 200} y1={y} x2={355 + ((382 - 355) * (y - 88)) / 200} y2={y} />
        ))}
      </g>
      <g stroke={edge} strokeWidth="1" opacity="0.75">
        {[186, 222, 256].map((y) => (
          <line key={y} x1={364 + ((382 - 364) * (y - 150)) / 138} y1={y} x2={540} y2={y} />
        ))}
      </g>

      {/* 断层面：粗墨线 */}
      <line x1="205" y1="88" x2="178" y2="288" stroke={ink} strokeWidth="2.6" />
      <line x1="355" y1="88" x2="382" y2="288" stroke={ink} strokeWidth="2.6" />

      {/* 地块编号 */}
      {[
        { x: 86, y: 138, c: "A" },
        { x: 280, y: 72, c: "B" },
        { x: 474, y: 138, c: "C" },
      ].map(({ x, y, c }) => (
        <g key={c}>
          <circle cx={x} cy={y - 4} r="9" fill="#ffffff" stroke={ink} strokeWidth="1" />
          <text x={x} y={y - 0.5} textAnchor="middle" fontSize="11" fontWeight="800" fill={ink}>{c}</text>
        </g>
      ))}

      {/* 注记 */}
      <text x="18" y="272" fontSize="10" fill="#8a8474">注：图中粗线为断面线；层理线在断面两侧错位。</text>
    </svg>
  );
}

export function ProfileExam() {
  const [pi, setPi] = useState(0);
  const [qi, setQi] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [evidence, setEvidence] = useState<number[]>([]);
  const [phase, setPhase] = useState<"answer" | "evidence" | "done">("answer");
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const p = PROFILES[pi];
  const q = p.questions[qi];
  const correct = selected === q.correct;
  const evCorrect = p.evidenceCorrect.every((i) => evidence.includes(i)) && evidence.every((i) => p.evidenceCorrect.includes(i));

  function choose(i: number) {
    if (phase !== "answer") return;
    setSelected(i);
    if (qi === 0) {
      setPhase("evidence");
    } else {
      if (i === q.correct) setScore((s) => s + 1);
      setPhase("done");
    }
  }

  function submitEvidence() {
    if (evCorrect) setScore((s) => s + 1);
    setPhase("done");
  }

  function next() {
    if (qi + 1 >= p.questions.length) {
      if (pi + 1 >= PROFILES.length) {
        setFinished(true);
      } else {
        setPi((v) => v + 1);
        setQi(0);
        setSelected(null);
        setEvidence([]);
        setPhase("answer");
      }
    } else {
      setQi((v) => v + 1);
      setSelected(null);
      setEvidence([]);
      setPhase("answer");
    }
  }

  function restart() {
    setPi(0); setQi(0); setSelected(null); setEvidence([]); setPhase("answer"); setScore(0); setFinished(false);
  }

  const total = PROFILES.length * (PROFILES.reduce((n, pr) => n + pr.questions.length, 0));

  return (
    <div className="panel overflow-hidden">
      {/* 进度条 */}
      <div className="flex items-center gap-4 border-b border-line px-6 py-4">
        <Segmented
          value={String(pi)}
          onChange={(v) => { setPi(Number(v)); setQi(0); setSelected(null); setEvidence([]); setPhase("answer"); }}
          options={PROFILES.map((pr, i) => ({ value: String(i), label: pr.name }))}
        />
        <div className="ml-auto hidden items-center gap-2 sm:flex">
          <span className="t-mono text-[12px] font-bold text-ink-faint">得分</span>
          <span className="t-mono text-[17px] font-extrabold text-clay">{score}</span>
          <span className="t-mono text-[12px] text-ink-faint">/ {total}</span>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1.15fr_1fr]">
        {/* 剖面 */}
        <div className="border-b border-line bg-night p-4 lg:border-b-0 lg:border-r">
          <div className="overflow-hidden rounded-xl border border-night-3">
            {p.svg}
          </div>
          <p className="mt-3 px-1 text-[12.5px] leading-relaxed text-chalk-dim">{p.intro}</p>
          <p className="t-mono mt-3 px-1 text-[11px] text-chalk-dim/60">
            剖面 {pi + 1}/{PROFILES.length} · 题目 {qi + 1}/{p.questions.length}
          </p>
        </div>

        {/* 答题区 */}
        <div className="flex flex-col p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={qi + phase}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.22 }}
              className="flex-1"
            >
              {finished ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 py-10 text-center">
                  <ScanSearch className="size-12 text-clay" />
                  <div>
                    <p className="text-[22px] font-extrabold">训练完成</p>
                    <p className="mt-1 text-[14px] text-ink-soft">
                      本组得分 <b className="t-mono text-clay">{score}</b> / {total}
                    </p>
                    <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-ink-faint">
                      先看构造证据，再结合侵蚀历史推断地貌，最后落到资源与工程。
                    </p>
                  </div>
                  <button className="btn btn-primary" onClick={restart}>
                    <RotateCcw className="size-4" /> 重新训练
                  </button>
                </div>
              ) : (
                <>
                  <p className="t-mono text-[11px] tracking-wider text-ink-faint">
                    第 {qi + 1} 题 / 共 {p.questions.length} 题
                  </p>
                  <h3 className="mt-1.5 text-[18px] font-extrabold">{q.q}</h3>

                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {q.options.map((o, i) => (
                      <button
                        key={o}
                        onClick={() => choose(i)}
                        disabled={phase !== "answer"}
                        className={
                          "flex items-center gap-2.5 rounded-xl border px-4 py-3 text-left text-[14px] font-semibold transition-all " +
                          (phase === "done" && i === q.correct
                            ? "border-moss bg-moss/10 text-moss"
                            : phase === "done" && i === selected
                              ? "border-clay bg-clay/10 text-clay"
                              : phase === "answer"
                                ? "border-line bg-card hover:border-line-strong hover:-translate-y-0.5"
                                : "border-line bg-card opacity-50")
                        }
                      >
                        <span className={"t-mono grid size-6 shrink-0 place-items-center rounded-md text-[12px] font-bold " + (phase === "done" && i === q.correct ? "bg-moss text-white" : "bg-paper-2")}>
                          {String.fromCharCode(65 + i)}
                        </span>
                        {o}
                        {phase === "done" && i === q.correct && <Check className="ml-auto size-4" />}
                        {phase === "done" && i === selected && i !== q.correct && <X className="ml-auto size-4" />}
                      </button>
                    ))}
                  </div>

                  {phase === "evidence" && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5 rounded-xl border border-gold/40 bg-paper-2/60 p-4">
                      <p className="flex items-center gap-1.5 text-[14px] font-extrabold text-gold">
                        <ScanSearch className="size-4" /> {p.evidencePrompt}
                      </p>
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        {p.evidenceOptions.map((o, i) => (
                          <button
                            key={o}
                            onClick={() => setEvidence((e) => (e.includes(i) ? e.filter((v) => v !== i) : [...e, i]))}
                            className={
                              "rounded-lg border px-3 py-1.5 text-[13px] font-semibold transition-colors " +
                              (evidence.includes(i) ? "border-clay bg-clay text-white" : "border-line-strong bg-card hover:border-clay")
                            }
                          >
                            {o}
                          </button>
                        ))}
                      </div>
                      <button className="btn btn-primary btn-sm mt-3" onClick={submitEvidence} disabled={evidence.length === 0}>
                        提交判读依据
                      </button>
                    </motion.div>
                  )}

                  {phase === "done" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={"mt-5 rounded-xl border p-4 " + (correct ? "border-moss bg-moss/10" : "border-clay bg-clay/10")}
                    >
                      <p className={"text-[15px] font-extrabold " + (correct ? "text-moss" : "text-clay")}>
                        {correct ? "✓ 判断正确" : "✗ 再想想"}
                      </p>
                      <p className="mt-1 text-[13.5px] leading-relaxed text-ink-soft">{q.explain}</p>
                      {qi === 0 && (
                        <p className={"mt-2 border-t pt-2 text-[12.5px] leading-relaxed " + (evCorrect ? "text-moss" : "text-clay")}>
                          判读依据：{evCorrect ? "全部命中 ✓ " : "还需补充："}
                          <span className="text-ink-soft">{p.evidenceExplain}</span>
                        </p>
                      )}
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {!finished && (
            <div className="mt-6 flex items-center justify-between">
              <StatusChip tone="ink" size="sm">
                得分 {score}
              </StatusChip>
              <button className="btn btn-dark" onClick={next} disabled={phase !== "done"}>
                下一题 <ChevronRight className="size-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
