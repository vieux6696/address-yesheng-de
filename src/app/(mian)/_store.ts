import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { IUser } from './_type';

interface StoreState {
  user: IUser.asObject | null;
  userHistory: IUser.asObject[];
  isHistoryDrawerOpen: boolean;
  coord: [number, number];
  country_code: string; // 可选属性，可能用于存储国家代码
  loadingAddress: boolean; // 是否正在加载地址信息
  hideMapTips: boolean; // 是否显示提示信息
  setHideMapTips: (show: boolean) => void;
  setCountryCode: (code: string) => void;
  setCoord: (coord: [number, number]) => void;
  setUser: (user: IUser.asObject) => void;
  addToHistory: (user: IUser.asObject) => void;
  clearHistory: () => void;
  setHistoryDrawerOpen: (open: boolean) => void;
  setLoadingAddress: (loading: boolean) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      user: null,
      coord: [0, 0],
      country_code: 'us', // 初始化为 undefined
      userHistory: [],
      loadingAddress: false,
      isHistoryDrawerOpen: false,
      hideMapTips: false,
      setHideMapTips: (show: boolean) => set({ hideMapTips: show }),
      setLoadingAddress: (loading: boolean) => set({ loadingAddress: loading }),
      setCountryCode: (code: string) => set({ country_code: code }),
      setCoord: (coord: [number, number]) => set({ coord }),
      setUser: (user: IUser.asObject) => {
        set({ user });
        // 添加到历史记录
        get().addToHistory(user);
      },
      addToHistory: (user: IUser.asObject) => {
        const currentHistory = get().userHistory;
        // 避免重复添加相同的用户（基于邮箱判断）
        const isDuplicate = currentHistory.some(
          (historyUser) => historyUser.email === user.email
        );
        if (!isDuplicate) {
          const newHistory = [user, ...currentHistory]; // 只保留最近20条记录
          set({ userHistory: newHistory });
        }
      },
      clearHistory: () => set({ userHistory: [] }),
      setHistoryDrawerOpen: (open: boolean) =>
        set({ isHistoryDrawerOpen: open }),
    }),
    {
      name: 'user-storage', // 存储名称
      storage: createJSONStorage(() => localStorage), // 存储介质
    }
  )
);
