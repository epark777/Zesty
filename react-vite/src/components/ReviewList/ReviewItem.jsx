import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews, updateReview, removeReview } from "../../redux/reviews";
import "./Reviews.css";


function ReviewItem({ review, productId }) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.session.user);

  const [isEditing, setIsEditing] = useState(false);
  const [editReview, setEditReview] = useState(review.review);
  const [editRating, setEditRating] = useState(review.rating);

  const handleEdit = async (e) => {
    e.preventDefault();
    const updatedReview = { review: editReview, rating: editRating, id: review.id };
    try {
      await dispatch(updateReview(updatedReview));
      await dispatch(fetchReviews(productId));
      setIsEditing(false);

    } catch (err) {
      console.error("Failed to update review:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(removeReview(review.id));
      await dispatch(fetchReviews(productId));

    } catch (err) {
      console.error("Failed to delete review:", err);
    }
  };

  return (
    <div className="review-item">
      {isEditing ? (
        <form onSubmit={handleEdit} className="edit-review-form">
          <h4>Edit Your Review</h4>
          <label>
            Rating:
            <select
              value={editRating}
              onChange={(e) => setEditRating(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </label>
          <textarea
            value={editReview}
            onChange={(e) => setEditReview(e.target.value)}
            placeholder="Edit your review here..."
            required
            className="review-textarea"
          ></textarea>
          <button type="submit" className="save-review-button">
            Save
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="cancel-edit-button"
          >
            Cancel
          </button>
        </form>
      ) : (
        <>
          <div className="review-header">
            <span className="review-username">{review.username}</span>
            <span className="review-rating">Rating: {review.rating} / 5</span>
          </div>
          <p className="review-text">{review.review}</p>
          {currentUser && currentUser.id === review.user_id && (
            <div className="review-actions">
              <button onClick={() => setIsEditing(true)} className="edit-review-button">
                Edit
              </button>
              <button onClick={handleDelete} className="delete-review-button">
                Delete
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ReviewItem;
