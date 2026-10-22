import React, { useEffect, useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteTwoToneIcon from "@mui/icons-material/FavoriteTwoTone";
import "./Favorite.css";

const Favorite = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("wishlist")) || [];
    setFavorites(stored);
  }, []);

  const removeFromFavorites = (id) => {
    const updated = favorites.filter((item) => item.id !== id);
    setFavorites(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  const handleAddToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
  };

  return (
    <div style={{ marginLeft: 240, marginTop: 64, padding: 20 }}>
      <h2 className="heading">Favorite Products</h2>

      {favorites.length > 0 ? (
        <div className="grid-container">
          {favorites.map((product) => (
            <div className="card" key={product.id}>
              <button
                className="heart-btn"
                onClick={() => removeFromFavorites(product.id)}
                title="Remove from Favorites"
              >
                <FavoriteIcon sx={{ color: "#e53935", fontSize: 26 }} />
              </button>

              <div className="img-wrapper">
                <img
                  src={product.image}
                  alt={product.name}
                  className="display-img"
                />
              </div>

              <div className="card-body">
                <p className="name">{product.name}</p>
                <p className="price">₹ {product.price}</p>

                <button
                  className="add-btn"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart <ShoppingCartIcon fontSize="small" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="fav-empty-wrapper">
          <div className="fav-cart">
            <FavoriteTwoToneIcon className="fav-cart-icon" />
            <p className="fav-cart-text">No favorite products yet!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorite;
