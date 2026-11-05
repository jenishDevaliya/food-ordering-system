import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AddCategory from "./pages/AddCategory";
import ManageCategory from "./pages/ManageCategory";
import AddFood from "./pages/AddFood";
import ManageFood from "./pages/ManageFood";
import SearchPage from "./pages/SearchPage";
import Register from "./components/Register";
import Login from "./components/Login";
import FoodDetail from "./pages/FoodDetail";
import Cart from "./pages/Cart";
import PaymentPage from "./pages/PaymentPage";
import MyOrders from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetails";
import ProfilePage from "./pages/ProfilePage";
import ChangePassword from "./pages/ChangePassword";
import OrdersNotConfirmed from "./pages/OrdersNotConfirmed";
import OrdersConfirmed from "./pages/OrdersConfirmed";
import FoodbeingPrepared from "./pages/FoodbeingPrepared";
import FoodPickup from "./pages/FoodPickup";
import FoodDelivered from "./pages/FoodDelivered";
import OrderCancelled from "./pages/OrderCancelled";
import AllOrders from "./pages/AllOrders";
import OrderReport from "./pages/OrderReport";
import ViewFoodOrder from "./pages/ViewFoodOrder";
import SearchOrder from "./pages/SearchOrder";
import EditCategory from "./pages/EditCategory";
import EditFood from "./pages/EditFood";
import ManageUser from "./pages/ManageUser";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import FoodList from "./pages/FoodList";
import Wishlist from "./pages/Wishlist";
import TrackOrder from "./pages/TrackOrder";
import ManageReviews from "./pages/ManageReviews";

function App() {
  return (
    <WishlistProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/add-category" element={<AddCategory />} />
            <Route path="/manage-category" element={<ManageCategory />} />
            <Route path="/add-food" element={<AddFood />} />
            <Route path="/manage-food" element={<ManageFood />} />
            <Route path="/order-not-confirmed" element={<OrdersNotConfirmed />} />
            <Route path="/order-confirmed" element={<OrdersConfirmed />} />
            <Route path="/food-being-prepared" element={<FoodbeingPrepared />} />
            <Route path="/food-pickup" element={<FoodPickup />} />
            <Route path="/food-delivered" element={<FoodDelivered />} />
            <Route path="/order-cancelled" element={<OrderCancelled />} />
            <Route path="/all-orders" element={<AllOrders />} />
            <Route path="/order-report" element={<OrderReport />} />
            <Route path="/search-order" element={<SearchOrder />} />
            <Route path="/edit_category/:id" element={<EditCategory />} />
            <Route path="/edit-food/:id" element={<EditFood />} />
            <Route path="/manage_user" element={<ManageUser />} />
            <Route path="/admin-view-order-detail/:orderNumber" element={<ViewFoodOrder />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/food/:id" element={<FoodDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/order-details/:order_number" element={<OrderDetails />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/changepassword" element={<ChangePassword />} />
            <Route path="/food-menu" element={<FoodList />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/track" element={<TrackOrder />} />
            <Route path="/track-order/:orderNumber" element={<TrackOrder />} />
            <Route path="/manage-reviews" element={<ManageReviews />} />


          </Routes>
        </BrowserRouter>
      </CartProvider>
    </WishlistProvider>
  );
}

export default App;
