interface ReviewsSectionProps {
  totalReviews?: number;
  averageRating?: number;
  reviewType?: "story" | "poem";
}

export default function ReviewsSection({ totalReviews = 0 }: ReviewsSectionProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-black">Reviews</h2>
      <p className="text-sm text-gray-500">
        {totalReviews > 0 ? `${totalReviews} reviews are recorded, but review details are not available yet.` : "Reviews are not available yet."}
      </p>
    </section>
  );
}
