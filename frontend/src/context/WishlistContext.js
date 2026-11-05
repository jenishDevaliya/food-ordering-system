import { createContext, useContext, useState } from "react";

// Create shared state (context)
const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistCount, setWishlistCount] = useState(0);

  return (
    <WishlistContext.Provider value={{ wishlistCount, setWishlistCount }}>
      {children}
    </WishlistContext.Provider>
  );
};

// Custom hook for easy access
export const useWishlist = () => useContext(WishlistContext);
