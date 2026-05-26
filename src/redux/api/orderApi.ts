import { baseApi } from "./baseApi";
import { 
  OrderRequestDto, 
  OrderResponseDto, 
  OrderStatusUpdateRequestDto
} from "@/lib/api";

type GenericApiResponse = Record<string, unknown>;

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── Checkout ────────────────────────────────────────────────────────────
    checkout: builder.mutation<GenericApiResponse, OrderRequestDto>({
      query: (body) => ({
        url: "/orders/checkout",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart", "Orders"],
    }),

    // ── Order History ────────────────────────────────────────────────────────
    getOrderHistory: builder.query<OrderResponseDto[], number>({
      query: (userId) => `/orders/${userId}/history`,
      providesTags: ["Orders"],
    }),

    // ── Order Tracking ───────────────────────────────────────────────────────
    trackOrder: builder.query<GenericApiResponse, number>({
      query: (orderId) => `/orders/${orderId}/tracking`,
    }),

    getOrderStatusHistory: builder.query<GenericApiResponse[], number>({
      query: (orderId) => `/orders/${orderId}/status-history`,
    }),

    getLatestStatus: builder.query<GenericApiResponse, number>({
      query: (orderId) => `/orders/${orderId}/latest-status`,
    }),

    getAllStatuses: builder.query<GenericApiResponse[], void>({
      query: () => "/orders/statuses",
    }),

    updateOrderStatus: builder.mutation<GenericApiResponse, { orderId: number; body: OrderStatusUpdateRequestDto }>({
      query: ({ orderId, body }) => ({
        url: `/orders/${orderId}/status`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useCheckoutMutation,
  useGetOrderHistoryQuery,
  useTrackOrderQuery,
  useGetOrderStatusHistoryQuery,
  useGetLatestStatusQuery,
  useGetAllStatusesQuery,
  useUpdateOrderStatusMutation,
} = orderApi;
