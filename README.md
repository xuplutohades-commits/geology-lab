# 地质构造实验室 · Geology Lab

面向高中地理课堂的「地质构造」数字教学网站。核心理念：**不是告诉学生结论，而是让学生亲手操作、观察、再得出结论。**

操作岩层、挤压褶皱、拉张断层、推动 2000 万年的时间轴、寻找油气、挑选坝址、完成剖面判读——把教材知识变成一间可以动手的实验室。

## 快速开始

```bash
npm install        # 安装依赖
npm run dev        # 开发模式（推荐）→ http://localhost:3000
```

生产 / 教室部署（静态导出，无服务器依赖）：

```bash
npm run build      # 生成静态站点到 out/
npm run preview    # 本地预览 → http://localhost:4173
```

把 `out/` 整个文件夹拷到任意电脑，用任意静态服务器（`python3 -m http.server`、Nginx、Vercel/Netlify、校园网盘 + 静态托管均可）即可运行。

## 页面结构

| 路由 | 页面 | 核心交互 |
| --- | --- | --- |
| `/` | 首页 | 动态地下剖面 Hero、六实验室入口、教学理念工作流 |
| `/basics` | 01 地质构造基础 | 水平挤压力滑块（0%→100% 岩层弯曲成褶）、8 层地层柱状图 |
| `/fold` | 02 褶皱实验室 | 背斜/向斜切换、核部新老标签、自动挤压动画、2000 万年侵蚀时间轴（背斜山→背斜谷） |
| `/fault` | 03 断层实验室 | 拉张/挤压/水平错动 → 正/逆/平移断层；地垒→断块山、地堑→断陷盆地 |
| `/evolution` | 04 构造演化与地貌 | 地质时间机器：沉积→抬升→褶皱→断层→侵蚀→河流切割→现代地貌 |
| `/application` | 05 实际应用 | 任务模拟器：找水 / 找油气 / 修隧道 / 选坝址，含风险报告与结果反馈 |
| `/quiz` | 06 判读训练 | 综合剖面题（类型→判据勾选→新老→地貌→意义）、反直觉题五连、真实案例 |

## 技术架构

- **Next.js 16（App Router）+ React 19 + TypeScript**
- **Tailwind CSS 4**（设计令牌：纸张暖色 + 夜色剖面 + 陶土高亮）
- **Framer Motion**（动画与微交互）
- **纯 SVG 动态绘制**：褶皱/断层/地垒等全部由路径几何实时生成，无位图
- 关键几何在 `src/lib/geology/paths.ts`：Catmull-Rom 平滑、分层褶皱（幅度随深度递减）、断层裁剪、地块边界

### 组件化设计

`src/components/geology/` 下分层复用：

- `StrataScene` / `BandGroup` —— 岩层场景基底（纹理、年龄标尺、深/浅两套配色）
- `FoldSimulator` / `ErosionLab` / `FaultSimulator` / `BlockLab` / `EvolutionLab` / `TaskSimulator` —— 各实验
- `Controls`（Slider / Segmented / StatusChip）、`quiz/`（ProfileExam / CounterQuiz）

新增地质剖面场景时，只需调用 `buildFoldBands()` 传入压力与模式，即可获得闭合岩层路径。

## 测试

```bash
npm run build && npm run qa   # 静态导出 + 无头浏览器全量交互回归
```

`npm run qa` 会启动静态服务器并用 Playwright（复用本机 Chrome）逐页检查控制台错误，并自动验证：挤压动画、滑块、任务切换与结果、剖面答题与判据勾选、地垒地堑切换、演化播放/复位。

> 注：若 `npm run qa` 找不到 Chrome，请修改 `scripts/qa-interactions.mjs` 顶部的 `EXE` 路径；首次运行需 `npm i -D playwright-core`（已随项目安装）。

## 后续迭代方向（Roadmap）

- 判读训练题库扩充（多剖面、随机出题、错题本）
- 真实案例模块接入卫星影像/实景照片（华山、渭河平原、东非大裂谷等）
- 地下水、油气模拟增加动态粒子流
- 可选：3D 地块（Three.js）作为进阶展项——当前版本刻意未用，SVG 已覆盖全部教学内容
