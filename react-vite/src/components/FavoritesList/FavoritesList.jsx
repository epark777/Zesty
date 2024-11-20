import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchFavorites } from "../../redux/favorites";
import FavoriteButton from "./FavoriteButton";
import "./Favorites.css";

function FavoritesList() {
  const dispatch = useDispatch();
  const [favorites, setFavorites] = useState([])
  const user = useSelector((state) => state.session.user);

  useEffect(() => {
    const fetchData = async () => {
      let data = await dispatch(fetchFavorites(user.id));
      setFavorites(data)
    };
    if (favorites.length < 1) fetchData();
  }, );

  

  if (!user) return <p className="empty-favorites">Not logged in.</p>;
  if (favorites.length === 0) return <p className="empty-favorites">No Favorites</p>;

  console.log(favorites)

  return (
    (
      <div className="favorites-list">
        {favorites.map((product) => (
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
            <FavoriteButton product={product} context={true} />
          </div>
        ))}
      </div>
    ) || <p className="empty-favorites"> Loading...</p>
  );
}

export default FavoritesList;
