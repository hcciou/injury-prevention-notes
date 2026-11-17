// 檢查專案是否符合 AGENTS.md 的規則。用法：node scripts/check.mjs
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const err = (where, msg) => errors.push(`${where}：${msg}`);

// 讀取索引
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, "data/notes.js"), "utf8"), ctx);
const { COURSES = [], NOTES = [] } = ctx.window;

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const FILE = /^\d{2}-[a-z0-9]+(-[a-z0-9]+)*\.html$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const SECTIONS = ["key", "concepts", "field", "quiz", "refs"];

const courseSlugs = new Set();
for (const c of COURSES) {
  if (!SLUG.test(c.slug)) err(`COURSES ${c.slug}`, "slug 必須是 kebab-case");
  if (!c.name || !c.description) err(`COURSES ${c.slug}`, "缺少 name 或 description");
  if (courseSlugs.has(c.slug)) err(`COURSES ${c.slug}`, "slug 重複");
  courseSlugs.add(c.slug);
}

const registered = new Set();
for (const n of NOTES) {
  const rel = `notes/${n.course}/${n.file}`;
  if (registered.has(rel)) err(rel, "索引中重複");
  registered.add(rel);
  if (!courseSlugs.has(n.course)) err(rel, `課程 ${n.course} 不在 COURSES 中`);
  if (!FILE.test(n.file)) err(rel, "檔名必須是 <兩位數序號>-<主題>.html");
  if (!DATE.test(n.date)) err(rel, "date 必須是 YYYY-MM-DD");
  if (!n.title || !n.summary) err(rel, "缺少 title 或 summary");
  if (!Array.isArray(n.tags) || n.tags.length < 1 || n.tags.length > 4) err(rel, "tags 必須有 1 到 4 個");

  const full = path.join(root, rel);
  if (!fs.existsSync(full)) { err(rel, "檔案不存在"); continue; }
  const html = fs.readFileSync(full, "utf8");

  if (/\{\{.*?\}\}/.test(html)) err(rel, "殘留 {{佔位符}}");
  if (/<style[\s>]/i.test(html) || /\sstyle\s*=/i.test(html)) err(rel, "不可使用 <style> 或行內 style");
  if (/(href|src)\s*=\s*"\/(?!\/)/i.test(html)) err(rel, "不可使用以 / 開頭的絕對路徑");
  if (!html.includes('href="../../assets/style.css"')) err(rel, "未引用共用樣式");
  if (!html.includes('class="breadcrumb"')) err(rel, "缺少麵包屑");

  const h1 = html.match(/<h1>([\s\S]*?)<\/h1>/);
  if (!h1) err(rel, "缺少 <h1>");
  else if (h1[1].trim() !== n.title) err(rel, `<h1> 與索引 title 不一致（${h1[1].trim()}）`);

  const found = [...html.matchAll(/<section id="([^"]+)"/g)].map((m) => m[1]);
  if (found.join(",") !== SECTIONS.join(",")) {
    err(rel, `區塊必須依序為 ${SECTIONS.join(", ")}（目前：${found.join(", ") || "無"}）`);
  }
  const quiz = html.match(/<section id="quiz">([\s\S]*?)<\/section>/);
  if (quiz && (quiz[1].match(/<details>/g) || []).length !== 3) err(rel, "自我檢測必須剛好三題");
  const refs = html.match(/<section id="refs">([\s\S]*?)<\/section>/);
  if (refs && !/<li>/.test(refs[1])) err(rel, "參考資料至少一筆");

  // 相對連結是否存在
  for (const m of html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
    const target = m[1];
    if (/^(https?:|mailto:)/.test(target)) continue;
    if (!fs.existsSync(path.resolve(path.dirname(full), target))) err(rel, `連結失效：${target}`);
  }
}

// notes/ 底下的檔案都要登記在索引中
const notesDir = path.join(root, "notes");
for (const course of fs.readdirSync(notesDir)) {
  const dir = path.join(notesDir, course);
  if (!fs.statSync(dir).isDirectory()) continue;
  if (!courseSlugs.has(course)) err(`notes/${course}`, "資料夾不在 COURSES 中");
  for (const f of fs.readdirSync(dir)) {
    const rel = `notes/${course}/${f}`;
    if (!registered.has(rel)) err(rel, "沒有登記在 data/notes.js");
  }
}

if (errors.length) {
  console.error(`檢查未通過（${errors.length} 項）：`);
  for (const e of errors) console.error(" - " + e);
  process.exit(1);
}
console.log(`檢查通過：${COURSES.length} 門課程、${NOTES.length} 篇筆記。`);
