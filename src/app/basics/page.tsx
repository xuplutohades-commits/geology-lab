import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Layers, Activity, MoveDownRight, GitFork } from "lucide-react";
import { FoldSimulator } from "@/components/geology/FoldSimulator";
import { ROCKS } from "@/lib/geology/palette";

export const metadata: Metadata = { title: "01 地质构造基础" };

const CHAIN = [
  { icon: <Layers className="size-5" />, t: "水平岩层", d: "沉积岩在水平状态下逐层堆积，新在上、老在下。", c: "text-sand" },
  { icon: <Activity className="size-5" />, t: "内力受力", d: "地壳运动产生的挤压力、拉张力持续作用。", c: "text-clay" },
  { icon: <MoveDownRight className="size-5" />, t: "岩层变形", d: "超过弹性极限后，岩层弯曲或断裂。", c: "text-water" },
  { icon: <GitFork className="size-5" />, t: "地质构造", d: "褶皱、断层——岩层变形的“定格照片”。", c: "text-moss" },
];

export default function BasicsPage() {
  return (
    <div className="shell section-pad space-y-16">
      {/* 页头 */}
      <header className="max-w-3xl">
        <p className="eyebrow mb-4">01 · 地质构造基础</p>
        <h1 className="t-h1">岩层 → 受力 → 变形 → 地质构造</h1>
        <p className="t-lead mt-4">
          这一页只用一条逻辑链：水平岩层在什么条件下变成褶皱？拖动滑块，把“书页一样的岩层”，
          亲手压成一座褶皱。
        </p>
      </header>

      {/* 概念链路 */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {CHAIN.map((c, i) => (
          <div key={c.t} className="relative rounded-2xl border border-line bg-card p-5">
            <span className="t-mono text-[11px] font-bold text-ink-faint">{String(i + 1).padStart(2, "0")}</span>
            <span className={`mt-2 grid size-9 place-items-center rounded-lg bg-paper-2 ${c.c}`}>{c.icon}</span>
            <p className="mt-3 text-[15.5px] font-extrabold">{c.t}</p>
            <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">{c.d}</p>
            {i < 3 && (
              <ArrowRight className="absolute -right-3 top-1/2 hidden size-4 -translate-y-1/2 text-ink-faint lg:block" />
            )}
          </div>
        ))}
      </div>

      {/* 核心实验 */}
      <div>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow mb-2">核心实验</p>
            <h2 className="t-h2">水平挤压力实验</h2>
          </div>
          <p className="max-w-md text-[13.5px] leading-relaxed text-ink-soft">
            0%：水平岩层 → 30%：轻微弯曲 → 60%：明显褶皱 → 100%：完整褶皱。
          </p>
        </div>
        <FoldSimulator />
      </div>

      {/* 岩层与地层 */}
      <div className="grid gap-8 lg:grid-cols-[1fr_1.25fr]">
        <div>
          <p className="eyebrow mb-2">岩层与地层</p>
          <h2 className="t-h2">一套 8 层的标准地层剖面</h2>
          <p className="mt-3 text-[14.5px] leading-relaxed text-ink-soft">
            地层是地壳发展历史上形成的成层岩石。每个标准地层单元都有：层理（成层性）、
            走向与倾向、以及新老顺序——通常<span className="font-bold text-ink">越往下越老</span>。
          </p>
          <p className="mt-3 text-[14.5px] leading-relaxed text-ink-soft">
            剖面图中每一层的颜色、颗粒与厚度都代表不同的沉积环境：砂岩来自河流与海滩，
            页岩来自静水湖泊与浅海，石灰岩来自温暖浅海生物堆积……
          </p>
          <Link href="/fold" className="btn btn-dark mt-6">
            继续：做褶皱实验 <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
            <p className="text-[14px] font-extrabold">地层柱状图 · 自新至老</p>
            <span className="t-mono text-[11px] text-ink-faint">AGE 8 → 1</span>
          </div>
          <div className="divide-y divide-line/60">
            {[...ROCKS].reverse().map((r, i) => (
              <div key={r.id} className="flex items-center gap-4 px-5 py-2.5 transition-colors hover:bg-paper-2/50">
                <span
                  className="t-mono grid w-9 shrink-0 place-items-center rounded-md py-1.5 text-[11px] font-bold text-[#3a352b]"
                  style={{ background: r.fill, border: `1px solid ${r.edge}` }}
                >
                  {8 - i}
                </span>
                <span className="w-24 text-[14px] font-bold">{r.name}</span>
                <span className="hidden flex-1 text-[12.5px] text-ink-faint sm:block">{rockNote(r.id)}</span>
                <span className="t-mono ml-auto text-[11px] font-bold text-ink-faint">
                  {i === 0 ? "新" : i === 7 ? "老" : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 小结 */}
      <div className="rounded-2xl border border-line bg-night p-7 text-chalk">
        <p className="eyebrow mb-3">小结</p>
        <p className="text-[16px] leading-relaxed text-chalk">
          地质构造，是<span className="font-bold text-clay">地壳运动</span>引起的岩层
          <span className="font-bold text-clay">变形与变位</span>：连续的弯曲是
          <span className="font-bold text-clay">褶皱</span>，断裂错动是
          <span className="font-bold text-clay">断层</span>。
          它们记录着内力作用的历史，也控制着地貌、水源、矿产与工程的可能。
        </p>
      </div>
    </div>
  );
}

function rockNote(id: string): string {
  const notes: Record<string, string> = {
    sediment: "第四纪松散堆积，出露于地表",
    mudstone: "细粒泥质沉积，颜色偏红褐",
    sandstone: "河流—滨海相碎屑沉积",
    shale: "静水环境页理发育",
    conglomerate: "山前快速堆积的磨圆砾石",
    limestone: "温暖浅海生物化学沉积",
    basalt: "玄武质岩浆喷出冷却的火山岩",
    granite: "侵入岩基底，未见层理",
  };
  return notes[id] ?? "";
}
