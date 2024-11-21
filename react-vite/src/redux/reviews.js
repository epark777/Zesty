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
export const fetchReviews = (productId) => async (dispatch, getState) => {
  const response = await fetch(`/api/reviews/${productId}`);
  const data = await response.json();

  const currentReviews = getState().reviews[productId];
  if (JSON.stringify(currentReviews) !== JSON.stringify(data)) {
    dispatch(setReviews(data, productId)); // Only dispatch if reviews have changed
  }
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
    case SET_REVIEWS: {
      if (JSON.stringify(state[action.payload.productId]) === JSON.stringify(action.payload.reviews)) {
        return state;
      }
      return { ...state, [action.payload.productId]: action.payload.reviews };
    }

    case ADD_REVIEW: {
      const productId = action.payload.productId;
      return {
        ...state,
        [productId]: [...(state[productId] || []), action.payload],
      };
    }

    case UPDATE_REVIEW: {
      const productId = action.payload.productId;
      return {
        ...state,
        [productId]: (state[productId] || []).map((review) =>
          review.id === action.payload.id ? action.payload : review
        ),
      };
    }

    case DELETE_REVIEW: {
      const { reviewId, productId } = action.payload;
      return {
        ...state,
        [productId]: (state[productId] || []).filter((review) => review.id !== reviewId),
      };
    }

    default:
      return state;
  }
}
