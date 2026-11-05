import React, { useEffect, useState } from "react";
import PublicLayout from "../components/PublicLayout";
import { Link } from "react-router-dom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "../styles/home.css";

const FoodList = () => {
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);

  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(200);

  const [sortBy, setSortBy] = useState("relevance");

  const [currentPage, setCurrentPage] = useState(1);
  const foodsPerPage = 9;

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/foods/")
      .then((res) => res.json())
      .then((data) => {
        setFoods(data);
        setFilteredFoods(data);
      });

    fetch("http://127.0.0.1:8000/api/categories/")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  const sortFoods = (list, sortValue) => {
    const sorted = [...list];
    switch (sortValue) {
      case "priceLowHigh":
        sorted.sort((a, b) => a.item_price - b.item_price);
        break;
      case "priceHighLow":
        sorted.sort((a, b) => b.item_price - a.item_price);
        break;
      case "nameAZ":
        sorted.sort((a, b) => a.item_name.localeCompare(b.item_name));
        break;
      case "nameZA":
        sorted.sort((a, b) => b.item_name.localeCompare(a.item_name));
        break;
      default:
        break;
    }
    return sorted;
  };

  const applyFilters = (
    searchTerm,
    category,
    priceMin = minPrice,
    priceMax = maxPrice,
    sortOverride = sortBy
  ) => {
    let result = foods;

    if (searchTerm) {
      result = result.filter((food) =>
        food.item_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (category !== "All") {
      result = result.filter((food) => food.category_name === category);
    }

    result = result.filter(
      (food) => food.item_price >= priceMin && food.item_price <= priceMax
    );

    result = sortFoods(result, sortOverride);

    setFilteredFoods(result);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters(search, selectedCategory);
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    applyFilters(search, category);
  };

  const handleMinPriceInput = (e) => {
    const value = Number(e.target.value);
    setMinPrice(value);
    applyFilters(search, selectedCategory, value, maxPrice);
  };

  const handleMaxPriceInput = (e) => {
    const value = Number(e.target.value);
    setMaxPrice(value);
    applyFilters(search, selectedCategory, minPrice, value);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    applyFilters(search, selectedCategory, minPrice, maxPrice, value);
  };

  const indexOfLastFood = currentPage * foodsPerPage;
  const indexOfFirstFood = indexOfLastFood - foodsPerPage;
  const currentFoods = filteredFoods.slice(indexOfFirstFood,indexOfLastFood);
  const totalPages = Math.ceil(filteredFoods.length / foodsPerPage);

  const paginate = (pagenumber) => setCurrentPage(pagenumber);

  return (
    <PublicLayout>
      <div className="container py-5">
        <h2 className="text-center mb-4">Find Your Delicious Food Here...</h2>

        <div className="row mb-4">
          <div className="col-md-8">
            <form onSubmit={handleSearch}>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search your favourite food"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button className="btn btn-primary" type="submit">
                  <i className="fa fa-search"></i>
                </button>
              </div>
            </form>
          </div>

          <div className="col-md-4">
            <select
              className="form-select"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.category_name}>
                  {cat.category_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="card mb-3 border-0 shadow-sm">
          <div className="card-body py-2">
            <div className="row g-2">
              <div className="col-md-4">
                <label className="form-label small mb-1">Sort</label>
                <select
                  className="form-select form-select-sm"
                  value={sortBy}
                  onChange={handleSortChange}
                >
                  <option value="relevance">Relevance</option>
                  <option value="priceLowHigh">Price: Low to High</option>
                  <option value="priceHighLow">Price: High to Low</option>
                  <option value="nameAZ">Name: A - Z</option>
                  <option value="nameZA">Name: Z - A</option>
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label small mb-1">
                  Min Price (₹)
                </label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={minPrice}
                  onChange={handleMinPriceInput}
                  min="0"
                />
              </div>

              <div className="col-md-4">
                <label className="form-label small mb-1">
                  Max Price (₹)
                </label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={maxPrice}
                  onChange={handleMaxPriceInput}
                  min="0"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="row m-4">
          <div className="col-md-12">
            <label className="form-label fw-bold my-2">
              Filter by Price: ₹{minPrice} - ₹{maxPrice}
            </label>
            <Slider
              range
              min={0}
              max={500}
              value={[minPrice, maxPrice]}
              onChange={(value) => {
                setMinPrice(value[0]);
                setMaxPrice(value[1]);
                applyFilters(
                  search,
                  selectedCategory,
                  value[0],
                  value[1]
                );
              }}
            />

            <button
              className="btn btn-outline-secondary btn-sm w-100 mt-3"
              onClick={() => {
                setSearch("");
                setMinPrice(0);
                setMaxPrice(200);
                setSortBy("relevance");
                setSelectedCategory("All");
                setFilteredFoods(foods);
                setCurrentPage(1);
              }}
            >
              Clear Filter
            </button>
          </div>
        </div>

        <div className="row mt-4">
          {currentFoods.length === 0 ? (
            <p className="text-center">No foods found</p>
          ) : (
            currentFoods.map((food) => (
              <div className="col-md-4 mb-4" key={food.id}>
                <div className="card hovereffect">
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
                  <div className="card-body">
                    <h5 className="card-title">
                      <Link to={`/food/${food.id}`}>
                        {food.item_name}
                      </Link>
                    </h5>
                    <p className="card-text text-muted">
                      {food.item_description?.length > 40
                        ? food.item_description.slice(0, 40) + "..."
                        : food.item_description}
                    </p>
                  </div>
                  <div className="d-flex justify-content-between align-items-center p-3">
                    <span className="fw-bold">₹{food.item_price}</span>
                    {food.is_available ? (
                      <Link
                        to={`/food/${food.id}`}
                        className="btn btn-outline-primary btn-sm"
                      >
                        <i className="fas fa-shopping-basket me-1"></i>
                        Order Now
                      </Link>
                    ) : (
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        disabled
                      >
                        <i className="fas fa-clock me-1"></i>
                        Currently Unavailable
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <nav className="mt-4 d-flex justify-content-center">
            <ul className="pagination">
              
              <li className={`page-item ${ currentPage === 1 && 'disabled'}`} >
                <button className="page-link" onClick={()=>paginate(1)}>First</button>
              </li>
              
              <li className={`page-item ${ currentPage === 1 && 'disabled'}`}>
                <button className="page-link" onClick={()=>paginate(currentPage-1)}>Prev</button>
              </li>
              
              <li className='page-item disabled'> 
                <button className="page-link"> Page {currentPage} of {totalPages} </button>
              </li>
              
              <li className={`page-item ${ currentPage === totalPages && 'disabled'}`}>
                <button className="page-link" onClick={()=>paginate(currentPage+1)}>Next</button>
              </li>
              
              <li className={`page-item ${currentPage === totalPages && 'disabled'}`}>
                <button className="page-link" onClick={()=>paginate(totalPages)}>Last </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </PublicLayout>
  );
};

export default FoodList;
