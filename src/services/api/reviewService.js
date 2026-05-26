import { api } from "@/services/api/axios-client";

function withAuth(token) {
  if (!token) return undefined;
  return { headers: { Authorization: `Bearer ${token}` } };
}

function extractArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  const source = payload;
  if (Array.isArray(source.data)) return source.data;
  if (Array.isArray(source.reviews)) return source.reviews;
  if (Array.isArray(source.content)) return source.content;
  if (Array.isArray(source.items)) return source.items;
  return [];
}

export async function getProductReviews(productId) {
  const response = await api.get(`/reviews/product/${productId}`);
  return extractArray(response.data);
}

export async function addReview(payload, token) {
  const response = await api.post("/reviews/add", payload, withAuth(token));
  return response.data;
}

export async function deleteReview(reviewId, token) {
  const response = await api.delete(`/reviews/${reviewId}`, withAuth(token));
  return response.data;
}

// Backend does not currently expose review update endpoint.
export async function updateReview(reviewId, payload, token) {
  const response = await api.put(`/reviews/${reviewId}`, payload, withAuth(token));
  return response.data;
}

export async function voteReview(reviewId, helpful, token) {
  const response = await api.post(`/reviews/${reviewId}/vote?helpful=${helpful}`, undefined, withAuth(token));
  return response.data;
}

export async function removeVote(reviewId, token) {
  const response = await api.delete(`/reviews/${reviewId}/vote`, withAuth(token));
  return response.data;
}

export async function getReviewVotes(reviewId) {
  const response = await api.get(`/reviews/${reviewId}/votes`);
  return response.data;
}

const reviewService = {
  addReview,
  getProductReviews,
  deleteReview,
  updateReview,
  voteReview,
  removeVote,
  getReviewVotes,
};

export default reviewService;

