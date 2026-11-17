// 課程與筆記索引：首頁的唯一資料來源。欄位說明見 AGENTS.md 第 7 節。

window.COURSES = [
  {
    slug: "injury-prevention",
    name: "傷害防治概論",
    description: "把傷害當成可以預防的公共衛生問題：分析架構與介入策略。"
  },
  {
    slug: "wilderness-medicine",
    name: "野外醫學",
    description: "資源有限、後送時間長的環境下，如何評估與處置。"
  },
  {
    slug: "road-safety",
    name: "道路交通與安全",
    description: "從系統設計的角度降低道路上的死亡與重傷。"
  }
];

window.NOTES = [
  {
    course: "injury-prevention",
    file: "01-haddon-matrix.html",
    title: "哈登矩陣：把一場傷害拆開來看",
    date: "2026-11-17",
    summary: "用「事件前、事件中、事件後」乘上「人、媒介、環境」，系統性地找出介入點。",
    tags: ["分析架構", "Haddon Matrix"]
  },
  {
    course: "wilderness-medicine",
    file: "01-hypothermia.html",
    title: "失溫的分級與處置",
    date: "2026-11-17",
    summary: "沒有溫度計的山上，用意識和顫抖判斷失溫嚴重度，決定現場該做什麼。",
    tags: ["失溫", "環境急症"]
  },
  {
    course: "road-safety",
    file: "01-safe-system.html",
    title: "安全系統取向：人會犯錯，但不該因此喪命",
    date: "2026-11-17",
    summary: "道路安全的責任從「用路人要小心」轉向「系統要能容錯」。",
    tags: ["Safe System", "Vision Zero"]
  }
];
