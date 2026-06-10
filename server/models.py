"""
資料庫模型定義
定義 User, Book, Bookmark 三張資料表
"""

from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from database import Base


class User(Base):
    """使用者資料表"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    display_name = Column(String(100), nullable=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # 關聯
    books = relationship("Book", back_populates="user", cascade="all, delete-orphan")


class Book(Base):
    """書籍記錄資料表"""
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    novel_name = Column(String(255), nullable=False)
    total_chapters = Column(Integer, default=0)
    current_chapter = Column(Integer, default=0)
    font_size = Column(Integer, default=18)
    reader_theme = Column(String(20), default="light")
    last_read_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # 關聯
    user = relationship("User", back_populates="books")
    bookmarks = relationship("Bookmark", back_populates="book", cascade="all, delete-orphan")


class Bookmark(Base):
    """書籤資料表"""
    __tablename__ = "bookmarks"

    id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, ForeignKey("books.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    chapter_index = Column(Integer, nullable=False)
    title = Column(String(255), nullable=True)
    note = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # 關聯
    book = relationship("Book", back_populates="bookmarks")

