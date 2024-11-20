import { useSelector} from "react-redux";
import "./Cart.css";

function Checkout() {

  const cartItems = useSelector((state) => state.cart);
  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

  const handleCheckout = async () => {
      alert("Thank you for your purchase!");
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
