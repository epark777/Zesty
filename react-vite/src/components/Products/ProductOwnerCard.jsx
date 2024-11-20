import { useNavigate } from "react-router-dom";

import "./Product.css";

function ProductOwnerCard({ product }) {
  const navigate = useNavigate();
  console.log(product);

  const handleEdit = (id) => {
    navigate(`/products/${id}/edit`);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Product deleted successfully");
        navigate(`api/`); // Redirect to the owner's product list
      } else {
        console.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  try {
    if (product.id)
      return (
        <div className="product-card-owner">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="product-image-owner"
          />
          <div className="product-info-owner">
            <h3 className="product-name-owner">{product.name}</h3>
            <p className="product-price-owner">${product.price}</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(product.id);
            }}
            className="edit-product-button"
          >
            Edit Product
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(product.id);
            }}
            className="delete-product-button"
          >
            Delete Product
          </button>
        </div>
      );
  } catch (error) {
    return <h1>No current products!</h1>;
  }
}

export default ProductOwnerCard;
