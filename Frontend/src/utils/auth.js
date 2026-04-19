const API_BASE = import.meta.env.VITE_API_BASE || "";
const STORAGE_USER = "chatapp_user";

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

export const signIn = async (credentials) => {
  const result = await createRequest("/api/auth/signin", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
  localStorage.setItem(STORAGE_USER, JSON.stringify(result.user));
  return result.user;
};

export const signUp = async (credentials) => {
  const result = await createRequest("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
  localStorage.setItem(STORAGE_USER, JSON.stringify(result.user));
  return result.user;
};

export const fetchMe = async () => {
  const result = await createRequest("/api/auth/me");
  localStorage.setItem(STORAGE_USER, JSON.stringify(result.user));
  return result.user;
};

export const updateProfile = async (profile) => {
  const result = await createRequest("/api/auth/profile", {
    method: "PUT",
    body: JSON.stringify(profile),
  });
  localStorage.setItem(STORAGE_USER, JSON.stringify(result.user));
  return result.user;
};

export const signOut = async () => {
  await createRequest("/api/auth/signout", { method: "POST" }).catch(() => {});
  localStorage.removeItem(STORAGE_USER);
};

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_USER) || "null");
  } catch {
    return null;
  }
};
