import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./ProductView.css";

const ProductView = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      // ✅ Category endpoints (no /:id — we’ll find it manually)
      const urls = [
        "http://localhost:3007/Kitchen",
        "http://localhost:3006/Beauty",
        "http://localhost:3003/Mobile",
        "http://localhost:3004/Electronics",
        "http://localhost:3005/Fashion",
        "http://localhost:3008/Sports",
        "http://localhost:3009/Furniture",
        "http://localhost:3010/Toys",
      ];

      for (const url of urls) {
        try {
          const res = await axios.get(url);
          // ✅ Find matching product by id
          const found = res.data.find(
            (item) => String(item.id) === String(id)
          );
          if (found) {
            setProduct(found);
            return; // Stop once found
          }
        } catch (err) {
          console.error("Error fetching from", url, err.message);
        }
      }

      console.error("❌ Product not found in any API");
    };

    fetchProduct();
  }, [id]);

  if (!product) return <p>Loading...</p>;

  // ⭐ Generate dynamic star rating
  const renderStars = (rate) => {
    const stars = [];
    const fullStars = Math.floor(rate);
    const hasHalfStar = rate % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIcon key={`full-${i}`} sx={{ color: "#fbc02d" }} />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalfIcon key="half" sx={{ color: "#fbc02d" }} />);
    }

    const remaining = 5 - stars.length;
    for (let i = 0; i < remaining; i++) {
      stars.push(
        <StarBorderIcon key={`empty-${i}`} sx={{ color: "#fbc02d" }} />
      );
    }

    return stars;
  };

  return (
    <div className="view-container">
      {/* 🔙 Back Button */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ArrowBackIcon /> Back
      </button>

      <div className="view-card">
        {/* 🖼️ Product Image */}
        <div className="view-image">
          <img src={product.image} alt={product.name} />
        </div>

        {/* 📄 Product Details */}
        <div className="view-details">
          <h2>{product.name}</h2>
          <p className="price">₹ {product.price}</p>

          {/* Description or Extensions */}
          {product.description ? (
            <p className="desc">{product.description}</p>
          ) : product.extensions ? (
            <ul className="desc">
              {product.extensions.map((ext, index) => (
                <li key={index}>{ext}</li>
              ))}
            </ul>
          ) : null}

          {/* ⭐ Optional Rating Section */}
          {product.rating && (
            <div className="rating-section">
              {renderStars(product.rating.rate)}
              <span className="rating">{product.rating.rate}</span>
              <span className="count">
                ({product.rating.count} ratings)
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductView;
