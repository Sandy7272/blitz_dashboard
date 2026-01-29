import axios from 'axios';

// Ensure this matches your Flask backend URL
const API_BASE = 'https://blitzapi.metashopai.com/api';

export const api = {
  // 1. Create Job & Get Upload URL (For Photos)
  createPhotoJob: async (fileTypes: string[]) => {
    const res = await axios.post(`${API_BASE}/create-photos-only-job`, { fileTypes });
    return res.data; // Returns { jobId, uploadUrls: [{url, key}] }
  },

  // 2. Create Job (For Audit)
  createAuditJob: async (url: string) => {
    const res = await axios.post(`${API_BASE}/create-audit-job`, { url });
    return res.data; // Returns { jobId, message }
  },

  // 3. Upload File to S3 directly
  uploadToS3: async (presignedUrl: string, file: File) => {
    await axios.put(presignedUrl, file, {
      headers: { 'Content-Type': file.type }
    });
  },

  // 4. Trigger Processing (Celery Task)
  startProcessing: async (jobId: string, mode: string, config: any = {}) => {
    const res = await axios.post(`${API_BASE}/start-processing`, {
      jobId,
      mode,
      config
    });
    return res.data;
  },

  // 5. Check Status
  getJobStatus: async (jobId: string) => {
    const res = await axios.get(`${API_BASE}/job-status/${jobId}`);
    return res.data;
  },

  // 6. Dashboard Stats
  getDashboardStats: async () => {
    const res = await axios.get(`${API_BASE}/dashboard-stats`);
    return res.data;
  },

  // 7. Analyze Brand (Sync)
  analyzeBrand: async (url: string) => {
    const res = await axios.post(`${API_BASE}/analyze-brand-sync`, { url });
    return res.data; // { voice, colors, instagram_style }
  }
};