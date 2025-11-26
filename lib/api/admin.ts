/**
 * Admin API endpoints
 */

import { apiClient } from './client';
import { User } from './auth';


export interface AdminStats {
  totalUsers: number;
  totalConversations: number;
  totalMessages: number;
  activeUsers: number;
}

export interface SystemSettings {
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  rateLimit: number;
}

export const adminApi = {
  async getStats(): Promise<AdminStats> {
    return apiClient.get<AdminStats>('/admin/stats');
  },

  async getUsers(): Promise<User[]> {
    return apiClient.get<User[]>('/admin/users');
  },

  async getUser(userId: string): Promise<User> {
    return apiClient.get<User>(`/admin/users/${userId}`);
  },

  async updateUser(userId: string, data: Partial<User>): Promise<User> {
    return apiClient.put<User>(`/admin/users/${userId}`, data);
  },

  async deleteUser(userId: string): Promise<void> {
    return apiClient.delete(`/admin/users/${userId}`);
  },

  async getSystemSettings(): Promise<SystemSettings> {
    return apiClient.get<SystemSettings>('/admin/settings');
  },

  async updateSystemSettings(settings: Partial<SystemSettings>): Promise<SystemSettings> {
    return apiClient.put<SystemSettings>('/admin/settings', settings);
  },
};

export type {User};