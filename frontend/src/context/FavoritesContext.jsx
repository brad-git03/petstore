import React, { createContext, useState, useEffect, useContext } from 'react';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('petstore_favorites');
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
    localStorage.setItem('petstore_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (pet) => {
    setFavorites(prev => {
      const isFavorited = prev.some(p => p.id === pet.id);
      if (isFavorited) {
        return prev.filter(p => p.id !== pet.id);
      } else {
        return [...prev, pet];
      }
    });
  };

  const isFavorite = (petId) => {
    return favorites.some(p => p.id === petId);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, clearFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};
