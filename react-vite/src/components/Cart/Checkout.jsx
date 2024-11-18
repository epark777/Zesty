import { useSelector, useDispatch } from "react-redux";
import { checkoutCartThunk } from "../../redux/cart"; // Import the new thunk
import "./Cart.css";

function Checkout() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart);
  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

  const handleCheckout = async () => {
    const userId = 1; // Replace with dynamic user ID if available
    try {
      await dispatch(checkoutCartThunk(userId)); // Dispatch the thunk for checkout
      alert("Thank you for your purchase!");
    } catch (error) {
      alert(`Checkout failed: ${error.message}`);
    }
  };

  if (cartItems.length === 0) {
    return <p className="empty-cart">Your cart is empty.</p>;
  }

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Order Summary</h2>
      <ul className="checkout-items">
        {cartItems.map((item) => (
          <li key={item.id} className="checkout-item">
            {item.name} - {item.quantity} x ${item.price}
          </li>
        ))}
      </ul>
      <div className="checkout-total">Total: ${totalAmount}</div>
      <button onClick={handleCheckout} className="confirm-checkout-button">Confirm Purchase</button>
    </div>
  );
}

export default Checkout;
