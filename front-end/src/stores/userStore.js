import { create } from 'zustand';
import { login as loginApi, logout as logoutApi, getMe } from '../api/auth';

const useUserStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,

  /**
   * 登录
   */
  login: async (tenantCode, username, password) => {
    const { data } = await loginApi({ tenantCode, username, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    set({ user: data.user, token: data.token });
  },

  /**
   * 获取当前用户信息
   */
  fetchUserInfo: async () => {
    const { data } = await getMe();
    localStorage.setItem('user', JSON.stringify(data));
    set({ user: data });
  },

  /**
   * 登出
   */
  logout: async () => {
    try {
      await logoutApi();
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ user: null, token: null });
    }
  },

  /**
   * 是否已登录
   */
  get isLoggedIn() {
    return !!localStorage.getItem('token');
  },
}));

export default useUserStore;
