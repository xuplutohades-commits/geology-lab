import { spawn } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium } from "playwright-core";
import { writeFileSync, mkdirSync } from "node:fs";
const EXE = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = process.env.QAPORT ? Number(process.env.QAPORT) : 3225;
const BASE = `http://127.0.0.1:${PORT}`;

(async () => {
  const OUT = "/Users/qianxu/Documents/experimenting/geology-lab/out";
  const server = spawn("python3", ["-m", "http.server", String(PORT), "--directory", OUT], { stdio: ["ignore", "pipe", "pipe"] });
  let log = "";
  server.stdout.on("data", (d) => { log += d; });
  server.stderr.on("data", (d) => { log += d; });
  for (let i = 0; i < 60; i++) { await new Promise((r) => setTimeout(r, 1000)); if (log.includes("Serving HTTP") || log.includes("server running")) break; }

  const browser = await chromium.launch({ executablePath: EXE });
  const report = {};

  async function newPage() {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [];
    page.on("console", (m) => { if (m.type() === "error") errors.push(m.text().slice(0, 300)); });
    page.on("pageerror", (e) => errors.push(String(e).slice(0, 500)));
    return { page, errors };
  }

  for (const r of ["", "basics", "fold", "fault", "evolution", "application", "quiz"]) {
    const { page, errors } = await newPage();
    await page.goto(`${BASE}/${r ? r + "/" : ""}`, { waitUntil: "load" });
    await page.waitForTimeout(2000);
    const info = await page.evaluate(() => ({
      title: document.title,
      scrollH: document.documentElement.scrollHeight,
      svgCount: document.querySelectorAll("svg").length,
      rangeCount: document.querySelectorAll('input[type="range"]').length,
    }));
    report[r === "" ? "home" : r] = { errors: errors.slice(0, 5), info };
    await page.close();
  }

  // fold
  {
    const { page, errors } = await newPage();
    await page.goto(`${BASE}/fold/`, { waitUntil: "load" });
    await page.waitForTimeout(1500);
    const before = await page.evaluate(() => document.body.innerText.includes("水平岩层"));
    await page.getByRole("button", { name: "开始挤压" }).click();
    await page.waitForTimeout(3600);
    const after = await page.evaluate(() => ({ full: document.body.innerText.includes("完整褶皱"), beixie: document.body.innerText.includes("背斜") }));
    await page.locator('input[type="range"]').first().evaluate((el) => {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
      setter.call(el, "100");
      el.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await page.waitForTimeout(500);
    const sliderFull = await page.evaluate(() => document.body.innerText.includes("完整褶皱"));
    report.foldInteract = { before, autoFull: after.full, beixie: after.beixie, sliderFull, errors: errors.slice(0, 5) };
    await page.close();
  }

  // application
  {
    const { page, errors } = await newPage();
    await page.goto(`${BASE}/application/`, { waitUntil: "load" });
    await page.waitForTimeout(1800);
    const waterOK = await page.evaluate(() => document.body.innerText.includes("地下水富集区"));
    await page.getByRole("tab", { name: "找石油天然气" }).click();
    await page.waitForTimeout(800);
    const oilOK = await page.evaluate(() => document.body.innerText.includes("发现油气藏"));
    await page.getByRole("button", { name: "【B】向斜核部" }).click();
    await page.waitForTimeout(600);
    const oilBad = await page.evaluate(() => document.body.innerText.includes("未发现有效油气聚集"));
    await page.getByRole("tab", { name: "修建隧道" }).click();
    await page.waitForTimeout(800);
    const tunnel = await page.evaluate(() => document.body.innerText.includes("较理想的隧道位置"));
    await page.getByRole("tab", { name: "工程选址" }).click();
    await page.waitForTimeout(800);
    const damHint = await page.evaluate(() => document.body.innerText.includes("布置坝轴线"));
    report.appInteract = { waterOK, oilOK, oilBad, tunnel, damHint, errors: errors.slice(0, 5) };
    await page.close();
  }

  // quiz full flow
  {
    const { page, errors } = await newPage();
    await page.goto(`${BASE}/quiz/`, { waitUntil: "load" });
    await page.waitForTimeout(1800);
    await page.getByRole("button", { name: "背斜" }).first().click();
    await page.waitForTimeout(400);
    await page.getByRole("button", { name: "中间岩层较老" }).click();
    await page.getByRole("button", { name: "岩层向上弯曲" }).click();
    await page.getByRole("button", { name: "提交判读依据" }).click();
    await page.waitForTimeout(400);
    const q1 = await page.evaluate(() => document.body.innerText.includes("判断正确"));
    await page.getByRole("button", { name: "下一题" }).first().click();
    await page.waitForTimeout(400);
    await page.getByRole("button", { name: "核部老、两翼新" }).click();
    await page.waitForTimeout(400);
    const q2 = await page.evaluate(() => document.body.innerText.includes("判断正确"));
    // 反直觉题
    const q = page.locator("text=看到山岭，它就一定是背斜形成的吗？");
    await q.scrollIntoViewIfNeeded();
    await page.getByRole("button", { name: "不一定" }).click();
    await page.waitForTimeout(2400);
    const counter = await page.evaluate(() => document.body.innerText.includes("向斜山"));
    report.quizInteract = { q1, q2, counter, errors: errors.slice(0, 5) };
    await page.close();
  }

  // fault
  {
    const { page, errors } = await newPage();
    await page.goto(`${BASE}/fault/`, { waitUntil: "load" });
    await page.waitForTimeout(1800);
    await page.getByRole("tab", { name: "挤压 → 逆断层" }).click();
    await page.waitForTimeout(1000);
    const reverse = await page.evaluate(() => document.body.innerText.includes("逆断层"));
    await page.getByRole("button", { name: "中间下降" }).click();
    await page.waitForTimeout(1000);
    const graben = await page.evaluate(() => document.body.innerText.includes("地堑"));
    await page.getByRole("button", { name: "中间上升" }).click();
    await page.waitForTimeout(1000);
    const horst = await page.evaluate(() => document.body.innerText.includes("断块山"));
    report.faultInteract = { reverse, graben, horst, errors: errors.slice(0, 5) };
    await page.close();
  }

  // evolution
  {
    const { page, errors } = await newPage();
    await page.goto(`${BASE}/evolution/`, { waitUntil: "load" });
    await page.waitForTimeout(1800);
    await page.getByRole("button", { name: "播放演化" }).click();
    await page.waitForTimeout(3500);
    const advanced = await page.evaluate(() => {
      const t = document.body.innerText;
      return t.includes("地壳抬升") || t.includes("挤压褶皱") || t.includes("断裂错动") || t.includes("风化侵蚀");
    });
    await page.getByRole("button", { name: "复位" }).click();
    await page.waitForTimeout(600);
    const reset = await page.evaluate(() => document.body.innerText.includes("沉积形成"));
    report.evoInteract = { advanced, reset, errors: errors.slice(0, 5) };
    await page.close();
  }

  await browser.close();
  server.kill("SIGTERM");
  const dir = join(tmpdir(), "geology-qa"); mkdirSync(dir, { recursive: true }); writeFileSync(join(dir, "report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  process.exit(0);
})().catch((e) => {
  console.error("QA FAIL:", String(e).slice(0, 1500));
  try { const dir = join(tmpdir(), "geology-qa"); mkdirSync(dir, { recursive: true }); writeFileSync(join(dir, "report.json"), JSON.stringify(report, null, 2)); } catch {}
  process.exit(1);
});
