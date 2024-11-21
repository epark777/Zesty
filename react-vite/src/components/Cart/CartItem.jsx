import { useDispatch, useSelector } from "react-redux";
import { removeFromCartThunk } from "../../redux/cart"; // Import thunks
import { productEdit } from "../../redux/products"; // Import thunks
import { useState } from "react";
import "./Cart.css";

function CartItem({ item }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const [quantity, setQuantity] = useState(item.quantity)

  const handleRemove = async () => {
    console.log(item);
    await dispatch(removeFromCartThunk(item.id, user.id)); // Remove item from cart using thunk
  };

  const handleQuantityChange = async (e) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (newQuantity > 0) {
      await dispatch(productEdit({ quantity: newQuantity, id: item.id, price: item.price, name: item.name }));
    }
    setQuantity(newQuantity)
  };

  return (
    <div className="cart-item">
      <div className="cart-item-details">
        <h3 className="cart-item-name">{item.name}</h3>
        <p className="cart-item-price">${item.price}</p>
        <label className="quantity-label">
          Quantity:
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={handleQuantityChange}
            className="quantity-input"
          />
        </label>
        <button onClick={handleRemove} className="remove-button">
          Remove
        </button>
      </div>
    </div>
  );
}

export default CartItem;
