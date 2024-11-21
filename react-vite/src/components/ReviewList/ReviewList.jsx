import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchReviews } from "../../redux/reviews";
import ReviewItem from "./ReviewItem";
import ReviewForm from "./ReviewForm";
import "./Reviews.css";

function ReviewList({ productId }) {
  console.log("Fetching reviews for productId:", productId);

  const user = useSelector((state) => state.session.user);
  const reviews = useSelector((state) => {
    const productReviews = state.reviews[productId];
    return Array.isArray(productReviews) ? productReviews : [];
  });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchReviews(productId));
  }, [dispatch, productId]);

  return (
    <div className="review-list">
      <h3 className="review-list-title">Customer Reviews</h3>
      {reviews.length === 0 ? (
        <p className="no-reviews">No reviews yet. Be the first to review!</p>
      ) : (
        reviews.map((review) => (
          <ReviewItem key={review.id} review={review} productId={productId} />
        ))
      )}
      {user ? <ReviewForm productId={productId} /> : <p>Sign in to post a review!</p>}
    </div>
  );
}

export default ReviewList;
