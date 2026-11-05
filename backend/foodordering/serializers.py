from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    Category, Food, Order, OrderAddress, PaymentDetail,
    FoodTracking, Wishlist
)

User = get_user_model()


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'category_name', 'creation_date']


class FoodSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.category_name', read_only=True)
    image = serializers.ImageField(required=False)
    is_available = serializers.BooleanField(required=False, default=True)

    class Meta:
        model = Food
        fields = [
            'id',
            'category',
            'category_name',
            'item_name',
            'item_price',
            'item_description',
            'image',
            'is_available'
        ]


class CartOrderSerializer(serializers.ModelSerializer):
    food = FoodSerializer(read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'food', 'quantity']


class MyOrdersListSerializer(serializers.ModelSerializer):
    order_final_status = serializers.SerializerMethodField()

    class Meta:
        model = OrderAddress
        fields = ['order_number', 'order_time', 'order_final_status']

    def get_order_final_status(self, obj):
        return obj.order_final_status or "Waiting for Restaurant Confirmation"


class OrderSerializer(serializers.ModelSerializer):
    food = FoodSerializer(read_only=True)
    food_id = serializers.PrimaryKeyRelatedField(
        queryset=Food.objects.all(),
        source="food",
        write_only=True
    )

    class Meta:
        model = Order
        fields = ['id', 'food', 'food_id', 'quantity']

from rest_framework import serializers
from .models import OrderAddress, PaymentDetail

class OrderAddressSerializer(serializers.ModelSerializer):
    payment_mode = serializers.SerializerMethodField()

    class Meta:
        model = OrderAddress
        fields = ['order_number', 'address', 'order_time', 'order_final_status', 'payment_mode']

    def get_payment_mode(self, obj):
        payment = PaymentDetail.objects.filter(order_number=obj.order_number).first()
        if payment:
            return payment.get_payment_mode_display()
        return "Not Available"

class UserSerializer(serializers.ModelSerializer):
    mobile = serializers.SerializerMethodField()
    reg_date = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'mobile', 'reg_date']

    def get_mobile(self, obj):
        return getattr(obj, 'mobile', None)

    def get_reg_date(self, obj):
        return getattr(obj, 'date_joined', None)


class OrderSummarySerializer(serializers.ModelSerializer):
    order_time = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%SZ")  # ISO format

    class Meta:
        model = OrderAddress
        fields = ['id', 'order_number', 'order_time']


class OrderDetailSerializer(serializers.ModelSerializer):
    user_first_name = serializers.CharField(source='user.first_name')
    user_last_name = serializers.CharField(source='user.last_name')
    user_email = serializers.CharField(source='user.email')
    user_mobile = serializers.SerializerMethodField()
    order_time = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%SZ")  # ISO format

    class Meta:
        model = OrderAddress
        fields = [
            'order_number', 'order_time', 'order_final_status',
            'address', 'user_first_name', 'user_last_name',
            'user_email', 'user_mobile'
        ]

    def get_user_mobile(self, obj):
        return getattr(obj.user, 'mobile', None)


class OrderFoodSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source='food.item_name')
    item_price = serializers.CharField(source='food.item_price')
    image = serializers.ImageField(source='food.image')

    class Meta:
        model = Order
        fields = ['item_name', 'item_price', 'image']


class FoodTrackingSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodTracking
        fields = ['remark', 'status', 'status_date', 'order_cancelled_by_user']

class WishlistSerializer(serializers.ModelSerializer):
    food_id = serializers.IntegerField(source='food.id')
    item_name = serializers.CharField(source='food.item_name')
    item_price = serializers.CharField(source='food.item_price')
    item_description = serializers.CharField(source='food.item_description')
    image = serializers.ImageField(source='food.image')
    is_available = serializers.CharField(source='food.is_available')

    class Meta:
        model = Wishlist
        fields = ['food_id','item_name','item_price','item_description','image','is_available',
        ]
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    food_name = serializers.CharField(source='food.item_name',read_only=True)
    user_id = serializers.IntegerField(source='user.id',read_only=True)

    class Meta:
        model = Review
        fields = ['id','user','user_id','user_name','food','food_name','rating','comment','created_at']

    def get_user_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"




