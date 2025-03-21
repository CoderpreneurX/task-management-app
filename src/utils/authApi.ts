import api from "./axiosInstance";

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
  };
  token: string;
}

export const registerUser = async (userData: RegisterData): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>("/auth/register", userData);
  return data;
};

export const loginUser = async (data: LoginData) => {
  const response = await api.post("/auth/login", data);
  return response.data;
}

export const logoutUser = async (): Promise<void> => {
  await api.post("/auth/logout");
};

export const fetchUser = async (): Promise<AuthResponse["user"]> => {
  const { data } = await api.get<AuthResponse["user"]>("/auth/me");
  return data;
};
