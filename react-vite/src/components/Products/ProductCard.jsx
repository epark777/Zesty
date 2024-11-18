import { useDispatch, useSelector } from "react-redux";
import { addToCartThunk } from "../../redux/cart";
import { useNavigate } from "react-router-dom";
import { fetchProductDetails } from "../../redux/products"; // Assuming you have a thunk for fetching details
import "./Product.css";

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.session.user)
  console.log(product);

  const handleAddToCart = () => {
    const fetchData = async () => {
      await dispatch(addToCartThunk(product, user));
    };
    fetchData();
  };

  const goToDetails = () => {
    const fetchData = async () => {
      await dispatch(fetchProductDetails(product.id));
      navigate(`/products/${product.id}`)
    };
    fetchData();
  };

  try { 
    if (product.id) return (
      <div className="product-card" onClick={goToDetails}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="product-image"
        />
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-price">${product.price}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart();
          }}
          className="add-to-cart-button"
        >
          Add to Cart
        </button>
      </div>
    );
  } catch (error) {
    return <h1>Product not found :/</h1>
  }
}

export default ProductCard;
