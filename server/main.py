"""
FastAPI 應用程式入口
掛載路由、CORS 設定、啟動時建立資料表
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base, SessionLocal
from models import User
from auth import hash_password
from routers import auth_router, books_router, bookmarks_router, admin_router
from dotenv import load_dotenv

load_dotenv()

# 啟動時自動建立所有資料表
Base.metadata.create_all(bind=engine)

ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")

def seed_admin():
    """確保 admin 帳號存在（每次重建資料庫後自動建立）"""
    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.username == "admin").first()
        if not existing:
            admin = User(
                username="admin",
                password_hash=hash_password(ADMIN_PASSWORD),
                display_name="系統管理員",
                is_admin=True,
            )
            db.add(admin)
            db.commit()
            print("[INFO] Admin 帳號已建立")
        elif not existing.is_admin:
            # 若帳號存在但不是管理員，強制升級
            existing.is_admin = True
            db.commit()
            print("[INFO] Admin 帳號已升級為管理員")
    finally:
        db.close()


seed_admin()

app = FastAPI(
    title="小說閱讀器 API",
    description="個人網站後端 — 使用者認證、書籍管理、書籤筆記",
    version="1.0.0",
)

# CORS 設定：允許前端開發伺服器存取
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 掛載路由
app.include_router(auth_router.router)
app.include_router(books_router.router)
app.include_router(bookmarks_router.router)
app.include_router(admin_router.router)


@app.get("/api/health")
def health_check():
    """健康檢查端點"""
    return {"status": "ok", "message": "伺服器運作中 🚀"}
