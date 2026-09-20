"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ChevronRight, RotateCcw, ScanSearch } from "lucide-react";
import { Segmented, StatusChip } from "@/components/ui/Controls";

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
    name: "剖面一 · 背斜谷",
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
    name: "剖面二 · 断块山地",
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
  return (
    <svg viewBox="0 0 520 240" className="w-full">
      <rect width="520" height="48" fill="#2b2820" />
      <g stroke="#8d8778" strokeWidth="1">
        <path d="M20 122 Q110 44 200 96 T340 88 T500 108" fill="#6f6555" />
        <path d="M20 138 Q110 60 200 112 T340 104 T500 124" fill="#57524a" />
        <path d="M20 154 Q110 76 200 128 T340 120 T500 140" fill="#6e6253" />
      </g>
      <g>
        <circle cx="260" cy="72" r="11" fill="#c9a169" />
        <text x="260" y="76" textAnchor="middle" fontSize="11" fontWeight="800" fill="#1b1a14">老</text>
      </g>
      <path d="M80 96 Q200 160 320 112" fill="none" stroke="#99a06e" strokeWidth="3" />
      <path d="M196 152 L212 152" stroke="#5d8cad" strokeWidth="4" strokeLinecap="round" />
      <text x="420" y="86" fontSize="13" fontWeight="800" fill="#e0a875">背斜谷</text>
      <text x="420" y="106" fontSize="11.5" fontWeight="700" fill="#a7a08d">核老翼新</text>
      <path d="M40 214 L70 214" stroke="#8d8778" strokeWidth="1.4" strokeDasharray="3 3" />
    </svg>
  );
}

function ProfileHorstSVG() {
  return (
    <svg viewBox="0 0 520 240" className="w-full">
      <rect width="520" height="46" fill="#2b2820" />
      <path d="M0 60 L165 60 L165 16 L355 16 L355 60 L520 60" fill="none" stroke="#99a06e" strokeWidth="2.6" strokeLinejoin="round" />
      <g>
        <rect x="0" y="62" width="165" height="160" fill="#57524a" stroke="#3a352b" />
        <rect x="165" y="18" width="190" height="204" fill="#6f6555" stroke="#3a352b" />
        <rect x="355" y="62" width="165" height="160" fill="#57524a" stroke="#3a352b" />
      </g>
      <g stroke="#3a352b" strokeWidth="1">
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <line x1="0" y1={92 + i * 34} x2="165" y2={92 + i * 34} />
            <line x1="165" y1={48 + i * 34} x2="355" y2={48 + i * 34} />
            <line x1="355" y1={92 + i * 34} x2="520" y2={92 + i * 34} />
          </g>
        ))}
      </g>
      <line x1="165" y1="16" x2="150" y2="236" stroke="#d9804f" strokeWidth="2.2" />
      <line x1="355" y1="16" x2="370" y2="236" stroke="#d9804f" strokeWidth="2.2" />
      <text x="82" y="142" fontSize="13" fontWeight="800" fill="#ede8d9" textAnchor="middle">A</text>
      <text x="260" y={120} fontSize="13" fontWeight="800" fill="#ede8d9" textAnchor="middle">B 地垒 ↑</text>
      <text x="437" y="142" fontSize="13" fontWeight="800" fill="#ede8d9" textAnchor="middle">C</text>
      <text x="260" y="12" fontSize="12.5" fontWeight="800" fill="#e0a875" textAnchor="middle">断块山 · 如华山</text>
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
