export type ReviewDto = {
  reviewId: number;
  productId?: number;
  userId?: number;
  username?: string;
  rating: number;
  comment: string;
  createdAt?: string;
  helpfulCount?: number;
  notHelpfulCount?: number;
};

export type AddReviewRequestDto = {
  productId: number;
  rating: number;
  comment: string;
};

export type ReviewVoteResponse = {
  helpfulCount?: number;
  notHelpfulCount?: number;
  userVote?: "HELPFUL" | "NOT_HELPFUL" | null;
  [key: string]: unknown;
};

