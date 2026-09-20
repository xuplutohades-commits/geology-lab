import Link from "next/link";
import { ArrowRight, PencilRuler, SearchCheck, MessageSquareText, Lightbulb } from "lucide-react";
import { HeroSection } from "@/components/home/HeroSection";

const ENTRIES = [
  {
    no: "01",
    href: "/basics",
    title: "地质构造基础",
    en: "FOUNDATIONS",
    desc: "拖动水平挤压力，观察岩层从水平到弯曲的完整过程。",
    color: "#c9a169",
    svg: <FlatStrata />,
  },
  {
    no: "02",
    href: "/fold",
    title: "褶皱实验室",
    en: "FOLD LAB",
    desc: "背斜与向斜、核部新老关系、背斜成谷的2000万年侵蚀实验。",
    color: "#c05b2c",
    svg: <FoldGlyph />,
  },
  {
    no: "03",
    href: "/fault",
    title: "断层实验室",
    en: "FAULT LAB",
    desc: "拉张、挤压、水平错动，亲手制造正断层、逆断层与地垒地堑。",
    color: "#3c6a85",
    svg: <FaultGlyph />,
  },
  {
    no: "04",
    href: "/evolution",
    title: "构造演化与地貌",
    en: "TIME MACHINE",
    desc: "沉积·褶皱·断裂·侵蚀·河流切割，拖动时间轴看地貌如何形成。",
    color: "#65744c",
    svg: <EvolveGlyph />,
  },
  {
    no: "05",
    href: "/application",
    title: "实际应用",
    en: "FIELD TASKS",
    desc: "找水、找油气、修隧道、选坝址——用地质构造知识解决真实问题。",
    color: "#b98a2f",
    svg: <ApplyGlyph />,
  },
  {
    no: "06",
    href: "/quiz",
    title: "判读训练",
    en: "INTERPRET",
    desc: "剖面判读、反直觉题、真实案例，把知识变成判断力。",
    color: "#8d8778",
    svg: <QuizGlyph />,
  },
];

