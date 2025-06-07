import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './ProductDetails.css';

const ProductDetails = ({ product, onEdit }) => {
  const [sales, setSales] = useState([]);
  const [forecasts, setForecasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalSold: 0,
    totalRevenue: 0,
    averageOrderSize: 0,
    lastSaleDate: null,
  });
  const { api } = useAuth();

  useEffect(() => {
    if (product) {
      fetchProductData();
    }
  }, [product]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const [salesResponse, forecastsResponse] = await Promise.all([
        api.get(`/api/sale-items/?product=${product.id}`),
        api.get(`/api/forecasts/?product=${product.id}`)
      ]);
      
      setSales(salesResponse.data);
      setForecasts(forecastsResponse.data);
      calculateStats(salesResponse.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch product data');
      console.error('Error fetching product data:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (salesData) => {
    const totalSold = salesData.reduce((sum, sale) => sum + sale.quantity, 0);
    const totalRevenue = salesData.reduce((sum, sale) => sum + (sale.quantity * parseFloat(sale.price)), 0);
    const averageOrderSize = salesData.length > 0 ? totalSold / salesData.length : 0;
    const lastSaleDate = salesData.length > 0 
      ? new Date(Math.max(...salesData.map(sale => new Date(sale.sale_date))))
      : null;

    setStats({
      totalSold,
      totalRevenue,
      averageOrderSize,
      lastSaleDate,
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStockStatus = () => {
    const stock = product.inventory_stock || 0;
    if (stock === 0) return { status: 'out-of-stock', label: 'Out of Stock', color: '#f44336' };
    if (stock <= (product.inventory_reorder_level || 10)) return { status: 'low-stock', label: 'Low Stock', color: '#ff9800' };
    return { status: 'in-stock', label: 'In Stock', color: '#4caf50' };
  };

  const calculateMargin = () => {
    const price = parseFloat(product.price) || 0;
    const cost = parseFloat(product.cost) || 0;
    if (price > 0 && cost > 0) {
      return ((price - cost) / price * 100).toFixed(1);
    }
    return '0';
  };

  const stockInfo = getStockStatus();

  return (
    <div className="product-details">
      <div className="product-details-header">
        <div className="product-info-header">
          <div className="product-title-section">
            <h2>{product.name}</h2>
            <span className="category-badge">{product.category}</span>
          </div>
          <p className="product-description">{product.description || 'No description available'}</p>
        </div>
        <button className="edit-product-btn" onClick={onEdit}>
          <span className="btn-icon">✏️</span>
          Edit Product
        </button>
      </div>

      <div className="product-overview">
        <div className="overview-card pricing-card">
          <h4>Pricing Information</h4>
          <div className="pricing-details">
            <div className="price-item">
              <span className="price-label">Selling Price:</span>
              <span className="price-value selling">{formatCurrency(product.price)}</span>
            </div>
            <div className="price-item">
              <span className="price-label">Cost Price:</span>
              <span className="price-value cost">{formatCurrency(product.cost)}</span>
            </div>
            <div className="price-item">
              <span className="price-label">Profit Margin:</span>
              <span className="price-value margin">{calculateMargin()}%</span>
            </div>
            <div className="price-item">
              <span className="price-label">Unit:</span>
              <span className="price-value unit">{product.unit}</span>
            </div>
          </div>
        </div>

        <div className="overview-card inventory-card">
          <h4>Inventory Status</h4>
          <div className="inventory-details">
            <div className="stock-info">
              <div className="stock-amount">
                <span className="stock-number">{product.inventory_stock || 0}</span>
                <span className="stock-unit">{product.unit}</span>
              </div>
              <div className="stock-status" style={{ color: stockInfo.color }}>
                <span className="status-indicator" style={{ backgroundColor: stockInfo.color }}></span>
                {stockInfo.label}
              </div>
            </div>
            <div className="reorder-info">
              <span className="reorder-label">Reorder Level:</span>
              <span className="reorder-value">{product.inventory_reorder_level || 10} {product.unit}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="product-stats">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h4>Total Sold</h4>
            <p className="stat-value">{stats.totalSold} {product.unit}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h4>Total Revenue</h4>
            <p className="stat-value">{formatCurrency(stats.totalRevenue)}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h4>Avg. Order Size</h4>
            <p className="stat-value">{stats.averageOrderSize.toFixed(1)} {product.unit}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h4>Last Sale</h4>
            <p className="stat-value">
              {stats.lastSaleDate ? formatDate(stats.lastSaleDate) : 'No sales yet'}
            </p>
          </div>
        </div>
      </div>

      <div className="product-tabs">
        <div className="tab-header">
          <h3>Sales History & Forecasts</h3>
        </div>

        {loading ? (
          <div className="tab-loading">
            <div className="loading-spinner"></div>
            <p>Loading product data...</p>
          </div>
        ) : error ? (
          <div className="tab-error">
            <span className="error-icon">⚠</span>
            {error}
            <button onClick={fetchProductData} className="retry-btn">Retry</button>
          </div>
        ) : (
          <div className="tab-content">
            <div className="sales-section">
              <h4>Recent Sales ({sales.length})</h4>
              {sales.length === 0 ? (
                <div className="no-data">
                  <div className="no-data-icon">📦</div>
                  <p>No sales recorded for this product yet.</p>
                </div>
              ) : (
                <div className="sales-list">
                  {sales.slice(0, 5).map((sale, index) => (
                    <div key={index} className="sale-item">
                      <div className="sale-info">
                        <span className="sale-quantity">{sale.quantity} {product.unit}</span>
                        <span className="sale-price">{formatCurrency(sale.price)} each</span>
                      </div>
                      <div className="sale-total">
                        {formatCurrency(sale.quantity * parseFloat(sale.price))}
                      </div>
                    </div>
                  ))}
                  {sales.length > 5 && (
                    <div className="more-sales">
                      +{sales.length - 5} more sales
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="forecasts-section">
              <h4>Demand Forecasts ({forecasts.length})</h4>
              {forecasts.length === 0 ? (
                <div className="no-data">
                  <div className="no-data-icon">📈</div>
                  <p>No forecasts available for this product.</p>
                </div>
              ) : (
                <div className="forecasts-list">
                  {forecasts.map((forecast, index) => (
                    <div key={index} className="forecast-item">
                      <div className="forecast-period">
                        {formatDate(forecast.start_date)} - {formatDate(forecast.end_date)}
                      </div>
                      <div className="forecast-demand">
                        {forecast.predicted_demand} {product.unit}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
