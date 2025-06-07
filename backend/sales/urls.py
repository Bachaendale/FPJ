from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from . import views
from . import auth_views

router = DefaultRouter()
router.register(r'customers', views.CustomerViewSet)
router.register(r'products', views.ProductViewSet)
router.register(r'sales', views.SaleViewSet)
router.register(r'sale-items', views.SaleItemViewSet)
router.register(r'inventory', views.InventoryViewSet)
router.register(r'forecasts', views.ForecastViewSet)
router.register(r'users', views.UserViewSet)

urlpatterns = [
    path('', views.home, name='home'),  # Homepage
    path('api/', include(router.urls)),
    path('api/dashboard/', views.dashboard_stats, name='dashboard_stats'),

    # Authentication URLs
    path('api/auth/register/', auth_views.register, name='register'),
    path('api/auth/login/', auth_views.login, name='login'),
    path('api/auth/logout/', auth_views.logout, name='logout'),
    path('api/auth/profile/', auth_views.user_profile, name='user_profile'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
