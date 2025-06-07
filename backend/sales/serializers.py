from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Customer, Product, Sale, SaleItem, Inventory, Forecast

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['id', 'name', 'email', 'phone', 'address', 'created_at']

class ProductSerializer(serializers.ModelSerializer):
    inventory_stock = serializers.SerializerMethodField()
    inventory_reorder_level = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'cost', 'category', 'unit', 'created_at', 'inventory_stock', 'inventory_reorder_level']

    def get_inventory_stock(self, obj):
        try:
            return obj.inventory.quantity_in_stock
        except:
            return 0

    def get_inventory_reorder_level(self, obj):
        try:
            return obj.inventory.reorder_level
        except:
            return 10

class InventorySerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = Inventory
        fields = ['id', 'product', 'product_name', 'quantity_in_stock', 'reorder_level', 'last_updated']

class SaleItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    subtotal = serializers.ReadOnlyField()

    class Meta:
        model = SaleItem
        fields = ['id', 'product', 'product_name', 'quantity', 'price', 'subtotal']

class SaleSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    employee_name = serializers.CharField(source='employee.username', read_only=True)
    items = SaleItemSerializer(many=True, read_only=True)

    class Meta:
        model = Sale
        fields = ['id', 'customer', 'customer_name', 'employee', 'employee_name', 'total', 'date', 'status', 'payment_method', 'notes', 'items']

class ForecastSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = Forecast
        fields = ['id', 'product', 'product_name', 'forecast_date', 'predicted_quantity', 'model_used', 'created_at']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']
