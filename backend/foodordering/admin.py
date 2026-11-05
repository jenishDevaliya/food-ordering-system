from django.contrib import admin
from .models import User, Category, Food, Order, OrderAddress, PaymentDetail, FoodTracking, Review, Wishlist

admin.site.register(User)
admin.site.register(Category)
admin.site.register(Food)
admin.site.register(Order)
admin.site.register(OrderAddress)
admin.site.register(PaymentDetail)
admin.site.register(FoodTracking)
admin.site.register(Review)
admin.site.register(Wishlist)
