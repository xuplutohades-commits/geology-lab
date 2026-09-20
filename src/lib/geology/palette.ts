/** 岩层色板：自老（下）至新（上） */
export type Rock = {
  id: string;
  name: string;
  fill: string;   // 亮色场景填充
  edge: string;   // 描边 / 分隔线
  dark: string;   // 夜色场景填充
  darkEdge: string;
  dotted?: boolean; // 砾岩等：内部点状纹理
  striated?: boolean; // 页岩等：内部层纹
};

export const ROCKS: Rock[] = [
  { id: "granite", name: "花岗岩", fill: "#b7a390", edge: "#8b7860", dark: "#6e6253", darkEdge: "#4d4439", striated: true },
  { id: "basalt", name: "玄武岩", fill: "#8a8173", edge: "#615b50", dark: "#57524a", darkEdge: "#3a3731" },
  { id: "limestone", name: "石灰岩", fill: "#cfc8b6", edge: "#a8a18d", dark: "#8b867a", darkEdge: "#625e54", dotted: true },
  { id: "conglomerate", name: "砾岩", fill: "#c0a386", edge: "#98795a", dark: "#7f6b53", darkEdge: "#574838", dotted: true },
  { id: "shale", name: "页岩", fill: "#a6977d", edge: "#83755d", dark: "#6f6555", darkEdge: "#4c453a", striated: true },
  { id: "sandstone", name: "砂岩", fill: "#d5b487", edge: "#b18f5d", dark: "#8d7651", darkEdge: "#64532f", striated: true },
  { id: "mudstone", name: "泥岩", fill: "#c09574", edge: "#9c724e", dark: "#7e6249", darkEdge: "#57442f" },
  { id: "sediment", name: "第四纪沉积", fill: "#97835f", edge: "#726046", dark: "#5f5240", darkEdge: "#40382b" },
];

export const AGE_LABELS = ["老", "", "较老", "", "较新", "", "新"] as const;

/** 夜色场景下对亮色岩层做整体压暗（备用滤镜） */
export const DARKEN = "brightness(0.62) saturate(0.82)";
