from django.urls import path
from .views import *

urlpatterns = [
    # Admin login
    path('admin-login/', admin_login_api),

    # Category
    path('categories/', categories),  # supports GET & POST
    path('categories/<int:id>/', category_detail),

    # CSRF
    path("get-csrf/", get_csrf),

    # Food
    path('foods/', list_foods),
    path('foods/<int:id>/', food_detail),
    path('food_search/', food_search),
    path('random_foods/', random_foods),
    path('add-food-item/', add_food_item),
    path('edit-food/<int:id>/', edit_food),
    path('delete_food/<int:id>/', delete_food),

    # User
    path('register/', register_user),
    path('login/', login_user),
    path('users/', list_users),
    path('delete_user/<int:id>/', delete_user),
    path('user/<int:user_id>/', get_user_profile),
    path('user_update/', update_user_profile),
    path('change_password/<int:user_id>/', change_password),

    # Cart
    path('cart/add/', add_to_cart),
    path('cart/<int:user_id>/', get_cart_items),
    path('cart/update_quantity/', update_cart_quantity),
    path('cart/delete/<int:order_id>/', delete_cart_item),

    # Orders
    path('place_order/', place_order),
    path('orders/<int:user_id>/', user_orders),
    path('orders/by_order_number/<str:order_number>/', order_by_order_number),
    path('order_address/<str:order_number>/', get_order_address),
    path('invoice/<str:order_number>/', get_invoice),
    path('orders-not-confirmed/', orders_not_confirmed),
    path('orders-confirmed/', order_confirmed),
    path('food_being_prepared/', food_being_prepared),
    path('foodpickup/', food_being_pickup),
    path('orders-delivered/', food_delivered),
    path('order-cancelled/', order_cancelled),
    path('all-orders/', all_orders),
    path('all-foods/', all_foods),
    path('order-between-dates/', order_between_dates),
    path('view-order-detail/<str:order_number>/', view_order_detail),
    path('update-order-status/', update_order_status),
    path('search-orders/', search_order),

    # Dashboard / Analytics
    path('dashboard_metrics/', dashboard_metrics),
    path('monthly_sales_summary/', monthly_sales_summary),
    path('top_selling_food/', top_selling_foods),
    path('weekly_sales_summary/', weekly_sales_summary),
    path('weekly_user_registrations/', weekly_user_registrations),

    # Wishlist
    path('wishlist/add/', add_to_wishlist),
    path('wishlist/remove/', remove_from_wishlist),
    path('wishlist/<int:user_id>/', get_wishlist),

    # Order Tracking & Cancel
    path('track_order/<str:order_number>/', track_order),
    path('cancel_order/<str:order_number>/', cancel_order),

    # Reviews
    path('reviews/add/<int:food_id>/', add_review),
    path('reviews/<int:food_id>/', food_reviews),
    path('review_edit/<int:id>/', review_detail),
    path('food_rating_summary/<int:food_id>/', food_rating_summary),
    path('all-reviews/', all_reviews),
    path('delete_review/<int:id>/', delete_review),
    
    
    
]
