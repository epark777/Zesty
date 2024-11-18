export const ADD_TO_FAVORITES = "favorites/addToFavorites";
export const REMOVE_FROM_FAVORITES = "favorites/removeFromFavorites";
export const GET_FAVORITES = "favorites/getFavorites";
export const GET_FAVORITES_ID = "favorites/getFavoritesById";

// Action creators
export const addToFavorites = (product) => ({
  type: ADD_TO_FAVORITES,
  payload: product,
});

export const removeFromFavorites = (product, user) => ({
  type: REMOVE_FROM_FAVORITES,
  payload: {product_id: product, user_id: user},
});

export const getFavorites = (favorites) => ({
  type: GET_FAVORITES,
  payload: favorites,
});

export const getFavoritesId = (favorites) => ({
  type: GET_FAVORITES_ID,
  payload: favorites,
});

export const fetchFavorites = (owner_id) => async (dispatch) => {
  const response = await fetch(`/api/favorites/users/${owner_id}/`);
  const data = await response.json();
  await dispatch(getFavorites(data));
  
};

// Thunk for fetching favorites from backend
export const fetchFavoritesId = (owner_id, product_id) => async (dispatch) => {
  const response = await fetch(`/api/favorites/users/${owner_id}/product/${product_id}`);
  const data = await response.json();
  await dispatch(getFavorites(data));
  return data
};

export const addFavorite = (product, user) => async (dispatch) => {
  try {
    let body = {product_id: product.id, user_id: user.id} 
    console.log(body)
    const response = await fetch(`/api/favorites/users/${user.id}`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      }
    });
    const data = await response.json();
    console.log(data)
    await dispatch(addToFavorites(data.body));
    return data
    
  } catch (error) {
    if (!user || !user.id) {
      console.error('User or user.id is undefined');
    }
  }
};

export const removeFavorite = (product, user) => async (dispatch) => {
  try {
    await fetch(`/api/favorites/users/${user.id}/products/${product.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      }
    })
    await dispatch(removeFromFavorites(product.id, user.id))
    return {"message": "deleted"}
  }
  catch (error) {
    console.error("Error removing favorite:", error); 
  }
}


const initialState = {};

export default function favoritesReducer(state = initialState, action) {
  switch (action.type) {
    case GET_FAVORITES: {
      const newState = {};
      action.payload.forEach((favorite) => {
        newState[favorite.product_id] = favorite;
      });
      return newState;
    }
    case GET_FAVORITES_ID: {
      const newState = {};
      action.payload.forEach((favorite) => {
        newState[favorite.product_id] = favorite;
      });
      return newState;
    }
    case ADD_TO_FAVORITES:
      {
        const newState = {...state}
        newState[action.payload.product_id ] = action.payload
        return newState
      }
      case REMOVE_FROM_FAVORITES: {
        const newState = { ...state };
        delete newState[action.payload.product_id];
        return newState;
      }
    default:
      return state;
  }
}
