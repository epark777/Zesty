export const ADD_TO_FAVORITES = "favorites/addToFavorites";
export const REMOVE_FROM_FAVORITES = "favorites/removeFromFavorites";
export const GET_FAVORITES = "favorites/setFavorites";

// Action creators
export const addToFavorites = (product) => ({
  type: ADD_TO_FAVORITES,
  payload: product,
});

export const removeFromFavorites = (product) => ({
  type: REMOVE_FROM_FAVORITES,
  payload: product,
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
  let body = {...product, user_id: user.id}
  console.log('User object:', user, 'Product:', product, "body", body);
       if (!user || !user.id) {
         console.error('User or user.id is undefined');
       }
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
};


const initialState = [];

export default function favoritesReducer(state = initialState, action) {
  switch (action.type) {
    case GET_FAVORITES:
      return [state, action.payload];
    case ADD_TO_FAVORITES:
      {
        const newState = [...state]
        newState.push(action.payload.product_id)
        return newState
      }
    case REMOVE_FROM_FAVORITES:
    {
      const newState = {...state}
      delete newState[action.payload];
      return newState;
    }
    default:
      return state;
  }
}
