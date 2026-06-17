import type { User } from "@repo/types";
import type { UserFormData } from "../utils/userSchema";
import type { SearchUsersRequest, SearchUsersResponse } from "../utils/filters";

const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000/users").replace(/\/users$/, "");
const USERS_API_URL = `${BASE_URL}/users`;
const AUTH_API_URL = `${BASE_URL}/auth`;

const getHeaders = (contentType = true) => {
  const headers: Record<string, string> = {};
  if (contentType) {
    headers["Content-Type"] = "application/json";
  }
  const token = localStorage.getItem("token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

const getErrorMessage = async (response: Response, fallback: string) => {
  try {
    const error = await response.json();
    return error.message || fallback;
  } catch {
    return fallback;
  }
};

const handleResponse = async (response: Response, fallback: string) => {
  if (response.status === 401) {
    window.dispatchEvent(new Event("auth-unauthorized"));
    throw new Error("Session expired. Please log in again.");
  }
  if (!response.ok) {
    const errorMsg = await getErrorMessage(response, fallback);
    throw new Error(errorMsg);
  }
  return response.json();
};

export const getUsers = async (): Promise<User[]> => {
  const response = await fetch(USERS_API_URL, {
    headers: getHeaders(false),
  });
  return handleResponse(response, "Failed to fetch users");
};

export const createUser = async (data: UserFormData): Promise<User> => {
  const response = await fetch(USERS_API_URL, {
    method: "POST",
    headers: getHeaders(true),
    body: JSON.stringify(data),
  });
  return handleResponse(response, "Failed to create user");
};

export const updateUser = async (
  id: string,
  data: UserFormData,
): Promise<User> => {
  const response = await fetch(`${USERS_API_URL}/${id}`, {
    method: "PATCH",
    headers: getHeaders(true),
    body: JSON.stringify(data),
  });
  return handleResponse(response, "Failed to update user");
};

export const deleteUser = async (id: string): Promise<{ message: string }> => {
  const response = await fetch(`${USERS_API_URL}/${id}`, {
    method: "DELETE",
    headers: getHeaders(false),
  });
  return handleResponse(response, "Failed to delete user");
};

export const searchUsers = async (payload: SearchUsersRequest): Promise<SearchUsersResponse> => { 
  const response = await fetch(`${USERS_API_URL}/search`, {
    method: "POST",
    headers: getHeaders(true),
    body: JSON.stringify(payload),
  });
  return handleResponse(response, "Failed to search users");
};

export const loginUser = async (email: string, password: string): Promise<{ accessToken: string }> => {
  const response = await fetch(`${AUTH_API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response, "Invalid credentials");
};

export const registerUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
): Promise<{ message: string }> => {
  const response = await fetch(`${AUTH_API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firstName, lastName, email, password }),
  });
  return handleResponse(response, "Registration failed");
};

export const getMe = async (): Promise<User> => {
  const response = await fetch(`${AUTH_API_URL}/me`, {
    headers: getHeaders(false),
  });
  return handleResponse(response, "Failed to retrieve user profile");
};