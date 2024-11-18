// src/redux/products.js
export const FETCH_PRODUCTS = "products/fetchProducts";
export const FETCH_PRODUCT_DETAILS = "products/fetchProductDetails";
export const PRODUCT_DELETE = "products/delete";
export const PRODUCT_EDIT = "products/edit";
export const PRODUCT_CREATE = "products/new";

export const fetchProducts = () => async (dispatch) => {
  const response = await fetch("/api/products");
  const data = await response.json();
  console.log(data);
  dispatch({ type: FETCH_PRODUCTS, payload: data });
  return data;
};

export const fetchProductDetails = (id) => async (dispatch) => {
  const response = await fetch(`/api/products/${id}`);
  const data = await response.json();
  console.log(data);
  await dispatch({ type: FETCH_PRODUCT_DETAILS, payload: data });
  return data;
};

export const productCreate = (product) => async (dispatch) => {
  let body = {
    category: product.category,
    description: product.description,
    name: product.name,
    owner_id: product.owner_id,
    price: product.price,
    quantity: product.quantity,
    imageUrl: product.imageUrl,
  };
  try {
    const response = await fetch("/api/products", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      let data = await response.json();
      await dispatch({ type: PRODUCT_CREATE, payload: data });
      return data;
    }
  } catch (error) {
    let shoe = await error;
    console.log(await shoe.json());
  }
};

export const productEdit = (product) => async (dispatch) => {
  if (!product || !product.id) {
    console.error("Invalid product data provided to productEdit.");
    return;
  }

  try {
    const response = await fetch(`/api/products/${product.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product), // Use the product data here
    });

    if (!response.ok) {
      throw new Error("Failed to update product");
    }

    const data = await response.json();
    dispatch({ type: PRODUCT_EDIT, payload: data }); // Dispatch the updated product to the store
    return data; // Return the updated product for further use
  } catch (error) {
    console.error("Error in productEdit:", error);
    throw error;
  }
};

export const productDelete = (id) => async (dispatch) => {
  try {
    const response = await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete the product");
    }

    await dispatch({ type: PRODUCT_DELETE, payload: id }); // Dispatch the ID to remove it from the state
    console.log(`Product with ID ${id} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error; // Rethrow the error if further handling is needed
  }
};

const initialState = {};

export default function productsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_PRODUCTS: {
      const newState = { ...state };
      action.payload.forEach((product) => {
        newState[product.id] = product;
      });
      return newState;
    }
    case FETCH_PRODUCT_DETAILS:
      return { ...state, detail: action.payload };
    case PRODUCT_DELETE: {
      const newState = { ...state };
      delete newState[action.payload.product_id];
      return newState;
    }
    case PRODUCT_EDIT: {
      const newState = { ...state };

      newState[action.payload.id] = action.payload;
      return newState;
    }
    case PRODUCT_CREATE: {
      const newState = { ...state };

      newState[action.payload.id] = action.payload;
      return newState;
    }
    default:
      return state;
  }
}
