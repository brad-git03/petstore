import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('petstore_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('petstore_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (pet) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === pet.id);
      if (existing) {
        return prev; // Pets usually have quantity 1
      }
      return [...prev, { ...pet, quantity: 1 }];
    });
  };

  const removeFromCart = (petId) => {
    setCart(prev => prev.filter(p => p.id !== petId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((total, pet) => {
    const price = pet.priceUsd ? pet.priceUsd : (pet.priceCents / 100);
    return total + price;
  }, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};
