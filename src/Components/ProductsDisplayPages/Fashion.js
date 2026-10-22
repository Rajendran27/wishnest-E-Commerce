import React, { useEffect, useState } from "react";
import axios from "axios";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import DeleteIcon from "@mui/icons-material/Delete";
import CachedIcon from "@mui/icons-material/Cached";
import { useNavigate } from "react-router-dom";
import Filter from "../Filter&Category/Filter";
import "./Mobile.css";

const Fashion = () => {
  const [fashion, setFashion] = useState([]);
  const [filteredFashion, setFilteredFashion] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();
  const role = (localStorage.getItem("role") || "").trim().toLowerCase();

  // 🟢 Fetch data
  const getFashion = async () => {
    try {
      const res = await axios.get("http://localhost:3005/Fashion");
      setFashion(res.data);
      setFilteredFashion(res.data);
    } catch (error) {
      console.error("Error fetching fashion:", error);
    }
  };

  useEffect(() => {
    getFashion();
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(savedWishlist);
  }, []);

  // 🟢 Wishlist toggle
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

  // 🟢 Add to cart
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

  // 🟢 Delete product
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:3005/Fashion/${id}`);
      setFashion((prev) => prev.filter((item) => item.id !== id));
      setFilteredFashion((prev) => prev.filter((item) => item.id !== id));
      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // 🟢 Gender filter
  const handleGenderFilter = (gender) => {
  if (!gender) {
    setFilteredFashion(fashion);
    return;
  }

  const filtered = fashion.filter((item) => {
    if (Array.isArray(item.gender)) {
      // If gender is an array, check if it includes the selected gender
      return item.gender.some(
        (g) => g.toLowerCase() === gender.toLowerCase()
      );
    } else if (typeof item.gender === "string") {
      // If gender is a string, do a normal comparison
      return item.gender.toLowerCase() === gender.toLowerCase();
    }
    return false;
  });

  setFilteredFashion(filtered);
};


  // 🟢 Sort
  const handleSort = (option) => {
  let sorted = [...filteredFashion];

  switch (option) {
    case "Price : High to Low":
      sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
      break;

    case "Price : Low to High":
      sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      break;

    case "Rating : High to Low":
      sorted.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
      break;

    case "Rating : Low to High":
      sorted.sort((a, b) => (a.rating?.rate || 0) - (b.rating?.rate || 0));
      break;

    case "New Arrivals":
      sorted.sort(
        (a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)
      );
      break;

    default:
      break;
  }

  setFilteredFashion(sorted);
};

  // 🟢 Filter dropdowns (Price, Brand, Size, Category)
  const handleFilterChange = (filters) => {
    let filtered = [...fashion];

    if (filters.price) {
      if (filters.price === "Below 1000") filtered = filtered.filter((i) => i.price < 1000);
      else if (filters.price === "1000-3000")
        filtered = filtered.filter((i) => i.price >= 1000 && i.price <= 3000);
      else if (filters.price === "Above 3000") filtered = filtered.filter((i) => i.price > 3000);
    }

    if (filters.brand) {
      filtered = filtered.filter(
        (i) => i.brand?.toLowerCase() === filters.brand.toLowerCase()
      );
    }

    if (filters.size) {
      filtered = filtered.filter((i) => i.size?.includes(filters.size));
    }

    if (filters.colour) {
  filtered = filtered.filter((i) => {
    if (Array.isArray(i.colour)) {
      // If colour is an array, check if it includes the selected colour
      return i.colour.some(
        (c) => c.toLowerCase() === filters.colour.toLowerCase()
      );
    } else if (typeof i.colour === "string") {
      // If colour is a string, do a normal comparison
      return i.colour.toLowerCase() === filters.colour.toLowerCase();
    }
    return false;
  });
}

    if (filters.category) {
      filtered = filtered.filter(
        (i) => i.category?.toLowerCase() === filters.category.toLowerCase()
      );
    }

    setFilteredFashion(filtered);
  };

  const handleViewProduct = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <>
      <Filter
        role={role}
        onGenderSelect={handleGenderFilter}
        onSortSelect={handleSort}
        onFilterChange={handleFilterChange} // 🔹 connect filter event
      />

      <div style={{ marginLeft: 240, marginTop: 64, padding: 20 }}>
        <h2 className="heading">Fashion</h2>

        <div className="grid-container">
          {filteredFashion.map((product) => (
            <div className="card" key={product.id}>
              {role !== "admin" && (
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
              )}

              <div className="img-wrapper" onClick={() => handleViewProduct(product.id)}
              style={{ cursor: "pointer" }}>
                <img src={product.image} alt={product.name} className="display-img" />
              </div>

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
    </>
  );
};

export default Fashion;
