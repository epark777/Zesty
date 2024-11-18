export const ADD_TO_FAVORITES = "favorites/addToFavorites";
export const REMOVE_FROM_FAVORITES = "favorites/removeFromFavorites";
export const GET_FAVORITES = "favorites/getFavorites";

// Action creators
export const addToFavorites = (product) => ({
  type: ADD_TO_FAVORITES,
  payload: product,
});

export const removeFromFavorites = (product) => ({
  type: REMOVE_FROM_FAVORITES,
  payload: {product_id: product.id},
});

export const getFavorites = (favorites) => ({
  type: GET_FAVORITES,
  payload: favorites,
});

// Thunk for fetching favorites from backend
export const fetchFavorites = (owner_id) => async (dispatch) => {
  const response = await fetch(`/api/favorites/users/${owner_id}`);
  const data = await response.json();
  await dispatch(getFavorites(data));
  return data
};

export const addFavorite = (product, user) => async (dispatch) => {
  try {
    let body = {...product, user_id: user.id}
   
    const response = await fetch(`/api/favorites/users/${user.id}`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      }
    });
    const data = await response.json();
    console.log(data)
    await dispatch(addToFavorites(data));
    return data
    
  } catch (error) {
    if (!user || !user.id) {
      console.error('User or user.id is undefined');
    }
  }
};

export const removeFavorite = (product, user) => async (dispatch) => {
  try {
    const response = await fetch(`api/favorites/users/${user.id}/product/${product.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      }
    })
    await dispatch(removeFromFavorites(user.id, product))
    return response.json()
  }
  catch (error) {
    console.log(await error.json())
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
