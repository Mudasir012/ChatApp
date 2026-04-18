const API_BASE = import.meta.env.VITE_API_BASE || "";

const createRequest = async (path, options = {}) => {
  const headers = options.headers ? { ...options.headers } : {};

  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.error || "Request failed");
  }

  return data;
};

// Users
export const searchUsers = async (query) => {
  return createRequest(`/api/users/search?q=${encodeURIComponent(query)}`);
};

// Groups & Boards
export const getGroups = async () => {
  return createRequest("/api/groups");
};

export const createGroup = async (payload) => {
  return createRequest("/api/groups", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const createBoard = async (groupId, payload) => {
  return createRequest(`/api/groups/${groupId}/boards`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

// Direct Messages
export const getDMs = async () => {
  return createRequest("/api/dms");
};

export const createDM = async (targetUserId) => {
  return createRequest("/api/dms", {
    method: "POST",
    body: JSON.stringify({ targetUserId }),
  });
};

// Messages
export const getMessages = async (roomKey) => {
  return createRequest(`/api/messages/${roomKey}`);
};

export const postMessage = async (message) => {
  return createRequest("/api/messages", {
    method: "POST",
    body: JSON.stringify(message),
  });
};
