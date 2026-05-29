export type OrderItemDto = {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  subTotal: number;
};

export type OrderDto = {
  orderId: number;
  orderDate: string;
  status: string;
  totalAmount: number;
  items: OrderItemDto[];
};

export type CheckoutRequestDto = {
  couponCode?: string;
};

export type OrderTrackingDto = {
  orderId?: number;
  timeline?: Array<Record<string, unknown>>;
  history?: Array<Record<string, unknown>>;
  [key: string]: unknown;
};

