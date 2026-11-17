# 傷防筆記（Injury Prevention Notes）

臺北醫學大學傷害防治學研究所的課程筆記網站。一個主題一頁，每篇都把理論連回救護、野外與防災教學現場。

## 這個專案的重點

這不是一次性做出來的網頁，而是一套可以持續新增內容的規則：

- [`AGENTS.md`](AGENTS.md)：給 AI 協作者的完整規則（目的、結構、格式、命名、界線）
- [`CLAUDE.md`](CLAUDE.md)：引用 `AGENTS.md`，讓 Claude Code 自動讀取
- [`templates/note.html`](templates/note.html)：新筆記的樣板
- [`scripts/check.mjs`](scripts/check.mjs)：檢查內容是否符合規則

## 新增一篇筆記

對 AI 說一句話即可，例如：

> 依照 AGENTS.md，在「野外醫學」新增一篇「熱傷害」筆記，內容用我貼的課堂筆記。

AI 會複製樣板、填入五個固定區塊、登記到 `data/notes.js`，並執行檢查。

## 本機預覽

直接用瀏覽器開啟 `index.html`，或：

```bash
python3 -m http.server 8000
```

## 檢查

```bash
node scripts/check.mjs
```

## 聲明

本站為個人學習筆記，不是醫療指引。
