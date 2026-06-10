"""
管理員路由
提供帳號管理相關 API（需要管理員權限）
"""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session

from database import get_db
from models import User, Book
from schemas import UserResponse
from auth import get_current_admin, hash_password

router = APIRouter(prefix="/api/admin", tags=["管理員"])


# ── 請求/回應 Schema ──────────────────────────────────────

class AdminUserResponse(BaseModel):
    """管理員視角的使用者資訊（包含書籍數量）"""
    id: int
    username: str
    display_name: Optional[str]
    is_admin: bool
    created_at: str
    book_count: int

    model_config = {"from_attributes": True}


class ResetPasswordRequest(BaseModel):
    """重設密碼請求"""
    new_password: str


class UpdateDisplayNameRequest(BaseModel):
    """修改顯示名稱請求"""
    display_name: str


# ── 路由 ──────────────────────────────────────────────────

@router.get("/users", response_model=list[AdminUserResponse])
def list_all_users(
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """取得所有已註冊的帳號清單（含書籍數量）"""
    users = db.query(User).order_by(User.id.asc()).all()
    result = []
    for u in users:
        book_count = db.query(Book).filter(Book.user_id == u.id).count()
        result.append(AdminUserResponse(
            id=u.id,
            username=u.username,
            display_name=u.display_name,
            is_admin=u.is_admin,
            created_at=u.created_at.isoformat(),
            book_count=book_count,
        ))
    return result


@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """刪除指定帳號（不能刪除自己）"""
    if user_id == current_admin.id:
        raise HTTPException(status_code=400, detail="不能刪除自己的帳號")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="找不到此帳號")

    db.delete(user)
    db.commit()


@router.patch("/users/{user_id}/reset-password", response_model=dict)
def reset_password(
    user_id: int,
    body: ResetPasswordRequest,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """重設指定帳號的密碼"""
    if len(body.new_password) < 6:
        raise HTTPException(status_code=400, detail="新密碼長度至少 6 個字元")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="找不到此帳號")

    user.password_hash = hash_password(body.new_password)
    db.commit()
    return {"message": f"帳號 {user.username} 的密碼已重設"}


@router.patch("/users/{user_id}/toggle-admin", response_model=dict)
def toggle_admin(
    user_id: int,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """切換指定帳號的管理員權限（不能修改自己）"""
    if user_id == current_admin.id:
        raise HTTPException(status_code=400, detail="不能修改自己的管理員權限")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="找不到此帳號")

    user.is_admin = not user.is_admin
    db.commit()
    status_text = "管理員" if user.is_admin else "一般使用者"
    return {"message": f"帳號 {user.username} 已設為{status_text}", "is_admin": user.is_admin}


@router.patch("/users/{user_id}/display-name", response_model=dict)
def update_display_name(
    user_id: int,
    body: UpdateDisplayNameRequest,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """修改指定帳號的顯示名稱"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="找不到此帳號")

    user.display_name = body.display_name.strip()
    db.commit()
    return {"message": f"帳號 {user.username} 的顯示名稱已更新"}


@router.get("/stats", response_model=dict)
def get_stats(
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """取得系統統計資訊"""
    total_users = db.query(User).count()
    total_admins = db.query(User).filter(User.is_admin == True).count()
    total_books = db.query(Book).count()
    return {
        "total_users": total_users,
        "total_admins": total_admins,
        "total_books": total_books,
    }
