/**
 * Centralized API Service
 * Handles authentication tokens, error handling, and request/response interceptors
 */

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// Ensure this matches your Flask backend URL
const API_BASE = 'https://blitzapi.metashopai.com/api';

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token getter function - will be set by auth module
let getAuthToken: (() => Promise<string>) | null = null;

export function setAuthTokenGetter(getter: () => Promise<string>) {
  getAuthToken = getter;
}

// Request interceptor - attach auth token
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (getAuthToken) {
      try {
        const token = await getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.warn('Failed to get auth token:', error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      console.error('Unauthorized request - token may be expired');
      // Could trigger re-authentication here
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Forbidden - insufficient permissions');
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network error - check your connection');
    }

    return Promise.reject(error);
  }
);

// API Response types
export interface JobCreateResponse {
  jobId: string;
  uploadUrls?: Array<{ url: string; key: string }>;
  message?: string;
}

export interface JobStatusResponse {
  status: string; // Flexible to handle various backend states
  progress?: number;
  result?: unknown;
  error?: string;
  // Result URL variants from backend
  result_urls?: string[];
  result_url?: string;
  photo_urls?: string[];
  clean_photo_urls?: string[];
  social_copy?: {
    headline: string;
    caption: string;
    hashtags: string[];
  } | string;
}

export interface DashboardStats {
  totalJobs: number;
  completedJobs: number;
  audits_completed?: number;
  three_d_requests?: number;
  system_health?: { status: string } | number;
  credits: number;
  usage: Array<{ date: string; count: number }>;
}

export interface BrandAnalysis {
  voice: string;
  colors: string[] | { primary: string; secondary: string };
  instagram_style: string;
}

// API methods with proper typing
export const api = {
  // 1. Create Job & Get Upload URL (For Photos)
  createPhotoJob: async (fileTypes: string[]): Promise<JobCreateResponse> => {
    const res = await axiosInstance.post('/create-photos-only-job', { fileTypes });
    return res.data;
  },

  // 2. Create Job (For Audit)
  createAuditJob: async (url: string): Promise<JobCreateResponse> => {
    const res = await axiosInstance.post('/create-audit-job', { url });
    return res.data;
  },

  // 3. Upload File to S3 directly
  uploadToS3: async (presignedUrl: string, file: File): Promise<void> => {
    await axios.put(presignedUrl, file, {
      headers: { 'Content-Type': file.type },
    });
  },

  // 4. Trigger Processing (Celery Task)
  startProcessing: async (
    jobId: string,
    mode: string,
    config: Record<string, unknown> = {}
  ): Promise<{ message: string }> => {
    const res = await axiosInstance.post('/start-processing', {
      jobId,
      mode,
      config,
    });
    return res.data;
  },

  // 5. Check Status
  getJobStatus: async (jobId: string): Promise<JobStatusResponse> => {
    const res = await axiosInstance.get(`/job-status/${jobId}`);
    return res.data;
  },

  // 6. Dashboard Stats
  getDashboardStats: async (): Promise<DashboardStats> => {
    const res = await axiosInstance.get('/dashboard-stats');
    return res.data;
  },

  // 7. Analyze Brand (Sync)
  analyzeBrand: async (url: string): Promise<BrandAnalysis> => {
    const res = await axiosInstance.post('/analyze-brand-sync', { url });
    return res.data;
  },

  // 8. User Profile
  getUserProfile: async (): Promise<{ name: string; email: string; plan: string; credits: number }> => {
    const res = await axiosInstance.get('/user/profile');
    return res.data;
  },

  // 9. Update User Profile
  updateUserProfile: async (data: { name?: string; preferences?: Record<string, unknown> }): Promise<void> => {
    await axiosInstance.patch('/user/profile', data);
  },
};

// Export the axios instance for direct use if needed
export { axiosInstance };
