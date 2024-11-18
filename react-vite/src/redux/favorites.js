// export const ADD_TO_FAVORITES = "favorites/addToFavorites";
// export const REMOVE_FROM_FAVORITES = "favorites/removeFromFavorites";
// export const GET_FAVORITES = "favorites/setFavorites";

// // Action creators
// export const addToFavorites = (product) => ({
//   type: ADD_TO_FAVORITES,
//   payload: product,
// });

// export const removeFromFavorites = (product) => ({
//   type: REMOVE_FROM_FAVORITES,
//   payload: product,
// });

// export const getFavorites = (favorites) => ({
//   type: GET_FAVORITES,
//   payload: favorites,
// });

// // Thunk for fetching favorites from backend
// export const fetchFavorites = (owner_id) => async (dispatch) => {
//   const response = await fetch(`/api/favorites/user/${owner_id}`);
//   const data = await response.json();
//   await dispatch(getFavorites(data));
//   return data
// };

// export const addFavorite = (product, user) => async (dispatch) => {
//   let body = {...product, user_id: user.id}
//   console.log('User object:', user, 'Product:', product, "body", body);
//        if (!user || !user.id) {
//          console.error('User or user.id is undefined');
//        }
//   const response = await fetch(`/api/favorites/users/${user.id}`, {
//     method: "POST",
//     body: JSON.stringify(body),
//     headers: {
//       "Content-Type": "application/json",
//     }
//   });
//   const data = await response.json();
//   console.log(data)
//   await dispatch(addToFavorites(data));
//   return data
// };


// const initialState = [];

// export default function favoritesReducer(state = initialState, action) {
//   switch (action.type) {
//     case GET_FAVORITES:
//       return [state, action.payload];
//     case ADD_TO_FAVORITES:
//       {
//         const newState = [...state]
//         newState.push(action.payload.product_id)
//         return newState
//       }
//     case REMOVE_FROM_FAVORITES:
//     {
//       const newState = {...state}
//       delete newState[action.payload];
//       return newState;
//     }
//     default:
//       return state;
//   }
// }

// Action Types
export const ADD_TO_FAVORITES = "favorites/addToFavorites";
export const REMOVE_FROM_FAVORITES = "favorites/removeFromFavorites";
export const GET_FAVORITES = "favorites/getFavorites";

// Action Creators
export const addToFavorites = (favorite) => ({
  type: ADD_TO_FAVORITES,
  payload: favorite,
});

export const removeFromFavorites = (favoriteId) => ({
  type: REMOVE_FROM_FAVORITES,
  payload: favoriteId,
});

export const getFavorites = (favorites) => ({
  type: GET_FAVORITES,
  payload: favorites,
});

// Thunk for fetching favorites
export const fetchFavorites = (owner_id) => async (dispatch) => {
  try {
    const response = await fetch(`/api/favorites/users/${owner_id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch favorites");
    }
    const data = await response.json();
    dispatch(getFavorites(data));
    return data;
  } catch (error) {
    console.error("Error fetching favorites:", error);
  }
};

// Thunk for adding a favorite
export const addFavorite = (product, user) => async (dispatch) => {
  if (!user || !user.id) {
    console.error("User or user.id is undefined");
    return;
  }

  const body = { product_id: product.id, user_id: user.id };

  try {
    const response = await fetch(`/api/favorites/users/${user.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error adding favorite:", errorData);
      return;
    }

    const data = await response.json();
    dispatch(addToFavorites(data));
    return data;
  } catch (error) {
    console.error("Error adding favorite:", error);
  }
};

// Thunk for removing a favorite
export const removeFavorite = (productId, userId) => async (dispatch) => {
  try {
    const response = await fetch(
      `/api/favorites/users/${userId}/product/${productId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error removing favorite:", errorData);
      return;
    }

    dispatch(removeFromFavorites(productId));
  } catch (error) {
    console.error("Error removing favorite:", error);
  }
};

const initialState = [];

// Favorites Reducer
export default function favoritesReducer(state = initialState, action) {
  switch (action.type) {
    case GET_FAVORITES:
      // Replace the state with the fetched favorites list
      return [...action.payload];
    case ADD_TO_FAVORITES:
      // Add a new favorite to the state
      return [...state, action.payload];
    case REMOVE_FROM_FAVORITES:
      // Remove the favorite by filtering out the product ID
      return state.filter((favorite) => favorite.product_id !== action.payload);
    default:
      return state;
  }
}
