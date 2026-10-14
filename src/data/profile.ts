// ============================================================
// 📝 個人資料設定檔 - 修改這裡來更新網站上所有的個人資訊
// ============================================================

export const PROFILE = {

  // ── 基本資訊 ──────────────────────────────────────────────
  name: "汪章貴",
  headlinePrefix: "專注於",
  roles: [
    "AI 系統開發",
    "機器學習 / 電腦視覺",
    "後端工程",
    "RAG 與 LLM 應用",
  ],
  statusText: "就學中",    // 首頁狀態徽章文字（例如：求職中、開放合作中）
  summary: "我喜歡把複雜的問題拆小、做成好用的產品。擅長在設計與工程之間找到平衡，讓畫面漂亮、也跑得快。",
  // ↑ 首頁的自我介紹一段話

  location: "台灣",            // 所在地，顯示在首頁資訊欄
  topSkillText: "C / Python / AI相關", // 主要技能，顯示在首頁資訊欄
  availability: "就學中", // 目前狀態，顯示在首頁資訊欄

  // ── 右側個人卡片 ───────────────────────────────────────────
  chipText: "AI 研究",
  cardDesc: "從向量資料庫、LLM 到電腦視覺，喜歡把研究落地成真實可用的系統。",

  stats: {
    years: "3+",
    projects: "8",
    focus: "AI / ML",
  },

  // ── 對外連結 ───────────────────────────────────────────────
  links: {
    email: "peterwang95267@gmail.com",
    github: "https://github.com/peterwang0329",
    linkedin: "https://linkedin.com",
  },

  // ── 關於我（個人簡介頁面上方區塊）────────────────────────────
  about: {
    lead: "對 AI 充滿熱情，喜歡將前沿技術轉化為有溫度、有意義的應用。曾主導以 RAG + LLM + 聲音克隆技術打造的互動導覽系統，也在 CIHCI Lab 實習期間深入電腦視覺研究。",

    strength: "後端 AI 引擎開發（RAG、LLM、WebSocket）、電腦視覺（YOLOv8、影像分割）、資料分析與模型訓練（scikit-learn、PyTorch）。熟悉從架構規劃到系統整合的完整流程。",

    looking: "期待跟在意品質的團隊合作：願意討論、願意迭代、願意把產品做到更成熟。",
    // ↑「我在找什麼」卡片裡的文字描述

    oneLiner: "讓 AI 不只是模型，而是真正好用的系統。",

    strengthPills: ["Python", "LLM / RAG", "電腦視覺", "YOLOv8", "PyTorch", "C / C#", "WebSocket", "FastAPI"],
  },

  // ── 技能雷達（進度條）─────────────────────────────────────
  // name: 技能名稱 | levelLabel: 熟練程度文字 | value: 進度條百分比（0–100）
  skills: [
    { name: "Python", levelLabel: "精通", value: 95 },
    { name: "C / C#", levelLabel: "精通", value: 92 },
    { name: "AI / LLM 應用", levelLabel: "精通", value: 90 },
    { name: "Unity", levelLabel: "精通", value: 90 },
    { name: "資料分析 / ML", levelLabel: "熟練", value: 85 },
    { name: "電腦視覺（YOLO）", levelLabel: "熟練", value: 82 },
    { name: "Web 後端（FastAPI）", levelLabel: "上手", value: 72 },
  ],

  // ── 工具與習慣（清單）────────────────────────────────────
  tools: [
    "以 Hybrid RAG 建構知識檢索系統",
    "使用 RAGAS 量化評估 LLM 回應品質",
    "以 YOLOv8 進行物件辨識與影像標記",
    "搭配 WebSocket 設計低延遲 AI 串流通訊",
    "以里程碑規劃專案，重視模組間介面清晰度",
  ],

  // ── 我重視的事（標籤）────────────────────────────────────
  values: ["研究嚴謹性", "系統可用性", "跨模組整合", "持續學習", "成果落地"],

  // ── 作品集（Profile 頁面簡易列表）───────────────────────────
  projects: [
    {
      title: "AI 即時互動導覽系統",
      desc: "以 Whisper、Ollama、Hybrid RAG、GPT-SoVITS 打造的邊緣 AI 導覽員，部署於 ASUS ASCENT GX10。",
      tags: ["LLM", "RAG", "語音克隆", "WebSocket"],
    },
    {
      title: "珊瑚農場百萬室內缸",
      desc: "以 YOLOv8 對 16 種珊瑚與 3 種小丑魚進行辨識，作為室內養殖環境的前導研究。",
      tags: ["YOLOv8", "電腦視覺", "Python"],
    },
    {
      title: "AI CUP — 交易警示帳戶分類",
      desc: "2025 玉山人工智慧挑戰賽，以 Random Forest 對銀行交易資料進行特徵工程與分類預測。",
      tags: ["機器學習", "Random Forest", "pandas"],
    },
    {
      title: "FastAPI 動態部落格系統",
      desc: "使用 FastAPI + SQLite 開發，部署於 Render，支援文章發佈、登入等完整功能。",
      tags: ["FastAPI", "Python", "Web"],
    },
  ],

  // ── 學習與經歷（時間軸）───────────────────────────────────
  // time: 時間區間 | title: 職位/事件名稱 | body: 詳細描述
  experience: [
    {
      time: "2023/09 — 2027/06",
      title: "國立金門大學 資訊工程學系",
    },
    {
      time: "2026/09 — 2027/06",
      title: "國立臺灣科技大學 國內交換生",
    },
    {
      time: "2025/07 — 2025/08",
      title: "臺科大 CIHCI Lab 暑期實習",
    },
  ],
};
