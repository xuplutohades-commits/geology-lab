"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Droplets, Fuel, TrainFront, Landmark, RotateCcw, CheckCircle2, XCircle, Circle,
} from "lucide-react";
import { Segmented, StatusChip } from "@/components/ui/Controls";

type Task = "water" | "oil" | "tunnel" | "dam";

const W = 1000;
const H = 430;
const SKY = 74;

type Probe = {
  id: string;
  x: number;
  y: number;
  label: string;
  ok: boolean | "mid";
  title: string;
  detail: string;
  rows?: { k: string; v: string; good: 0 | 1 | 2 }[];
};

/* ---------------- 找水 ---------------- */
function waterSurface(x: number) {
  // 左向斜（x≈340 谷底）右背斜（x≈740 峰顶）的起伏地面
  return (
    SKY + 46 * Math.pow(Math.sin((Math.PI * (x - 40)) / 640), 2) - 30 * Math.pow(Math.sin((Math.PI * (x - 700)) / 520 + 1.2), 2) * 0.7
  );
}

function WaterScene({ selected }: { selected: string | null }) {
  const probes: Probe[] = [
    { id: "A", x: 350, y: waterSurface(350), label: "向斜轴部", ok: true, title: "地下水富集区", detail: "向斜核部岩层向下弯曲，地下水在此汇集，含水层厚、水量大——是最理想的钻井位置。" },
    { id: "B", x: 740, y: waterSurface(740), label: "背斜顶部", ok: false, title: "地下水向两翼分流", detail: "背斜核部地下水沿岩层向两翼流动，顶部往往缺乏含水层，打井容易落空。" },
    { id: "C", x: 520, y: waterSurface(520), label: "向斜翼部", ok: "mid", title: "水量一般", detail: "翼部含水层较薄，水位较深，水量一般，可作备用井位。" },
    { id: "D", x: 900, y: waterSurface(900), label: "缓坡地带", ok: false, title: "补给有限", detail: "远离向斜汇水中心，地下水补给有限，旱季易断水。" },
  ];

  // 岩层（6 层，跟随地表起伏）
  const layers = Array.from({ length: 6 }, (_, i) => i);
  const rockFill = ["#8d7651", "#6f6555", "#8b867a", "#7f6b53", "#57524a", "#6e6253"];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full select-none">
      <defs>
        <linearGradient id="wsky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b2820" /><stop offset="1" stopColor="#1b1a14" />
        </linearGradient>
        <linearGradient id="wwater" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3c6a85" stopOpacity="0.66" />
          <stop offset="1" stopColor="#335c74" stopOpacity="0.5" />
        </linearGradient>
      </defs>

      <rect width={W} height={SKY} fill="url(#wsky)" />

      {/* 岩层带 */}
      {layers.map((i) => {
        const d: string[] = [`M 0 ${waterSurface(0) + i * 34}`];
        for (let x = 8; x <= W; x += 8) d.push(`L ${x} ${waterSurface(x) + i * 34}`);
        d.push(`L ${W} ${waterSurface(W) + (i + 1) * 34}`);
        for (let x = W - 8; x >= 0; x -= 8) d.push(`L ${x} ${waterSurface(x) + (i + 1) * 34}`);
        d.push("Z");
        return <path key={i} d={d.join(" ")} fill={rockFill[i]} stroke="#3a352b" strokeWidth="1" />;
      })}

      {/* 地下水体（蓝色渗流区） */}
      <path
        d={`M 0 ${waterSurface(0) + 128} L 150 ${waterSurface(150) + 138} L 350 ${waterSurface(350) + 132} L 560 ${waterSurface(560) + 148} L 1000 ${waterSurface(1000) + 128} L 1000 ${H} L 0 ${H} Z`}
        fill="url(#wwater)"
      />
      <path
        d={`M 90 ${waterSurface(90) + 122} Q 350 ${waterSurface(350) + 96} 610 ${waterSurface(610) + 130}`}
        fill="none" stroke="#6c9fc0" strokeWidth="1.8" strokeDasharray="8 7"
      />

      {/* 降水与入渗箭头 */}
      <g stroke="#a7cfe0" strokeWidth="1.8" fill="none" opacity="0.85">
        {[180, 260, 340, 430, 520].map((x, i) => (
          <g key={x}>
            <path d={`M ${x} ${18 + (i % 3) * 7} L ${x} ${44 + (i % 3) * 6}`} strokeDasharray="3 4" />
            <path d={`M ${x - 4} ${40 - (i % 3) * -4} L ${x} ${48 + (i % 3) * 6} L ${x + 4} ${40 - (i % 3) * -4}`} />
          </g>
        ))}
        <text x={310} y={30} stroke="none" fill="#9cc3d6" fontSize="13" fontWeight="700" textAnchor="middle">降水入渗</text>
      </g>

      <g stroke="#6c9fc0" strokeWidth="1.7" fill="none">
        <path d={`M 350 ${waterSurface(350)} Q 360 ${waterSurface(350) + 46} 352 ${waterSurface(350) + 108}`} />
      </g>
      <path d={`M ${355 - 6} ${waterSurface(350) + 100} L ${352 + 4} ${waterSurface(350) + 112} L ${360 - 2} ${waterSurface(350) + 96}`} fill="#6c9fc0" />

      {/* 地表线 */}
      <path
        d={(() => { const d = ["M 0 " + waterSurface(0)]; for (let x = 8; x <= W; x += 8) d.push(`L ${x} ${waterSurface(x)}`); return d.join(" "); })()}
        fill="none" stroke="#99a06e" strokeWidth="2.4" strokeLinejoin="round"
      />

      {/* 探测点 */}
      {probes.map((p) => (
        <g key={p.id} opacity={selected && selected !== p.id ? 0.35 : 1}>
          <circle cx={p.x} cy={p.y + 8} r="15" fill={selected === p.id ? "#c05b2c" : "#1b1a14"} stroke={selected === p.id ? "#e8c9b4" : "#a7a08d"} strokeWidth="1.8" />
          <text x={p.x} y={p.y + 12.5} textAnchor="middle" fontSize="13" fontWeight="800" fill="#ede8d9">{p.id}</text>
        </g>
      ))}

      {/* 已选井位 */}
      {selected && (
        <g>
          <line x1={probes.find((p) => p.id === selected)!.x} y1={probes.find((p) => p.id === selected)!.y} x2={probes.find((p) => p.id === selected)!.x} y2={probes.find((p) => p.id === selected)!.y + 128} stroke="#e8c9b4" strokeWidth="2.4" strokeDasharray="7 6" />
          <circle cx={probes.find((p) => p.id === selected)!.x} cy={probes.find((p) => p.id === selected)!.y + 128} r="4" fill="#e8c9b4" />
        </g>
      )}
    </svg>
  );
}

