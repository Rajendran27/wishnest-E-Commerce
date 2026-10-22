import React, { useEffect, useState } from "react";
import axios from "axios";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import DeleteIcon from "@mui/icons-material/Delete";
import CachedIcon from "@mui/icons-material/Cached";
import "./Mobile.css";
import Filter from "../Filter&Category/Filter"; // ✅ Import Filter component
import { useNavigate } from "react-router-dom";

const Mobile = () => {

  const navigate = useNavigate();

  const [mobiles, setMobiles] = useState([]);
  const [filteredMobiles, setFilteredMobiles] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const role = (localStorage.getItem("role") || "").trim().toLowerCase();

  // ✅ Fetch mobiles from backend
  const getMobiles = async () => {
    try {
      const res = await axios.get("http://localhost:3003/Mobile");
      setMobiles(res.data);
      setFilteredMobiles(res.data);
    } catch (error) {
      console.log("Error fetching mobiles:", error);
    }
  };

  // ✅ Initial load
  useEffect(() => {
    getMobiles();
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(savedWishlist);
  }, []);

  // ✅ Wishlist toggle
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

  // ✅ Add to Cart
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

  // ✅ Filter Handling
  const handleFilterChange = (filters) => {
    let filtered = [...mobiles];

    // 🔹 PRICE FILTER
    if (filters.price) {
      filtered = filtered.filter((p) => {
        const priceValue = Number(String(p.price).replace(/[^0-9]/g, ""));
        if (filters.price === "Below 10000") return priceValue < 10000;
        if (filters.price === "10000-30000") return priceValue >= 10000 && priceValue <= 30000;
        if (filters.price === "Above 30000") return priceValue > 30000;
        return true;
      });
    }

    // 🔹 BRAND FILTER
    if (filters.brand) {
      filtered = filtered.filter(
        (p) => p.brand?.toLowerCase() === filters.brand.toLowerCase()
      );
    }

    // 🔹 RAM/MEMORY FILTER (uses "size" from Filter component)
    if (filters.size) {
      filtered = filtered.filter(
        (p) => p.ram?.toLowerCase() === filters.size.toLowerCase()
      );
    }

    // 🔹 COLOUR FILTER
    if (filters.colour) {
      filtered = filtered.filter(
        (p) => p.colour?.toLowerCase() === filters.colour.toLowerCase()
      );
    }

    setFilteredMobiles(filtered);
  };

   const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:3003/Mobile/${id}`);
      setMobiles((prev) => prev.filter((item) => item.id !== id));
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
      <h2 className="heading">Mobile Products</h2>

      {/* ✅ Floating Filter Component */}
      <Filter onFilterChange={handleFilterChange} />

      {/* ✅ Product Grid */}
      <div className="grid-container">
        {filteredMobiles.length > 0 ? (
          filteredMobiles.map((product) => (
            <div className="card" key={product.id}>
              {/* ❤️ Wishlist Button */}
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

              {/* 🖼️ Product Image */}
              <div className="img-wrapper"  onClick={() => handleViewProduct(product.id)}
              style={{ cursor: "pointer" }}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="display-img"
                />
              </div>

              {/* 📝 Product Info */}
              <div className="card-body">
                <p className="name">{product.name}</p>
                <p className="price">₹ {product.price}</p>

                {/* 🛒 Buttons */}
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
                    navigate(`/update/${product.id}`, { state: { api: "http://localhost:3003/Mobile", category: "Mobile" } })
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
          ))
        ) : (
          <p style={{ textAlign: "center", width: "100%", marginTop: 40 }}>
            No products match your selected filters.
          </p>
        )}
      </div>
    </div>
  );
};

export default Mobile;
