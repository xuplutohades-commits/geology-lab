"use client";

import { FoldSimulator } from "@/components/geology/FoldSimulator";

/** 褶皱动态实验区 */
export function FoldStage() {
  return (
    <section>
      <div className="mb-6">
        <p className="eyebrow mb-2">实验 01 · 褶皱动态实验</p>
        <h2 className="t-h2">挤压 · 弯曲 · 成褶</h2>
      </div>
      <FoldSimulator />
    </section>
  );
}
