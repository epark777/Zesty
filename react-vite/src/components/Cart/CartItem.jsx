import { useDispatch, useSelector } from "react-redux";
import { removeFromCartThunk, updateQuantityThunk } from "../../redux/cart";
import "./Cart.css";

function CartItem({ item }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);

  const handleRemove = async () => {
    if (!user) {
      console.error("User not logged in.");
      return;
    }

    try {
      console.log(item);
      await dispatch(removeFromCartThunk(item.id, user.id));
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
    }
  };

  const handleQuantityChange = async (e) => {
    const value = e.target.value;
    const newQuantity = parseInt(value, 10);

    if (isNaN(newQuantity) || newQuantity < 1) {
      return; // Optionally, show an error or reset the input
    }

    try {
      await dispatch(updateQuantityThunk(item.id, newQuantity));
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
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
            value={item.quantity !== undefined ? item.quantity : 1}
            onChange={handleQuantityChange}
            className="quantity-input"
          />
        </label>
        <button onClick={handleRemove} className="remove-button">Remove</button>
      </div>
    </div>
  );
}

export default CartItem;