/* ---------------- 油气 ---------------- */
function OilScene({ selected }: { selected: string | null }) {
  const probes: Probe[] = [
    { id: "A", x: 560, y: 150, label: "背斜核部", ok: true, title: "发现油气藏", detail: "背斜圈闭：天然气（最轻）在上，石油居中，地下水垫底。A 位置打穿盖层即可见丰富的油气聚集。" },
    { id: "B", x: 330, y: 278, label: "向斜核部", ok: false, title: "未发现有效油气聚集", detail: "向斜核部地势低、以水为主：重力分异让油气向高处（背斜）运移，而不是沉在向斜底部。" },
    { id: "C", x: 760, y: 236, label: "背斜陡翼", ok: "mid", title: "见少量油迹", detail: "翼部倾角大，油气沿储层向上运移，只能见到残留的油迹，难以形成可采油气藏。" },
    { id: "D", x: 500, y: 300, label: "油水界面以下", ok: false, title: "含水为主", detail: "钻至油水界面以下，见水不见油——底部是水层，不能出油。" },
  ];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full select-none">
      <defs>
        <linearGradient id="osky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b2820" /><stop offset="1" stopColor="#1b1a14" />
        </linearGradient>
        <linearGradient id="oillens" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b3f4a" /><stop offset="1" stopColor="#2a2d35" />
        </linearGradient>
      </defs>
      <rect width={W} height={SKY} fill="url(#osky)" />

      {/* 背斜岩层 */}
      {Array.from({ length: 6 }, (_, i) => {
        const y0 = 150 + i * 38;
        const amp = 110 - i * 12;
        const d = ["M 0 " + (y0 + amp)];
        for (let x = 10; x <= W; x += 10) {
          const u = x / W;
          d.push(`L ${x} ${y0 + amp * Math.cos(2 * Math.PI * (u - 0.5)) * 0.55 - amp * Math.pow(Math.sin(Math.PI * u), 2)}`);
        }
        d.push(`L ${W} ${y0 + amp + 38}`);
        for (let x = W - 10; x >= 0; x -= 10) {
          const u = x / W;
          d.push(`L ${x} ${y0 + amp * Math.cos(2 * Math.PI * (u - 0.5)) * 0.55 - amp * Math.pow(Math.sin(Math.PI * u), 2) + 38}`);
        }
        d.push("Z");
        const fills = ["#57524a", "#6f6555", "#8b7a5c", "#a0845a", "#8b867a", "#6e6253"];
        return <path key={i} d={d.join(" ")} fill={fills[i]} stroke="#3a352b" strokeWidth="1" />;
      })}

      {/* 背斜圈闭（盖层） */}
      <path d={`M 360 116 Q 560 54 760 116 L 760 146 Q 560 88 360 146 Z`} fill="#45413a" stroke="#2e2b25" strokeWidth="1.4" />

      {/* 油气水次第：只有钻井揭穿背斜核部后才显示 */}
      {selected === "A" && (
        <g>
          <ellipse cx="560" cy="184" rx="120" ry="20" fill="#d9a441" opacity="0.92" />
          <ellipse cx="560" cy="220" rx="150" ry="26" fill="#8a5a24" opacity="0.94" />
          <ellipse cx="560" cy="266" rx="188" ry="30" fill="#3c6a85" opacity="0.72" />
          <g fontSize="12.5" fontWeight="800">
            <text x="560" y="189" textAnchor="middle" fill="#1b1a14">天然气</text>
            <text x="560" y="226" textAnchor="middle" fill="#f0e6cd">石油</text>
            <text x="560" y="271" textAnchor="middle" fill="#cfe2ee">地下水</text>
          </g>
          <g stroke="#d8d1bd" strokeWidth="1.6" fill="none" opacity="0.75">
            <path d="M 692 252 L 680 208" /><path d="M 686 216 L 680 208 L 680 220" />
            <path d="M 428 210 L 440 254" /><path d="M 434 246 L 440 254 L 446 246" />
          </g>
        </g>
      )}

      {/* 探测点 */}
      {probes.map((p) => (
        <g key={p.id} opacity={selected && selected !== p.id ? 0.35 : 1}>
          <circle cx={p.x} cy={p.y} r="15" fill={selected === p.id ? "#c05b2c" : "#1b1a14"} stroke={selected === p.id ? "#e8c9b4" : "#a7a08d"} strokeWidth="1.8" />
          <text x={p.x} y={p.y + 4.5} textAnchor="middle" fontSize="13" fontWeight="800" fill="#ede8d9">{p.id}</text>
        </g>
      ))}

      {/* 钻杆 */}
      {selected && (
        <g>
          <line x1={probes.find((p) => p.id === selected)!.x} y1={SKY - 10} x2={probes.find((p) => p.id === selected)!.x} y2={probes.find((p) => p.id === selected)!.y} stroke="#e8c9b4" strokeWidth="2.6" strokeDasharray="6 5" />
          <text x={probes.find((p) => p.id === selected)!.x} y={SKY - 16} textAnchor="middle" fontSize="12" fontWeight="800" fill="#e8c9b4">钻井</text>
        </g>
      )}
    </svg>
  );
}

