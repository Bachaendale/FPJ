import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './CustomerDetails.css';

const CustomerDetails = ({ customer, onEdit }) => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalSpent: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    lastOrderDate: null,
  });
  const { api } = useAuth();

  useEffect(() => {
    if (customer) {
      fetchCustomerSales();
    }
  }, [customer]);

  const fetchCustomerSales = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/sales/?customer=${customer.id}`);
      const customerSales = response.data.filter(sale => sale.customer === customer.id);
      setSales(customerSales);
      calculateStats(customerSales);
      setError(null);
    } catch (err) {
      setError('Failed to fetch sales history');
      console.error('Error fetching sales:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (salesData) => {
    const totalSpent = salesData.reduce((sum, sale) => sum + parseFloat(sale.total), 0);
    const totalOrders = salesData.length;
    const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;
    const lastOrderDate = salesData.length > 0 
      ? new Date(Math.max(...salesData.map(sale => new Date(sale.date))))
      : null;

    setStats({
      totalSpent,
      totalOrders,
      averageOrderValue,
      lastOrderDate,
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

  return (
    <div className="customer-details">
      <div className="customer-details-header">
        <div className="customer-avatar-large">
          {customer.name.charAt(0).toUpperCase()}
        </div>
        <div className="customer-info-header">
          <h2>{customer.name}</h2>
          <p className="customer-email">{customer.email}</p>
          <p className="customer-joined">
            Customer since {formatDate(customer.created_at)}
          </p>
        </div>
        <button className="edit-customer-btn" onClick={onEdit}>
          <span className="btn-icon">✏️</span>
          Edit Customer
        </button>
      </div>

      <div className="customer-contact-info">
        <div className="contact-item">
          <span className="contact-label">Email:</span>
          <span className="contact-value">{customer.email}</span>
        </div>
        {customer.phone && (
          <div className="contact-item">
            <span className="contact-label">Phone:</span>
            <span className="contact-value">{customer.phone}</span>
          </div>
        )}
        {customer.address && (
          <div className="contact-item">
            <span className="contact-label">Address:</span>
            <span className="contact-value">{customer.address}</span>
          </div>
        )}
      </div>

      <div className="customer-stats">
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h4>Total Spent</h4>
            <p className="stat-value">{formatCurrency(stats.totalSpent)}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h4>Total Orders</h4>
            <p className="stat-value">{stats.totalOrders}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h4>Average Order</h4>
            <p className="stat-value">{formatCurrency(stats.averageOrderValue)}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h4>Last Order</h4>
            <p className="stat-value">
              {stats.lastOrderDate ? formatDate(stats.lastOrderDate) : 'No orders yet'}
            </p>
          </div>
        </div>
      </div>

      <div className="sales-history">
        <div className="sales-history-header">
          <h3>Sales History</h3>
          <span className="sales-count">({sales.length} orders)</span>
        </div>

        {loading ? (
          <div className="sales-loading">
            <div className="loading-spinner"></div>
            <p>Loading sales history...</p>
          </div>
        ) : error ? (
          <div className="sales-error">
            <span className="error-icon">⚠</span>
            {error}
            <button onClick={fetchCustomerSales} className="retry-btn">Retry</button>
          </div>
        ) : sales.length === 0 ? (
          <div className="no-sales">
            <div className="no-sales-icon">📦</div>
            <h4>No sales history</h4>
            <p>This customer hasn't made any purchases yet.</p>
          </div>
        ) : (
          <div className="sales-list">
            {sales.map(sale => (
              <div key={sale.id} className="sale-item">
                <div className="sale-header">
                  <div className="sale-id">Order #{sale.id}</div>
                  <div className="sale-date">{formatDate(sale.date)}</div>
                </div>
                <div className="sale-details">
                  <div className="sale-amount">{formatCurrency(sale.total)}</div>
                  <div className="sale-status">
                    <span className={`status-badge ${sale.status.toLowerCase()}`}>
                      {sale.status}
                    </span>
                  </div>
                  <div className="sale-payment">{sale.payment_method}</div>
                </div>
                {sale.notes && (
                  <div className="sale-notes">
                    <strong>Notes:</strong> {sale.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDetails;
