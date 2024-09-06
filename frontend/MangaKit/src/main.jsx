import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { store } from "./app/store.js";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
  <StrictMode>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_API}>
    <Provider store={store}>
      <App />
    </Provider>
      </GoogleOAuthProvider>
  </StrictMode>
);
