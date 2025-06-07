from django.contrib import admin
from .models import Customer, Product, Sale, SaleItem, Inventory, Forecast

# Register your models here.

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'phone', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'email', 'phone']
    ordering = ['-created_at']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'cost', 'unit', 'created_at']
    list_filter = ['category', 'created_at']
    search_fields = ['name', 'description', 'category']
    ordering = ['-created_at']

class SaleItemInline(admin.TabularInline):
    model = SaleItem
    extra = 1
    fields = ['product', 'quantity', 'price']

@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    list_display = ['id', 'customer', 'employee', 'total', 'date', 'status', 'payment_method']
    list_filter = ['date', 'status', 'payment_method']
    search_fields = ['customer__name', 'employee__username']
    ordering = ['-date']
    inlines = [SaleItemInline]

@admin.register(SaleItem)
class SaleItemAdmin(admin.ModelAdmin):
    list_display = ['sale', 'product', 'quantity', 'price', 'subtotal']
    list_filter = ['sale__date']
    search_fields = ['product__name', 'sale__customer__name']

@admin.register(Inventory)
class InventoryAdmin(admin.ModelAdmin):
    list_display = ['product', 'quantity_in_stock', 'reorder_level', 'last_updated']
    list_filter = ['last_updated']
    search_fields = ['product__name']
    ordering = ['quantity_in_stock']

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('product')

@admin.register(Forecast)
class ForecastAdmin(admin.ModelAdmin):
    list_display = ['product', 'forecast_date', 'predicted_quantity', 'model_used', 'created_at']
    list_filter = ['forecast_date', 'model_used', 'created_at']
    search_fields = ['product__name']
    ordering = ['-forecast_date']
