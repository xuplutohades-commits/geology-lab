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
          沉积到现代地貌需要数千万年。拖动时间轴，看内力和外力作用如何先后塑造地表。
        </p>
      </header>

      <EvolutionLab />

      {/* 内外力对比 */}
      <section className="grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-line bg-card p-7">
          <span className="grid size-11 place-items-center rounded-xl bg-clay-soft/60 text-clay-deep">
            <Flame className="size-5" />
          </span>
          <h2 className="mt-4 text-[19px] font-extrabold">内力作用</h2>
          <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
            地壳运动、岩浆活动、变质作用。使岩层变形变位，形成褶皱、断层、地垒与地堑。
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-card p-7">
          <span className="grid size-11 place-items-center rounded-xl bg-paper-2 text-water">
            <Droplets className="size-5" />
          </span>
          <h2 className="mt-4 text-[19px] font-extrabold">外力作用</h2>
          <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
            风化、侵蚀、搬运、堆积。削平高地、填平低地，重塑地表形态。
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
          地表形态 = <span className="font-bold text-clay">构造</span> ×{" "}
          <span className="font-bold text-water">侵蚀</span> ×{" "}
          <span className="font-bold text-moss">时间</span>。构造相同，侵蚀程度不同，地貌就不同。
        </p>
        <Link href="/application" className="btn btn-primary mt-6">
          去真实任务里用一用 <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
