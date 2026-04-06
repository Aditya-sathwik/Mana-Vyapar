import { apiFetch } from './api-client';

export const storefrontApi = {
  // Store Metadata & Config
  getStoreBySlug: (slug: string) => apiFetch(`/store/${slug}`),
  getStoreProducts: (slug: string) => apiFetch(`/products/store/${slug}`),
  
  // Products
  getProductDetails: (productId: string) => apiFetch(`/products/${productId}`),
  
  // Authentication (Customer)
  register: (data: any) => apiFetch('/users/register', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  login: (data: any) => apiFetch('/users/login', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  logout: () => apiFetch('/users/logout', { method: 'POST' }),
  getCurrentUser: () => apiFetch('/users/current-user'),
  
  // Orders
  placeOrder: (orderData: any) => apiFetch('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData)
  }),
  getCustomerOrders: () => apiFetch('/orders/my-orders'),
  getOrderDetails: (orderId: string) => apiFetch(`/orders/${orderId}`),

  // Categories
  getCategories: () => apiFetch('/categories'),
};

export default storefrontApi;
