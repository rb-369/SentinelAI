const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const TOKEN_KEY = "threatlens_auth_token";

const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

const buildHeaders = (hasJsonBody = false) => {
  const headers = {};
  if (hasJsonBody) {
    headers["Content-Type"] = "application/json";
  }

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const parseJson = async (res) => {
  const raw = await res.text();
  let payload = {};

  if (raw) {
    try {
      payload = JSON.parse(raw);
    } catch {
      payload = {};
    }
  }

  if (!res.ok) {
    const fallback = raw && raw.trim() ? raw.slice(0, 200) : "";
    throw new Error(payload.error || payload.detail || fallback || `Request failed (${res.status})`);
  }

  return payload;
};

const request = async (path, options = {}) => {
  const res = await fetch(`${BASE}${path}`, options);
  return parseJson(res);
};

export const registerUser = async (payload) => {
  const response = await request("/auth/register", {
    method: "POST",
    headers: buildHeaders(true),
    body: JSON.stringify(payload),
  });
  setToken(response.data?.token);
  return response;
};

export const loginUser = async (payload) => {
  const response = await request("/auth/login", {
    method: "POST",
    headers: buildHeaders(true),
    body: JSON.stringify(payload),
  });
  setToken(response.data?.token);
  return response;
};

export const logoutUser = async () => {
  const response = await request("/auth/logout", {
    method: "POST",
    headers: buildHeaders(),
  });
  clearToken();
  return response;
};

export const getCurrentUser = async () => {
  return request("/auth/me", {
    method: "GET",
    headers: buildHeaders(),
  });
};

export const analyzeThreat = async (input, inputType) => {
  return request("/analyze", {
    method: "POST",
    headers: buildHeaders(true),
    body: JSON.stringify({ input, inputType }),
  });
};

export const analyzeScreenshot = async (file, contextText = "") => {
  const formData = new FormData();
  formData.append("screenshot", file);
  formData.append("contextText", contextText);

  return request("/analyze-screenshot", {
    method: "POST",
    headers: buildHeaders(false),
    body: formData,
  });
};

export const reportThreat = async (threatId, notes = "") => {
  if (!threatId) {
    throw new Error("threatId is required");
  }

  return request(`/threats/${threatId}/report`, {
    method: "POST",
    headers: buildHeaders(true),
    body: JSON.stringify({ notes }),
  });
};

export const getAreaThreatIntelligence = async (location = "") => {
  const query = location ? `?location=${encodeURIComponent(location)}` : "";
  return request(`/area-threat-intelligence${query}`, {
    method: "GET",
    headers: buildHeaders(),
  });
};

export const getHistory = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const suffix = query ? `?${query}` : "";
  return request(`/history${suffix}`, {
    method: "GET",
    headers: buildHeaders(),
  });
};

export const getStats = async () => {
  return request("/stats", {
    method: "GET",
    headers: buildHeaders(),
  });
};

export const clearHistory = async () => {
  return request("/history", {
    method: "DELETE",
    headers: buildHeaders(),
  });
};
