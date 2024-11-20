import { useDispatch, useSelector } from "react-redux";
import {
  addFavorite,
  removeFavorite,
} from "../../redux/favorites";
import "./Favorites.css";
import { useEffect, useState } from "react";

function FavoriteButton({ product }) {
  const user = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  const [fav, setFav] = useState(false);
  
  useEffect(() => {
    const checkIfFavorite = async () => {
      if (user && product) {
        try {
          const response = await fetch(
            `/api/favorites/users/${user.id}/${product.name}`
          );
          const data = await response.json();
          console.log(data)
          if (data.name === product.name) {
            setFav(true);
          } else {
            setFav(false);
          }
        } catch (error) {
          console.error("Error checking favorite status:", error);
        }
      }
    };

    checkIfFavorite();
  }, [user, product]);
 

  const handleFavoriteToggle = async () => {
    if (fav) {
      console.log(product)
      const response = await dispatch(removeFavorite(product, user));
      let res = await response
      if (res.message === "deleted") {
        setFav(false);
      }
    } else {
      console.log(product)
      const response = await dispatch(addFavorite(product, user));
      let res = await response
      if (res.message === "created") {
        setFav(true);
      }
    }
  };


  if (user)
    return (
      <button
        onClick={handleFavoriteToggle}
        className={`favorite-button ${
          fav ? "remove-favorite" : "add-favorite"
        }`}
      >
        {fav ? <p>Remove from favorites</p> : <p>Add to favorites</p>}
      </button>
    );
}

export default FavoriteButton;
