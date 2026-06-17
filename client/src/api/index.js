import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : "/api",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 — token expired, log out
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ── Auth ──
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  me: () => api.get("/auth/me"),
  verifyEmail: (token) => api.post("/auth/verify-email", { token }),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (data) => api.post("/auth/reset-password", data),
};

// ── Users ──
export const usersAPI = {
  getProfile: () => api.get("/users/profile"),
  updateProfile: (data) => api.put("/users/profile", data),
  changePassword: (data) => api.put("/users/password", data),
  uploadAvatar: (formData) => api.post("/users/avatar", formData, { headers: { "Content-Type": "multipart/form-data" } }),
  getSavedMentors: () => api.get("/users/saved-mentors"),
  toggleSaveMentor: (mentorId) => api.post(`/users/saved-mentors/${mentorId}`),
};

// ── Mentors ──
export const mentorsAPI = {
  getAll: (params) => api.get("/mentors", { params }),
  getById: (id) => api.get(`/mentors/${id}`),
  apply: (data) => api.post("/mentors/apply", data),
  getApplicationStatus: () => api.get("/mentors/application/status"),
  updateProfile: (data) => api.put("/mentors/profile", data),
  getAvailability: () => api.get("/mentors/availability/me"),
  setAvailability: (data) => api.put("/mentors/availability", data),
  updatePricing: (data) => api.put("/mentors/pricing", data),
  getEarnings: () => api.get("/mentors/earnings/me"),
};

// ── Sessions ──
export const sessionsAPI = {
  getMySessions: () => api.get("/sessions"),
  book: (data) => api.post("/sessions", data),
  getById: (id) => api.get(`/sessions/${id}`),
  cancel: (id) => api.put(`/sessions/${id}/cancel`),
  complete: (id) => api.put(`/sessions/${id}/complete`),
  getRoom: (id) => api.get(`/sessions/${id}/room`),
};

// ── Messages ──
export const messagesAPI = {
  getConversations: () => api.get("/messages"),
  getThread: (userId) => api.get(`/messages/${userId}`),
  send: (userId, data) => api.post(`/messages/${userId}`, data),
};

// ── Reviews ──
export const reviewsAPI = {
  getMentorReviews: (mentorId) => api.get(`/reviews/mentor/${mentorId}`),
  leave: (data) => api.post("/reviews", data),
  edit: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
};

// ── Roadmaps ──
export const roadmapsAPI = {
  getAll: () => api.get("/roadmaps"),
  getById: (id) => api.get(`/roadmaps/${id}`),
  create: (data) => api.post("/roadmaps", data),
  update: (id, data) => api.put(`/roadmaps/${id}`, data),
  delete: (id) => api.delete(`/roadmaps/${id}`),
};

// ── Payments ──
export const paymentsAPI = {
  createCheckout: (data) => api.post("/payments/checkout", data),
  getHistory: () => api.get("/payments/history"),
  subscribe: (data) => api.post("/payments/subscribe", data),
  cancelSubscription: () => api.post("/payments/cancel-sub"),
};

// ── Notifications ──
export const notificationsAPI = {
  getAll: () => api.get("/notifications"),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put("/notifications/read-all"),
};

// ── Admin ──
export const adminAPI = {
  getDashboard: () => api.get("/admin/dashboard"),
  getApplications: () => api.get("/admin/applications"),
  reviewApplication: (id, data) => api.put(`/admin/applications/${id}`, data),
  getUsers: () => api.get("/admin/users"),
  editUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getSessions: () => api.get("/admin/sessions"),
  getRevenue: () => api.get("/admin/revenue"),
  getAnalytics: () => api.get("/admin/analytics"),
  getSettings: () => api.get("/admin/settings"),
  updateSettings: (data) => api.put("/admin/settings", data),
};

export default api;
