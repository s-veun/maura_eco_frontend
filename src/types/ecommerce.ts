export type ApiListResponse<T> =
  | T[]
  | {
      data?: T[];
      content?: T[];
      products?: T[];
      items?: T[];
    };

export type ApiEntityResponse<T> =
  | T
  | {
      data?: T;
      item?: T;
      product?: T;
      user?: T;
    };

export type PaginatedQuery = {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
};

export type ProductFilterQuery = PaginatedQuery & {
  keyword?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  brand?: string;
};

export type AuthCredentials = {
  username: string;
  password: string;
};

export type RegisterPayload = {
  username: string;
  password: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  token: string;
  newPassword: string;
};

