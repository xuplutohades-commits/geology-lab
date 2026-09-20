import Link from "next/link";
import { ArrowRight, Flame, Droplets } from "lucide-react";
import { EvolutionLab } from "@/components/geology/EvolutionLab";

export const metadata = { title: "04 构造演化与地貌" };

export default function EvolutionPage() {
  return (
    <div className="shell section-pad space-y-16">
      <header className="max-w-3xl">
        <p className="eyebrow mb-4">04 · 构造演化与地貌</p>
        <h1 className="t-h1">地质时间机器</h1>
        <p className="t-lead mt-4">
          从沉积到现代地貌，往往需要数千万年。拖动时间轴，看内力作用
          （抬升、褶皱、断裂）与外力作用（风化、侵蚀、流水）如何轮番登场，共同完成地貌的最终雕刻。
        </p>
      </header>

      <EvolutionLab />

      {/* 内外力对比 */}
      <section className="grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-line bg-card p-7">
          <span className="grid size-11 place-items-center rounded-xl bg-clay-soft/60 text-clay-deep">
            <Flame className="size-5" />
          </span>
          <h2 className="mt-4 text-[19px] font-extrabold">内力作用：搭骨架</h2>
          <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
            来自地球内部的能量：地壳运动、岩浆活动、变质作用。它使岩层变形变位——
            形成褶皱、断层、地垒地堑，奠定地貌的基本框架（高原、山地、盆地）。
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-card p-7">
          <span className="grid size-11 place-items-center rounded-xl bg-paper-2 text-water">
            <Droplets className="size-5" />
          </span>
          <h2 className="mt-4 text-[19px] font-extrabold">外力作用：做雕刻</h2>
          <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
            来自地球外部的能量：风化、侵蚀、搬运、堆积。它把高地削低、把低地填平，
            在构造骨架上刻出山谷、河流与平原——最终塑造“被侵蚀过的”地表形态。
          </p>
        </div>
      </section>

      {/* 结论带 */}
      <div className="rounded-2xl bg-night p-8 text-chalk">
        <p className="eyebrow mb-3">这一页的答案</p>
        <p className="text-[17px] font-bold leading-relaxed">
          背斜山为什么会变成背斜谷？地垒为什么会成为山、地堑为什么会成为谷？
        </p>
        <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-chalk-dim">
          因为地表形态 = <span className="font-bold text-clay">构造背景</span> ×{" "}
          <span className="font-bold text-water">侵蚀历史</span> ×{" "}
          <span className="font-bold text-moss">时间长度</span>。
          构造相同，侵蚀程度不同，地貌就不同——这就是课本里反复强调的
          「地质构造与地表形态不总是一一对应」。
        </p>
        <Link href="/application" className="btn btn-primary mt-6">
          去真实任务里用一用 <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
