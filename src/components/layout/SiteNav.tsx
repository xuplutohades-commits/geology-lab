"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "/", label: "首页" },
  { href: "/basics", label: "01 基础", num: "01" },
  { href: "/fold", label: "02 褶皱", num: "02" },
  { href: "/fault", label: "03 断层", num: "03" },
  { href: "/evolution", label: "04 演化", num: "04" },
  { href: "/application", label: "05 应用", num: "05" },
  { href: "/quiz", label: "06 判读", num: "06" },
];

function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path d="M4 22 L10 10 L16 16 L22 6 L28 14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 27 L10 17 L16 21 L22 12 L28 19" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
    </svg>
  );
}

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="shell flex h-16 items-center justify-between gap-4">
        <Link href="/" className="group flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="grid size-9 place-items-center rounded-xl bg-night text-clay transition-transform duration-300 group-hover:scale-105">
            <LogoMark className="size-5 text-clay" />
          </span>
          <span className="leading-tight">
            <span className="block text-[15px] font-extrabold tracking-tight">地质构造实验室</span>
            <span className="t-mono block text-[10px] tracking-[0.18em] text-ink-faint">GEOLOGY LAB · 高中地理</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="主导航">
          {LINKS.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={
                  "relative rounded-lg px-3 py-2 text-[14.5px] font-semibold transition-colors " +
                  (active ? "text-clay" : "text-ink-soft hover:text-ink")
                }
              >
                {l.label}
                {active && (
                  <motion.span
                    layoutId="nav-dot"
                    className="absolute inset-x-3 -bottom-[3px] h-[2.5px] rounded-full bg-clay"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
              </Link>
            );
          })}
          <Link href="/quiz" className="btn btn-dark btn-sm ml-2">
            开始判读训练
          </Link>
        </nav>

        <button
          className="grid size-10 place-items-center rounded-lg text-ink-soft transition-colors hover:bg-paper-2 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "关闭菜单" : "打开菜单"}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="overflow-hidden border-t border-line bg-paper lg:hidden"
            aria-label="移动端导航"
          >
            <div className="shell flex flex-col gap-1 py-3">
              {LINKS.map((l) => {
                const active = pathname === l.href;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={
                      "flex items-center justify-between rounded-lg px-3 py-3 text-[15px] font-semibold " +
                      (active ? "bg-paper-2 text-clay" : "text-ink-soft")
                    }
                  >
                    {l.label}
                    <span className="t-mono text-xs text-ink-faint">{l.num}</span>
                  </Link>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
