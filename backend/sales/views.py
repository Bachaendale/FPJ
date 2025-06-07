from django.http import JsonResponse
from rest_framework import viewsets
from rest_framework.decorators import api_view, action, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.db.models import Sum, F
from .models import Customer, Product, Sale, SaleItem, Inventory, Forecast
from .serializers import (
    CustomerSerializer, ProductSerializer, SaleSerializer,
    SaleItemSerializer, InventorySerializer, ForecastSerializer, UserSerializer
)

# Create your views here.

def home(request):
    """API Homepage"""
    return JsonResponse({
        'message': 'Welcome to Smart Sales API',
        'endpoints': {
            'customers': '/api/customers/',
            'products': '/api/products/',
            'sales': '/api/sales/',
            'inventory': '/api/inventory/',
            'forecasts': '/api/forecasts/',
            'dashboard': '/api/dashboard/',
            'admin': '/admin/'
        },
        'status': 'API is running successfully!'
    })

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related('inventory').all()
    serializer_class = ProductSerializer

    def perform_create(self, serializer):
        """Create product and associated inventory"""
        product = serializer.save()

        # Create inventory record if inventory data is provided
        inventory_stock = self.request.data.get('inventory_stock', 0)
        reorder_level = self.request.data.get('reorder_level', 10)

        Inventory.objects.create(
            product=product,
            quantity_in_stock=inventory_stock,
            reorder_level=reorder_level
        )

    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        """Get products with low stock"""
        low_stock_products = Product.objects.filter(
            inventory__quantity_in_stock__lte=F('inventory__reorder_level')
        )
        serializer = self.get_serializer(low_stock_products, many=True)
        return Response(serializer.data)

class SaleViewSet(viewsets.ModelViewSet):
    queryset = Sale.objects.select_related('customer', 'employee').prefetch_related('items__product').all()
    serializer_class = SaleSerializer

class SaleItemViewSet(viewsets.ModelViewSet):
    queryset = SaleItem.objects.select_related('sale', 'product').all()
    serializer_class = SaleItemSerializer

class InventoryViewSet(viewsets.ModelViewSet):
    queryset = Inventory.objects.select_related('product').all()
    serializer_class = InventorySerializer

class ForecastViewSet(viewsets.ModelViewSet):
    queryset = Forecast.objects.select_related('product').all()
    serializer_class = ForecastSerializer

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

@api_view(['GET'])
@permission_classes([AllowAny])
def dashboard_stats(request):
    """Get comprehensive dashboard statistics"""
    # Basic counts
    total_customers = Customer.objects.count()
    total_products = Product.objects.count()
    total_sales = Sale.objects.count()

    # Revenue calculations
    total_revenue = Sale.objects.aggregate(Sum('total'))['total__sum'] or 0

    # Inventory stats
    total_inventory_value = Product.objects.aggregate(
        total_value=Sum(F('inventory__quantity_in_stock') * F('cost'))
    )['total_value'] or 0

    low_stock_count = Inventory.objects.filter(
        quantity_in_stock__lte=F('reorder_level')
    ).count()

    # Recent sales (last 30 days)
    from datetime import datetime, timedelta
    thirty_days_ago = datetime.now() - timedelta(days=30)
    recent_sales = Sale.objects.filter(date__gte=thirty_days_ago).count()
    recent_revenue = Sale.objects.filter(date__gte=thirty_days_ago).aggregate(
        Sum('total')
    )['total__sum'] or 0

    return Response({
        'total_customers': total_customers,
        'total_products': total_products,
        'total_sales': total_sales,
        'total_revenue': float(total_revenue),
        'total_inventory_value': float(total_inventory_value),
        'low_stock_count': low_stock_count,
        'recent_sales_30_days': recent_sales,
        'recent_revenue_30_days': float(recent_revenue),
    })
