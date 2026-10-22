import React, { useEffect, useState } from "react";
import axios from "axios";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import "./Mobile.css";
import { useNavigate } from "react-router-dom";

const Kitchen = () => {
  const [electronics, setElectronics] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  // --- Fetch Electronics Data ---
  const getElectronics = async () => {
    try {
      const res = await axios.get("http://localhost:3007/Kitchen");
      setElectronics(res.data);
    } catch (error) {
      console.error("Error fetching electronics:", error);
    }
  };

  useEffect(() => {
    getElectronics();
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(savedWishlist);
  }, []);

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

  return (
    <div style={{ marginLeft: 240, marginTop: 64, padding: 20 }}>
      <h2 className="heading">Home & Kitchen</h2>

      <div className="grid-container">
        {electronics.map((product) => (
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

            {/* Product Image (Clickable) */}
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


export default Kitchen;
