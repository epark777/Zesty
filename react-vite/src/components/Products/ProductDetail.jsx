import { useDispatch, useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
import "./Product.css";
import ReviewList from "../ReviewList/ReviewList";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProductDetails } from "../../redux/products";
import { fetchFavorites } from "../../redux/favorites";
import FavoriteButton from "../FavoritesList/FavoriteButton";

function ProductDetail() {
  let id = useParams()
  id = id.productId
  const product = useSelector((state) => state.products.detail)
  const user = useSelector((state) => state.session.user)
  const dispatch = useDispatch();
  const [favorites, setFavorites] = useState([])
  
  useEffect(() => {
      const fetchData = async () => {
        if (!product) await dispatch(fetchProductDetails(id))
      }
      fetchData()
  })

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        let data = await dispatch(fetchFavorites(user.id));
        setFavorites(data)
      }
    };
    fetchData()
  }, [dispatch, user, product]);



try {
  return (
    <div className="product-detail">
      <img src={product.imageUrl} alt={product.name} className="detail-image" />
      <div className="detail-info">
        <h2 className="detail-name">{product.name}</h2>
        <p className="detail-category">{product.category}</p>
        <p className="detail-price">${product.price}</p>
        <p className="detail-description">{product.description}</p>
        <FavoriteButton product={product} favorites={favorites} />
      </div>
      <ReviewList productId={id}/>
    </div>
  ) || <h1>nothing</h1>
  
} catch (error) {
  return <h1></h1>
}
}

export default ProductDetail;
