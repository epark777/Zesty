import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import CartItem from "./CartItem";
import "./Cart.css";
import { clearCartThunk, fetchCartItemsThunk } from "../../redux/cart";
import { useNavigate } from "react-router-dom";

function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const [cart, setCart] = useState([])


  useEffect(() => {
    const fetchData = async () => {
      let data = await dispatch(fetchCartItemsThunk(user.id));
      setCart(data)
    };
    fetchData();
  }, [dispatch, user, cart]);

  const handleCheckout = async (e) => {
    e.preventDefault();
    await dispatch(clearCartThunk(user.id))
    navigate("/cart/purchased");
  };

  if (cart.length === 0) {
    return <p className="empty-cart">Your cart is empty.</p>;
  }

  const total = cart.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="cart-container">
      <h2 className="cart-title">Shopping Cart</h2>
      <div className="cart-items">
        {cart.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>
      <div className="cart-total">
        <p>Total: ${total.toFixed(2)}</p>
      </div>
      <button onClick={handleCheckout} className="checkout-button">
        Proceed to Checkout
      </button>
    </div>
  );
}

export default Cart;
