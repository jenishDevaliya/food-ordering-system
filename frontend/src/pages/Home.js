import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PublicLayout from "../components/PublicLayout";
import "../styles/home.css";
import { useWishlist } from "../context/WishlistContext";

const Home = () => {
  const [foods, setFoods] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const { wishlistCount, setWishlistCount } = useWishlist();
  const [ratings, setRatings] = useState({});
  const [hovered, setHovered] = useState(null);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/random_foods/")
      .then((res) => res.json())
      .then((data) => setFoods(data));
  }, []);

  useEffect(() => {
    if (userId) {
      fetch(`http://127.0.0.1:8000/api/wishlist/${userId}/`)
        .then((res) => res.json())
        .then((data) => {
          const wishlistIds = data.map((item) => item.food_id);
          setWishlist(wishlistIds);
        });
    }
  }, [userId]);

  useEffect(() => {
    const fetchAllRatings = async () => {
      const all = {};
      for (let food of foods) {
        const res = await fetch(
          `http://127.0.0.1:8000/api/food_rating_summary/${food.id}/`
        );
        const data = await res.json();
        all[food.id] = data;
      }
      setRatings(all);
    };
    if (foods.length > 0) fetchAllRatings();
  }, [foods]);

  const toggleWishlist = async (foodId) => {
    if (!userId) {
      toast.info("Please log in to use wishlist.");
      return;
    }

    const isLoved = wishlist.includes(foodId);
    const endpoint = isLoved ? "remove" : "add";

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/wishlist/${endpoint}/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId, food_id: foodId }),
        }
      );

      if (res.ok) {
        setWishlist((prev) =>
          isLoved ? prev.filter((id) => id !== foodId) : [...prev, foodId]
        );

        const newCountRes = await fetch(
          `http://127.0.0.1:8000/api/wishlist/${userId}/`
        );
        const wishlistData = await newCountRes.json();
        setWishlistCount(wishlistData.length);

        toast.success(isLoved ? "Removed from wishlist" : "Added to wishlist");
      } else {
        toast.error("Failed to update wishlist");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <PublicLayout>
      <ToastContainer position="top-center" autoClose={2000} />

      <section
        className="hero py-5 text-center"
        style={{ backgroundImage: "url('/images/food1.png')" }}
      >
        <div
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            padding: "40px 20px",
            borderRadius: "10px",
          }}
        >
          <h1 className="display-4 text-white">
            Quick & Hot Food, Delivered to You
          </h1>
          <p className="lead text-white">
            Craving something tasty? Let's get it to your door!
          </p>

          <form
            method="GET"
            action="/search"
            className="d-flex mt-3 justify-content-center"
            style={{ maxWidth: "600px", margin: "0 auto" }}
          >
            <input
              type="text"
              name="q"
              placeholder="I would like to eat..."
              className="form-control"
              style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
            />
            <button
              type="submit"
              className="btn btn-warning px-4"
              style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
            >
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-4">
            Most Loved Dishes This Month{" "}
            <span className="badge bg-danger ms-2">Top Picks</span>
          </h2>

          <div className="row mt-4">
            {foods.length === 0 ? (
              <p className="text-center">No foods found</p>
            ) : (
              foods.map((food) => (
                <div className="col-md-4 mb-4" key={food.id}>
                  <div className="card hovereffect">
                    <div className="position-relative">
                      <img
                        src={
                          food.image
                            ? `http://127.0.0.1:8000${food.image}`
                            : "/images/food1.png"
                        }
                        alt={food.item_name}
                        className="card-img-top"
                        style={{ height: "180px", objectFit: "cover" }}
                      />

                      <i
                        className={`${
                          wishlist.includes(food.id) ? "fas" : "far"
                        } fa-heart heart-anim position-absolute top-0 end-0 m-2 text-danger`}
                        style={{
                          cursor: "pointer",
                          background: "white",
                          fontSize: "20px",
                          padding: "5px",
                          borderRadius: "50%",
                        }}
                        onClick={() => toggleWishlist(food.id)}
                      ></i>
                    </div>

                    <div className="card-body">
                      <h5 className="card-title">
                        <Link to={`/food/${food.id}`}>{food.item_name}</Link>
                      </h5>
                      <p className="card-text text-muted">
                        {food.item_description?.length > 40
                          ? food.item_description.slice(0, 40) + "..."
                          : food.item_description}
                      </p>
                    </div>

                    {ratings[food.id] && (
                      <div
                        className="mb-2 rating-summary-wrapper position-relative"
                        onMouseEnter={() => setHovered(food.id)}
                        onMouseLeave={() => setHovered(null)}
                      >
                        <div>
                          <span className="text-warning">
                            {Array(
                              Math.round(ratings[food.id].average)
                            )
                              .fill(0)
                              .map((_, i) => (
                                <i key={i} className="fas fa-star"></i>
                              ))}
                            {Array(
                              5 - Math.round(ratings[food.id].average)
                            )
                              .fill(0)
                              .map((_, i) => (
                                <i key={i} className="far fa-star"></i>
                              ))}
                          </span>
                          <small className="text-muted ms-2">
                            {ratings[food.id].average} (
                            {ratings[food.id].total_reviews} ratings)
                          </small>
                        </div>

                        {hovered === food.id &&
                          ratings[food.id].breakdown && (
                            <div
                              className="hover-popup p-3 border rounded shadow position-absolute bg-white"
                              style={{
                                bottom: "100%",
                                width: "100%",
                                marginBottom: "10px",
                                zIndex: 1000,
                              }}
                            >
                              {[5, 4, 3, 2, 1].map((star) => {
                                const count =
                                  ratings[food.id].breakdown[star] || 0;
                                const percent = ratings[food.id].total_reviews
                                  ? (count /
                                      ratings[food.id].total_reviews) *
                                    100
                                  : 0;
                                return (
                                  <div
                                    key={star}
                                    className="d-flex align-items-center mb-1"
                                  >
                                    <small className="me-2" style={{ width: 50 }}>
                                      {star} star
                                    </small>
                                    <div className="progress flex-grow-1">
                                      <div
                                        className="progress-bar bg-warning"
                                        style={{ width: `${percent}%` }}
                                      ></div>
                                    </div>
                                    <small className="ms-2">{count}</small>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                      </div>
                    )}

                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold">₹{food.item_price}</span>
                      {food.is_available ? (
                        <Link
                          to={`/food/${food.id}`}
                          className="btn btn-outline-primary btn-sm"
                        >
                          <i className="fas fa-shopping-basket me-1"></i> Order
                          Now
                        </Link>
                      ) : (
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          disabled
                        >
                          <i className="fas fa-clock me-1"></i> Currently
                          Unavailable
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

       <section>
        <div className="py-5 bg-dark text-white">
          <div className="container text-center">
            <h2>Ordering in 3 Simple Steps</h2>

            <div className="row mt-4">
              <div className="col-md-4">
                <h4>1. Pick a dish you love</h4>
                <p>
                  Explore hundreds of mouth-watering options and choose what you crave!
                </p>
              </div>

              <div className="col-md-4">
                <h4>2. Share your location</h4>
                <p>
                  Tell us where you are, and we’ll handle the rest.
                </p>
              </div>

              <div className="col-md-4">
                <h4>3. Enjoy doorstep delivery</h4>
                <p>
                  Relax while your meal arrives fast and fresh — pay when it’s delivered!
                </p>
              </div>
            </div>

            <p className="mt-4">
              Pay easily with <strong>Cash on Delivery</strong> — hassle-free!
            </p>
          </div>
        </div>
      </section>

      <section className="py-5 bg-warning text-center text-dark">
        <h4>Ready to Satisfy Your Hunger?</h4>
        <Link to="/food-menu" className="btn btn-dark btn-lg mt-3">
          Browse Full Menu
        </Link>
      </section>
    </PublicLayout>
  );
};

export default Home;
