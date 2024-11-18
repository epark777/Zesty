import { useDispatch, useSelector } from "react-redux";
import { removeFromCartThunk, updateQuantityThunk } from "../../redux/cart"; // Import thunks
import "./Cart.css";

function CartItem({ item }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user)

  const handleRemove = () => {
    const fetchData = async () => {
      console.log(item)
      await dispatch(removeFromCartThunk(item.id, user.id)); // Remove item from cart using thunk
    }
    fetchData()
  };

  const handleQuantityChange = (e) => {
    const fetchData = async () => {
    const newQuantity = parseInt(e.target.value, 10);
    if (newQuantity > 0) {
      await dispatch(updateQuantityThunk(item.id, newQuantity)); // Update quantity using thunk
    }
  }
  fetchData()
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
            value={item.quantity || 1}
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
