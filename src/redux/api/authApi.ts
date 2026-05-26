import { baseApi } from "./baseApi";

type GenericApiResponse = Record<string, unknown>;
type LoginResponse = {
  token?: string;
  jwt?: string;
  accessToken?: string;
  refreshToken?: string;
} & GenericApiResponse;
type AddressInput = {
  fullName: string;
  phoneNumber?: string;
  city: string;
  district: string;
  detailsAddress: string;
  userId: number;
};

const AUTH_REFRESH_ENDPOINT = process.env.NEXT_PUBLIC_AUTH_REFRESH_PATH || "/auth/refresh-token";
const AUTH_LOGOUT_ENDPOINT = process.env.NEXT_PUBLIC_AUTH_LOGOUT_PATH || "/auth/logout";
const AUTH_FORGOT_PASSWORD_ENDPOINT = process.env.NEXT_PUBLIC_AUTH_FORGOT_PASSWORD_PATH || "/auth/forgot-password";
const AUTH_RESET_PASSWORD_ENDPOINT = process.env.NEXT_PUBLIC_AUTH_RESET_PASSWORD_PATH || "/auth/reset-password";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // -- Auth ----------------------------------------------------------------
    login: builder.mutation<LoginResponse, { username: string; password: string }>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),

    register: builder.mutation<
      GenericApiResponse,
      {
        username: string;
        password: string;
        email?: string;
        firstName?: string;
        lastName?: string;
        phoneNumber?: string;
      }
    >({
      query: (userData) => ({
        url: "/register",
        method: "POST",
        body: userData,
      }),
    }),

    logout: builder.mutation<GenericApiResponse, { refreshToken?: string } | void>({
      query: (body) => ({
        url: AUTH_LOGOUT_ENDPOINT,
        method: "POST",
        body,
      }),
    }),

    refreshAuthToken: builder.mutation<GenericApiResponse, { refreshToken?: string } | void>({
      query: (body) => ({
        url: AUTH_REFRESH_ENDPOINT,
        method: "POST",
        body,
      }),
    }),

    forgotPassword: builder.mutation<GenericApiResponse, { email: string }>({
      query: (body) => ({
        url: AUTH_FORGOT_PASSWORD_ENDPOINT,
        method: "POST",
        body,
      }),
    }),

    resetPassword: builder.mutation<GenericApiResponse, { token: string; newPassword: string }>({
      query: (body) => ({
        url: AUTH_RESET_PASSWORD_ENDPOINT,
        method: "POST",
        body,
      }),
    }),

    getUserProfile: builder.query<GenericApiResponse, void>({
      query: () => "/user/profile",
      providesTags: ["Profile"],
    }),

    // PUT /api/v1/profile/change-password
    changePassword: builder.mutation<
      GenericApiResponse,
      { oldPassword: string; newPassword: string }
    >({
      query: (body) => ({
        url: "/profile/change-password",
        method: "PUT",
        body,
      }),
    }),

    // PUT /api/v1/profile/update
    updateProfile: builder.mutation<
      GenericApiResponse,
      { username?: string; email?: string; phoneNumber?: string }
    >({
      query: (body) => ({
        url: "/profile/update",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Profile"],
    }),

    // -- Addresses -----------------------------------------------------------
    // GET /api/v1/addresses/user/{userId}
    getAddresses: builder.query<GenericApiResponse[], number>({
      query: (userId) => `/addresses/user/${userId}`,
      providesTags: ["Profile"],
    }),

    // POST /api/v1/addresses/add
    addAddress: builder.mutation<GenericApiResponse, AddressInput>({
      query: (body) => ({
        url: "/addresses/add",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Profile"],
    }),

    // PUT /api/v1/addresses/update/{addressId}
    updateAddress: builder.mutation<GenericApiResponse, { addressId: number; body: GenericApiResponse }>({
      query: ({ addressId, body }) => ({
        url: `/addresses/update/${addressId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Profile"],
    }),

    // DELETE /api/v1/addresses/delete/{addressId}
    deleteAddress: builder.mutation<string, number>({
      query: (addressId) => ({
        url: `/addresses/delete/${addressId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useRefreshAuthTokenMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetUserProfileQuery,
  useChangePasswordMutation,
  useUpdateProfileMutation,
  useGetAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = authApi;
