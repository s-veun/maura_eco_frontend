export type Role = "USER" | "ADMIN" | string;

export interface AuthUser {
  id: number;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role: Role;
  provider?: string;
  profileImage?: string;
  profileImageUrl?: string;
  createdAt?: string;
  lastLoginAt?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export interface LoginResponse {
  accessToken?: string;
  refreshToken?: string;
  token?: string;
  jwt?: string;
  user?: AuthUser;
  [key: string]: unknown;
}

export interface RefreshResponse {
  accessToken?: string;
  refreshToken?: string;
  token?: string;
  jwt?: string;
  [key: string]: unknown;
}

export interface StoredSession {
  accessToken: string;
  refreshToken?: string;
  user: AuthUser;
  remember: boolean;
}