/* ---------------- 隧道 ---------------- */
function tunnelSurface(x: number) {
  return SKY - 34 * Math.pow(Math.sin((Math.PI * (x - 160)) / 460), 2) + 62 * Math.pow(Math.sin((Math.PI * (x - 470)) / 320), 2) - 26 * Math.pow(Math.sin((Math.PI * (x - 840)) / 240), 2);
}

function TunnelScene({ selected }: { selected: string | null }) {
  const probes: Probe[] = [
    {
      id: "A", x: 320, y: 250, label: "背斜轴部", ok: true, title: "较理想的隧道位置",
      detail: "背斜呈拱形，围岩向两侧挤压、自稳性好；顶部裂隙虽多但地下水沿翼部排走，施工风险低。",
      rows: [
        { k: "岩层稳定性", v: "拱形结构，自稳性好", good: 2 },
        { k: "地下水", v: "向两翼分流，不易积水", good: 2 },
        { k: "施工风险", v: "需注意顶部张裂隙渗漏", good: 1 },
      ],
    },
    {
      id: "B", x: 560, y: 268, label: "向斜核部", ok: false, title: "水害风险大，应避开",
      detail: "向斜核部是地下水汇集中心，隧道开挖极易遭遇涌水、突泥，且核部岩层受压破碎。",
      rows: [
        { k: "岩层稳定性", v: "核部受压，岩体破碎", good: 0 },
        { k: "地下水", v: "汇水中心，易涌水", good: 0 },
        { k: "施工风险", v: "突水突泥风险高", good: 0 },
      ],
    },
    {
      id: "C", x: 830, y: 250, label: "断层破碎带", ok: false, title: "严禁穿越断层带",
      detail: "断层带岩体破碎、节理发育，隧道穿越时易塌方、错动，且往往是地下水通道。",
      rows: [
        { k: "岩层稳定性", v: "破碎带失稳塌方", good: 0 },
        { k: "地下水", v: "断层富水，涌水风险", good: 0 },
        { k: "施工风险", v: "极高，需绕避或加固", good: 0 },
      ],
    },
    {
      id: "D", x: 930, y: 196, label: "山体东翼浅层", ok: "mid", title: "埋深浅、围岩软",
      detail: "浅埋段围岩强度低，若隧道埋深不足易引起地表沉降；但避开断层带后尚可施工。",
      rows: [
        { k: "岩层稳定性", v: "围岩较软", good: 1 },
        { k: "地下水", v: "水位之上，渗漏小", good: 1 },
        { k: "施工风险", v: "注意浅埋与偏压", good: 1 },
      ],
    },
  ];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full select-none">
      <defs>
        <linearGradient id="tsky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b2820" /><stop offset="1" stopColor="#1b1a14" />
        </linearGradient>
      </defs>
      <rect width={W} height={SKY} fill="url(#tsky)" />

      {/* 山体岩层 */}
      {Array.from({ length: 5 }, (_, i) => {

        const mix = (u: number) => tunnelSurface(u * W) + i * 40;
        const d = ["M 0 " + mix(0)];
        for (let x = 10; x <= W; x += 10) d.push(`L ${x} ${mix(x / W)}`);
        d.push(`L ${W} ${mix(1) + 40}`);
        for (let x = W - 10; x >= 0; x -= 10) d.push(`L ${x} ${mix(x / W) + 40}`);
        d.push("Z");
        const fills = ["#7a6b55", "#6f6555", "#8b867a", "#57524a", "#5d5447"];
        return <path key={i} d={d.join(" ")} fill={fills[i]} stroke="#3a352b" strokeWidth="1" />;
      })}

      {/* 向斜核部积水 */}
      <g opacity="0.5">
        <path d={`M 500 ${tunnelSurface(500) + 72} Q 560 ${tunnelSurface(500) + 118} 620 ${tunnelSurface(620) + 76}`} fill="#3c6a85" stroke="#3c6a85" strokeWidth="1" />
      </g>

      {/* 地表线 + 断层 */}
      <path d={(() => { const d = ["M 0 " + tunnelSurface(0)]; for (let x = 8; x <= W; x += 8) d.push(`L ${x} ${tunnelSurface(x)}`); return d.join(" "); })()} fill="none" stroke="#99a06e" strokeWidth="2.4" strokeLinejoin="round" />
      <line x1={830} y1={tunnelSurface(830)} x2={840} y2={H} stroke="#d9804f" strokeWidth="2.4" />
      <line x1={830} y1={tunnelSurface(830)} x2={840} y2={H} stroke="#1b1a14" strokeWidth="1" strokeDasharray="5 5" opacity="0.5" />
      

      {/* 探测点 */}
      {probes.map((p) => (
        <g key={p.id} opacity={selected && selected !== p.id ? 0.35 : 1}>
          <circle cx={p.x} cy={p.y} r="15" fill={selected === p.id ? "#c05b2c" : "#1b1a14"} stroke={selected === p.id ? "#e8c9b4" : "#a7a08d"} strokeWidth="1.8" />
          <text x={p.x} y={p.y + 4.5} textAnchor="middle" fontSize="13" fontWeight="800" fill="#ede8d9">{p.id}</text>
        </g>
      ))}

      {/* 隧道示意 */}
      {selected && (
        <g>
          <path d={`M ${probes.find((p) => p.id === selected)!.x - 66} ${probes.find((p) => p.id === selected)!.y + 56} L ${probes.find((p) => p.id === selected)!.x + 66} ${probes.find((p) => p.id === selected)!.y + 56}`} stroke="#e8c9b4" strokeWidth="4.5" strokeLinecap="round" strokeDasharray="12 8" />
          <path d={`M ${probes.find((p) => p.id === selected)!.x - 66} ${probes.find((p) => p.id === selected)!.y + 56} L ${probes.find((p) => p.id === selected)!.x + 66} ${probes.find((p) => p.id === selected)!.y + 56}`} stroke="#c05b2c" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="2 10" />
          <text x={probes.find((p) => p.id === selected)!.x} y={probes.find((p) => p.id === selected)!.y + 82} textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#e8c9b4">隧道方案</text>
        </g>
      )}
    </svg>
  );
}

