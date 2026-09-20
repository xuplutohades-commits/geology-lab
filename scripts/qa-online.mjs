import { chromium } from "playwright-core";
const EXE = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const URL = "https://xuplutohades-commits.github.io/geology-lab/";
(async () => {
  const browser = await chromium.launch({ executablePath: EXE });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text().slice(0, 200)); });
  page.on("pageerror", (e) => errors.push(String(e).slice(0, 300)));
  page.on("response", (r) => { if (r.status() >= 400) errors.push(r.status() + " " + r.url().slice(0, 120)); });
  await page.goto(URL, { waitUntil: "load" });
  await page.waitForTimeout(4000);
  const home = await page.evaluate(() => ({
    title: document.title,
    svgCount: document.querySelectorAll("svg").length,
    hasHero: document.body.innerText.includes("看见岩层如何运动"),
  }));
  console.log("HOME:", JSON.stringify(home));
  // 点击导航到褶皱实验室
  await page.getByRole("link", { name: "02 褶皱" }).click();
  await page.waitForTimeout(3500);
  const fold = await page.evaluate(() => ({
    url: location.pathname,
    title: document.title,
    hasSim: document.body.innerText.includes("开始挤压"),
    svgCount: document.querySelectorAll("svg").length,
  }));
  console.log("FOLD:", JSON.stringify(fold));
  await page.getByRole("button", { name: "开始挤压" }).click();
  await page.waitForTimeout(3600);
  const interact = await page.evaluate(() => document.body.innerText.includes("完整褶皱"));
  console.log("INTERACT full-fold:", interact);
  console.log("ERRORS:", JSON.stringify(errors.slice(0, 8)));
  await browser.close();
  process.exit(0);
})();
