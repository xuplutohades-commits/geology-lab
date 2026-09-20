import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TaskSimulator } from "@/components/geology/TaskSimulator";

export const metadata = { title: "05 地质构造的实际应用" };

export default function ApplicationPage() {
  return (
    <div className="shell section-pad space-y-16">
      <header className="max-w-3xl">
        <p className="eyebrow mb-4">05 · 地质构造的实际应用</p>
        <h1 className="t-h1">把构造知识，变成工程决策</h1>
        <p className="t-lead mt-4">
          向斜找水、背斜找油、隧道避开断层、坝址避开岩溶——地质构造不是试卷上的判断题，
          而是决定一口井、一座城、一条铁路成败的关键信息。
        </p>
      </header>

      <TaskSimulator />

      {/* 规律总结 */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          ["找水", "向斜是储水构造；断层带可能涌出地下水（泉）。", "text-water"],
          ["找油气", "背斜是储油构造——顶部圈闭，气上油中水下。", "text-clay"],
          ["隧道", "优选背斜轴部；向斜易积水，断层带必须避开。", "text-moss"],
          ["坝址", "避开断层与岩溶，选坚硬完整、谷口狭窄的基岩。", "text-gold"],
        ].map(([k, v, c]) => (
          <div key={k} className="rounded-2xl border border-line bg-card p-6">
            <p className={"text-[13px] font-extrabold " + c}>▍{k}</p>
            <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">{v}</p>
          </div>
        ))}
      </section>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-card p-6">
        <p className="text-[15px] font-bold">学完了怎么用，来检验自己会不会“读图”。</p>
        <Link href="/quiz" className="btn btn-primary">
          进入判读训练 <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
