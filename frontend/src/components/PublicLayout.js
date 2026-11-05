import React, { useEffect, useState, useCallback } from "react";
import {FaUtensils,FaHome,FaTruck,FaUserPlus,FaSignInAlt,FaUserShield,FaShoppingCart,FaUser,FaHeart,FaUserCircle,FaSignOutAlt,FaCogs,} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "../styles/layout.css";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useLocation } from "react-router-dom";

const PublicLayout = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [animateCart, setAnimateCart] = useState(false);
  const [animateWishlist, setAnimateWishlist] = useState(false);

  const { cartCount, setCartCount } = useCart();
  const { wishlistCount, setWishlistCount } = useWishlist();
  const location = useLocation();
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const name = localStorage.getItem("userName");

  const fetchCartCount = useCallback(async () => {
    if (userId) {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/cart/${userId}/`);
        const data = await res.json();
        setCartCount(data.length);
      } 
      catch (error) {
        console.error("Error fetching cart count:", error);
      }
    }
  }, [userId, setCartCount]);

  // ✅ Fetch wishlist count
  const fetchWishlistCount = useCallback(async () => {
    if (userId) {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/wishlist/${userId}/`);
        const data = await res.json();
        setWishlistCount(data.length);
      } 
      catch (error) {
        console.error("Error fetching wishlist count:", error);
      }
    }
  }, [userId, setWishlistCount]);

  // ✅ Handle login state and fetch data
  useEffect(() => {
    if (userId) {
      setIsLoggedIn(true);
      setUserName(name);
      fetchCartCount();
      fetchWishlistCount();
    }
  }, [userId, name, fetchCartCount, fetchWishlistCount]);

  // ✅ Animate badges when counts change
  useEffect(() => {
    if (cartCount > 0) {
      setAnimateCart(true);
      const timeout = setTimeout(() => setAnimateCart(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [cartCount]);

  useEffect(() => {
    if (wishlistCount > 0) {
      setAnimateWishlist(true);
      const timeout = setTimeout(() => setAnimateWishlist(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [wishlistCount]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
    setCartCount(0);
    setWishlistCount(0);
    navigate("/login");
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
            <FaUtensils className="me-1" /> Food Ordering System
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item mx-1">
                <Link className={`nav-link ${location.pathname === "/" ? "active-nav-link" : ""}`} to="/">
                  <FaHome className="me-1" /> Home
                </Link>
              </li>
              <li className="nav-item mx-1">
                <Link className={`nav-link ${location.pathname === "/food-menu" ? "active-nav-link" : ""}`} to="/food-menu">
                  <FaUtensils className="me-1" /> Menu
                </Link>
              </li>
              <li className="nav-item mx-1">
                <Link className={`nav-link ${location.pathname === "/track" ? "active-nav-link" : ""}`} to="/track">
                  <FaTruck className="me-1" /> Track
                </Link>
              </li>
              {!isLoggedIn ? (
                <>
                  <li className="nav-item mx-1">
                    <Link className={`nav-link ${location.pathname === "/register" ? "active-nav-link" : ""}`} to="/register">
                      <FaUserPlus className="me-1" /> Register
                    </Link>
                  </li>
                  <li className="nav-item mx-1">
                    <Link className={`nav-link ${location.pathname === "/login" ? "active-nav-link" : ""}`} to="/login">
                      <FaSignInAlt className="me-1" /> Login
                    </Link>
                  </li>
                  <li className="nav-item mx-1">
                    <Link className={`nav-link ${location.pathname === "/admin-login" ? "active-nav-link" : ""}`} to="/admin-login">
                      <FaUserShield className="me-1" /> Admin
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item mx-1">
                    <Link className={`nav-link ${location.pathname === "/my-orders" ? "active-nav-link" : ""}`} to="/my-orders">
                      <FaUser className="me-1" /> My Orders
                    </Link>
                  </li>

                  <li className="nav-item mx-1 position-relative">
                    <Link className={`nav-link ${location.pathname === "/cart" ? "active-nav-link" : ""}`} to="/cart">
                      <FaShoppingCart className="me-1" /> Cart
                      {cartCount > 0 && (
                        <span
                          className={`badge bg-light text-dark ms-1 ${
                            animateCart ? "badge-bounce" : ""
                          }`}
                        >
                          ({cartCount})
                        </span>
                      )}
                    </Link>
                  </li>

                  <li className="nav-item mx-1 position-relative">
                    <Link className={`nav-link ${location.pathname === "/wishlist" ? "active-nav-link" : ""}`} to="/wishlist">
                      <FaHeart className="me-1" /> Wishlist
                      {wishlistCount > 0 && (
                        <span
                          className={`badge bg-light text-dark ms-1 ${
                            animateWishlist ? "badge-bounce" : ""
                          }`}
                        >
                          ({wishlistCount})
                        </span>
                      )}
                    </Link>
                  </li>

                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#!"
                      id="navbarDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <FaUserCircle className="me-1" /> {userName}
                    </a>
                    <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                      <li>
                        <Link className={`dropdown-item ${location.pathname === "/profile" ? "active-dropdown" : ""}`} to="/profile">
                          <FaUser className="me-1" /> Profile
                        </Link>
                      </li>
                      <li>
                        <Link className={`dropdown-item ${location.pathname === "/changepassword" ? "active-dropdown" : ""}`} to="/changepassword">
                          <FaCogs className="me-1" /> Setting
                        </Link>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <button className="dropdown-item" onClick={handleLogout}>
                          <FaSignOutAlt className="me-1" /> Logout
                        </button>
                      </li>
                    </ul>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <div className="text-primary">{children}</div>

      <footer className="text-center py-3 mt-5">
        <div className="container">
          <p>&copy; 2025 Food Ordering System. All rights reserved</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
