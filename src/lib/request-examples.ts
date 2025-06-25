/**
 * 简化的请求工具使用示例
 */

import { HttpClient, get, post, put, del, upload } from './request';

// ================ 基础使用 ================

// 使用默认实例
export const basicUsage = {
  // GET 请求
  async getUsers() {
    const response = await get<User[]>('/api/users');
    return response.data;
  },

  // GET 请求带参数
  async searchUsers(keyword: string) {
    const response = await get('/api/users', { keyword, page: 1 });
    return response.data;
  },

  // POST 请求
  async createUser(userData: CreateUserData) {
    const response = await post<User>('/api/users', userData);
    return response.data;
  },

  // PUT 请求
  async updateUser(id: number, userData: Partial<User>) {
    const response = await put<User>(`/api/users/${id}`, userData);
    return response.data;
  },

  // DELETE 请求
  async deleteUser(id: number) {
    const response = await del(`/api/users/${id}`);
    return response.ok;
  },

  // 文件上传
  async uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await upload<{ url: string }>('/api/upload', formData);
    return response.data;
  },
};

// ================ 创建专用客户端 ================

// API 客户端
const apiClient = new HttpClient({
  baseURL: 'https://api.example.com',
  headers: {
    Authorization: 'Bearer your-token',
  },
  timeout: 15000,
});

// 用户 API
export const userAPI = {
  async getProfile() {
    const response = await apiClient.get<UserProfile>('/user/profile');
    return response.data;
  },

  async updateProfile(data: Partial<UserProfile>) {
    const response = await apiClient.put('/user/profile', data);
    return response.data;
  },

  async getUsers(page = 1, size = 20) {
    const response = await apiClient.get('/users', { page, size });
    return response.data;
  },
};

// 第三方 API 客户端
const geoClient = new HttpClient({
  baseURL: 'https://nominatim.openstreetmap.org',
  timeout: 8000,
});

export const geoAPI = {
  async search(query: string) {
    const response = await geoClient.get<GeoResult[]>('/search', {
      q: query,
      format: 'json',
      limit: 10,
    });
    return response.data;
  },

  async reverseGeocode(lat: number, lon: number) {
    const response = await geoClient.get<ReverseGeoResult>('/reverse', {
      lat,
      lon,
      format: 'json',
      zoom: 18,
    });
    return response.data;
  },
};

// ================ 错误处理 ================

export const withErrorHandling = {
  async safeRequest<T>(requestFn: () => Promise<T>): Promise<T | null> {
    try {
      return await requestFn();
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  async getUserWithRetry(id: number, maxRetries = 3): Promise<User | null> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await get<User>(`/api/users/${id}`);
        return response.data;
      } catch (error) {
        console.error(error);
        if (i === maxRetries - 1) {
          console.error('获取用户失败，已重试', maxRetries, '次');
          return null;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
    return null;
  },
};

// ================ 类型定义 ================

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

interface UserProfile extends User {
  bio?: string;
  phone?: string;
}

interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

interface GeoResult {
  display_name: string;
  lat: string;
  lon: string;
}

interface ReverseGeoResult {
  display_name: string;
  address: {
    road?: string;
    city?: string;
    country?: string;
  };
}