/* ---------------- 坝址 ---------------- */
function DamScene({ selected }: { selected: string | null }) {
  const probes: Probe[] = [
    { id: "甲", x: 350, y: 300, label: "断层带", ok: false, title: "坝基不稳，渗漏严重", detail: "坝址横跨断层：坝基岩体破碎、易发生差异沉降与渗漏，地震时还可能错动。", rows: [{ k: "地基稳定性", v: "破碎，差", good: 0 }, { k: "渗漏风险", v: "高", good: 0 }] },
    { id: "乙", x: 620, y: 300, label: "石灰岩区", ok: "mid", title: "溶蚀渗漏风险", detail: "坝址选在石灰岩上：岩溶发育，水库蓄水后可能沿溶洞渗漏，需做防渗处理。", rows: [{ k: "地基稳定性", v: "较好但岩溶发育", good: 1 }, { k: "渗漏风险", v: "较高", good: 1 }] },
    { id: "丙", x: 830, y: 300, label: "花岗岩谷口", ok: true, title: "理想坝址", detail: "丙处：谷口狭窄、工程量小，坝基为坚硬完整的花岗岩，不透水且稳固，是三个位置中最优选择。", rows: [{ k: "地基稳定性", v: "坚硬完整，优", good: 2 }, { k: "渗漏风险", v: "低", good: 2 }] },
  ];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full select-none">
      <defs>
        <linearGradient id="dsky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b2820" /><stop offset="1" stopColor="#1b1a14" />
        </linearGradient>
      </defs>
      <rect width={W} height={SKY} fill="url(#dsky)" />

      {/* 河谷地形（V 形谷） */}
      <path d={`M 0 ${SKY + 60} L 300 ${SKY + 74} Q 500 300 700 ${SKY + 76} L 1000 ${SKY + 58} L 1000 ${H} L 0 ${H} Z`} fill="#5d5447" />
      <path d={`M 0 ${SKY + 60} L 300 ${SKY + 74} Q 500 300 700 ${SKY + 76} L 1000 ${SKY + 58}`} fill="none" stroke="#99a06e" strokeWidth="2.4" strokeLinejoin="round" />

      {/* 石灰岩区（左岸中段）与花岗岩区（右岸） */}
      <path d={`M 460 210 Q 500 330 540 212`} fill="none" stroke="#a9a18d" strokeWidth="3" strokeDasharray="6 5" />
      
      <path d={`M 760 180 L 920 176`} fill="none" stroke="#8d8778" strokeWidth="3.6" strokeLinecap="round" />
      

      {/* 断层 */}
      <line x1={350} y1={SKY + 70} x2={340} y2={H} stroke="#d9804f" strokeWidth="2.2" />
      <line x1={350} y1={SKY + 70} x2={340} y2={H} stroke="#1b1a14" strokeWidth="1" strokeDasharray="5 5" opacity="0.5" />
      <line x1={740} y1={SKY + 74} x2={748} y2={H} stroke="#d9804f" strokeWidth="2" />

      {/* 河流 */}
      <path d={`M 0 ${SKY + 68} Q 500 320 1000 ${SKY + 52}`} fill="none" stroke="#5d8cad" strokeWidth="7" strokeLinecap="round" />
      <path d={`M 0 ${SKY + 68} Q 500 320 1000 ${SKY + 52}`} fill="none" stroke="#a7cfe0" strokeWidth="2.2" strokeDasharray="10 10" />

      {/* 坝址选项（水面附近） */}
      {probes.map((p) => (
        <g key={p.id} opacity={selected && selected !== p.id ? 0.35 : 1}>
          <circle cx={p.x} cy={p.y - 26} r="16" fill={selected === p.id ? "#c05b2c" : "#1b1a14"} stroke={selected === p.id ? "#e8c9b4" : "#a7a08d"} strokeWidth="1.8" />
          <text x={p.x} y={p.y - 21.5} textAnchor="middle" fontSize="13.5" fontWeight="800" fill="#ede8d9">{p.id}</text>
          <line x1={p.x} y1={p.y - 10} x2={p.x} y2={p.y + 10} stroke="#a7a08d" strokeWidth="1.2" strokeDasharray="3 3" />
        </g>
      ))}

      {/* 大坝示意 */}
      {selected && (
        <g>
          <path d={selected === "甲" ? `M 330 ${SKY + 70} L 370 ${SKY + 70} L 350 ${p300(330)} Z` : selected === "乙" ? `M 600 ${SKY + 74} L 640 ${SKY + 74} L 620 ${p300(600)} Z` : `M 812 ${SKY + 78} L 848 ${SKY + 78} L 830 ${p300(812)} Z`} fill="#c9a169" stroke="#e8c9b4" strokeWidth="1.6" />
          {selected === "丙" && <text x={830} y={SKY + 46} textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#e8c9b4">坝轴线</text>}
        </g>
      )}
    </svg>
  );
}

