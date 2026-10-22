import React, { useEffect, useState } from "react";
import axios from "axios";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import DeleteIcon from "@mui/icons-material/Delete";
import CachedIcon from "@mui/icons-material/Cached";
import "./Mobile.css";
import { useNavigate } from "react-router-dom";

const Beauty = () => {

  const navigate = useNavigate();

  const [electronics, setElectronics] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const role = (localStorage.getItem("role") || "").trim().toLowerCase();

  // --- Fetch Electronics Data ---
  const getElectronics = async () => {
    try {
      const res = await axios.get("http://localhost:3006/Beauty");
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

  // --- Toggle Wishlist ---
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

  // --- Add to Cart ---
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

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:3005/Fashion/${id}`);
      setElectronics((prev) => prev.filter((item) => item.id !== id));
      // setFilteredFashion((prev) => prev.filter((item) => item.id !== id));
      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };


  const handleViewProduct = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div style={{ marginLeft: 240, marginTop: 64, padding: 20 }}>
      <h2 className="heading">Beauty Products</h2>

      <div className="grid-container">
        {electronics.map((product) => (
          <div className="card" key={product.id}>
            {/* Heart Icon */}
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

            {/* Product Image */}
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
            {/* Product Details */}
            <div className="card-body">
              <p className="name">{product.name}</p>
              <p className="price">₹ {product.price}</p>
              

            {role !== "admin" && (
                  <>
                    <button className="add-btn" onClick={() => handleAddToCart(product)}>
                      Add to Cart <ShoppingCartIcon fontSize="small" />
                    </button>
                    <button className="buy-btn">
                      Buy Now <LocalMallIcon fontSize="small" />
                    </button>
                  </>
                )}

                {role === "admin" && (
                  <>
                    <button
  className="update-btn"
  onClick={() =>
    navigate(`/update/${product.id}`, { state: { api: "http://localhost:3005/Fashion", category: "Fashion" } })
  }
>

                      Update <CachedIcon fontSize="small" />
                    </button>
                    <button className="dlt-btn" onClick={() => handleDelete(product.id)}>
                      Delete <DeleteIcon fontSize="small" />
                    </button>
                  </>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Beauty;
