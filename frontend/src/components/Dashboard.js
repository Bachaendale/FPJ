import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({
    total_customers: 0,
    total_products: 0,
    total_sales: 0,
    total_revenue: 0,
    total_inventory_value: 0,
    low_stock_count: 0,
    recent_sales_30_days: 0,
    recent_revenue_30_days: 0
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { api } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsResponse, productsResponse] = await Promise.all([
        api.get('/api/dashboard/'),
        api.get('/api/products/')
      ]);

      setDashboardStats(statsResponse.data);
      setProducts(productsResponse.data.slice(0, 6)); // Show only first 6 products
      setError(null);
    } catch (err) {
      setError('Failed to fetch data. Make sure Django backend is running on port 8000.');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Customers', value: dashboardStats.total_customers, icon: '👥', color: '#4CAF50' },
    { title: 'Total Products', value: dashboardStats.total_products, icon: '📦', color: '#2196F3' },
    { title: 'Total Sales', value: dashboardStats.total_sales, icon: '💰', color: '#FF9800' },
    { title: 'Total Revenue', value: `$${dashboardStats.total_revenue}`, icon: '💵', color: '#9C27B0' },
    { title: 'Inventory Value', value: `$${dashboardStats.total_inventory_value}`, icon: '📋', color: '#607D8B' },
    { title: 'Low Stock Items', value: dashboardStats.low_stock_count, icon: '⚠️', color: '#F44336' },
    { title: 'Recent Sales (30d)', value: dashboardStats.recent_sales_30_days, icon: '📈', color: '#00BCD4' },
    { title: 'Recent Revenue (30d)', value: `$${dashboardStats.recent_revenue_30_days}`, icon: '💹', color: '#8BC34A' },
  ];

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <p>Welcome back! Here's what's happening with your business today.</p>
      </div>

      {error && (
        <div className="error-card">
          <div className="error-icon">⚠️</div>
          <div className="error-content">
            <h3>Connection Error</h3>
            <p>{error}</p>
            <button onClick={fetchData} className="retry-button">Retry</button>
          </div>
        </div>
      )}

      {!error && (
        <>
          <div className="stats-grid">
            {statCards.map((stat, index) => (
              <div key={index} className="stat-card" style={{ '--accent-color': stat.color }}>
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-content">
                  <h3 className="stat-title">{stat.title}</h3>
                  <p className="stat-value">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="dashboard-sections">
            <div className="section">
              <div className="section-header">
                <h2>Recent Products</h2>
                <button className="view-all-btn">View All</button>
              </div>
              <div className="products-grid">
                {products.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📦</div>
                    <h3>No Products Found</h3>
                    <p>Add some products to get started!</p>
                  </div>
                ) : (
                  products.map(product => (
                    <div key={product.id} className="product-card">
                      <div className="product-header">
                        <h4>{product.name}</h4>
                        <span className="product-category">{product.category}</span>
                      </div>
                      <p className="product-description">{product.description}</p>
                      <div className="product-details">
                        <div className="product-price">
                          <span className="price-label">Price:</span>
                          <span className="price-value">${product.price}</span>
                        </div>
                        <div className="product-stock">
                          <span className="stock-label">Stock:</span>
                          <span className="stock-value">{product.inventory_stock || 0} {product.unit}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
