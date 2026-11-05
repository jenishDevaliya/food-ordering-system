import React, { useEffect, useState } from "react";
import PublicLayout from "../components/PublicLayout";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "../context/CartContext";
import { FaShoppingCart, FaMinus, FaPlus, FaTrash } from "react-icons/fa";

const Cart = () => {
  const userId = localStorage.getItem("userId");
  const [cartItems, setCartItems] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const { setCartCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/cart/${userId}/`);
        if (!res.ok) throw new Error("Failed to fetch cart");
        const data = await res.json();
        setCartItems(data);
        const total = data.reduce(
          (sum, item) => sum + item.food.item_price * item.quantity,
          0
        );
        setGrandTotal(total);
        setCartCount(data.length);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load cart");
      }
    };

    if (!userId) {
      navigate("/login");
      return;
    }

    fetchCartData();
  }, [userId, navigate, setCartCount]);

  const updateQuantity = async (orderId, newQty) => {
    if (newQty < 1) return;

    try {
      const res = await fetch("http://127.0.0.1:8000/api/cart/update_quantity/", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, quantity: newQty }),
      });

      if (res.ok) {
        toast.success("Quantity updated");
  
        setCartItems((prev) =>
          prev.map((item) =>
            item.id === orderId ? { ...item, quantity: newQty } : item
          )
        );
        const total = cartItems.reduce(
          (sum, item) =>
            item.id === orderId
              ? sum + item.food.item_price * newQty
              : sum + item.food.item_price * item.quantity,
          0
        );
        setGrandTotal(total);
      } else {
        await res.json();
        toast.error("Something went wrong");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error connecting to server");
    }
  };

  const deleteCartItem = async (orderId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this item?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/cart/delete/${orderId}/`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        toast.success("Item removed");
        setCartItems((prev) => prev.filter((item) => item.id !== orderId));
        const total = cartItems
          .filter((item) => item.id !== orderId)
          .reduce(
            (sum, item) => sum + item.food.item_price * item.quantity,
            0
          );
        setGrandTotal(total);
        setCartCount(cartItems.length - 1);
      } else {
        await res.json();
        toast.error("Something went wrong");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error connecting to server");
    }
  };

  return (
    <PublicLayout>
      <ToastContainer position="top-center" autoClose={2000} />
      <div className="container py-5">
        <h2 className="mb-4 text-center">
          <FaShoppingCart className="me-2" /> Your Cart
        </h2>

        {cartItems.length === 0 ? (
          <p className="text-center text-muted">Your cart is empty</p>
        ) : (
          <>
            <div className="row">
              {cartItems.map((item) => (
                <div key={item.id} className="col-md-6 mb-4">
                  <div className="card shadow-sm">
                    <div className="row">
                      <div className="col-md-4">
                        <img
                          src={`http://127.0.0.1:8000${item.food.image}`}
                          className="img-fluid rounded-start"
                          style={{ minHeight: "200px" }}
                          alt={item.food.item_name}
                        />
                      </div>
                      <div className="col-md-8">
                        <div className="card-body">
                          <h5 className="card-title">{item.food.item_name}</h5>
                          <p className="card-text text-muted small">
                            {item.food.item_description}
                          </p>
                          <p className="fw-bold text-success">
                            ₹ {item.food.item_price}
                          </p>

                          <div className="d-flex align-items-center mb-2">
                            <button
                              className="btn btn-sm btn-outline-secondary me-2"
                              disabled={item.quantity <= 1}
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                            >
                              <FaMinus />
                            </button>
                            <span className="fw-bold px-2">{item.quantity}</span>
                            <button
                              className="btn btn-sm btn-outline-secondary ms-2"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                            >
                              <FaPlus />
                            </button>
                          </div>

                          <button
                            className="btn btn-sm btn-outline-danger px-3"
                            onClick={() => deleteCartItem(item.id)}
                          >
                            <FaTrash className="me-2" /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="card p-4 mt-4 shadow-sm border-0">
              <h4 className="text-end">Total: ₹{grandTotal.toFixed(2)}</h4>
              <div className="text-end">
                <button
                  className="btn btn-primary mt-3 px-4 py-2"
                  onClick={() => navigate("/payment")}
                >
                  <FaShoppingCart className="me-2" /> Proceed to Payment
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </PublicLayout>
  );
};

export default Cart;
