export type LoginRequestDto = {
  username: string;
  password: string;
};

export type RegisterRequestDto = {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
};

export type LoginResponseDto = {
  success?: boolean;
  message?: string;
  accessToken?: string;
  refreshToken?: string;
  token?: string;
  tokenType?: string;
  username?: string;
  role?: string;
  id?: number;
};

export type RefreshTokenResponseDto = {
  accessToken?: string;
  refreshToken?: string;
  token?: string;
};

