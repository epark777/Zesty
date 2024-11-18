import { useDispatch, useSelector } from "react-redux";
import { addFavorite, fetchFavorites, removeFromFavorites } from "../../redux/favorites";
import "./Favorites.css";
import { useEffect, useState } from "react";

function FavoriteButton({ product }) {
  const user = useSelector((state) => state.session.user)
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites);
  const [fav, setFav] = useState(false)

  useEffect(() => {
    if (user) {
      dispatch(fetchFavorites(user.id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (favorites && favorites[product.id] && (favorites[product.id].user_id == user.id)) {
      setFav(true);
    } else {
      setFav(false);
    }
  }, [favorites, product.id, user]);

  const handleFavoriteToggle = async () => {
    if (fav) {
      console.log("true!")
      await dispatch(removeFromFavorites(product, user)); // Remove from favorites
      setFav(false)
    } else {
      console.log("false!")
      await dispatch(addFavorite(product, user)); // Add to favorites
      setFav(true)
    }
  };

  if (user) return (
    <button
      onClick={handleFavoriteToggle}
      className={`favorite-button ${fav ? "remove-favorite" : "add-favorite"}`}
    >
      {fav ? <p>Remove from favorites</p> : <p>Add to favorites</p>}
    </button>
  );
}

export default FavoriteButton;
