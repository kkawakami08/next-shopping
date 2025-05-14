"use client";

import { paths } from "@/lib/constants";
import { Review } from "@/types";
import Link from "next/link";
import { useState, useEffect } from "react";
import ReviewForm from "./review-form";
import { getReviews } from "@/lib/actions/review.actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, User } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import Rating from "@/components/shared/product/rating";

interface ReviewListProps {
  userId: string;
  productId: string;
  productSlug: string;
}
const ReviewList = ({ userId, productId, productSlug }: ReviewListProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const loadReviews = async () => {
      const res = await getReviews({ productId });
      setReviews(res.data);
    };
    loadReviews();
  }, [productId]);

  //will reload reviews after submitting one
  const reload = async () => {
    const res = await getReviews({ productId });
    setReviews([...res.data]);
  };

  return (
    <div className="space-y-4">
      {reviews.length === 0 && <div>No reviews yet</div>}
      {userId ? (
        <>
          <ReviewForm
            userId={userId}
            productId={productId}
            onReviewSubmitted={reload}
          />
        </>
      ) : (
        <div>
          <Link
            className="text-primary font-semibold"
            href={`${paths.signIn()}?callbackUrl=${paths.product(productSlug)}`}
          >
            Sign In{" "}
          </Link>
          to write a review
        </div>
      )}
      <div className="flex flex-col gap-3">
        {/* Reviews here */}
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{review.title}</CardTitle>
              </div>
              <CardDescription>{review.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 text-sm text-muted-foreground">
                {/* Rating stars */}
                <Rating value={review.rating} />
                <div className="flex items-center">
                  <User className="size-3 mr-1" />
                  {review.user ? review.user.name : "Customer"}
                </div>
                <div className="flex items-center">
                  <Calendar className="size-3 mr-1" />
                  {formatDateTime(review.createdAt).dateTime}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
