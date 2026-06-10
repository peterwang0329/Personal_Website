# 個人作品集與互動體驗網站 (React + TypeScript + Vite + FastAPI)

這是一個結合前端靜態展示與全端動態互動功能的個人網站專案。前端採用現代化的 React 和 TypeScript 技術棧，並透過 Vite 提供極速的開發與建置體驗；後端則採用輕量高效的 Python FastAPI 搭配 SQLite 資料庫，提供使用者認證與資料持久化服務。

目前已上架至Render

網站網址:https://personal-website-static-pmb2.onrender.com/

## 專案特色

本專案主要包含以下五大區塊：

1. **網站介紹 (Hero Section)**
   展示個人基本資訊、目前的求職狀態、動態的職稱輪播，以及社群平台連結。

2. **個人簡介 (Profile Section)**
   詳細介紹「關於我」、精選的技能雷達圖、開發工具習慣，並整合了過去的作品集與學習經歷。

3. **使用者系統與個人書庫 (User System & Library)**
   - 內建帳號註冊與登入功能，並以 JWT (JSON Web Token) 進行安全認證。
   - **我的書庫**：專屬已登入使用者的頁面，可管理上傳過的書籍，直觀檢視各本書的閱讀進度與最後閱讀時間。
   - **書籤管理**：可瀏覽所有新增的書籤，支援編輯與刪除功能。

4. **小說閱讀器 (Novel Reader)**
   - 支援本機上傳 `.txt` 格式的純文字檔。
   - 透過正則表達式自動辨識「第 X 章」或「Chapter X」進行章節的自動分割與分頁。
   - 提供五種閱讀主題自由切換及字體大小調整功能。
   - **雲端同步**：若已登入，閱讀進度、偏好設定與書籤皆會即時同步至後端資料庫，實現跨裝置無縫閱讀。
   - **離線備援**：若未登入，仍可透過瀏覽器的 `localStorage` 儲存進度與設定。

5. **打磚塊小遊戲 (Brick Breaker)**
   - 內建基於 HTML5 Canvas 搭配 `requestAnimationFrame` 開發的經典打磚塊遊戲。
   - 具備球體與磚塊的碰撞偵測、分數計算與生命值機制。
   - 支援使用鍵盤的左右方向鍵進行流暢遊玩。

## 技術架構

### 前端
- **框架**：[React](https://react.dev/)
- **語言**：[TypeScript](https://www.typescriptlang.org/)
- **建置工具**：[Vite](https://vitejs.dev/)，並配置 Proxy 轉發 API 請求。
- **樣式設計**：純 CSS (Vanilla CSS) 搭配 CSS 變數，實現 Glassmorphism (毛玻璃) 質感與深淺色模式。
- **狀態與路由**：使用 React Context 管理全域認證狀態，使用 React Router DOM 處理分頁。
- **圖示庫**：[Lucide React](https://lucide.dev/)

### 後端
- **框架**：[FastAPI](https://fastapi.tiangolo.com/)，提供高效能且具備自動文件 (Swagger UI) 的 API。
- **資料庫**：[SQLite](https://www.sqlite.org/index.html) (開發用輕量資料庫)，搭配 [SQLAlchemy](https://www.sqlalchemy.org/) ORM 操作資料。
- **資料驗證**：[Pydantic](https://docs.pydantic.dev/) 用於請求與回應的資料格式驗證。
- **安全性**：使用 `passlib` 進行 bcrypt 密碼雜湊，`python-jose` 處理 JWT 簽發與驗證。

---

## 如何在本地端執行

由於專案包含前後端，啟動時需要開啟**兩個**獨立的終端機視窗。

### 步驟 1：啟動後端 API 伺服器
請在專案根目錄下開啟第一個終端機：
```bash
# 進入後端資料夾
cd server

# (選用) 建立並啟動虛擬環境 (Windows 範例)
python -m venv venv
venv\Scripts\activate

# 安裝 Python 依賴套件
pip install -r requirements.txt

# 啟動 FastAPI 伺服器
python -m uvicorn main:app --reload
```
後端伺服器啟動後，將運行於 `http://localhost:8000`。您可以造訪 `http://localhost:8000/docs` 查看自動生成的 API 測試文件。

### 步驟 2：啟動前端開發伺服器
請在專案根目錄下開啟第二個終端機：
```bash
# 安裝 Node 依賴套件
npm install

# 啟動 Vite 開發伺服器
npm run dev
```
啟動後，開啟瀏覽器造訪終端機顯示的位址 (通常為 `http://localhost:5173/`) 即可預覽網站。

*註：前端的 `vite.config.ts` 已設定 Proxy，所有 `/api` 開頭的請求會自動轉發至後端伺服器，無需處理 CORS 問題。*

---

## 專案檔案結構與功能說明

### 📁 核心架構
- **`src/main.tsx` & `src/App.tsx`**：React 進入點與主程式佈局，配置了路由機制與 `AuthProvider` 認證狀態。
- **`src/index.css`**：全域樣式設定，包含所有元件的設計細節、動畫效果與深淺色主題變數。
- **`vite.config.ts`**：Vite 建置設定，包含對後端的 API Proxy 配置。

### 📁 後端服務 (`server/`)
- **`main.py`**：FastAPI 應用程式入口，掛載路由與初始化資料表。
- **`database.py` & `models.py`**：定義 SQLite 連線及 User, Book, Bookmark 三張資料表的 ORM 結構。
- **`schemas.py`**：定義 API 請求與回應的 Pydantic 模型，包含帳號密碼的格式驗證。
- **`auth.py`**：處理密碼雜湊與 JWT Token 的簽發、驗證邏輯。
- **`routers/`**：依照功能分類的 API 路由 (認證 `auth_router.py`、書籍 `books_router.py`)。

### 📁 前端元件 (`src/components/`)
- **`LoginPage.tsx`**：整合登入與註冊功能的毛玻璃質感表單。
- **`Library.tsx`**：專屬已登入使用者的「我的書庫」頁面，展示書籍進度條與書籤。
- **`NovelReader.tsx`**：支援 TXT 解析的小說閱讀器。整合了後端 API，可即時同步閱讀進度，並提供新增書籤的面板。
- **`Navbar.tsx`**：頂部導覽列，整合了使用者狀態顯示與下拉選單。
- **`Hero.tsx` & `Profile.tsx`**：首頁與個人簡介展示區塊。
- **`BrickBreaker.tsx`**：Canvas 打磚塊遊戲。

### 📁 資料與邏輯層
- **`src/contexts/AuthContext.tsx`**：全域認證狀態管理中心，處理登入/註冊邏輯與 Token 狀態維持。
- **`src/utils/apiClient.ts`**：封裝的 `fetch` 請求工具，會自動在 Header 帶上 JWT Token 並統一處理 401 錯誤。
- **`src/data/profile.ts`**：網站的靜態資料設定檔，集中管理個人簡歷文字。
- **`src/hooks/useTheme.ts`**：處理深色模式切換邏輯。
