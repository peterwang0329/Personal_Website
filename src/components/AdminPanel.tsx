/**
 * AdminPanel — 管理員後台
 * 列出所有帳號、支援刪除、重設密碼、切換管理員權限
 */

import { useState, useEffect, useCallback } from "react";
import {
  Users, Shield, ShieldOff, Trash2, KeyRound,
  RefreshCw, BookOpen, Crown, AlertTriangle, X, Check
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/apiClient";

interface AdminUser {
  id: number;
  username: string;
  display_name: string | null;
  is_admin: boolean;
  created_at: string;
  book_count: number;
}

interface Stats {
  total_users: number;
  total_admins: number;
  total_books: number;
}

type ModalType = "delete" | "reset-password" | null;

export function AdminPanel() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  // Modal state
  const [modal, setModal] = useState<ModalType>(null);
  const [targetUser, setTargetUser] = useState<AdminUser | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // 顯示 Toast 通知
  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  // 載入資料
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersData, statsData] = await Promise.all([
        apiFetch<AdminUser[]>("/api/admin/users"),
        apiFetch<Stats>("/api/admin/stats"),
      ]);
      setUsers(usersData);
      setStats(statsData);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "載入失敗");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user?.is_admin)) {
      navigate("/");
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  useEffect(() => {
    if (isAuthenticated && user?.is_admin) {
      fetchData();
    }
  }, [isAuthenticated, user, fetchData]);

  // 刪除帳號
  const handleDelete = async () => {
    if (!targetUser) return;
    setActionLoading(true);
    try {
      await apiFetch(`/api/admin/users/${targetUser.id}`, { method: "DELETE" });
      showToast(`已刪除帳號「${targetUser.username}」`);
      setModal(null);
      fetchData();
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "刪除失敗", false);
    } finally {
      setActionLoading(false);
    }
  };

  // 重設密碼
  const handleResetPassword = async () => {
    if (!targetUser || !newPassword.trim()) return;
    if (newPassword.length < 6) {
      showToast("新密碼長度至少 6 個字元", false);
      return;
    }
    setActionLoading(true);
    try {
      await apiFetch(`/api/admin/users/${targetUser.id}/reset-password`, {
        method: "PATCH",
        body: JSON.stringify({ new_password: newPassword }),
      });
      showToast(`已重設「${targetUser.username}」的密碼`);
      setModal(null);
      setNewPassword("");
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "重設密碼失敗", false);
    } finally {
      setActionLoading(false);
    }
  };

  // 切換管理員
  const handleToggleAdmin = async (u: AdminUser) => {
    try {
      const res = await apiFetch<{ message: string; is_admin: boolean }>(
        `/api/admin/users/${u.id}/toggle-admin`,
        { method: "PATCH" }
      );
      showToast(res.message);
      fetchData();
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "操作失敗", false);
    }
  };

  const openModal = (type: ModalType, u: AdminUser) => {
    setTargetUser(u);
    setModal(type);
    setNewPassword("");
  };

  const closeModal = () => {
    setModal(null);
    setTargetUser(null);
    setNewPassword("");
  };

  if (isLoading || (!isAuthenticated || !user?.is_admin)) {
    return null;
  }

  return (
    <div className="adminPage">
      <div className="container">
        {/* Header */}
        <div className="adminHeader">
          <div className="adminHeader__left">
            <div className="adminHeader__icon">
              <Crown size={22} />
            </div>
            <div>
              <h1 className="adminHeader__title">管理員後台</h1>
              <p className="adminHeader__sub">管理所有已註冊帳號</p>
            </div>
          </div>
          <button className="btn btn--ghost btn--sm" onClick={fetchData} disabled={loading}>
            <RefreshCw size={15} className={loading ? "spinning" : ""} />
            重新整理
          </button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="adminStats">
            <div className="adminStat">
              <Users size={20} className="adminStat__icon" />
              <div>
                <div className="adminStat__num">{stats.total_users}</div>
                <div className="adminStat__label">總帳號數</div>
              </div>
            </div>
            <div className="adminStat adminStat--admin">
              <Crown size={20} className="adminStat__icon" />
              <div>
                <div className="adminStat__num">{stats.total_admins}</div>
                <div className="adminStat__label">管理員數</div>
              </div>
            </div>
            <div className="adminStat adminStat--book">
              <BookOpen size={20} className="adminStat__icon" />
              <div>
                <div className="adminStat__num">{stats.total_books}</div>
                <div className="adminStat__label">書籍總數</div>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="adminError">
            <AlertTriangle size={16} />
            {error}
          </div>
        )}

        {/* User Table */}
        <div className="adminTable__wrap">
          {loading ? (
            <div className="adminLoading">
              <RefreshCw size={24} className="spinning" />
              <span>載入中…</span>
            </div>
          ) : (
            <table className="adminTable">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>帳號</th>
                  <th>顯示名稱</th>
                  <th>書籍數</th>
                  <th>身分</th>
                  <th>註冊時間</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className={u.id === user?.id ? "adminTable__row--self" : ""}>
                    <td className="adminTable__id">#{u.id}</td>
                    <td>
                      <span className="adminTable__username">
                        {u.username}
                        {u.id === user?.id && (
                          <span className="adminTable__selfBadge">（你）</span>
                        )}
                      </span>
                    </td>
                    <td className="adminTable__muted">{u.display_name || "—"}</td>
                    <td>
                      <span className="adminTable__bookCount">
                        <BookOpen size={13} />
                        {u.book_count}
                      </span>
                    </td>
                    <td>
                      {u.is_admin ? (
                        <span className="adminBadge adminBadge--admin">
                          <Crown size={12} /> 管理員
                        </span>
                      ) : (
                        <span className="adminBadge adminBadge--user">
                          <Users size={12} /> 使用者
                        </span>
                      )}
                    </td>
                    <td className="adminTable__muted">
                      {new Date(u.created_at).toLocaleDateString("zh-TW")}
                    </td>
                    <td>
                      <div className="adminTable__actions">
                        {/* 重設密碼 */}
                        <button
                          className="adminAction adminAction--key"
                          title="重設密碼"
                          onClick={() => openModal("reset-password", u)}
                        >
                          <KeyRound size={14} />
                        </button>
                        {/* 切換管理員（不能改自己） */}
                        {u.id !== user?.id && (
                          <button
                            className={`adminAction ${u.is_admin ? "adminAction--shield-off" : "adminAction--shield"}`}
                            title={u.is_admin ? "撤銷管理員" : "設為管理員"}
                            onClick={() => handleToggleAdmin(u)}
                          >
                            {u.is_admin ? <ShieldOff size={14} /> : <Shield size={14} />}
                          </button>
                        )}
                        {/* 刪除（不能刪自己） */}
                        {u.id !== user?.id && (
                          <button
                            className="adminAction adminAction--delete"
                            title="刪除帳號"
                            onClick={() => openModal("delete", u)}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* === 刪除確認 Modal === */}
      {modal === "delete" && targetUser && (
        <div className="adminModal__overlay" onClick={closeModal}>
          <div className="adminModal" onClick={(e) => e.stopPropagation()}>
            <div className="adminModal__header adminModal__header--danger">
              <Trash2 size={20} />
              <h2 className="adminModal__title">確認刪除帳號</h2>
              <button className="adminModal__close" onClick={closeModal}><X size={16} /></button>
            </div>
            <div className="adminModal__body">
              <p>確定要刪除帳號 <strong>「{targetUser.username}」</strong> 嗎？</p>
              <p className="adminModal__warn">
                <AlertTriangle size={14} />
                此操作無法復原，該帳號的所有書籍與書籤也會一併刪除。
              </p>
            </div>
            <div className="adminModal__footer">
              <button className="btn btn--ghost" onClick={closeModal}>取消</button>
              <button
                className="btn adminModal__deleteBtn"
                onClick={handleDelete}
                disabled={actionLoading}
              >
                {actionLoading ? <RefreshCw size={14} className="spinning" /> : <Trash2 size={14} />}
                確認刪除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === 重設密碼 Modal === */}
      {modal === "reset-password" && targetUser && (
        <div className="adminModal__overlay" onClick={closeModal}>
          <div className="adminModal" onClick={(e) => e.stopPropagation()}>
            <div className="adminModal__header">
              <KeyRound size={20} />
              <h2 className="adminModal__title">重設密碼 — {targetUser.username}</h2>
              <button className="adminModal__close" onClick={closeModal}><X size={16} /></button>
            </div>
            <div className="adminModal__body">
              <label className="field__label" htmlFor="adminNewPwd">新密碼（至少 6 個字元）</label>
              <input
                id="adminNewPwd"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="輸入新密碼…"
                onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
                autoFocus
              />
            </div>
            <div className="adminModal__footer">
              <button className="btn btn--ghost" onClick={closeModal}>取消</button>
              <button
                className="btn btn--primary"
                onClick={handleResetPassword}
                disabled={actionLoading || !newPassword.trim()}
              >
                {actionLoading ? <RefreshCw size={14} className="spinning" /> : <Check size={14} />}
                確認重設
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.ok ? "toast--ok" : "toast--err"}`}>
          {toast.ok ? <Check size={15} /> : <AlertTriangle size={15} />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}
