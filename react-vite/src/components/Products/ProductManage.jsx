import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchProducts } from "../../redux/products.js";
import ProductOwnerCard from "./ProductOwnerCard.jsx";
import "./Product.css";

export const ManageProducts = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([])
  const user = useSelector((state) => state.session.user?.id)
  let fetchedProducts = useSelector((state) => state.products)
  if(fetchedProducts.length < 1) setProducts(fetchProducts)

  useEffect(() => {
    const fetchData = async () => {
        setProducts(await dispatch(fetchProducts()))
    }
    fetchData()
  }, [dispatch, setProducts]);

  if (user && products.length > 0) return (
    <div className="product-list">
      {products.map((product) => {
      if (product.owner_id == user) return (
        <ProductOwnerCard key={product.id} product={product} />
      )})}
    </div>
  ) || <h1>Loading...</h1>
  else return <h1>Not logged in</h1>

}