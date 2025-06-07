import React, { useState, useEffect } from 'react';
import './CustomerForm.css';

const CustomerForm = ({ customer, onSubmit, onCancel, title }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        address: customer.address || '',
      });
    }
  }, [customer]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (!formData.name.trim()) {
      setError('Customer name is required');
      setLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      setError('Email address is required');
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    const result = await onSubmit(formData);

    if (result.success) {
      // Form will be closed by parent component
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="customer-form-container">
      <div className="customer-form-header">
        <h3>{title}</h3>
        <button className="close-btn" onClick={onCancel}>×</button>
      </div>

      <form onSubmit={handleSubmit} className="customer-form">
        {error && (
          <div className="form-error">
            <span className="error-icon">⚠</span>
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="name">
            Customer Name <span className="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter customer's full name"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">
            Email Address <span className="required">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="customer@example.com"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (555) 123-4567"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter customer's address"
            rows="3"
            disabled={loading}
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                {customer ? 'Updating...' : 'Adding...'}
              </>
            ) : (
              customer ? 'Update Customer' : 'Add Customer'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;
