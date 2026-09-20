import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { FaultSimulator } from "@/components/geology/FaultSimulator";
import { BlockLab } from "@/components/geology/BlockLab";

export const metadata = { title: "03 断层实验室" };

const CASES = [
  {
    name: "华山",
    type: "地垒 → 断块山",
    color: "#c05b2c",
    desc: "秦岭北麓中间地块沿断层抬升，两侧相对下降，形成断块山。",
    note: "地垒常形成断块山：华山、泰山、庐山。",
  },
  {
    name: "渭河平原",
    type: "地堑 → 断陷盆地",
    color: "#3c6a85",
    desc: "两侧抬升、中间下沉，渭河沿地堑发育成平原。",
    note: "地堑常形成盆地或谷地：渭河、汾河谷地。",
  },
  {
    name: "东非大裂谷",
    type: "张裂 → 正断层",
    color: "#65744c",
    desc: "地壳拉张、正断层错落下陷，形成绵延数千千米的大裂谷。",
    note: "拉张应力区以正断层、地堑为主。",
  },
];

export default function FaultPage() {
  return (
    <div className="shell section-pad space-y-20">
      <header className="max-w-3xl">
        <p className="eyebrow mb-4">03 · 断层实验室</p>
        <h1 className="t-h1">断层：断裂之后，大地开始错位</h1>
        <p className="t-lead mt-4">
          应力超过岩层强度时岩层断裂，两侧岩块沿断层面错动，形成断层。试试拉张、挤压和水平错动。
        </p>
      </header>

      <section>
        <div className="mb-6">
          <p className="eyebrow mb-2">实验 03 · 岩层断裂</p>
          <h2 className="t-h2">应力方式决定断层类型</h2>
        </div>
        <FaultSimulator />
      </section>

      <section>
        <div className="mb-6">
          <p className="eyebrow mb-2">实验 04 · 地垒与地堑</p>
          <h2 className="t-h2">两条断层之间，是抬升还是沉降？</h2>
          <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-ink-soft">
            中间地块相对上升为地垒，相对下沉为地堑。
          </p>
        </div>
        <BlockLab />
      </section>

      {/* 真实案例 */}
      <section>
        <p className="eyebrow mb-2">现实世界</p>
        <h2 className="t-h2 mb-7">课本示意图 → 现实世界</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {CASES.map((c) => (
            <div key={c.name} className="group rounded-2xl border border-line bg-card p-6 transition-transform duration-300 hover:-translate-y-1">
              <p className="flex items-center gap-1.5 text-[13px] font-bold" style={{ color: c.color }}>
                <MapPin className="size-3.5" /> {c.type}
              </p>
              <h3 className="mt-2 text-[21px] font-extrabold">{c.name}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">{c.desc}</p>
              <p className="mt-3 border-t border-line pt-3 text-[12px] leading-relaxed text-ink-faint">{c.note}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-card p-6">
        <p className="text-[15px] font-bold">下一步：构造演化。</p>
        <Link href="/evolution" className="btn btn-primary">
          构造演化时间机器 <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
