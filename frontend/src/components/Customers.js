import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import CustomerForm from './CustomerForm';
import CustomerDetails from './CustomerDetails';
import './Customers.css';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const { api } = useAuth();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/customers/');
      setCustomers(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch customers');
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = async (customerData) => {
    try {
      const response = await api.post('/api/customers/', customerData);
      setCustomers([response.data, ...customers]);
      setShowForm(false);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to add customer';
      return { success: false, error: errorMessage };
    }
  };

  const handleUpdateCustomer = async (customerId, customerData) => {
    try {
      const response = await api.put(`/api/customers/${customerId}/`, customerData);
      setCustomers(customers.map(c => c.id === customerId ? response.data : c));
      setEditingCustomer(null);
      if (selectedCustomer && selectedCustomer.id === customerId) {
        setSelectedCustomer(response.data);
      }
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to update customer';
      return { success: false, error: errorMessage };
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) {
      return;
    }

    try {
      await api.delete(`/api/customers/${customerId}/`);
      setCustomers(customers.filter(c => c.id !== customerId));
      if (selectedCustomer && selectedCustomer.id === customerId) {
        setSelectedCustomer(null);
      }
    } catch (err) {
      setError('Failed to delete customer');
      console.error('Error deleting customer:', err);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.phone && customer.phone.includes(searchTerm))
  );

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    setEditingCustomer(null);
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setSelectedCustomer(null);
  };

  if (loading) {
    return (
      <div className="customers-loading">
        <div className="loading-spinner"></div>
        <p>Loading customers...</p>
      </div>
    );
  }

  return (
    <div className="customers-container">
      <div className="customers-header">
        <div className="header-left">
          <h2>Customer Management</h2>
          <p>Manage your customer database and track their purchase history</p>
        </div>
        <button 
          className="add-customer-btn"
          onClick={() => setShowForm(true)}
        >
          <span className="btn-icon">+</span>
          Add New Customer
        </button>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠</span>
          {error}
          <button onClick={fetchCustomers} className="retry-btn">Retry</button>
        </div>
      )}

      <div className="customers-content">
        <div className="customers-sidebar">
          <div className="search-section">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="customers-list">
            <div className="list-header">
              <h3>Customers ({filteredCustomers.length})</h3>
            </div>
            
            {filteredCustomers.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">👥</div>
                <h4>No customers found</h4>
                <p>
                  {searchTerm 
                    ? 'Try adjusting your search terms' 
                    : 'Add your first customer to get started'
                  }
                </p>
              </div>
            ) : (
              <div className="customer-items">
                {filteredCustomers.map(customer => (
                  <div 
                    key={customer.id}
                    className={`customer-item ${selectedCustomer?.id === customer.id ? 'active' : ''}`}
                    onClick={() => handleCustomerSelect(customer)}
                  >
                    <div className="customer-avatar">
                      {customer.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="customer-info">
                      <h4>{customer.name}</h4>
                      <p>{customer.email}</p>
                      {customer.phone && <span className="phone">{customer.phone}</span>}
                    </div>
                    <div className="customer-actions">
                      <button 
                        className="edit-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditCustomer(customer);
                        }}
                      >
                        ✏️
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCustomer(customer.id);
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="customers-main">
          {showForm && (
            <CustomerForm
              onSubmit={handleAddCustomer}
              onCancel={() => setShowForm(false)}
              title="Add New Customer"
            />
          )}

          {editingCustomer && (
            <CustomerForm
              customer={editingCustomer}
              onSubmit={(data) => handleUpdateCustomer(editingCustomer.id, data)}
              onCancel={() => setEditingCustomer(null)}
              title="Edit Customer"
            />
          )}

          {selectedCustomer && !editingCustomer && (
            <CustomerDetails 
              customer={selectedCustomer}
              onEdit={() => handleEditCustomer(selectedCustomer)}
            />
          )}

          {!showForm && !editingCustomer && !selectedCustomer && (
            <div className="welcome-state">
              <div className="welcome-icon">👥</div>
              <h3>Welcome to Customer Management</h3>
              <p>Select a customer from the list to view their details and sales history, or add a new customer to get started.</p>
              <button 
                className="welcome-btn"
                onClick={() => setShowForm(true)}
              >
                Add Your First Customer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Customers;
