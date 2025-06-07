import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ProductForm from './ProductForm';
import ProductDetails from './ProductDetails';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const { api } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/products/');
      setProducts(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (productData) => {
    try {
      const response = await api.post('/api/products/', productData);
      setProducts([response.data, ...products]);
      setShowForm(false);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to add product';
      return { success: false, error: errorMessage };
    }
  };

  const handleUpdateProduct = async (productId, productData) => {
    try {
      const response = await api.put(`/api/products/${productId}/`, productData);
      setProducts(products.map(p => p.id === productId ? response.data : p));
      setEditingProduct(null);
      if (selectedProduct && selectedProduct.id === productId) {
        setSelectedProduct(response.data);
      }
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to update product';
      return { success: false, error: errorMessage };
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await api.delete(`/api/products/${productId}/`);
      setProducts(products.filter(p => p.id !== productId));
      if (selectedProduct && selectedProduct.id === productId) {
        setSelectedProduct(null);
      }
    } catch (err) {
      setError('Failed to delete product');
      console.error('Error deleting product:', err);
    }
  };

  // Get unique categories for filter
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setEditingProduct(null);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setSelectedProduct(null);
  };

  const getStockStatus = (product) => {
    const stock = product.inventory_stock || 0;
    if (stock === 0) return 'out-of-stock';
    if (stock <= 10) return 'low-stock';
    return 'in-stock';
  };

  if (loading) {
    return (
      <div className="products-loading">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="products-container">
      <div className="products-header">
        <div className="header-left">
          <h2>Product Management</h2>
          <p>Manage your product catalog, inventory, and pricing</p>
        </div>
        <button 
          className="add-product-btn"
          onClick={() => setShowForm(true)}
        >
          <span className="btn-icon">+</span>
          Add New Product
        </button>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠</span>
          {error}
          <button onClick={fetchProducts} className="retry-btn">Retry</button>
        </div>
      )}

      <div className="products-content">
        <div className="products-sidebar">
          <div className="filters-section">
            <h3>Filters & Search</h3>
            
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="view-controls">
              <label>View Mode</label>
              <div className="view-buttons">
                <button 
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  ▦
                </button>
                <button 
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  ▤
                </button>
              </div>
            </div>
          </div>

          <div className="products-summary">
            <h4>Summary</h4>
            <div className="summary-item">
              <span>Total Products:</span>
              <span>{filteredProducts.length}</span>
            </div>
            <div className="summary-item">
              <span>Categories:</span>
              <span>{categories.length}</span>
            </div>
            <div className="summary-item">
              <span>Low Stock:</span>
              <span className="low-stock-count">
                {filteredProducts.filter(p => getStockStatus(p) === 'low-stock').length}
              </span>
            </div>
            <div className="summary-item">
              <span>Out of Stock:</span>
              <span className="out-stock-count">
                {filteredProducts.filter(p => getStockStatus(p) === 'out-of-stock').length}
              </span>
            </div>
          </div>
        </div>

        <div className="products-main">
          {showForm && (
            <ProductForm
              onSubmit={handleAddProduct}
              onCancel={() => setShowForm(false)}
              title="Add New Product"
            />
          )}

          {editingProduct && (
            <ProductForm
              product={editingProduct}
              onSubmit={(data) => handleUpdateProduct(editingProduct.id, data)}
              onCancel={() => setEditingProduct(null)}
              title="Edit Product"
            />
          )}

          {selectedProduct && !editingProduct && (
            <ProductDetails 
              product={selectedProduct}
              onEdit={() => handleEditProduct(selectedProduct)}
            />
          )}

          {!showForm && !editingProduct && !selectedProduct && (
            <div className="products-list-container">
              <div className="list-header">
                <h3>Products ({filteredProducts.length})</h3>
                <div className="list-controls">
                  <span className="results-count">
                    Showing {filteredProducts.length} of {products.length} products
                  </span>
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📦</div>
                  <h4>No products found</h4>
                  <p>
                    {searchTerm || selectedCategory 
                      ? 'Try adjusting your search or filters' 
                      : 'Add your first product to get started'
                    }
                  </p>
                  {!searchTerm && !selectedCategory && (
                    <button 
                      className="empty-btn"
                      onClick={() => setShowForm(true)}
                    >
                      Add Your First Product
                    </button>
                  )}
                </div>
              ) : (
                <div className={`products-grid ${viewMode}`}>
                  {filteredProducts.map(product => (
                    <div 
                      key={product.id}
                      className={`product-card ${getStockStatus(product)}`}
                      onClick={() => handleProductSelect(product)}
                    >
                      <div className="product-header">
                        <h4>{product.name}</h4>
                        <span className={`stock-badge ${getStockStatus(product)}`}>
                          {product.inventory_stock || 0} {product.unit}
                        </span>
                      </div>
                      
                      <div className="product-category">
                        <span className="category-badge">{product.category}</span>
                      </div>
                      
                      <p className="product-description">
                        {product.description || 'No description available'}
                      </p>
                      
                      <div className="product-pricing">
                        <div className="price-info">
                          <span className="price-label">Price:</span>
                          <span className="price-value">${product.price}</span>
                        </div>
                        <div className="cost-info">
                          <span className="cost-label">Cost:</span>
                          <span className="cost-value">${product.cost}</span>
                        </div>
                      </div>
                      
                      <div className="product-actions">
                        <button 
                          className="edit-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditProduct(product);
                          }}
                        >
                          ✏️
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProduct(product.id);
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
