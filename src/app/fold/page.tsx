import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mountain, ChevronUp, ChevronDown } from "lucide-react";
import { FoldStage } from "./FoldStage";
import { ErosionLab } from "@/components/geology/ErosionLab";
import { StatusChip } from "@/components/ui/Controls";

export const metadata: Metadata = { title: "02 褶皱实验室" };

export default function FoldPage() {
  return (
    <div className="shell section-pad space-y-20">
      <header className="max-w-3xl">
        <p className="eyebrow mb-4">02 · 褶皱实验室</p>
        <h1 className="t-h1">褶皱：把岩层压弯的那一双手</h1>
        <p className="t-lead mt-4">
          褶皱是岩层受水平挤压发生弯曲变形形成的地质构造。
          在这里你拥有两件工具：<b>挤压力</b>与<b>时间</b>。前者制造褶皱，后者把褶皱蚀成山、削成谷。
        </p>
      </header>

      <FoldStage />

      {/* 背斜 / 向斜判读 */}
      <section className="grid gap-8 lg:grid-cols-[1.25fr_1fr]">
        <div className="panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
            <p className="text-[14px] font-extrabold">背斜 vs 向斜 · 岩层新老关系</p>
            <span className="t-mono text-[11px] text-ink-faint">CORE AGE</span>
          </div>
          <FoldCompare />
          <div className="grid grid-cols-2 divide-x divide-line border-t border-line">
            <div className="p-5">
              <p className="flex items-center gap-1.5 text-[14.5px] font-extrabold text-clay">
                <ChevronUp className="size-4" /> 背斜判读
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">
                中间岩层较<span className="font-bold text-clay">老</span>、两翼较新；
                岩层向上弯曲（核部向上拱起）。
              </p>
            </div>
            <div className="p-5">
              <p className="flex items-center gap-1.5 text-[14.5px] font-extrabold text-water">
                <ChevronDown className="size-4" /> 向斜判读
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">
                中间岩层较<span className="font-bold text-water">新</span>、两翼较老；
                岩层向下弯曲（核部向下凹陷）。
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="rounded-2xl border border-line bg-card p-6">
            <p className="t-mono text-[11px] tracking-wider text-ink-faint">判读口诀</p>
            <p className="mt-2 text-[19px] font-extrabold leading-snug">
              「老背新向」——<span className="text-clay">老</span>岩层在
              <span className="text-clay">背</span>斜核部，<span className="text-water">新</span>
              岩层在<span className="text-water">向</span>斜核部。
            </p>
            <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink-soft">
              记住：<b>地表形态不能作为唯一判据</b>（背斜可能已被蚀成谷）；
              最可靠的判据是<b>岩层新老关系</b>。
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-paper-2/60 p-6">
            <p className="t-mono text-[11px] tracking-wider text-ink-faint">怎么做</p>
            <ol className="mt-2 space-y-2 text-[14px] leading-relaxed text-ink-soft">
              <li><b>1.</b> 先看弯曲方向：向上拱起还是向下凹陷</li>
              <li><b>2.</b> 再核对新老：从剖面两侧向中间，岩层变老还是变新</li>
              <li><b>3.</b> 最后看地表形态：结合侵蚀过程综合判断</li>
            </ol>
          </div>
          <div className="rounded-2xl bg-night p-6 text-chalk">
            <p className="flex items-center gap-2 text-[14.5px] font-extrabold">
              <Mountain className="size-4.5 text-clay" /> 现实世界：褶皱山系
            </p>
            <p className="mt-2 text-[13.5px] leading-relaxed text-chalk-dim">
              喜马拉雅、阿尔卑斯等褶皱山系，就是印度板块与亚欧板块、非洲板块与欧亚板块
              持续挤压的“现场证据”——岩层至今仍在增高、仍在变形。
            </p>
          </div>
        </div>
      </section>

      {/* 长期侵蚀 */}
      <section>
        <div className="mb-6">
          <p className="eyebrow mb-2">实验 02 · 长期侵蚀</p>
          <h2 className="t-h2">背斜山 → 背斜谷：地形反转</h2>
          <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-ink-soft">
            构造定型之后，外力作用登场。推动时间轴，风化与流水会重新雕刻地表——
            特别留意芯部岩层被剥蚀后，背斜会变成什么。
          </p>
        </div>
        <ErosionLab />
      </section>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-card p-6">
        <p className="text-[15px] font-bold">已经看懂褶皱？下一站，让岩层断裂。</p>
        <Link href="/fault" className="btn btn-primary">
          进入断层实验室 <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}

/* 背斜 / 向斜 对比图 */
function FoldCompare() {
  return (
    <div className="grid grid-cols-2">
      <div className="border-r border-line/70">
        <div className="flex items-center justify-center gap-1.5 py-2.5">
          <StatusChip tone="clay" size="sm">背斜 · 核老</StatusChip>
        </div>
        <svg viewBox="0 0 260 150" className="w-full">
          <g stroke="#a9a18d" strokeWidth="1">
            <path d="M20 98 Q70 30 130 78 T240 70" fill="#d5b487" strokeWidth="1.2" />
            <path d="M20 110 Q70 42 130 90 T240 82" fill="#a6977d" strokeWidth="1.2" />
            <path d="M20 122 Q70 54 130 102 T240 94" fill="#8a8173" strokeWidth="1.2" />
          </g>
          <circle cx="130" cy="52" r="11" fill="#c9a169" />
          <circle cx="70" cy="84" r="9" fill="#3a352b" opacity="0.45" />
          <circle cx="190" cy="82" r="9" fill="#3a352b" opacity="0.3" />
          <text x="130" y="56" textAnchor="middle" fontSize="11" fontWeight="800" fill="#1b1a14">老</text>
          <text x="70" y="88" textAnchor="middle" fontSize="10" fontWeight="800" fill="#ede8d9">新</text>
          <text x="190" y="86" textAnchor="middle" fontSize="10" fontWeight="800" fill="#ede8d9">新</text>
          <path d="M130 10 L130 36" stroke="#c05b2c" strokeWidth="2" strokeDasharray="3 3" />
          <path d="M126 14 L130 8 L134 14" fill="none" stroke="#c05b2c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div>
        <div className="flex items-center justify-center gap-1.5 py-2.5">
          <StatusChip tone="water" size="sm">向斜 · 核新</StatusChip>
        </div>
        <svg viewBox="0 0 260 150" className="w-full">
          <g stroke="#a9a18d" strokeWidth="1">
            <path d="M20 74 Q70 130 130 88 T240 96" fill="#d5b487" strokeWidth="1.2" />
            <path d="M20 86 Q70 142 130 100 T240 108" fill="#a6977d" strokeWidth="1.2" />
            <path d="M20 98 Q70 154 130 112 T240 120" fill="#8a8173" strokeWidth="1.2" />
          </g>
          <circle cx="130" cy="98" r="11" fill="#a6977d" />
          <circle cx="64" cy="84" r="9" fill="#3a352b" opacity="0.35" />
          <circle cx="196" cy="86" r="9" fill="#3a352b" opacity="0.4" />
          <text x="130" y="102" textAnchor="middle" fontSize="11" fontWeight="800" fill="#1b1a14">新</text>
          <text x="64" y="88" textAnchor="middle" fontSize="10" fontWeight="800" fill="#ede8d9">老</text>
          <text x="196" y="90" textAnchor="middle" fontSize="10" fontWeight="800" fill="#ede8d9">老</text>
          <path d="M130 130 L130 108" stroke="#3c6a85" strokeWidth="2" strokeDasharray="3 3" />
          <path d="M126 112 L130 118 L134 112" fill="none" stroke="#3c6a85" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}
