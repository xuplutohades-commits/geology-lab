import { spawn } from "node:child_process";
import { chromium } from "playwright-core";
const EXE = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 3236;
(async () => {
  const server = spawn("python3", ["-m", "http.server", String(PORT), "--directory", "/Users/qianxu/Documents/experimenting/geology-lab/out"], { stdio: ["ignore", "pipe", "pipe"] });
  await new Promise((r) => setTimeout(r, 2000));
  const browser = await chromium.launch({ executablePath: EXE });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errs = [];
  page.on("pageerror", (e) => errs.push(String(e).slice(0, 200)));
  await page.goto(`http://127.0.0.1:${PORT}/fold/`, { waitUntil: "load" });
  await page.waitForTimeout(2000);

  const tabsBefore = await page.evaluate(() => Array.from(document.querySelectorAll('[role="tab"]')).map((b) => b.textContent.trim() + "|" + b.getAttribute("aria-selected")));
  console.log("tabs:", JSON.stringify(tabsBefore));

  // 先挤压到满，再切向斜，看图内标签和状态是否变化
  await page.getByRole("button", { name: "开始挤压" }).click();
  await page.waitForTimeout(4000);
  const fullState = await page.evaluate(() => document.body.innerText.includes("完整褶皱"));
  console.log("after squeeze, 完整褶皱:", fullState);

  const syncBtn = page.locator('[role="tab"]').filter({ hasText: "向斜" }).first();
  await syncBtn.click();
  await page.waitForTimeout(800);
  const after = await page.evaluate(() => ({
    selectedTabs: Array.from(document.querySelectorAll('[role="tab"]')).filter((b) => b.getAttribute("aria-selected") === "true").map((b) => b.textContent.trim()),
    hasXiangxie: document.body.innerText.includes("向斜"),
  }));
  console.log("after clicking 向斜:", JSON.stringify(after));
  console.log("page errors:", JSON.stringify(errs));
  await browser.close();
  server.kill("SIGTERM");
  process.exit(0);
})();
