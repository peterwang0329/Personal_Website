"""
書籍路由
處理使用者的書籍清單、閱讀進度 CRUD
"""

import os
import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from database import get_db
from models import User, Book, BookContent
from fastapi.responses import FileResponse, Response
from schemas import BookCreate, BookUpdate, BookResponse
from auth import get_current_user

router = APIRouter(prefix="/api/books", tags=["書籍"])

@router.get("", response_model=list[BookResponse])
def list_books(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """取得使用者的所有書籍"""
    books = (
        db.query(Book)
        .filter(Book.user_id == current_user.id)
        .order_by(Book.last_read_at.desc())
        .all()
    )
    return books


@router.post("/upload", response_model=BookResponse, status_code=status.HTTP_201_CREATED)
async def upload_book(
    file: UploadFile = File(...),
    total_chapters: int = Form(0),
    font_size: int = Form(18),
    reader_theme: str = Form("light"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """上傳小說檔案實體並建立/更新記錄"""
    if not file.filename.endswith(".txt"):
        raise HTTPException(status_code=400, detail="僅支援 .txt 檔案")

    novel_name = file.filename.rsplit(".txt", 1)[0]
    
    # 檢查是否已存在
    existing = (
        db.query(Book)
        .filter(Book.user_id == current_user.id, Book.file_name == file.filename)
        .first()
    )

    content_bytes = await file.read()
    content_text = content_bytes.decode('utf-8', errors='ignore')

    if existing:
        existing.total_chapters = total_chapters
        existing.last_read_at = datetime.now(timezone.utc)
        
        # 更新內容
        book_content = db.query(BookContent).filter(BookContent.book_id == existing.id).first()
        if book_content:
            book_content.content = content_text
        else:
            new_content = BookContent(book_id=existing.id, content=content_text)
            db.add(new_content)
            
        db.commit()
        db.refresh(existing)
        return existing

    book = Book(
        user_id=current_user.id,
        file_name=file.filename,
        file_path="db_storage", # 不再使用實體路徑
        novel_name=novel_name,
        total_chapters=total_chapters,
        current_chapter=0,
        font_size=font_size,
        reader_theme=reader_theme,
    )
    db.add(book)
    db.flush() # 取得 book.id
    
    new_content = BookContent(book_id=book.id, content=content_text)
    db.add(new_content)
    
    db.commit()
    db.refresh(book)
    return book

@router.post("", response_model=BookResponse, status_code=status.HTTP_201_CREATED)
def create_book(
    req: BookCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """(保留給舊版相容或沒有實體檔案的情況) 新增一本書籍記錄"""
    raise HTTPException(status_code=400, detail="請使用 /upload API 上傳檔案")

@router.get("/{book_id}/download")
def download_book(
    book_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """下載/讀取書籍檔案"""
    book = db.query(Book).filter(Book.id == book_id, Book.user_id == current_user.id).first()
    if not book:
        raise HTTPException(status_code=404, detail="找不到檔案")
        
    book_content = db.query(BookContent).filter(BookContent.book_id == book.id).first()
    if not book_content:
        raise HTTPException(status_code=404, detail="找不到檔案內容")
        
    return Response(content=book_content.content, media_type="text/plain")


@router.put("/{book_id}", response_model=BookResponse)
def update_book(
    book_id: int,
    req: BookUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """更新書籍閱讀進度或偏好設定"""
    book = (
        db.query(Book)
        .filter(Book.id == book_id, Book.user_id == current_user.id)
        .first()
    )
    if not book:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="找不到此書籍")

    if req.current_chapter is not None:
        book.current_chapter = req.current_chapter
    if req.font_size is not None:
        book.font_size = req.font_size
    if req.reader_theme is not None:
        book.reader_theme = req.reader_theme

    book.last_read_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(book)
    return book


@router.delete("/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_book(
    book_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """刪除一本書籍（連同其書籤和筆記）"""
    book = (
        db.query(Book)
        .filter(Book.id == book_id, Book.user_id == current_user.id)
        .first()
    )
    if not book:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="找不到此書籍")

    db.delete(book)
    db.commit()
