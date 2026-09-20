import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-night text-chalk">
      <div className="shell flex flex-col gap-6 py-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[15px] font-bold">地质构造实验室</p>
          <p className="mt-1 max-w-md text-[13px] leading-relaxed text-chalk-dim">
            人教版高中地理「地质构造」互动教学。
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-chalk-dim">
          <Link href="/basics" className="hover:text-chalk">基础</Link>
          <Link href="/fold" className="hover:text-chalk">褶皱</Link>
          <Link href="/fault" className="hover:text-chalk">断层</Link>
          <Link href="/evolution" className="hover:text-chalk">演化</Link>
          <Link href="/application" className="hover:text-chalk">应用</Link>
          <Link href="/quiz" className="hover:text-chalk">判读训练</Link>
        </nav>
      </div>
      <div className="border-t border-night-3">
        <div className="shell flex flex-wrap items-center justify-between gap-2 py-3 text-[11px] text-chalk-dim/70">
          <span>面向高中地理课堂 · 地质构造与地貌</span>
          <span className="t-mono">STRATA · FAULT · FOLD · EROSION</span>
        </div>
      </div>
    </footer>
  );
}
