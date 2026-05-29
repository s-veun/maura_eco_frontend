import { ENDPOINTS, assertPublicEcommerceEndpoint } from "@/lib/endpoints";
import type { AuthenticatedRequest } from "@/services/http";
import { requestJson } from "@/services/http";
import { homeApiClient } from "@/services/home/apiClient";
import type { AddReviewRequestDto, ReviewDto, ReviewVoteResponse } from "@/types/review.types";

export const reviewService = {
  async getProductReviews(productId: number) {
    const path = assertPublicEcommerceEndpoint(ENDPOINTS.reviews.byProduct(productId));
    const reviews = await homeApiClient.getList<ReviewDto>(path);
    return reviews;
  },

  async addReview(request: AuthenticatedRequest, payload: AddReviewRequestDto) {
    const path = assertPublicEcommerceEndpoint(ENDPOINTS.reviews.add);
    return requestJson<ReviewDto>(request, path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  },

  async deleteReview(request: AuthenticatedRequest, reviewId: number) {
    const path = assertPublicEcommerceEndpoint(ENDPOINTS.reviews.remove(reviewId));
    return requestJson<Record<string, unknown>>(request, path, { method: "DELETE" });
  },

  async voteReview(request: AuthenticatedRequest, reviewId: number, helpful: boolean) {
    const path = assertPublicEcommerceEndpoint(ENDPOINTS.reviews.vote(reviewId));
    return requestJson<ReviewVoteResponse>(request, `${path}?helpful=${helpful}`, {
      method: "POST",
    });
  },

  async getReviewVotes(reviewId: number) {
    const path = assertPublicEcommerceEndpoint(ENDPOINTS.reviews.votes(reviewId));
    return homeApiClient.get<ReviewVoteResponse>(path);
  },
};

export default reviewService;