export default function Home() {
  return (
    <>
      <HeroSection />

      {/* 六大实验入口 */}
      <section className="section-pad shell">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-3">六个实验室</p>
            <h2 className="t-h1">这门课，用手做完</h2>
          </div>
          <p className="max-w-sm text-[14px] leading-relaxed text-ink-soft">
            每个实验都遵循同一条路线：<span className="font-bold text-ink">操作 → 观察 → 判断 → 解释 → 总结</span>。
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ENTRIES.map((e) => (
            <Link
              key={e.no}
              href={e.href}
              className="group relative overflow-hidden rounded-2xl border border-line bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgba(36,34,28,0.4)]"
            >
              <div className="flex items-start justify-between">
                <span className="t-mono text-[13px] font-bold" style={{ color: e.color }}>
                  {e.no}
                </span>
                <span className="t-mono text-[10px] tracking-[0.16em] text-ink-faint">{e.en}</span>
              </div>
              <div className="my-5 flex h-28 items-center justify-center rounded-xl bg-paper-2/70 transition-colors duration-300 group-hover:bg-paper-2">
                <div className="w-40 transition-transform duration-500 group-hover:scale-110">{e.svg}</div>
              </div>
              <h3 className="text-[17px] font-extrabold">{e.title}</h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">{e.desc}</p>
              <span
                className="mt-4 inline-flex items-center gap-1 text-[13px] font-bold"
                style={{ color: e.color }}
              >
                进入实验室 <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 教学理念 */}
      <section className="border-y border-line bg-paper-2/50">
        <div className="shell section-pad">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.15fr]">
            <div>
              <p className="eyebrow mb-3">教学理念</p>
              <h2 className="t-h2 leading-snug">
                不是告诉学生结论，
                <br />
                而是让学生自己操作、观察，再得出结论。
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
                一张静态的“背斜示意图”很难留下印象。但当学生亲手把挤压力从 0% 推到 100%，
                看着水平岩层一点点拱起，他记住的不再是一张图，而是一个过程。
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {[
                { icon: <PencilRuler className="size-5" />, k: "操作", d: "拖动滑块，改变力的方向与大小，控制地质过程", c: "text-clay" },
                { icon: <SearchCheck className="size-5" />, k: "观察", d: "记录岩层弯曲方向、新老关系与地貌变化", c: "text-water" },
                { icon: <MessageSquareText className="size-5" />, k: "判断", d: "在关键节点做出选择：这是背斜还是向斜？", c: "text-moss" },
                { icon: <Lightbulb className="size-5" />, k: "总结", d: "把现象归纳为结论：构造—地貌—工程—资源", c: "text-gold" },
              ].map((s, i, arr) => (
                <div key={s.k} className="relative flex items-center gap-4 rounded-xl border border-line bg-card p-4">
                  <span className={`grid size-10 shrink-0 place-items-center rounded-lg bg-paper-2 ${s.c}`}>{s.icon}</span>
                  <div>
                    <p className="text-[15px] font-extrabold">
                      <span className="t-mono mr-2 text-[12px] text-ink-faint">0{i + 1}</span>
                      {s.k}
                    </p>
                    <p className="mt-0.5 text-[13px] text-ink-soft">{s.d}</p>
                  </div>
                  {i < arr.length - 1 && (
                    <ArrowRight className="absolute -right-3 top-1/2 hidden size-4 -translate-y-1/2 text-ink-faint lg:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 分裂提示 */}
      <section className="shell section-pad">
        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/fold" className="group relative overflow-hidden rounded-2xl bg-night p-8 text-chalk transition-transform duration-300 hover:-translate-y-1">
            <p className="t-mono mb-2 text-[11px] tracking-[0.2em] text-clay">02 · 褶皱实验室</p>
            <h3 className="text-[22px] font-extrabold">背斜山，为什么可能变成背斜谷？</h3>
            <p className="mt-2 max-w-sm text-[14px] text-chalk-dim">启动 2000 万年侵蚀时间轴，亲眼看地形反转如何发生。</p>
            <ArrowRight className="mt-5 size-5 text-clay transition-transform duration-300 group-hover:translate-x-1.5" />
          </Link>
          <Link href="/application" className="group relative overflow-hidden rounded-2xl bg-card p-8 transition-transform duration-300 hover:-translate-y-1" style={{ border: "1px solid #dcd5c2" }}>
            <p className="t-mono mb-2 text-[11px] tracking-[0.2em] text-water">05 · 实际应用</p>
            <h3 className="text-[22px] font-extrabold">石油，为什么藏在背斜里？</h3>
            <p className="mt-2 max-w-sm text-[14px] text-ink-soft">选择钻探位置，找到油气藏；再试试向斜、断层，看看会发生什么。</p>
            <ArrowRight className="mt-5 size-5 text-water transition-transform duration-300 group-hover:translate-x-1.5" />
          </Link>
        </div>
      </section>
    </>
  );
}

/* ---- 入口小图（纯 SVG，无交互） ---- */

function FlatStrata() {
  return (
    <svg viewBox="0 0 160 92" className="w-full">
      <g stroke="#8d8778" strokeWidth="1">
        <rect x="10" y="12" width="140" height="13" rx="2" fill="#d5b487" />
        <rect x="10" y="26" width="140" height="13" rx="2" fill="#a6977d" />
        <rect x="10" y="40" width="140" height="13" rx="2" fill="#cfc8b6" />
        <rect x="10" y="54" width="140" height="13" rx="2" fill="#b7a390" />
      </g>
      <line x1="10" y1="62" x2="10" y2="44" stroke="#c05b2c" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M4 48 L10 40 L16 48" fill="none" stroke="#c05b2c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <text x="22" y="56" fontSize="10.5" fontWeight="800" fill="#c05b2c">挤压力</text>
    </svg>
  );
}

function FoldGlyph() {
  return (
    <svg viewBox="0 0 160 92" className="w-full">
      <g stroke="#8d8778" strokeWidth="1">
        <path d="M10 34 Q 45 8 80 34 T 150 34" fill="#d5b487" strokeWidth="1.2" />
        <path d="M10 46 Q 45 20 80 46 T 150 46" fill="#a6977d" strokeWidth="1.2" />
        <path d="M10 58 Q 45 32 80 58 T 150 58" fill="#8a8173" strokeWidth="1.2" />
      </g>
      <circle cx="80" cy="16" r="8" fill="#c9a169" stroke="#fff" strokeWidth="2" />
      <text x="80" y="19.5" textAnchor="middle" fontSize="9" fontWeight="800" fill="#1b1a14">老</text>
    </svg>
  );
}

function FaultGlyph() {
  return (
    <svg viewBox="0 0 160 92" className="w-full">
      <g clipPath="url(#fl)">
        <g stroke="#8d8778" strokeWidth="1">
          <rect x="10" y="8" width="140" height="12" fill="#d5b487" />
          <rect x="10" y="20" width="140" height="12" fill="#a6977d" />
          <rect x="10" y="32" width="140" height="12" fill="#cfc8b6" />
          <rect x="10" y="44" width="140" height="12" fill="#b7a390" />
          <rect x="10" y="56" width="140" height="12" fill="#8a8173" />
        </g>
      </g>
      <g clipPath="url(#fr)">
        <g transform="translate(8 5)" stroke="#8d8778" strokeWidth="1">
          <rect x="10" y="8" width="140" height="12" fill="#d5b487" />
          <rect x="10" y="20" width="140" height="12" fill="#a6977d" />
          <rect x="10" y="32" width="140" height="12" fill="#cfc8b6" />
          <rect x="10" y="44" width="140" height="12" fill="#b7a390" />
          <rect x="10" y="56" width="140" height="12" fill="#8a8173" />
        </g>
      </g>
      <line x1="80" y1="4" x2="60" y2="88" stroke="#c05b2c" strokeWidth="2.6" />
      <defs>
        <clipPath id="fl"><path d="M0 0 L80 0 L60 92 L0 92 Z" /></clipPath>
        <clipPath id="fr"><path d="M80 0 L160 0 L160 92 L60 92 Z" /></clipPath>
      </defs>
    </svg>
  );
}

function EvolveGlyph() {
  return (
    <svg viewBox="0 0 160 92" className="w-full">
      <path d="M14 60 Q40 14 66 60 T118 52 T146 74" fill="none" stroke="#65744c" strokeWidth="2.4" strokeLinecap="round" />
      <g stroke="#8d8778" strokeWidth="1">
        <path d="M14 66 Q40 24 66 66" fill="#d5b487" />
        <path d="M66 66 Q92 24 118 62" fill="#a6977d" />
        <path d="M118 62 Q132 44 146 78" fill="#cfc8b6" />
      </g>
      <path d="M60 82 L100 82" stroke="#3c6a85" strokeWidth="2.4" strokeLinecap="round" strokeDasharray="4 4" />
      <circle cx="60" cy="82" r="3.4" fill="#3c6a85" />
      <circle cx="100" cy="82" r="3.4" fill="#3c6a85" />
    </svg>
  );
}

function ApplyGlyph() {
  return (
    <svg viewBox="0 0 160 92" className="w-full">
      <g stroke="#8d8778" strokeWidth="1">
        <path d="M14 20 Q50 2 90 20 T146 20" fill="#d5b487" />
        <path d="M14 34 Q50 16 90 34 T146 34" fill="#a6977d" />
        <path d="M14 48 Q50 30 90 48 T146 48" fill="#cfc8b6" />
        <path d="M14 62 Q50 44 90 62 T146 62" fill="#b7a390" />
      </g>
      <ellipse cx="90" cy="22" rx="13" ry="8" fill="#b98a2f" opacity="0.92" />
      <ellipse cx="90" cy="33" rx="16" ry="7" fill="#8a6d2f" opacity="0.88" />
      <ellipse cx="90" cy="44" rx="18" ry="6" fill="#3c6a85" opacity="0.75" />
      <line x1="42" y1="10" x2="42" y2="72" stroke="#3c6a85" strokeWidth="2" strokeDasharray="5 4" />
      <path d="M38 70 L42 78 L46 70" fill="none" stroke="#3c6a85" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function QuizGlyph() {
  return (
    <svg viewBox="0 0 160 92" className="w-full">
      <g stroke="#8d8778" strokeWidth="1">
        <path d="M20 22 Q50 34 80 22" fill="none" stroke="#c05b2c" strokeWidth="2" />
        <path d="M20 34 Q50 46 80 34" fill="none" stroke="#c05b2c" strokeWidth="2" />
        <path d="M80 22 Q110 34 140 22" fill="none" stroke="#3c6a85" strokeWidth="2" />
        <path d="M80 34 Q110 46 140 34" fill="none" stroke="#3c6a85" strokeWidth="2" />
        <rect x="14" y="12" width="132" height="44" rx="6" fill="none" stroke="#8d8778" strokeWidth="1.4" strokeDasharray="4 3" />
      </g>
      <g>
        <circle cx="80" cy="52" r="11" fill="#ede8d9" stroke="#c05b2c" strokeWidth="2.4" />
        <text x="80" y="56.5" textAnchor="middle" fontSize="14" fontWeight="800" fill="#c05b2c">?</text>
      </g>
      <line x1="30" y1="72" x2="130" y2="72" stroke="#c9c0a9" strokeWidth="1.6" />
      <circle cx="52" cy="72" r="3.4" fill="#c9c0a9" />
      <circle cx="80" cy="72" r="3.4" fill="#8d8778" />
      <circle cx="108" cy="72" r="3.4" fill="#3c6a85" />
    </svg>
  );
}
