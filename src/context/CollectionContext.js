import React, { createContext, useContext, useState } from 'react';

const CollectionContext = createContext(null);

export const CollectionProvider = ({ children }) => {
  const [collection, setCollection] = useState([]);

  const isBookmarked = (id) => {
    return collection.some((item) => Number(item.id) === Number(id));
  };

  const addBookmark = (pokemon) => {
    if (!pokemon || !pokemon.id) return;
    setCollection((prev) => {
      if (prev.some((item) => Number(item.id) === Number(pokemon.id))) {
        return prev;
      }
      return [
        ...prev,
        {
          id: pokemon.id,
          name: pokemon.name,
          imageUrl: pokemon.imageUrl,
          types: pokemon.types || [],
        },
      ];
    });
  };

  const removeBookmark = (id) => {
    setCollection((prev) => prev.filter((item) => Number(item.id) !== Number(id)));
  };

  const toggleBookmark = (pokemon) => {
    if (!pokemon || !pokemon.id) return;
    if (isBookmarked(pokemon.id)) {
      removeBookmark(pokemon.id);
    } else {
      addBookmark(pokemon);
    }
  };

  return (
    <CollectionContext.Provider
      value={{
        collection,
        isBookmarked,
        addBookmark,
        removeBookmark,
        toggleBookmark,
      }}
    >
      {children}
    </CollectionContext.Provider>
  );
};

export const useCollection = () => {
  const context = useContext(CollectionContext);
  if (!context) {
    throw new Error('useCollection must be used within a CollectionProvider');
  }
  return context;
};
