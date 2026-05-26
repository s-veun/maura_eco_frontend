"use client";

import { memo, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ThumbsUp, Star } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast-provider";
import { useAuth } from "@/auth/AuthProvider";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { getApiErrorMessage } from "@/lib/api-error";
import reviewService from "@/services/api/reviewService";

type ReviewEntity = {
  reviewId: number;
  rating: number;
  comment?: string;
  createdAt?: string;
  username?: string;
  verifiedPurchase?: boolean;
};

type SortKey = "newest" | "oldest" | "rating_desc" | "rating_asc" | "helpful";

type ProductReviewsSectionProps = {
  productId: number;
  productName?: string;
  compact?: boolean;
};

function toReviewEntity(raw: unknown): ReviewEntity | null {
  if (!raw || typeof raw !== "object") return null;
  const src = raw as Record<string, unknown>;
  const reviewId = Number(src.reviewId ?? src.id);
  const rating = Number(src.rating ?? 0);
  if (!Number.isFinite(reviewId) || !Number.isFinite(rating)) return null;
  return {
    reviewId,
    rating,
    comment: typeof src.comment === "string" ? src.comment : "",
    createdAt: typeof src.createdAt === "string" ? src.createdAt : undefined,
    username: typeof src.username === "string" ? src.username : "Customer",
    verifiedPurchase: typeof src.verifiedPurchase === "boolean" ? src.verifiedPurchase : true,
  };
}

function parseHelpfulCount(payload: unknown): number {
  if (typeof payload === "number") return payload;
  if (!payload || typeof payload !== "object") return 0;
  const src = payload as Record<string, unknown>;
  const values = [
    src.helpfulCount,
    src.helpful,
    src.likes,
    src.totalHelpful,
    src.count,
    src.data && typeof src.data === "object" ? (src.data as Record<string, unknown>).helpfulCount : undefined,
  ];
  for (const value of values) {
    const num = Number(value);
    if (Number.isFinite(num)) return num;
  }
  return 0;
}

