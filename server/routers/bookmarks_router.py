from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models import User, Book, Bookmark
from schemas import BookmarkCreate, BookmarkResponse
from auth import get_current_user

router = APIRouter(tags=["書籤"])

@router.get("/api/books/{book_id}/bookmarks", response_model=list[BookmarkResponse])
def list_bookmarks(
    book_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """取得書籍的所有書籤"""
    bookmarks = (
        db.query(Bookmark)
        .filter(Bookmark.book_id == book_id, Bookmark.user_id == current_user.id)
        .order_by(Bookmark.chapter_index.asc(), Bookmark.created_at.desc())
        .all()
    )
    return bookmarks

@router.post("/api/books/{book_id}/bookmarks", response_model=BookmarkResponse, status_code=status.HTTP_201_CREATED)
def create_bookmark(
    book_id: int,
    req: BookmarkCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """新增書籤"""
    book = db.query(Book).filter(Book.id == book_id, Book.user_id == current_user.id).first()
    if not book:
        raise HTTPException(status_code=404, detail="找不到此書籍")
    
    bookmark = Bookmark(
        book_id=book_id,
        user_id=current_user.id,
        chapter_index=req.chapter_index,
        title=req.title,
        note=req.note
    )
    db.add(bookmark)
    db.commit()
    db.refresh(bookmark)
    return bookmark

@router.delete("/api/bookmarks/{bookmark_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_bookmark(
    bookmark_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """刪除書籤"""
    bookmark = (
        db.query(Bookmark)
        .filter(Bookmark.id == bookmark_id, Bookmark.user_id == current_user.id)
        .first()
    )
    if not bookmark:
        raise HTTPException(status_code=404, detail="找不到此書籤")
    
    db.delete(bookmark)
    db.commit()
