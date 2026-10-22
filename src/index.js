import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";        // ✅ Import Redux Provider
import { store } from "./Redux/store";         // ✅ Import your store
import { SearchProvider } from "./Components/Navigation/SearchContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>                    {/* ✅ Wrap Redux first */}
    <SearchProvider>                          {/* ✅ Then your Search context */}
      <App />
    </SearchProvider>
  </Provider>
);

reportWebVitals();
