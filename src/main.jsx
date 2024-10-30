import React, { createContext, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { FirebaseContext } from "./store/firebaseContext.js";
import { auth, db, storage } from "./utils/firebase.js";
import Context from "./store/userContext.jsx";
import {CartProvider} from "./store/cartContext.jsx";
import  Post from "./store/postContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <FirebaseContext.Provider value={{ auth, db, storage }}>
      <CartProvider>
      <Context>
        <Post>
          <App />
        </Post>
      </Context>
      </CartProvider>
    </FirebaseContext.Provider>
  </StrictMode>
);