function formatReviewDate(input?: string) {
  if (!input) return "";
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function StarDisplay({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < Math.round(value) ? "fill-yellow-400 text-yellow-400" : "fill-none text-muted-foreground"}`}
        />
      ))}
    </span>
  );
}

function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <span className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const starVal = i + 1;
        const filled = hovered > 0 ? starVal <= hovered : starVal <= value;
        return (
          <Star
            key={i}
            className={`h-7 w-7 cursor-pointer transition-colors ${filled ? "fill-yellow-400 text-yellow-400" : "fill-none text-muted-foreground"}`}
            onMouseEnter={() => setHovered(starVal)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(starVal)}
          />
        );
      })}
    </span>
  );
}

function ProductReviewsSectionComponent({ productId, productName, compact = false }: ProductReviewsSectionProps) {
  const { showToast } = useToast();
  const { isAuthenticated, user, accessToken } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>("newest");
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const debouncedRatingFilter = useDebouncedValue(ratingFilter, 220);
  const [page, setPage] = useState(1);
  const [helpfulMap, setHelpfulMap] = useState<Record<number, number>>({});
  const [likedMap, setLikedMap] = useState<Record<number, boolean>>({});

  const [formRating, setFormRating] = useState(5);
  const [formComment, setFormComment] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const pageSize = compact ? 3 : 5;

  const reviewsQuery = useQuery({
    queryKey: ["product-reviews", productId],
    queryFn: async () => {
      const list = await reviewService.getProductReviews(productId);
      return (Array.isArray(list) ? list : []).map(toReviewEntity).filter((item): item is ReviewEntity => item !== null);
    },
    enabled: Number.isFinite(productId) && productId > 0,
    retry: 2,
  });

  useEffect(() => {
    let active = true;
    const loadVotes = async () => {
      if (!reviewsQuery.data || reviewsQuery.data.length === 0) {
        if (active) setHelpfulMap({});
        return;
      }
      const entries = await Promise.all(
        reviewsQuery.data.slice(0, 50).map(async (review) => {
          try {
            const payload = await reviewService.getReviewVotes(review.reviewId);
            return [review.reviewId, parseHelpfulCount(payload)] as const;
          } catch {
            return [review.reviewId, 0] as const;
          }
        }),
      );
      if (!active) return;
      setHelpfulMap(Object.fromEntries(entries));
    };
    void loadVotes();
    return () => {
      active = false;
    };
  }, [reviewsQuery.data]);

  const addReviewMutation = useMutation({
    mutationFn: async (payload: { rating: number; comment: string }) => {
      if (!user?.id) throw new Error("Login required");
      return reviewService.addReview({ productId, userId: user.id, ...payload }, accessToken || undefined);
    },
    onSuccess: async () => {
      showToast({ title: "Review submitted", message: "Thanks for sharing your feedback.", type: "success" });
      setFormRating(5);
      setFormComment("");
      setIsModalOpen(false);
      await queryClient.invalidateQueries({ queryKey: ["product-reviews", productId] });
    },
    onError: (error) => {
      const text = getApiErrorMessage(error, "Unable to submit review");
      const lower = text.toLowerCase();
      if (lower.includes("unauthorized") || lower.includes("invalid token") || lower.includes("jwt") || lower.includes("401")) {
        showToast({ title: "Session expired", message: "Please sign in again to continue.", type: "error" });
        router.push(`/login?redirect=${encodeURIComponent(pathname || `/products/${productId}`)}`);
        return;
      }
      if (lower.includes("duplicate") || lower.includes("already") || lower.includes("review")) {
        showToast({ title: "Duplicate review", message: text, type: "info" });
        return;
      }
      showToast({ title: "Review failed", message: text, type: "error" });
    },
  });

  const helpfulMutation = useMutation({
    mutationFn: async (reviewId: number) => {
      const liked = likedMap[reviewId] === true;
      if (liked) {
        await reviewService.removeVote(reviewId, accessToken || undefined);
      } else {
        await reviewService.voteReview(reviewId, true, accessToken || undefined);
      }
      return { reviewId, liked: !liked };
    },
    onSuccess: ({ reviewId, liked }) => {
      setLikedMap((prev) => ({ ...prev, [reviewId]: liked }));
      setHelpfulMap((prev) => {
        const current = Number(prev[reviewId] || 0);
        return { ...prev, [reviewId]: liked ? current + 1 : Math.max(0, current - 1) };
      });
    },
    onError: (error) => {
      const text = getApiErrorMessage(error, "Unable to update vote");
      if (text.toLowerCase().includes("401") || text.toLowerCase().includes("unauthorized")) {
        showToast({ title: "Login required to like reviews.", type: "info" });
        router.push(`/login?redirect=${encodeURIComponent(pathname || `/products/${productId}`)}`);
        return;
      }
      showToast({ title: text, type: "error" });
    },
  });

  const reviewStats = useMemo(() => {
    const list = reviewsQuery.data || [];
    if (list.length === 0) {
      return {
        count: 0,
        average: 0,
        distribution: [5, 4, 3, 2, 1].map((star) => ({ star, count: 0, percent: 0 })),
      };
    }
    const total = list.reduce((acc, cur) => acc + Number(cur.rating || 0), 0);
    const average = total / list.length;
    const distribution = [5, 4, 3, 2, 1].map((star) => {
      const count = list.filter((item) => Math.round(item.rating) === star).length;
      return { star, count, percent: Math.round((count / list.length) * 100) };
    });
    return { count: list.length, average, distribution };
  }, [reviewsQuery.data]);

  const filteredAndSorted = useMemo(() => {
    const list = [...(reviewsQuery.data || [])];
    const filtered =
      debouncedRatingFilter > 0 ? list.filter((item) => Math.round(item.rating) === debouncedRatingFilter) : list;
    const byDateAsc = (a: ReviewEntity, b: ReviewEntity) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return aTime - bTime;
    };
    filtered.sort((a, b) => {
      if (sortBy === "oldest") return byDateAsc(a, b);
      if (sortBy === "rating_desc") return b.rating - a.rating;
      if (sortBy === "rating_asc") return a.rating - b.rating;
      if (sortBy === "helpful") return (helpfulMap[b.reviewId] || 0) - (helpfulMap[a.reviewId] || 0);
      return byDateAsc(b, a);
    });
    return filtered;
  }, [debouncedRatingFilter, helpfulMap, reviewsQuery.data, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / pageSize));
  const cappedPage = Math.min(page, totalPages);
  const visible = filteredAndSorted.slice(0, cappedPage * pageSize);

  if (reviewsQuery.isLoading) {
    return (
      <div className="border rounded-lg bg-card p-5 shadow-sm flex flex-col gap-4">
        <div className="animate-pulse bg-muted rounded h-4 w-1/3" />
        <div className="animate-pulse bg-muted rounded h-4 w-2/3" />
        <div className="animate-pulse bg-muted rounded h-20 w-full" />
        <div className="animate-pulse bg-muted rounded h-20 w-full" />
      </div>
    );
  }

  if (reviewsQuery.isError) {
    return (
      <div className="border rounded-lg bg-card p-6 shadow-sm text-center flex flex-col items-center gap-3">
        <p className="font-semibold text-lg">Unable to load reviews</p>
        <p className="text-sm text-muted-foreground">
          {getApiErrorMessage(reviewsQuery.error, "Please try again in a moment.")}
        </p>
        <Button variant="outline" onClick={() => void reviewsQuery.refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  const handleSubmit = () => {
    if (!formComment.trim()) {
      setFormError("Please enter your comment.");
      return;
    }
    if (formComment.trim().length < 3) {
      setFormError("Comment is too short.");
      return;
    }
    if (formComment.trim().length > 500) {
      setFormError("Maximum 500 characters.");
      return;
    }
    setFormError(null);
    addReviewMutation.mutate({ rating: formRating, comment: formComment.trim() });
  };

  return (
    <div className={`border rounded-lg bg-card shadow-sm ${compact ? "p-4" : "p-5"}`}>
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-2">
          {compact ? (
            <h5 className="font-semibold text-base">Customer Reviews</h5>
          ) : (
            <h4 className="font-bold text-lg">Customer Reviews</h4>
          )}
          <div className="flex flex-wrap gap-1.5">
            {(["newest", "rating_desc", "helpful"] as const).map((key) => (
              <Button
                key={key}
                size="sm"
                variant={sortBy === key ? "default" : "outline"}
                onClick={() => {
                  setSortBy(key);
                  setPage(1);
                }}
              >
                {key === "newest" ? "Newest" : key === "rating_desc" ? "Top Rated" : "Most Helpful"}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Average rating</p>
            <p className="text-2xl font-bold">
              {reviewStats.average.toFixed(1)}{" "}
              <span className="text-sm font-normal text-muted-foreground">/ 5</span>
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total reviews</p>
            <p className="text-2xl font-bold">{reviewStats.count}</p>
          </div>
          <StarDisplay value={reviewStats.average} />
          <span className="inline-flex items-center rounded-full bg-purple-100 text-purple-800 px-2.5 py-0.5 text-xs font-medium">
            {reviewStats.count} opinions
          </span>
        </div>

        {/* Distribution */}
        <div className="flex flex-col gap-2 w-full">
          {reviewStats.distribution.map((row) => (
            <div key={row.star} className="flex items-center gap-2.5">
              <span className="text-sm w-12 shrink-0">{row.star} star</span>
              <div className="flex-1 h-2 bg-muted rounded-full">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${row.percent}%` }} />
              </div>
              <span className="text-xs text-muted-foreground w-5 text-right">{row.count}</span>
            </div>
          ))}
        </div>

        <hr className="border-border my-1" />

        {/* Auth prompt / write button */}
        {!isAuthenticated ? (
          <div className="rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm flex flex-wrap items-center gap-3">
            <div className="flex-1">
              <p className="font-medium">Login required</p>
              <p className="text-muted-foreground text-xs">Sign in to add your review and rate this product.</p>
            </div>
            <Button
              size="sm"
              onClick={() =>
                router.push(`/login?redirect=${encodeURIComponent(pathname || `/products/${productId}`)}`)
              }
            >
              Login
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap justify-between items-center gap-2">
            <p className="text-sm text-muted-foreground">Share your experience with other buyers.</p>
            <Button onClick={() => setIsModalOpen(true)}>Write a review</Button>
          </div>
        )}

        {/* Rating filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Filter by rating:</span>
          {[0, 5, 4, 3, 2, 1].map((value) => (
            <span
              key={value}
              className={`cursor-pointer inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                ratingFilter === value
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
              onClick={() => {
                setRatingFilter(value);
                setPage(1);
              }}
            >
              {value === 0 ? "All" : `${value} star`}
            </span>
          ))}
        </div>

        {/* Reviews list */}
        {visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <p>No reviews yet. Be the first to review this product.</p>
          </div>
        ) : (
          <ul className="flex flex-col divide-y">
            {visible.map((item) => (
              <li key={item.reviewId} className="py-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarFallback>{(item.username || "U").slice(0, 1).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">{item.username || "Customer"}</span>
                      {item.verifiedPurchase ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 text-green-800 px-2.5 py-0.5 text-xs font-medium">
                          Verified purchase
                        </span>
                      ) : null}
                    </div>
                    <StarDisplay value={item.rating} />
                    <p className="text-sm mt-1 whitespace-pre-wrap">{item.comment || "No comment provided."}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatReviewDate(item.createdAt)}</p>
                    <button
                      className={`mt-2 flex items-center gap-1.5 text-sm rounded-md px-2.5 py-1 transition-colors ${
                        likedMap[item.reviewId]
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-accent"
                      }`}
                      onClick={() => {
                        if (!isAuthenticated) {
                          showToast({ title: "Please login to vote helpful.", type: "info" });
                          router.push(
                            `/login?redirect=${encodeURIComponent(pathname || `/products/${productId}`)}`,
                          );
                          return;
                        }
                        helpfulMutation.mutate(item.reviewId);
                      }}
                      disabled={helpfulMutation.isPending}
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                      Helpful ({helpfulMap[item.reviewId] || 0})
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Load more */}
        {cappedPage < totalPages ? (
          <div className="flex justify-center">
            <Button variant="outline" onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}>
              Load more reviews
            </Button>
          </div>
        ) : null}
      </div>

      {/* Review Modal */}
      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsModalOpen(false);
            setFormError(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review {productName || "this product"}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Rating</label>
              <StarInput value={formRating} onChange={setFormRating} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Comment</label>
              <Textarea
                rows={4}
                maxLength={500}
                placeholder="Tell other buyers what you liked or disliked."
                value={formComment}
                onChange={(e) => setFormComment(e.target.value)}
              />
              <p className="text-xs text-muted-foreground text-right">{formComment.length}/500</p>
            </div>
            {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
            <div className="rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm">
              <p className="font-medium">Review guidelines</p>
              <p className="text-xs text-muted-foreground">
                Please keep your feedback clear, honest, and respectful.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={addReviewMutation.isPending}>
              {addReviewMutation.isPending ? (
                <div className="mr-2 h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
              ) : null}
              Submit review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export const ProductReviewsSection = memo(ProductReviewsSectionComponent);
export default ProductReviewsSection;
