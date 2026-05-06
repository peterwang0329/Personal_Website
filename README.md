# 個人作品集與互動體驗網站 (React + TypeScript + Vite)

這是一個以 React 和 TypeScript 建立的個人網站專案，採用了現代化的前端技術棧，並透過 Vite 提供極速的開發與建置體驗。

## 專案特色

本專案結合了靜態展示與動態互動功能，主要包含以下四大區塊：

1. **網站介紹 (Hero Section)**
   展示個人基本資訊、目前的求職狀態、動態的職稱輪播，以及社群平台連結。

2. **個人簡介 (Profile Section)**
   詳細介紹「關於我」、精選的技能雷達圖、開發工具習慣，並整合了過去的作品集與學習經歷。

3. **小說閱讀器 (Novel Reader)**
   - 支援本機上傳 `.txt` 格式的純文字檔。
   - 透過正則表達式自動辨識「第 X 章」或「Chapter X」進行章節的自動分割與分頁。
   - 具備字體大小調整功能。
   - 提供三種閱讀主題（明亮、護眼、深色）自由切換。

4. **打磚塊小遊戲 (Brick Breaker)**
   - 內建基於 HTML5 Canvas 搭配 `requestAnimationFrame` 開發的經典打磚塊遊戲。
   - 具備球體與磚塊的碰撞偵測、分數計算與生命值機制。
   - 支援使用鍵盤的左右方向鍵進行流暢遊玩。

## 技術架構

- **前端框架**：[React](https://react.dev/)
- **開發語言**：[TypeScript](https://www.typescriptlang.org/)，提供嚴謹的型別檢查，減少開發錯誤。
- **建置工具**：[Vite](https://vitejs.dev/)，提供模組熱替換 (HMR) 以及極快的本地伺服器啟動速度。
- **樣式設計**：採用純 CSS (Vanilla CSS) 搭配 CSS 變數，實現了高質感的深淺色模式 (Dark / Light Mode) 切換與響應式排版 (RWD)。
- **圖示庫**：使用 [Lucide React](https://lucide.dev/) 呈現簡潔俐落的 UI 元素。

## 如何在本地端執行

1. **安裝依賴套件**
   請在專案根目錄下（也就是這個 `README.md` 所在的資料夾）打開終端機，執行以下指令安裝套件：
   ```bash
   npm install
   ```

2. **啟動開發伺服器**
   ```bash
   npm run dev
   ```
   啟動後，請在瀏覽器開啟終端機所顯示的位址（通常為 `http://localhost:5173/`），即可預覽網站。

3. **建置生產版本**
   ```bash
   npm run build
   ```
   此指令會先執行 TypeScript 型別檢查 (`tsc`)，確保沒有型別錯誤後，將專案打包優化至 `dist` 資料夾中。

## 專案結構簡介

- `src/components/`：存放所有的 React 獨立元件（例如：導覽列 Navbar、遊戲區塊 BrickBreaker、閱讀器 NovelReader 等）。
- `src/hooks/`：存放自訂的 React Hooks，例如用來控制深淺色模式的 `useTheme.ts`。
- `src/data/`：存放網站的靜態資料設定檔 (`profile.ts`)，所有個人資訊皆集中於此，方便未來快速修改文字內容。
- `src/index.css`：全域樣式檔，包含定義深淺色主題的 CSS 變數與所有的版面設計細節。
- `legacy/`：存放改版前的純 HTML/CSS/JS 舊版原始碼，作為備份與設計參考。

---
*備註：本專案的基礎架構由 Vite 官方的 `@vitejs/plugin-react` 模板建立，並已預設配置 ESLint 協助維持程式碼品質。*

# 專案檔案結構與功能說明

這份文件旨在幫助您了解本專案各個檔案的功能與用途，方便您日後進行維護與修改。

## 📁 核心架構檔案

### [main.tsx](file:///c:/Users/peter/Desktop/program/vide-coding/src/main.tsx)
- **功能**：應用程式的進入點。
- **說明**：負責將 React 根元件掛載到 HTML 的 `#root` 節點上，並配置了 `BrowserRouter` 以啟用分頁路由功能。

### [App.tsx](file:///c:/Users/peter/Desktop/program/vide-coding/src/App.tsx)
- **功能**：主程式佈局與路由設定。
- **說明**：定義了網站的整體架構（如導覽列與頁尾），並使用 `Routes` 與 `Route` 設定各個頁面（首頁、簡介、閱讀器、遊戲）對應的路徑。

### [index.css](file:///c:/Users/peter/Desktop/program/vide-coding/src/index.css)
- **功能**：全域樣式設定。
- **說明**：包含了 CSS 變數（顏色、間距等）、基礎排版、動畫效果以及深/淺色模式的樣式定義。

---

## 📁 資料與邏輯層

### [src/data/profile.ts](file:///c:/Users/peter/Desktop/program/vide-coding/src/data/profile.ts)
- **功能**：**個人資訊中心（最常修改的地方）**。
- **說明**：存放網站上顯示的所有文字內容，包括姓名、自介、技能、作品集與經歷。已加上詳細註解。

### [src/hooks/useTheme.ts](file:///c:/Users/peter/Desktop/program/vide-coding/src/hooks/useTheme.ts)
- **功能**：主題管理 Hook。
- **說明**：處理深色模式與淺色模式的切換邏輯，並將偏好設定儲存在瀏覽器的 `localStorage` 中。

---

## 📁 網頁元件 (src/components/)

### [Navbar.tsx](file:///c:/Users/peter/Desktop/program/vide-coding/src/components/Navbar.tsx)
- **功能**：頂部導覽列。
- **說明**：包含品牌標誌、分頁連結、主題切換按鈕，以及行動版的選單切換功能。

### [Footer.tsx](file:///c:/Users/peter/Desktop/program/vide-coding/src/components/Footer.tsx)
- **功能**：頁尾。
- **說明**：顯示版權資訊、目前的年份，以及「回頂部」的按鈕。

### [Hero.tsx](file:///c:/Users/peter/Desktop/program/vide-coding/src/components/Hero.tsx)
- **功能**：首頁「網站介紹」區塊。
- **說明**：網頁的第一印象，包含動態職稱輪播、個人卡片與聯絡方式。

### [Profile.tsx](file:///c:/Users/peter/Desktop/program/vide-coding/src/components/Profile.tsx)
- **功能**：個人簡介頁面。
- **說明**：整合了「關於我」、技能進度條、工具習慣、作品清單與學習經歷。

### [NovelReader.tsx](file:///c:/Users/peter/Desktop/program/vide-coding/src/components/NovelReader.tsx)
- **功能**：小說閱讀器。
- **說明**：實作 TXT 檔案上傳、自動辨識章節、調整字體大小與切換閱讀主題（護眼、深色）的功能。

### [BrickBreaker.tsx](file:///c:/Users/peter/Desktop/program/vide-coding/src/components/BrickBreaker.tsx)
- **功能**：打磚塊小遊戲。
- **說明**：使用 HTML5 Canvas 實作的遊戲邏輯。包含球的運動、板子控制、磚塊碰撞偵測與計分機制。

---

## 📁 其他資料夾

- **legacy/**：存放改版前的舊版 HTML/CSS/JS 檔案，作為參考與備份。
- **dist/**：執行 `npm run build` 後生成的生產版本檔案，可用於部署。
- **node_modules/**：存放所有安裝的第三方套件（如 React, Lucide React, React Router）。
