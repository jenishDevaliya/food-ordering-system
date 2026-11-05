from urllib import request
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.hashers import make_password, check_password
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404, render
import random
from .models import FoodTracking



from .models import Food, Category, Order, OrderAddress, PaymentDetail, FoodTracking, Review, Wishlist

from .serializers import (
    CategorySerializer,
    FoodSerializer,
    CartOrderSerializer,
    MyOrdersListSerializer,
    OrderSerializer,
    OrderAddressSerializer,
    UserSerializer,
    OrderSummarySerializer,
)

User = get_user_model()


@api_view(['POST'])
def admin_login_api(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user and user.is_staff:
        return Response({"message": "Login successful"}, status=status.HTTP_200_OK)
    return Response({"message": "Invalid Credentials"}, status=status.HTTP_401_UNAUTHORIZED)

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Category
from .serializers import CategorySerializer


@api_view(['POST'])
def add_category(request):
    category_name = request.data.get('category_name')

    Category.objects.create(category_name=category_name)
    return Response({"meassage":"Category has been created"},status=201)

from.serializers import CategorySerializer
    
@api_view(['GET'])
def list_categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)
    
    

@api_view(['GET', 'POST'])
def categories(request):
    if request.method == 'GET':
        categories = Category.objects.all()
        serializer = CategorySerializer(categories,many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        name = request.data.get('name')
        if not name:
            return Response({"message": "Category name is required"},status=400)
        if Category.objects.filter(category_name=name).exists():
            return Response({"message": "Category already exists"},status=400)
        category = Category.objects.create(category_name=name)
        return Response({"message": "Category added successfully", "id": category.id},status=200)


@api_view(['GET'])
def list_foods(request):
    foods = Food.objects.all()
    serializer = FoodSerializer(foods,many=True)
    return Response(serializer.data)

@api_view(['GET'])
def food_search(request):
    query = request.GET.get('q', '')
    foods = Food.objects.filter(item_name__icontains=query)
    serializer = FoodSerializer(foods, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def random_foods(request):
    foods = list(Food.objects.all())
    random.shuffle(foods)
    serializer = FoodSerializer(foods[:9],many=True)  
    return Response(serializer.data)




@api_view(['GET'])
def food_detail(request, id):
    food = get_object_or_404(Food, id=id)
    serializer = FoodSerializer(food)
    return Response(serializer.data)

@api_view(['POST'])
def add_food_item(request):
    serializer = FoodSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Food item has been added"}, status=status.HTTP_201_CREATED)
    return Response({"message": "Something went wrong", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
def register_user(request):
    first_name = request.data.get('firstname')
    last_name = request.data.get('lastname')
    email = request.data.get('email')
    password = request.data.get('password')

    if not all([first_name, last_name, email, password]):
        return Response({"message": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(email=email).exists():
        return Response({"message": "Email already registered"}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create(
        first_name=first_name,
        last_name=last_name,
        email=email,
        password=make_password(password)
    )
    return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def login_user(request):
    email = request.data.get('email') or request.data.get('emailcont')
    password = request.data.get('password')

    if not email or not password:
        return Response({"message": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)

        # For testing only - use hashing in production
        if password == user.password:
            return Response({
                "message": "Login Successful",
                "userId": user.id,
                "userName": f"{user.first_name} {user.last_name}"
            }, status=status.HTTP_200_OK)

        return Response({"message": "Invalid Credentials"}, status=status.HTTP_401_UNAUTHORIZED)

    except User.DoesNotExist:
        return Response({"message": "Invalid Credentials"}, status=status.HTTP_401_UNAUTHORIZED)

from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone  # <-- import timezone
from .models import User, Food, Order

@api_view(['POST'])
def add_to_cart(request):
    user_id = request.data.get('userId')
    food_id = request.data.get('foodId')
    try:
        user = User.objects.get(id=user_id)
        food = Food.objects.get(id=food_id)
        order, created = Order.objects.get_or_create(
            user=user,
            food=food,
            is_order_placed=False,
            defaults={
                'quantity': 1,
                'order_time': timezone.now()  # <-- yahan add kiya
                
            }
        )
        if not created:
            order.quantity += 1
            order.save()
        return Response({"message": "Food added to cart successfully"}, status=200)
    except Exception as e:
        return Response({"message": "Something went wrong", "error": str(e)}, status=400)




@api_view(['GET'])
def get_cart_items(request, user_id):
    orders = Order.objects.filter(user_id=user_id, is_order_placed=False).select_related('food')
    serializer = CartOrderSerializer(orders,many=True)
    return Response(serializer.data)

@api_view(['PUT'])
def update_cart_quantity(request):
    order_id = request.data.get('orderId')
    quantity = request.data.get('quantity')
    try:
        order = Order.objects.get(id=order_id, is_order_placed=False)
        order.quantity = quantity
        order.save()
        return Response({"message": "Quantity updated successfully"},status=200)
    except:
        return Response({"message": "Something went wrong"},status=400)
    
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie

@ensure_csrf_cookie
def get_csrf(request):
    return JsonResponse({"detail": "CSRF cookie set"})


@api_view(['DELETE'])
def delete_cart_item(request, order_id):
    try:
        order = Order.objects.get(id=order_id, is_order_placed=False)
        order.delete()
        return Response({"message": "Item deleted from cart"}, status=status.HTTP_200_OK)
    except:
        return Response({"message": "Something went wrong"}, status=status.HTTP_400_BAD_REQUEST)


import random
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Order, OrderAddress, PaymentDetail


def make_unique_order_number():
    while True:
        num = str(random.randint(1000000000, 9999999999))
        if not Order.objects.filter(order_number=num).exists():
            return num


@api_view(['POST'])
def place_order(request):
    user_id = request.data.get('userId')
    address = request.data.get('address')
    payment_mode = request.data.get('paymentMode')
    card_number = request.data.get('cardNumber')
    expiry_date = request.data.get('expiryDate')
    cvv = request.data.get('cvv')

    try:
        orders = Order.objects.filter(user_id=user_id, is_order_placed=False)
        if not orders.exists():
            return Response({"message": "No items in cart"}, status=400)

        # ✅ Generate unique order number
        order_number = make_unique_order_number()

        # ✅ Update order status
        orders.update(order_number=order_number, is_order_placed=True)

        # ✅ Create order address
        OrderAddress.objects.create(
            user_id=user_id,
            order_number=order_number,
            address=address,
            order_final_status="Waiting for Restaurant Confirmation"
        )

        # ✅ Create payment record
        PaymentDetail.objects.create(
            user_id=user_id,
            order_number=order_number,
            payment_mode=payment_mode.lower() if payment_mode else "cod",
            card_number=card_number if payment_mode == 'online' else None,
            expiry_date=expiry_date if payment_mode == 'online' else None,
            cvv=cvv if payment_mode == 'online' else None
        )

        return Response({
            "message": "Order placed successfully!",
            "order_number": order_number,
            "payment_mode": payment_mode or "COD"
        }, status=200)

    except Exception as e:
        return Response({
            "message": "Something went wrong",
            "error": str(e)
        }, status=400)




@api_view(['GET'])
def user_orders(request, user_id):
    orders = OrderAddress.objects.filter(user_id=user_id).order_by('-id')
    serializer = MyOrdersListSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def order_by_order_number(request, order_number):
    orders = Order.objects.filter(order_number=order_number, is_order_placed=True).select_related('food')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

from .serializers import OrderAddressSerializer
@api_view(['GET'])
def get_order_address(request, order_number):
    address = get_object_or_404(OrderAddress, order_number=order_number)
    serializer = OrderAddressSerializer(address)
    return Response(serializer.data)


from django.shortcuts import render, get_object_or_404
from .models import Order, OrderAddress

def get_invoice(request, order_number):
    # Get all items for this order
    orders = Order.objects.filter(order_number=order_number, is_order_placed=True).select_related('food')

    if not orders.exists():
        return render(request, 'invoice.html', {'error': 'Order not found'})

    # Get address details
    address = get_object_or_404(OrderAddress, order_number=order_number)

    # Calculate totals
    grand_total = 0
    order_data = []
    for order in orders:
        total_price = order.food.item_price * order.quantity
        grand_total += total_price
        order_data.append({
            'food': order.food,
            'quantity': order.quantity,
            'price': order.food.item_price,
            'total_price': total_price
        })

    return render(request, 'invoice.html', {
        'order_number': order_number,
        'address': address,
        'grand_total': grand_total,
        'orders': order_data,
        'order_time': orders.first().order_time,  # ✅ show order date from model
    })


@api_view(['GET'])
def get_user_profile(request, user_id):
    user = User.objects.get(id=user_id)
    serializer = UserSerializer(user)
    return Response(serializer.data)

@api_view(['PUT'])
def update_user_profile(request, user_id):
    user = User.objects.get(id=user_id)
    serializer = UserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Profile updated successfully!"}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=400)

@api_view(['POST'])
def change_password(request):
    user_id = request.data.get('user_id')
    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')
    user = get_object_or_404(User, id=user_id)
    if not user.check_password(old_password):
        return Response({"message": "Old password is incorrect"},status=400)
    user.set_password(new_password)
    user.save()
    return Response({"message": "Password changed successfully"},status=200)

@api_view(['GET'])
def orders_not_confirmed(request):
    orders = OrderAddress.objects.filter(order_final_status__isnull=True).order_by('-order_time')
    serializer = OrderSummarySerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def order_confirmed(request):
    orders = OrderAddress.objects.filter(order_final_status="Order Confirmed").order_by('-order_time')
    serializer = OrderSummarySerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def food_being_prepared(request):
    orders = OrderAddress.objects.filter(order_final_status="Food being Prepared").order_by('-order_time')
    serializer = OrderSummarySerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def food_being_pickup(request):
    orders = OrderAddress.objects.filter(order_final_status="Food Pickup").order_by('-order_time')
    serializer = OrderSummarySerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def food_delivered(request):
    orders = OrderAddress.objects.filter(order_final_status="Food Delivered").order_by('-order_time')
    serializer = OrderSummarySerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def order_cancelled(request):
    orders = OrderAddress.objects.filter(order_final_status="Order Cancelled").order_by('-order_time')
    serializer = OrderSummarySerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def all_orders(request):
    orders = OrderAddress.objects.all().order_by('-order_time')
    serializer = OrderSummarySerializer(orders, many=True)
    return Response(serializer.data)

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Food
from .serializers import FoodSerializer

@api_view(['GET'])
def all_foods(request):
    serializer = FoodSerializer(Food.objects.all(), many=True)
    return Response(serializer.data)



@api_view(['POST'])
def order_between_dates(request):
    from_date = request.data.get('from_date')
    to_date = request.data.get('to_date')
    status = request.data.get('status')


    orders = OrderAddress.objects.filter(order_time__date__range=[from_date, to_date])

    if status == 'not_confirmed':
        orders = orders.filter(order_final_status__isnull=True)
    elif status != 'all':
        orders = orders.filter(order_final_status=status)

    serializer = OrderSummarySerializer(orders.order_by('-order_time'), many=True)
    return Response(serializer.data)

from .serializers import OrderDetailSerializer , OrderFoodSerializer , FoodTrackingSerializer
@api_view(['GET'])
def view_order_detail(request, order_number):
    try:
        order_address = OrderAddress.objects.select_related('user').get(order_number=order_number)
        ordered_foods = Order.objects.filter(order_number=order_number).select_related('food')
        tracking = FoodTracking.objects.filter(order__order_number=order_number)
    except:
        return Response({'error': 'Something went wrong'}, status=404)

    return Response({
        'order': OrderDetailSerializer(order_address).data,
        'foods': OrderFoodSerializer(ordered_foods, many=True).data,
        'tracking': FoodTrackingSerializer(tracking, many=True).data,
    })

    

@api_view(['POST'])
def update_order_status(request):
    order_number = request.data.get('order_number')
    new_status = request.data.get('status')
    remark = request.data.get('remark')

    try:
        address = OrderAddress.objects.get(order_number=order_number)
        order = Order.objects.filter(order_number=order_number).first()
        if not order:
            return Response({'error': 'Order not found'},status=404)
        FoodTracking.objects.create(order=order, remark=remark, status=new_status, order_cancelled_by_user=False)

        address.order_final_status = new_status
        address.save()
    
        return Response({'message': 'Order status updated successfully'})
    except OrderAddress.DoesNotExist:
        return Response({'error': 'Invalid order number'},status=400)
    
@api_view(['GET'])
def search_order(request):
    query = request.GET.get('q', '')
    if query:
        orders = OrderAddress.objects.filter(order_number__icontains=query).order_by('-order_time')
    else:
        orders = []
    serializer = OrderSummarySerializer(orders,many=True)
    return Response(serializer.data)     

from django.views.decorators.csrf import csrf_exempt

@api_view(['GET','PUT','DELETE'])
def category_detail(request, id):
    try:
        category = Category.objects.get(id=id)
    except Category.DoesNotExist:
        return Response({'error': 'Category not found'},status=404)
    
    if request.method == 'GET':
        serializer = CategorySerializer(category)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = CategorySerializer(category, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Category updated successfully'},status=200)
    elif request.method == 'DELETE':
        category.delete()
        return Response({'message':'Category deleted successfully'},status=200)
    
  
@api_view(['DELETE'])
def delete_food(request,id):
    try:
        food = Food.objects.get(id=id)
        food.delete()
        return Response({'message':'Food deleted successfully'},status=200)
    except Food.DoesNotExist:
        return Response({'error':'Food item Not Found'},status=404)
    
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import parser_classes
@api_view(['GET','PUT'])
@parser_classes([MultiPartParser, FormParser])
def edit_food(request,id):
    try:
        food = Food.objects.get(id=id)
    except Food.DoesNotExist:
        return Response({'error':'Food item not found'},status=404)
    
    if request.method == 'GET':
        serializer = FoodSerializer(food)
        return Response(serializer.data)
    elif request.method == 'PUT': 
        data = request.data.copy()

        if 'image' not in request.FILES:
            data['image'] = food.image
        if 'is_available' in data:
            data['is_available'] = data['is_available'].lower() == 'true'
                                                #'true/'false' == 'true'
        serializer = FoodSerializer(food,data=data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Food item updated successfully'},status=200)

@api_view(['GET'])
def list_users(request):
    users = User.objects.all().order_by('-id')
    serializer = UserSerializer(users,many=True)
    return Response(serializer.data)



from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import User

@csrf_exempt
def delete_user(request, id):
    if request.method == "DELETE":
        try:
            user = User.objects.get(id=id)
            user.delete()
            return JsonResponse({"message": "User deleted successfully"},status=200)
        except User.DoesNotExist:
            return JsonResponse({"error": "User not found"},status=404)
    return JsonResponse({"error": "Invalid request"}, status=400)


from django.utils.timezone import now, timedelta,make_aware
from django.db.models import Sum,F,DecimalField
from datetime import datetime
@api_view(['GET'])
def dashboard_metrics(request):
    today = now().date()   
    start_week = today - timedelta(days=today.weekday()) 

    start_month = today.replace(day=1)
    start_year = today.replace(month=1,day=1)

    def get_sales_total(start_date):
        # convert date-> timezone-aware datetime
        aware_start= make_aware(datetime.combine(start_date, datetime.min.time()))

        paid_orders = PaymentDetail.objects.filter(payment_date__gte=start_date).values_list('order_number', flat=True)
       
        total = Order.objects.filter(order_number__in=paid_orders).annotate(
            total_price=F('quantity') * F('food__item_price')
        ).aggregate(sale_amount=Sum('total_price'))['sale_amount'] or 0.0
        return total

    #def get_sales_total(start_date):
    #   paid_orders = PaymentDetail.objects.filter(payment_date__gte=start_date).values_list('order_number', flat=True)
    #   total = Order.objects.filter(order_number__in=paid_orders).annotate(
    #        total_price=F('quantity') * F('food__item_price')
    #    ).aggregate(sale_amount=Sum('total_price'))['sale_amount'] or 0.0
    #   return round(total,2) 
   
    data = {
        "total_orders": OrderAddress.objects.count(),
        "new_orders": OrderAddress.objects.filter(order_final_status__isnull=True).count(),
        "confirmed_orders": OrderAddress.objects.filter(order_final_status="Order Confirmed").count(),
        "food_preparing": OrderAddress.objects.filter(order_final_status="Food being prepared").count(),
        "food_pickup": OrderAddress.objects.filter(order_final_status="Food Pickup").count(),
        "food_delivered": OrderAddress.objects.filter(order_final_status="Food Delivered").count(),
        "cancelled_orders": OrderAddress.objects.filter(order_final_status="Order Cancelled").count(),
        "total_users": User.objects.count(),
        "total_categories": Category.objects.count(),
        "total_reviews": Review.objects.count(),
        "total_wishlists": Wishlist.objects.count(),
        "today_sales": get_sales_total(today),
        "week_sales": get_sales_total(start_week),
        "month_sales": get_sales_total(start_month),
        "year_sales": get_sales_total(start_year),
    }

    return Response(data)

from decimal import Decimal
from collections import defaultdict
from django.db.models import Sum, F, DecimalField
from django.db.models.functions import TruncMonth,Coalesce ,TruncWeek

@api_view(['GET'])
def monthly_sales_summary(request):
    # Step 1: Pre-order total = Sum(quantity * price)
    orders = (
        Order.objects
        .filter(is_order_placed=True)
        .values('order_number')
        .annotate
        (total_price=Sum(F('quantity') * F('food__item_price'),
         output_field=DecimalField(max_digits=12, decimal_places=2))
        )
    )

    # Step 2: 
    order_price_map = {
        o['order_number']: o['total_price'] for o in orders
    }

    # Step 3: month resolve
    addresses = (
        OrderAddress.objects
        .filter(order_number__in=order_price_map.keys())
        .annotate(month=TruncMonth('order_time'))
        .values('month', 'order_number')
    )

    month_totals = defaultdict(lambda: Decimal('0.00'))

    for addr in addresses:
        label = addr['month'].strftime('%b')  
        month_totals[label] += order_price_map.get(addr['order_number'], Decimal('0.00'))

    result = [{"month": m,"sales":total} for m,total in month_totals.items()]
    return Response(result)


@api_view(['GET'])
def top_selling_foods(request):
   
    
    top_foods = (
        Order.objects
        .filter(is_order_placed=True)
        .values('food__item_name')
        .annotate
        (total_sold=Sum('quantity'))
        .order_by('-total_sold')[:5]
    )
    #burger - 2, burger -4 , burger -1
    #burger - 7 (quantity)
    #pizza  - 5
   
    return Response(top_foods)


@api_view(['GET'])
def weekly_sales_summary(request):
    # Step 1: Pre-order total = Sum(quantity * price)
    orders = (
        Order.objects
        .filter(is_order_placed=True)
        .values('order_number')
        .annotate(
            total_price=Sum(
                F('quantity') * F('food__item_price'),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            )
        )
    )

    # Step 2:
    order_price_map = {
        o['order_number']: o['total_price'] for o in orders
    }

    # Step 3: week resolve
    addresses = (
        OrderAddress.objects
        .filter(order_number__in=order_price_map.keys())
        .annotate(week=TruncWeek('order_time'))
        .values('week', 'order_number')
    )

    weekly_totals = defaultdict(lambda: Decimal('0.00'))

    for addr in addresses:
        label = addr['week'].strftime('Week %W')
        weekly_totals[label] += order_price_map.get(addr['order_number'],Decimal('0.00'))

    result = [{"week": w, "sales": total} for w, total in weekly_totals.items()]
    return Response(result)


from django.db.models import Count

@api_view(['GET'])
def weekly_user_registrations(request):
    data = (
        User.objects
        .annotate(week=TruncWeek('reg_date'))  
        .values('week')
        .annotate(new_users=Count('id'))
        .order_by('week')
    )

    result = [
        {
            "week": entry["week"].strftime('Week %W'),
            "new_users": entry["new_users"]
        }
        for entry in data
    ]
    return Response(result)

@api_view(['POST'])
def add_to_wishlist(request):
    user_id = request.data.get('user_id')
    food_id = request.data.get('food_id')

    obj, created = Wishlist.objects.get_or_create(user_id=user_id, food_id=food_id)  # ✅ fixed here

    if created:
        return Response({"message": "Added to wishlist"}, status=201)
    else:
        return Response({"message": "Already in wishlist"}, status=200)
    

@api_view(['POST'])
def remove_from_wishlist(request):
    user_id = request.data.get('user_id')
    food_id = request.data.get('food_id')
    try:
        Wishlist.objects.get(user_id=user_id, food_id=food_id).delete()
        return Response({"message": "Removed from wishlist"}, status=200)
    except Wishlist.DoesNotExist:
        return Response({"message": "Item not found in wishlist"}, status=404)


from .serializers import WishlistSerializer

@api_view(['GET'])
def get_wishlist(request, user_id):
    wishlist_items = Wishlist.objects.filter(user_id=user_id)
    serializer = WishlistSerializer(wishlist_items, many=True)
    return Response(serializer.data)

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Order, FoodTracking
from .serializers import FoodTrackingSerializer

@api_view(['GET'])
def track_order(request, order_number):
    # Get order by order_number
    order = Order.objects.filter(order_number=order_number, is_order_placed=True).first()
    
    if not order:
        return Response({"message": "Order not found or not yet placed."}, status=404)
    
    # Fetch related tracking updates
    tracking_entries = FoodTracking.objects.filter(order=order).order_by('id')
    
    if not tracking_entries.exists():
        # If no tracking entries found, show sample data
        tracking_data = [
            {"status": "Order Confirmed", "status_date": "2025-11-06T10:00:00Z"},
            {"status": "Food Being Prepared", "status_date": "2025-11-06T10:20:00Z"},
            {"status": "Food Pickup", "status_date": "2025-11-06T10:50:00Z"},
            {"status": "Food Delivered", "status_date": "2025-11-06T11:30:00Z"},
        ]
        return Response(tracking_data)
    
    serializer = FoodTrackingSerializer(tracking_entries, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def cancel_order(request, order_number):
    remark = request.data.get('remark')

    address = OrderAddress.objects.filter(order_number=order_number).first()
    if not address:
        return Response({"message": "Order not found"}, status=404)

    sample_order = Order.objects.filter(order_number=order_number).first()
    if not sample_order:
        return Response({"message": "Order not found"}, status=404)

    FoodTracking.objects.create(
        order=sample_order,
        remark=remark,
        status="Order Cancelled",
        order_cancelled_by_user=True
    )

    address.order_final_status = "Order Cancelled"
    address.save()

    return Response({"message": "Order Cancelled successfully"}, status=200)


@api_view(['POST'])
def add_review(request,food_id):
    user_id = request.data.get('user_id')
    rating = request.data.get('rating')
    comment = request.data.get('comment')

    try:
       user = User.objects.get(id = user_id)
       food = Food.objects.get(id = food_id)

    except(User.DoesNotExist , Food.DoesNotExist):
         return Response({"message": "User or Food"},status=404)
    
    Review.objects.create(
        user = user,
        food = food,
        rating = rating,
        comment = comment
    )
    return Response({"message":"Review Submitted"},status=201)

from .serializers import ReviewSerializer
@api_view(['GET'])
def food_reviews(request,food_id):
    reviews = Review.objects.filter(food_id = food_id).order_by('-created_at')
    serializer = ReviewSerializer(reviews,many=True)
    return Response(serializer.data)

@api_view(['DELETE','PUT'])
def review_detail(request,id):
    try:
        review = Review.objects.get( id = id)
    except Review.DoesNotExist:
        return Response({"message":"Review not Found"},status=404) 
    
    if request.method == 'DELETE':
        review.delete()
        return Response({"message":"Review deleted"},status=200)
    if request.method == 'PUT':
        data = {"rating":request.data.get("rating",review.rating),
                "comment":request.data.get("comment",review.comment)
                
                }
        serializer = ReviewSerializer(review,data=data,partial=True)
        if serializer.is_valid():
            serializer.save()
        return Response({"message":"Review Updated"},status=200) 
    return Response(serializer.errors,status=400)

from django.db.models import Count,Avg
@api_view(['GET'])
def food_rating_summary(request,food_id):
    reviews = Review.objects.filter(food_id = food_id)
    rating_summary = reviews.values('rating').annotate(count=Count('rating')).order_by('-rating')
    average = reviews.aggregate(average = Avg('rating'))['average'] or 0
    total_reviews = reviews.count()
    return Response({
        'average': round(average,1),
        'total_reviews' : total_reviews,
        'breakdown' : {entry['rating'] : entry['count'] for entry in rating_summary}

})

@api_view(['GET'])
def all_reviews(request):
    reviews = Review.objects.select_related('user', 'food').order_by('-created_at')
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data)


@api_view(['DELETE'])
def delete_review(request, id):
    try:
        review = Review.objects.get(id=id)
        review.delete()
        return Response({"message": "Review deleted successfully"}, status=200)
    except Review.DoesNotExist:
        return Response({"message": "Review not found"}, status=404)
