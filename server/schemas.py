"""
Pydantic 請求/回應模型
定義 API 的輸入輸出格式
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, field_validator


# ── 認證相關 ──────────────────────────────────────

class RegisterRequest(BaseModel):
    """註冊請求"""
    username: str
    password: str
    display_name: Optional[str] = None

    @field_validator("username")
    @classmethod
    def username_must_be_valid(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 3 or len(v) > 20:
            raise ValueError("使用者名稱長度必須在 3-20 字元之間")
        if not v.isalnum() and not all(c.isalnum() or c == '_' or c == ' ' for c in v):
            raise ValueError("使用者名稱只能包含英文字母、數字、底線和空格")
        return v

    @field_validator("password")
    @classmethod
    def password_must_be_strong(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError("密碼長度至少 6 個字元")
        return v


class LoginRequest(BaseModel):
    """登入請求"""
    username: str
    password: str


class TokenResponse(BaseModel):
    """登入成功回應"""
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    """使用者資訊回應"""
    id: int
    username: str
    display_name: Optional[str]
    is_admin: bool = False
    created_at: datetime

    model_config = {"from_attributes": True}


# ── 書籍相關 ──────────────────────────────────────

class BookCreate(BaseModel):
    """新增書籍請求"""
    file_name: str
    novel_name: str
    total_chapters: int = 0
    current_chapter: int = 0
    font_size: int = 18
    reader_theme: str = "light"


class BookUpdate(BaseModel):
    """更新書籍（閱讀進度）請求"""
    current_chapter: Optional[int] = None
    font_size: Optional[int] = None
    reader_theme: Optional[str] = None


class BookResponse(BaseModel):
    """書籍回應"""
    id: int
    file_name: str
    novel_name: str
    total_chapters: int
    current_chapter: int
    font_size: int
    reader_theme: str
    last_read_at: datetime
    created_at: datetime

    model_config = {"from_attributes": True}


# ── 書籤相關 ──────────────────────────────────────

class BookmarkCreate(BaseModel):
    """新增書籤請求"""
    chapter_index: int
    title: Optional[str] = None
    note: Optional[str] = None


class BookmarkResponse(BaseModel):
    """書籤回應"""
    id: int
    book_id: int
    chapter_index: int
    title: Optional[str]
    note: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}



