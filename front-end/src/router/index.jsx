import { Navigate } from 'react-router-dom';

/**
 * 路由守卫：未登录跳转到登录页
 */
export function AuthGuard({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

/**
 * 游客守卫：已登录跳转到首页
 */
export function GuestGuard({ children }) {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/" replace />;
  }
  return children;
}
