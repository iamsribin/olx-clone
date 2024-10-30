import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [likedProducts, setLikedProducts] = useState([]);

  const addLikedProduct = (product) => {
    setLikedProducts((prev) => [...prev, product]);
  };

  const removeLikedProduct = (id) => {
    setLikedProducts((prev) => prev.filter((product) => product.id !== id));
  };

  return (
    <CartContext.Provider value={{ likedProducts, addLikedProduct, removeLikedProduct }}>
      {children}
    </CartContext.Provider>
  );
}
