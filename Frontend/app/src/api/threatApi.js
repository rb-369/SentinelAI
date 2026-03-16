const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const parseJson = async (res) => {
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(payload.error || payload.detail || "Request failed");
  }
  return payload;
};

export const analyzeThreat = async (input, inputType) => {
  const res = await fetch(`${BASE}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input, inputType }),
  });
  return parseJson(res);
};

export const getHistory = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const suffix = query ? `?${query}` : "";
  const res = await fetch(`${BASE}/history${suffix}`);
  return parseJson(res);
};

export const getStats = async () => {
  const res = await fetch(`${BASE}/stats`);
  return parseJson(res);
};

export const clearHistory = async () => {
  const res = await fetch(`${BASE}/history`, { method: "DELETE" });
  return parseJson(res);
};
