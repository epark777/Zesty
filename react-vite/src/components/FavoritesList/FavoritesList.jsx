import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchFavorites } from "../../redux/favorites";
import FavoriteButton from "./FavoriteButton";
import "./Favorites.css";

function FavoritesList() {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => Object.values(state.favorites))
  const allProducts = useSelector((state) => state.products);
  const user = useSelector((state) => state.session.user);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchFavorites(user.id));
    };
    fetchData();
  }, [dispatch, user]);

  if (!user) return <p className="empty-favorites">Not logged in.</p>;

  if (favorites.length === 0) {
    return <p className="empty-favorites">No favorites yet.</p>;
  }


  let products = Object.values(allProducts)
  products = products.filter(
    (product, index, self) =>
      index === self.findIndex((p) => p.id === product.id)
  );

  let favoriteValues = []
    for (let a of favorites) {
      favoriteValues.push(a)
    }
  

  const filteredProducts = products.filter((product) =>
    favoriteValues.includes(product.id)
  );

  console.log(filteredProducts, products, favoriteValues)


  return (
    (
      <div className="favorites-list">
        {filteredProducts.map((product) => (
          <div key={product.id} className="favorite-item">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="favorite-image"
            />
            <div className="favorite-details">
              <h3 className="favorite-name">{product.name}</h3>
              <p className="favorite-price">${product.price}</p>
            </div>
            <FavoriteButton product={product} user={user} />
          </div>
        ))}
      </div>
    ) || <p className="empty-favorites"> Loading...</p>
  );
}

export default FavoritesList;
