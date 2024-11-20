// src/redux/reviews.js
export const SET_REVIEWS = "reviews/setReviews";
export const ADD_REVIEW = "reviews/addReview";
export const UPDATE_REVIEW = "reviews/editReview";
export const DELETE_REVIEW = "reviews/deleteReview";

export const setReviews = (reviews, productId) => ({
  type: SET_REVIEWS,
  payload: { reviews, productId },
});

export const addReview = (review) => ({
  type: ADD_REVIEW,
  payload: review,
});

export const editReview = (review) => ({
  type: UPDATE_REVIEW,
  payload: review,
});

export const deleteReview = (reviewId) => ({
  type: DELETE_REVIEW,
  payload: { reviewId },
});

// Thunks
export const fetchReviews = (productId) => async (dispatch) => {
  const response = await fetch(`/api/reviews/${productId}`);
  const data = await response.json();
  dispatch(setReviews(data, productId));
  return data
};

export const postReview = (review) => async (dispatch) => {
  const response = await fetch(`/api/reviews/${review.product_id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(review),
  });
  const data = await response.json();
  await dispatch(addReview(data));
};

export const removeReview = (reviewId) => async (dispatch) => {
  await fetch(`/api/reviews/${reviewId}`, {
    method: "DELETE",
  });
  await dispatch(deleteReview(reviewId));
};

export const updateReview = (review) => async (dispatch) => {
  const response = await fetch(`/api/reviews/${review.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(review),
  });

  if (response.ok) {
    const updatedReview = await response.json();
    await dispatch(editReview(updatedReview))
  }
};



const initialState = {};

export default function reviewsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_REVIEWS:
      return { ...state, [action.payload.productId]: action.payload.reviews };
    case ADD_REVIEW:
      return {
        ...state,
        [action.payload.productId]: [
          ...(state[action.payload.productId] || []),
          action.payload,
        ],
      };
      case UPDATE_REVIEW:
      return {
        ...state,
        [action.payload.productId]: [
          ...(state[action.payload.productId] || []),
          action.payload,
        ],
      };
    case DELETE_REVIEW:
      delete state[action.payload.productId]
      return {
        ...state,
      };
    default:
      return state;
  }
}
