"use client";

import { useState } from "react";
import { FoldSimulator } from "@/components/geology/FoldSimulator";
import { Segmented } from "@/components/ui/Controls";
import type { FoldMode } from "@/lib/geology/paths";

/** 褶皱动态实验区：承载 背斜/向斜 模式状态并与模拟器同步 */
export function FoldStage() {
  const [mode, setMode] = useState<FoldMode>("anticline");
  return (
    <section>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow mb-2">实验 01 · 褶皱动态实验</p>
          <h2 className="t-h2">挤压 · 弯曲 · 成褶</h2>
        </div>
        <Segmented<FoldMode>
          value={mode}
          onChange={setMode}
          options={[
            { value: "anticline", label: "背斜" },
            { value: "syncline", label: "向斜" },
          ]}
        />
      </div>
      <FoldSimulator mode={mode} onModeChange={setMode} />
    </section>
  );
}
