import { useDispatch, useSelector } from "react-redux";
import { addFavorite, fetchFavorites, removeFavorite } from "../../redux/favorites";
import "./Favorites.css";
import { useEffect, useState } from "react";

function FavoriteButton({ product }) {
  const user = useSelector((state) => state.session.user); // Get the current user from Redux state
  const dispatch = useDispatch();
  const [favorites, setFavorites] = useState([]); // Local state to track fetched favorites

  // Check if the product is already in the favorites
  const isFavorite = favorites.some((fav) => fav.product_id === product.id);

  // Fetch favorites when the component mounts or when the user changes
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const res = await dispatch(fetchFavorites(user.id)); // Fetch user's favorites
      setFavorites(res || []); // Set local state with the favorites list
    };

    fetchData();
  }, [dispatch, user]); // Only re-run if `dispatch` or `user` changes

  const handleFavoriteToggle = async () => {
    if (!user) {
      console.error("No user logged in!");
      return;
    }

    if (isFavorite) {
      // Remove product from favorites
      await dispatch(removeFavorite(product.id, user.id));
      setFavorites(favorites.filter((fav) => fav.product_id !== product.id));
    } else {
      // Add product to favorites
      const newFavorite = await dispatch(addFavorite(product, user));
      setFavorites([...favorites, newFavorite]);
    }
  };

  return (
    <button
      onClick={handleFavoriteToggle}
      className={`favorite-button ${isFavorite ? "remove-favorite" : "add-favorite"}`}
    >
      {isFavorite ? "♥ Remove from Favorites" : "♡ Add to Favorites"}
    </button>
  );
}

export default FavoriteButton;
