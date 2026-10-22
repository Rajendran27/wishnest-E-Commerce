import React, { createContext, useState } from "react";

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]); // for dropdown preview

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm, suggestions, setSuggestions }}>
      {children}
    </SearchContext.Provider>
  );
};
