import type { User } from "@repo/types";
import type { UserFormData } from "../utils/userSchema";
import type { SearchUsersRequest, SearchUsersResponse } from "../utils/filters";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/users";

const getErrorMessage = async (response: Response, fallback: string) => {
  try {
    const error = await response.json();
    return error.message || fallback;
  } catch {
    return fallback;
  }
};

export const getUsers = async (): Promise<User[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
};

export const createUser = async (data: UserFormData): Promise<User> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Failed to create user"));
  }

  return response.json();
};

export const updateUser = async (
  id: string,
  data: UserFormData,
): Promise<User> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Failed to update user"));
  }

  return response.json();
};

export const deleteUser = async (id: string): Promise<{ message: string }> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Failed to delete user"));
  }

  return response.json();
};


export const searchUsers = async (payload: SearchUsersRequest): Promise<SearchUsersResponse> => { 
  const response = await fetch(`${API_URL}/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  console.log("Search Users Payload:", payload);
  if (!response.ok) {
    console.error("Search Users Error Response:", response);
    throw new Error(await getErrorMessage(response, "Failed to search users"));
  }
  return response.json();
}