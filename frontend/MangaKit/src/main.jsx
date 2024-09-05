import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { store } from "./app/store.js";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
  <StrictMode>
      <GoogleOAuthProvider clientId="946067320289-t8u84p9mc07s637ptinpb2u6ur4k5c57.apps.googleusercontent.com">
    <Provider store={store}>
      <App />
    </Provider>
      </GoogleOAuthProvider>
  </StrictMode>
);
