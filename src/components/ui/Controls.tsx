"use client";

import type { CSSProperties, ReactNode } from "react";

/* ---------------- 滑块 ---------------- */
export function Slider({
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  label,
  unit = "%",
  dark = false,
  markers,
}: {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (v: number) => void;
  label?: string;
  unit?: string;
  dark?: boolean;
  markers?: { at: number; label: string }[];
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="w-full">
      {(label || true) && (
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <span className={"text-[14px] font-semibold " + (dark ? "text-chalk" : "text-ink-soft")}>{label}</span>
          <span className={"t-mono text-[15px] font-bold " + (dark ? "text-clay" : "text-clay")}>
            {Math.round(value)}
            {unit}
          </span>
        </div>
      )}
      <input
        type="range"
        className={"glide " + (dark ? "dark-track" : "")}
        style={{ "--fill": `${pct}%` } as CSSProperties}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
      />
      {markers && (
        <div className="relative mt-1.5 h-4">
          {markers.map((m, i) => (
            <span
              key={i}
              className={
                "t-mono absolute -translate-x-1/2 text-[10px] " +
                (dark ? "text-chalk-dim" : "text-ink-faint")
              }
              style={{ left: `${m.at}%` }}
            >
              {m.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- 分段选择 ---------------- */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  dark = false,
  className = "",
}: {
  options: { value: T; label: ReactNode; hint?: string }[];
  value: T;
  onChange: (v: T) => void;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={
        "inline-flex flex-wrap gap-1 rounded-xl p-1 " +
        (dark ? "bg-night-3" : "bg-paper-2") +
        " " + className
      }
      role="tablist"
    >
      {options.map((o) => (
        <button
          key={o.value}
          role="tab"
          aria-selected={value === o.value}
          data-active={value === o.value}
          onClick={() => onChange(o.value)}
          className={
            "rounded-lg px-3.5 py-2 text-[14px] font-semibold transition-all " +
            (value === o.value
              ? dark
                ? "bg-clay text-white shadow-md shadow-black/20"
                : "bg-card text-ink shadow-sm"
              : dark
                ? "text-chalk-dim hover:text-chalk"
                : "text-ink-faint hover:text-ink")
          }
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ---------------- 徽记 ---------------- */
export function StatusChip({
  tone = "clay",
  children,
  dark = false,
  size = "md",
}: {
  tone?: "clay" | "moss" | "water" | "gold" | "ink";
  children: ReactNode;
  dark?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const tones: Record<string, string> = {
    clay: "text-clay",
    moss: "text-moss",
    water: "text-water",
    gold: "text-gold",
    ink: dark ? "text-chalk" : "text-ink",
  };
  const pads = size === "sm" ? "px-2.5 py-1 text-[12px]" : size === "lg" ? "px-4 py-2 text-[15px]" : "px-3 py-1.5 text-[13px]";
  return (
    <span
      className={
        "inline-flex items-center gap-1.5 rounded-full font-bold " + pads + " " + tones[tone] + " " +
        (dark ? "bg-night-3" : "bg-paper-2")
      }
    >
      <span className={"size-1.5 rounded-full " + (tone === "water" ? "bg-water" : tone === "moss" ? "bg-moss" : tone === "gold" ? "bg-gold" : tone === "ink" ? (dark ? "bg-chalk" : "bg-ink") : "bg-clay")} />
      {children}
    </span>
  );
}

/* ---------------- 小节标题 ---------------- */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  dark = false,
  center = false,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  dark?: boolean;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className={"t-h2 " + (dark ? "text-chalk" : "text-ink")}>{title}</h2>
      {lead && <p className={"mt-3 " + (dark ? "text-chalk-dim" : "text-ink-soft")} style={{ lineHeight: 1.75 }}>{lead}</p>}
    </div>
  );
}
