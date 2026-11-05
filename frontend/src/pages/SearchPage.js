import React, { useEffect, useState } from "react";
import PublicLayout from "../components/PublicLayout";
import { Link, useLocation } from "react-router-dom";
import "../styles/home.css";

const SearchPage = () => {
  const query = new URLSearchParams(useLocation().search).get("q") || "";
  const [foods, setFoods] = useState([]);
  //useLocation().search -> ?q=burger

  useEffect(() => {
    if (query) {
      fetch(`http://127.0.0.1:8000/api/food_search/?q=${query}`)
        .then((res) => res.json())
        .then((data) => {
          setFoods(data);
        })
        .catch((err) => console.error("Error fetching foods:", err));
    }
  }, [query]);

  return (
    <PublicLayout>
      <div className="container py-4">
        <h3 className="text-center text-primary">Result for: "{query}"</h3>
        <div className="row mt-4">
          {foods.length === 0 ? (
            <p className="text-center">No foods found</p>
          ) : (
            foods.map((food, index) => (
              <div className="col-md-4 mb-4" key={index}>
                <div className="card hovereffect">
                  <img src={food.image? `http://127.0.0.1:8000${food.image}`: "/images/food1.png"} className="card-img-top" style={{ height: "180px"}}/>
                  <div className="card-body">
                    <h5 className="card-title">
                      <Link to="#">{food.item_name}</Link>
                    </h5>
                   <p className="card-text text-muted">{food.item_description?.length > 40 ? food.item_description.slice(0, 40) + '...' : food.item_description}</p>
                   </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold">₹{food.item_price}</span>
                    {food.is_available ? (
                    <Link to="" className="btn btn-outline-primary btn-sm">
                      <i className="fas fa-shopping-basket me-1"></i> Order Now
                    </Link>
                    ) : (
                      <div title="This food item is not available right now. Please try again later.">
                         <button className="btn btn-outline-secondary btn-sm">
                      <i className="fas fa-time-circle me-1"></i> Currently Unavailable
                    </button>
                        
                        </div>

                    ) }  

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

export default SearchPage;
