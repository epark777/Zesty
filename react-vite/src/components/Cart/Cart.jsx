import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import CartItem from "./CartItem";
import "./Cart.css";
import { fetchCartItemsThunk } from "../../redux/cart";

function Cart() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.session.user)
  const cart = useSelector((state) => Object.values(state.cart));

  useEffect(() => {
    const checkCart = async () => {
      if (user && cart.length < 1) {
        try {
          const response = await fetch(
            `/api/cart/users/${user.id}`
          );
          await response.json();
        } catch (error) {
          console.error("Error checking favorite status:", error);
        }
      }
    };

    checkCart();
  }, [user, cart]);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchCartItemsThunk(user.id))
    }
    fetchData()
  }, [dispatch, user])

  if (cart.length === 0) {
    return <p className="empty-cart">Your cart is empty.</p>;
  }


  return (
    <div className="cart-container">
      <h2 className="cart-title">Shopping Cart</h2>
      <div className="cart-items">
        {cart.map((item) => (
          <CartItem key={item} item={item} />
        ))}
      </div>
      <button className="checkout-button">Proceed to Checkout</button>
    </div>
  );
}

export default Cart;