from django.db import models
from django.contrib.auth.models import User

# ------------------------------
# 1. Customer Model
# ------------------------------
class Customer(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

# ------------------------------
# 2. Product Model
# ------------------------------
class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=100)
    unit = models.CharField(max_length=50, default='pcs')  # e.g., kg, L
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

# ------------------------------
# 3. Sale Model (i.e., Order)
# ------------------------------
class Sale(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='sales')
    employee = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='sales')
    total = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, default='Completed')
    payment_method = models.CharField(max_length=50, default='Cash')
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Sale {self.id} - {self.customer.name}"

# ------------------------------
# 4. SaleItem Model (line items)
# ------------------------------
class SaleItem(models.Model):
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"

    @property
    def subtotal(self):
        return self.quantity * self.price

# ------------------------------
# 5. Inventory Model
# ------------------------------
class Inventory(models.Model):
    product = models.OneToOneField(Product, on_delete=models.CASCADE, related_name='inventory')
    quantity_in_stock = models.IntegerField(default=0)
    reorder_level = models.IntegerField(default=10)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.product.name} - {self.quantity_in_stock} in stock"

# ------------------------------
# 6. Forecast Model
# ------------------------------
class Forecast(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='forecasts')
    forecast_date = models.DateField()
    predicted_quantity = models.IntegerField()
    model_used = models.CharField(max_length=100, default='ARIMA')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product.name} forecast for {self.forecast_date}"

# ------------------------------
# 7. (Built-in) User model from django.contrib.auth.models.User
# ------------------------------
# No need to redefine unless you're customizing it.
