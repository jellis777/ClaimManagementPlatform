export interface AuthUser {
  email: string;
  role: string;
}

export interface AuthResponse {
  email: string;
  role: string;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}