function p300(x: number) {
  // 河床线近似：Q500 320
  const u = Math.abs(x - 500) / 500;
  return 320 + u * 60;
}

/* ---------------- 外壳 ---------------- */
const TASKS: { id: Task; label: string; icon: React.ReactNode; title: string; task: string }[] = [
  { id: "water", label: "找水", icon: <Droplets className="size-4" />, title: "任务：打一口井", task: "点 A–D 钻井取水，哪处地下水最丰富？" },
  { id: "oil", label: "找石油天然气", icon: <Fuel className="size-4" />, title: "任务：勘探油气", task: "点 A–D 布设钻井，哪里能发现油气藏？" },
  { id: "tunnel", label: "修建隧道", icon: <TrainFront className="size-4" />, title: "任务：给铁路选隧道线", task: "点 A–D 布设隧道，评估稳定性、地下水与风险。" },
  { id: "dam", label: "工程选址", icon: <Landmark className="size-4" />, title: "任务：为水库选坝址", task: "点甲–丙布置坝轴线，避开断层与岩溶。" },
];

export function TaskSimulator() {
  const [task, setTask] = useState<Task>("water");
  const [selected, setSelected] = useState<string | null>(null);

  const meta = TASKS.find((t) => t.id === task)!;

  const probes =
    task === "water"
      ? [["A", "向斜轴部"], ["B", "背斜顶部"], ["C", "向斜翼部"], ["D", "缓坡地带"]]
      : task === "oil"
        ? [["A", "背斜核部"], ["B", "向斜核部"], ["C", "背斜陡翼"], ["D", "油水界面下"]]
        : task === "tunnel"
          ? [["A", "背斜轴部"], ["B", "向斜核部"], ["C", "断层带"], ["D", "浅埋翼部"]]
          : [["甲", "断层带"], ["乙", "石灰岩区"], ["丙", "花岗岩谷口"]];

  const result = getResult(task, selected);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
      <div className="panel relative overflow-hidden">
        <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
          <StatusChip tone="clay">{meta.title}</StatusChip>
        </div>

        <div className="relative">
          {task === "water" && <WaterScene selected={selected} />}
          {task === "oil" && <OilScene selected={selected} />}
          {task === "tunnel" && <TunnelScene selected={selected} />}
          {task === "dam" && <DamScene selected={selected} />}

          {/* 点位提示条 */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line bg-card px-5 py-2.5">
            {probes.map(([id, label]) => (
              <button
                key={id}
                onClick={() => setSelected(selected === id ? null : id)}
                className={
                  "t-mono text-[12px] font-bold transition-colors " +
                  (selected === id ? "text-clay" : "text-ink-soft hover:text-ink")
                }
              >
                【{id}】{label}
              </button>
            ))}
            <button
              onClick={() => setSelected(null)}
              className="ml-auto flex items-center gap-1 text-[12px] font-semibold text-ink-faint hover:text-ink"
            >
              <RotateCcw className="size-3" /> 清除选择
            </button>
          </div>
        </div>
      </div>

      <div className="panel flex flex-col gap-5 p-6">
        <div>
          <p className="eyebrow mb-2">任务模拟器</p>
          <h3 className="text-[19px] font-extrabold">{meta.title}</h3>
          <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">{meta.task}</p>
        </div>

        <Segmented<Task>
          value={task}
          onChange={(t) => {
            setTask(t);
            // 预选中一个展示点位，便于快速理解
            setSelected(t === "dam" ? null : t === "water" || t === "oil" || t === "tunnel" ? "A" : null);
          }}
          options={TASKS.map((t) => ({ value: t.id, label: t.label }))}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={task + (selected ?? "none")}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
            className="rounded-xl border border-line bg-paper-2/60 p-4"
          >
            {result ? (
              <>
                <p className="flex items-center gap-2 text-[15px] font-extrabold">
                  {result.ok === true && <CheckCircle2 className="size-5 shrink-0 text-moss" />}
                  {result.ok === false && <XCircle className="size-5 shrink-0 text-clay" />}
                  {result.ok === "mid" && <Circle className="size-5 shrink-0 text-gold" />}
                  <span className={result.ok === true ? "text-moss" : result.ok === false ? "text-clay" : "text-gold"}>
                    {result.title}
                  </span>
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">{result.detail}</p>
                {result.rows && (
                  <div className="mt-3 space-y-1.5">
                    {result.rows.map((r) => (
                      <div key={r.k} className="flex items-center justify-between gap-3 text-[12.5px]">
                        <span className="text-ink-faint">{r.k}</span>
                        <span className="flex items-center gap-1 font-semibold" style={{ color: r.good === 2 ? "#65744c" : r.good === 1 ? "#b98a2f" : "#c05b2c" }}>
                          {r.v}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p className="text-[13.5px] font-semibold text-ink-faint">点圆点看评价。</p>
            )}
          </motion.div>
        </AnimatePresence>

        {task === "water" && <Explain text="地下向斜向下弯曲，把降水与两侧补给水汇在核部，是储水构造；背斜顶部分流，是贫水区。" />}
        {task === "oil" && <Explain text="油气比水轻，沿渗透层上移，遇不透水盖层后聚集。背斜顶部因此成为圈闭，气、油、水按密度分层。" />}
        {task === "tunnel" && <Explain text="背斜拱形稳定、不易积水，是隧道优选部位；向斜核部汇水、断层带破碎，都应避开。" />}
        {task === "dam" && <Explain text="坝址三原则：地基完整、避开断层、谷口狭窄。石灰岩岩溶易渗漏，花岗岩是理想坝基。" />}
      </div>
    </div>
  );
}

function Explain({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-line bg-night p-4 text-chalk">
      <p className="text-[12.5px] leading-relaxed text-chalk-dim">{text}</p>
    </div>
  );
}

function getResult(task: Task, selected: string | null): Probe | null {
  if (!selected) return null;
  const pools: Record<Task, Probe[]> = {
    water: [
      { id: "A", x: 0, y: 0, label: "", ok: true, title: "地下水富集区", detail: "向斜核部下凹，汇聚降水与两侧地下水，含水层厚、水量大。" },
      { id: "B", x: 0, y: 0, label: "", ok: false, title: "水量小，易落空", detail: "背斜核部地下水向两翼分流，顶部缺厚含水层。" },
      { id: "C", x: 0, y: 0, label: "", ok: "mid", title: "水量一般", detail: "翼部含水层薄、水位深，水量有限。" },
      { id: "D", x: 0, y: 0, label: "", ok: false, title: "补给有限", detail: "远离汇水中心，补给不足，旱季易断水。" },
    ],
    oil: [
      { id: "A", x: 0, y: 0, label: "", ok: true, title: "发现油气藏", detail: "背斜圈闭的标准层序：天然气在上、石油居中、地下水在下。A 井打穿盖层即可采出。" },
      { id: "B", x: 0, y: 0, label: "", ok: false, title: "未发现有效油气聚集", detail: "向斜核部以水为主。油气密度小，向高处运移，不会沉在底部。" },
      { id: "C", x: 0, y: 0, label: "", ok: "mid", title: "见少量油迹", detail: "翼部倾角大，油气继续上移，只残留油迹，难成藏。" },
      { id: "D", x: 0, y: 0, label: "", ok: false, title: "钻入水层", detail: "位于油水界面以下，见水不见油。" },
    ],
    tunnel: [
      { id: "A", x: 0, y: 0, label: "", ok: true, title: "较理想的隧道位置", detail: "背斜轴部呈拱形，围岩自稳好；地下水沿翼部排走，不易积水。", rows: [
        { k: "岩层稳定性", v: "拱形，自稳好", good: 2 },
        { k: "地下水", v: "向两翼分流", good: 2 },
        { k: "施工风险", v: "较低", good: 2 },
      ] },
      { id: "B", x: 0, y: 0, label: "", ok: false, title: "水害风险大，应避开", detail: "向斜核部是汇水中心，易涌水突泥，核部岩层受压破碎。", rows: [
        { k: "岩层稳定性", v: "核部破碎", good: 0 },
        { k: "地下水", v: "易涌水", good: 0 },
        { k: "施工风险", v: "极高", good: 0 },
      ] },
      { id: "C", x: 0, y: 0, label: "", ok: false, title: "严禁穿越断层带", detail: "断层带岩体破碎、富水，隧道穿越易塌方涌水。", rows: [
        { k: "岩层稳定性", v: "破碎失稳", good: 0 },
        { k: "地下水", v: "断层富水", good: 0 },
        { k: "施工风险", v: "极高", good: 0 },
      ] },
      { id: "D", x: 0, y: 0, label: "", ok: "mid", title: "浅埋软岩，尚可施工", detail: "埋深浅、围岩偏软，需防地表沉降；避开断层带后可施工。", rows: [
        { k: "岩层稳定性", v: "围岩较软", good: 1 },
        { k: "地下水", v: "水位以上", good: 1 },
        { k: "施工风险", v: "中等", good: 1 },
      ] },
    ],
    dam: [
      { id: "甲", x: 0, y: 0, label: "", ok: false, title: "坝基不稳，渗漏严重", detail: "坝基岩体破碎，蓄水后易渗漏，还可能错动。", rows: [
        { k: "地基稳定性", v: "差", good: 0 },
        { k: "渗漏风险", v: "高", good: 0 },
      ] },
      { id: "乙", x: 0, y: 0, label: "", ok: "mid", title: "岩溶渗漏风险", detail: "石灰岩岩溶发育，库水可能沿溶洞渗漏，防渗成本高。", rows: [
        { k: "地基稳定性", v: "岩溶发育", good: 1 },
        { k: "渗漏风险", v: "较高", good: 1 },
      ] },
      { id: "丙", x: 0, y: 0, label: "", ok: true, title: "理想坝址", detail: "谷口狭窄、工程量小，坝基为坚硬完整、不透水的花岗岩。", rows: [
        { k: "地基稳定性", v: "坚硬完整", good: 2 },
        { k: "渗漏风险", v: "低", good: 2 },
      ] },
    ],
  };
  return pools[task].find((p) => p.id === selected) ?? null;
}
