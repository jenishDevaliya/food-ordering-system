import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PublicLayout from "../components/PublicLayout";
import "../styles/home.css";
import { useWishlist } from "../context/WishlistContext";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const { setWishlistCount } = useWishlist();
  const userId = localStorage.getItem("userId");

  const fetchWishlist = useCallback(async () => {
    if (userId) {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/wishlist/${userId}/`);
        const data = await res.json();
        setWishlist(data);
        setWishlistCount(data.length);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    }
  }, [userId, setWishlistCount]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]); 

  const removeFromWishlist = async (foodId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/wishlist/remove/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, food_id: foodId }),
      });

      if (response.ok) {
        const updatedWishlist = wishlist.filter((item) => item.food_id !== foodId);
        setWishlist(updatedWishlist);
        setWishlistCount(updatedWishlist.length);
        toast.success("Removed from wishlist");
      } else {
        toast.error("Failed to remove item from wishlist");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleHeartClick = (e, foodId) => {
    const heartEl = e.currentTarget;
    if (!heartEl) return;

    heartEl.classList.add("bounce");
    setTimeout(() => {
      if (heartEl && heartEl.classList) heartEl.classList.remove("bounce");
    }, 600);

    removeFromWishlist(foodId);
  };

  return (
    <PublicLayout>
      <div className="container py-5">
        <h2 className="mb-4">My Wishlist</h2>

        <div className="row mt-4">
          {wishlist.length === 0 ? (
            <p className="text-center">No items in wishlist</p>
          ) : (
            wishlist.map((item, index) => (
              <div className="col-md-4 mb-4" key={index}>
                <div className="card hovereffect shadow-sm">
                  <div className="position-relative">
                    <img
                      src={
                        item.image
                          ? `http://127.0.0.1:8000${item.image}`
                          : "/images/food1.png"
                      }
                      alt={item.item_name || "Food image"}
                      className="card-img-top"
                      style={{ height: "180px", objectFit: "cover" }}
                    />
                    <i
                      className="fas fa-heart heart-anim position-absolute top-0 end-0 m-2 text-danger"
                      style={{
                        cursor: "pointer",
                        background: "white",
                        fontSize: "20px",
                        padding: "5px",
                        borderRadius: "50%",
                        transition: "transform 0.3s ease",
                      }}
                      onClick={(e) => handleHeartClick(e, item.food_id)}
                    ></i>
                  </div>

                  <div className="card-body">
                    <h5 className="card-title">
                      <Link to={`/food/${item.food_id}`}>{item.item_name}</Link>
                    </h5>
                    <p className="card-text text-muted">
                      {item.item_description?.length > 40
                        ? item.item_description.slice(0, 40) + "..."
                        : item.item_description}
                    </p>
                  </div>

                  <div className="d-flex justify-content-between align-items-center p-3">
                    <span className="fw-bold">₹{item.item_price}</span>
                    {item.is_available ? (
                      <Link
                        to={`/food/${item.food_id}`}
                        className="btn btn-outline-primary btn-sm"
                      >
                        <i className="fas fa-shopping-basket me-1"></i> Order Now
                      </Link>
                    ) : (
                      <button className="btn btn-outline-secondary btn-sm" disabled>
                        <i className="fas fa-clock me-1"></i> Unavailable
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </PublicLayout>
  );
};

export default Wishlist;
