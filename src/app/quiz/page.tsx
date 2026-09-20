import { ProfileExam } from "@/components/quiz/ProfileExam";
import { CounterQuiz } from "@/components/quiz/CounterQuiz";

export const metadata = { title: "06 地质构造判读训练" };

const CASES = [
  {
    name: "华山",
    tag: "地垒 → 断块山",
    desc: "秦岭北麓断块强烈抬升，形成“自古华山一条路”的块状山地。",
    color: "#c05b2c",
  },
  {
    name: "渭河平原",
    tag: "地堑 → 断陷盆地",
    desc: "夹于秦岭与黄土塬之间下沉，渭河蜿蜒其中——教科书级地堑。",
    color: "#3c6a85",
  },
  {
    name: "东非大裂谷",
    tag: "张裂 → 正断层带",
    desc: "地壳拉张、一系列正断层下陷，未来可能裂开成一片新海洋。",
    color: "#65744c",
  },
  {
    name: "喜马拉雅山脉",
    tag: "挤压 → 褶皱山系",
    desc: "印度板块与亚欧板块持续碰撞，岩层至今仍在弯曲抬升。",
    color: "#b98a2f",
  },
];

export default function QuizPage() {
  return (
    <div className="shell section-pad space-y-16">
      <header className="max-w-3xl">
        <p className="eyebrow mb-4">06 · 地质构造判读训练</p>
        <h1 className="t-h1">读图，是地理的基本功</h1>
        <p className="t-lead mt-4">
          先做综合剖面题（没把握就先查判读要点），再挑战反直觉题，最后看看真实世界里的地质构造。
          不是背答案，而是训练“从剖面中找证据”的顺序与方法。
        </p>
      </header>

      {/* 判读要点 */}
      <section className="grid gap-4 md:grid-cols-3">
        {[
          { t: "第一步 · 看变形", d: "岩层是连续弯曲（褶皱）还是断裂错动（断层）？", c: "text-clay" },
          { t: "第二步 · 核对新老", d: "老背新向：核部岩层老→背斜；核部岩层新→向斜。", c: "text-water" },
          { t: "第三步 · 连地貌", d: "结合侵蚀历史解释山/谷，再推断储油储水与工程意义。", c: "text-moss" },
        ].map((s) => (
          <div key={s.t} className="rounded-2xl border border-line bg-card p-6">
            <p className={"text-[14px] font-extrabold " + s.c}>{s.t}</p>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">{s.d}</p>
          </div>
        ))}
      </section>

      {/* 综合题训练 */}
      <section>
        <div className="mb-6">
          <p className="eyebrow mb-2">综合题训练</p>
          <h2 className="t-h2">一份剖面，五道设问</h2>
          <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-ink-soft">
            按考试节奏完成：类型判断 → 判读依据 → 新老关系 → 地貌成因 → 实际意义。每答对一题 +1 分。
          </p>
        </div>
        <ProfileExam />
      </section>

      {/* 反直觉题 */}
      <section>
        <div className="mb-6">
          <p className="eyebrow mb-2">反直觉题</p>
          <h2 className="t-h2">那些一眼看错的结论</h2>
        </div>
        <CounterQuiz />
      </section>

      {/* 真实案例 */}
      <section>
        <p className="eyebrow mb-2">现实世界中的地质构造</p>
        <h2 className="t-h2 mb-7">课本示意图 → 实景地图</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CASES.map((c) => (
            <div key={c.name} className="group rounded-2xl border border-line bg-card p-5 transition-transform duration-300 hover:-translate-y-1">
              <p className="t-mono text-[11px] font-bold" style={{ color: c.color }}>{c.tag}</p>
              <h3 className="mt-1.5 text-[19px] font-extrabold">{c.name}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
