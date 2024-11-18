import { useDispatch, useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
import { addToCart } from "../../redux/cart";
import "./Product.css";
import ReviewList from "../ReviewList/ReviewList";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchProductDetails } from "../../redux/products";
import FavoriteButton from "../FavoritesList/FavoriteButton";

function ProductDetail() {
  let id = useParams()
  id = id.productId
  const product = useSelector((state) => state.products.detail)
  const dispatch = useDispatch();
  
  useEffect(() => {
      const fetchData = async () => {
        if (!product) await dispatch(fetchProductDetails(id))
      }
      fetchData()
  })

  const handleCart = async () => {
    await dispatch(addToCart(product))
  }


try {
  return (
    <div className="product-detail">
      <img src={product.imageUrl} alt={product.name} className="detail-image" />
      <div className="detail-info">
        <h2 className="detail-name">{product.name}</h2>
        <p className="detail-category">{product.category}</p>
        <p className="detail-price">${product.price}</p>
        <p className="detail-description">{product.description}</p>
        <button onClick={() => handleCart} className="add-to-cart-button">
          Add to Cart
        </button>
        <FavoriteButton product={product} />
      </div>
      <ReviewList productId={id}/>
    </div>
  ) || <h1>nothing</h1>
  
} catch (error) {
  return <h1></h1>
}
}

export default ProductDetail;
