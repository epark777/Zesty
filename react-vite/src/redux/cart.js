export const ADD_TO_CART = "cart/addToCart";
export const REMOVE_FROM_CART = "cart/removeFromCart";
export const UPDATE_QUANTITY = "cart/updateQuantity";
export const CLEAR_CART = "cart/clearCart";

export const addToCart = (product) => ({
  type: ADD_TO_CART,
  payload: product,
});

export const removeFromCart = (productId) => ({
  type: REMOVE_FROM_CART,
  payload: productId,
});

export const updateQuantity = (productId, quantity) => ({
  type: UPDATE_QUANTITY,
  payload: { productId, quantity },
});

export const clearCart = () => ({
  type: CLEAR_CART,
});

export const fetchCartItemsThunk = (userId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/cart/users/${userId}`, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch cart items");
    }

    const data = await response.json();

    await dispatch(clearCart());

    data.forEach((item) => {
      dispatch(addToCart({
        id: item.product_id,
        name: item.name,
        price: item.price,
        quantity: item.quantity_in_cart || 1,
      }));
    });
  } catch (error) {
    console.error("Error fetching cart items:", error);
  }
};

export const addToCartThunk = (product, user) => async (dispatch) => {
  try {
    const res = await fetch(`/api/cart/users/${user.id}/products/${product.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });

    console.log(res)

    if (!res.ok) throw new Error("Failed to add item to cart");
    else console.log(res)

    const data = await res.json();

    await dispatch(addToCart({
      id: data.product_id,
      name: data.name,
      price: data.price,
      quantity: 1,
    }));
  } catch (error) {
    console.error("Error adding item to cart:", error);
  }
};

export const removeFromCartThunk = (product, userId) => async (dispatch) => {
  try {
    const res = await fetch(`/api/cart/users/${userId}/products/${product}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to remove item from cart");

    await dispatch(removeFromCart(product));
  } catch (error) {
    console.error("Error removing item from cart:", error);
  }
};

export const updateQuantityThunk = (productId, quantity, userId) => async (dispatch) => {
  try {
    const res = await fetch(`/api/users/${userId}/cart/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });

    if (!res.ok) throw new Error("Failed to update cart item quantity");

    const data = await res.json();
    await dispatch(updateQuantity(productId, data.quantity));
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
  }
};

export const clearCartThunk = (userId) => async (dispatch) => {
  try {
    const res = await fetch(`/api/cart/users/${userId}/checkout`, {
      method: "POST",
    });

    if (!res.ok) throw new Error("Failed to clear the cart");

    await dispatch(clearCart());
  } catch (error) {
    console.error("Error clearing the cart:", error);
  }
};


const initialState = {};

const findCartItem = (cart, productId) => cart[productId];

export default function cartReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_TO_CART: {
      const existingItem = findCartItem(state, action.payload.id);
      if (existingItem) {
        return {
          ...state,
          [action.payload.id]: {
            ...existingItem,
            quantity: existingItem.quantity + 1,
          },
        };
      } else {
        return {
          ...state,
          [action.payload.id]: { ...action.payload, quantity: 1 },
        };
      }
    }

    case REMOVE_FROM_CART: {
      const newState = { ...state };
      delete newState[action.payload];
      return newState;
    }

    case UPDATE_QUANTITY: {
      const existingItem = findCartItem(state, action.payload.productId);
      if (existingItem) {
        return {
          ...state,
          [action.payload.productId]: {
            ...existingItem,
            quantity: action.payload.quantity,
          },
        };
      }
      return state;
    }

    case CLEAR_CART:
      return {};

    default:
      return state;
  }
}
