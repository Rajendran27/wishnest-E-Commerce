import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSportsProducts } from "../../Redux/Slices/sportsSlice";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import "./Mobile.css";
import { useNavigate } from "react-router-dom";

const SportsAndGames = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, error } = useSelector((state) => state.sports);

  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    dispatch(fetchSportsProducts());
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(savedWishlist);
  }, [dispatch]);

  const toggleWishlist = (product) => {
    let updatedWishlist;
    if (wishlist.find((item) => item.id === product.id)) {
      updatedWishlist = wishlist.filter((item) => item.id !== product.id);
    } else {
      updatedWishlist = [...wishlist, product];
    }
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
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

  const handleViewProduct = (id) => {
    navigate(`/product/${id}`);
  };

  if (loading) return <p style={{ marginLeft: 240, marginTop: 64 }}>Loading...</p>;
  if (error) return <p style={{ marginLeft: 240, marginTop: 64 }}>Error: {error}</p>;

  return (
    <div style={{ marginLeft: 240, marginTop: 64, padding: 20 }}>
      <h2 className="heading">Sports & Games </h2>

      <div className="grid-container">
        {products.map((product) => (
          <div className="card" key={product.id}>
            <button
              className="heart-btn"
              onClick={() => toggleWishlist(product)}
              title="Add to Wishlist"
            >
              {wishlist.find((item) => item.id === product.id) ? (
                <FavoriteIcon sx={{ color: "#e53935", fontSize: 26 }} />
              ) : (
                <FavoriteBorderIcon sx={{ color: "#555", fontSize: 26 }} />
              )}
            </button>

            <div
              className="img-wrapper"
              onClick={() => handleViewProduct(product.id)}
              style={{ cursor: "pointer" }}
            >
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
              <button className="buy-btn">
                Buy Now <LocalMallIcon fontSize="small" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SportsAndGames;
