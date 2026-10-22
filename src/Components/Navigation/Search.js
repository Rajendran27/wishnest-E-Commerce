import React, { useContext, useEffect, useState } from "react";
import { SearchContext } from "../Navigation/SearchContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const { searchTerm } = useContext(SearchContext);
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [mob, elec, fashion, beauty, kitchen, Sports, Furniture, Toys] =
          await Promise.all([
            axios.get("http://localhost:3003/Mobile"),
            axios.get("http://localhost:3004/Electronics"),
            axios.get("http://localhost:3005/Fashion"),
            axios.get("http://localhost:3006/Beauty"),
            axios.get("http://localhost:3007/Kitchen"),
            axios.get("http://localhost:3008/Sports"),
            axios.get("http://localhost:3009/Furniture"),
            axios.get("http://localhost:3010/Toys"),
          ]);

        const all = [
          ...mob.data,
          ...elec.data,
          ...fashion.data,
          ...beauty.data,
          ...kitchen.data,
          ...Sports.data,
          ...Furniture.data,
          ...Toys.data,
        ];
        const filtered = all.filter((p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setResults(filtered);
      } catch (err) {
        console.error("Search error:", err);
      }
    };

    if (searchTerm.trim() !== "") fetchAll();
  }, [searchTerm]);

  const styles = {
    container: {
      marginLeft: 240,
      marginTop: 64,
      padding: 20,
      backgroundColor: "#f9fafc",
      minHeight: "100vh",
      fontFamily: "Poppins, sans-serif",
      transition: "all 0.3s ease",
    },
    heading: {
      fontSize: "1.8rem",
      fontWeight: 600,
      color: "#222",
      marginBottom: 20,
    },
    message: {
      fontSize: "1.1rem",
      color: "#555",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
      gap: 25,
      padding: "10px 0",
    },
    card: {
      background: "#fff",
      borderRadius: 16,
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.08)",
      overflow: "hidden",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    img: {
      width: "100%",
      height: 200,
      objectFit: "contain",
      backgroundColor: "#f2f2f2",
      transition: "transform 0.3s ease",
    },
    cardBody: {
      padding: 15,
      textAlign: "center",
    },
    name: {
      fontSize: "1rem",
      fontWeight: 500,
      color: "#333",
      marginBottom: 8,
      minHeight: 45,
    },
    price: {
      fontSize: "1.1rem",
      fontWeight: 600,
      color: "#1976d2",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Search results...</h2>

      {results.length === 0 ? (
        <p style={styles.message}>No products found.</p>
      ) : (
        <div style={styles.grid}>
          {results.map((p) => (
            <div
              key={p.id}
              style={styles.card}
              onClick={() => navigate(`/product/${p.id}`)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-6px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "none")
              }
            >
              <img src={p.image} alt={p.name} style={styles.img} />
              <div style={styles.cardBody}>
                <p style={styles.name}>{p.name}</p>
                <p style={styles.price}>₹ {p.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
