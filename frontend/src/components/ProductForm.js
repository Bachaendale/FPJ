import React, { useState, useEffect } from 'react';
import './ProductForm.css';

const ProductForm = ({ product, onSubmit, onCancel, title }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    cost: '',
    category: '',
    unit: '',
    inventory_stock: '',
    reorder_level: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Common categories and units
  const commonCategories = [
    'Electronics',
    'Clothing',
    'Food & Beverages',
    'Home & Garden',
    'Sports & Outdoors',
    'Books & Media',
    'Health & Beauty',
    'Automotive',
    'Office Supplies',
    'Toys & Games'
  ];

  const commonUnits = [
    'pcs', 'kg', 'g', 'L', 'mL', 'lb', 'oz', 'ft', 'm', 'cm', 'box', 'pack', 'bottle', 'bag'
  ];

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        cost: product.cost || '',
        category: product.category || '',
        unit: product.unit || '',
        inventory_stock: product.inventory_stock || '',
        reorder_level: product.inventory_reorder_level || '',
      });
    }
  }, [product]);

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

    // Validation
    if (!formData.name.trim()) {
      setError('Product name is required');
      setLoading(false);
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Valid price is required');
      setLoading(false);
      return;
    }

    if (!formData.cost || parseFloat(formData.cost) <= 0) {
      setError('Valid cost is required');
      setLoading(false);
      return;
    }

    if (parseFloat(formData.cost) >= parseFloat(formData.price)) {
      setError('Cost should be less than price');
      setLoading(false);
      return;
    }

    if (!formData.category.trim()) {
      setError('Category is required');
      setLoading(false);
      return;
    }

    if (!formData.unit.trim()) {
      setError('Unit is required');
      setLoading(false);
      return;
    }

    // Prepare data for submission
    const submitData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      cost: parseFloat(formData.cost),
      category: formData.category.trim(),
      unit: formData.unit.trim(),
    };

    // Add inventory data if provided
    if (formData.inventory_stock) {
      submitData.inventory_stock = parseInt(formData.inventory_stock);
    }
    if (formData.reorder_level) {
      submitData.reorder_level = parseInt(formData.reorder_level);
    }

    const result = await onSubmit(submitData);

    if (result.success) {
      // Form will be closed by parent component
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const calculateMargin = () => {
    const price = parseFloat(formData.price) || 0;
    const cost = parseFloat(formData.cost) || 0;
    if (price > 0 && cost > 0) {
      const margin = ((price - cost) / price * 100).toFixed(1);
      return `${margin}%`;
    }
    return '0%';
  };

  return (
    <div className="product-form-container">
      <div className="product-form-header">
        <h3>{title}</h3>
        <button className="close-btn" onClick={onCancel}>×</button>
      </div>

      <form onSubmit={handleSubmit} className="product-form">
        {error && (
          <div className="form-error">
            <span className="error-icon">⚠</span>
            {error}
          </div>
        )}

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">
              Product Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">
              Category <span className="required">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">Select category</option>
              {commonCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter product description"
            rows="3"
            disabled={loading}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">
              Selling Price <span className="required">*</span>
            </label>
            <div className="input-with-prefix">
              <span className="prefix">$</span>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="cost">
              Cost Price <span className="required">*</span>
            </label>
            <div className="input-with-prefix">
              <span className="prefix">$</span>
              <input
                type="number"
                id="cost"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Profit Margin</label>
            <div className="margin-display">
              {calculateMargin()}
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="unit">
              Unit <span className="required">*</span>
            </label>
            <select
              id="unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">Select unit</option>
              {commonUnits.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="inventory_stock">Initial Stock</label>
            <input
              type="number"
              id="inventory_stock"
              name="inventory_stock"
              value={formData.inventory_stock}
              onChange={handleChange}
              placeholder="0"
              min="0"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="reorder_level">Reorder Level</label>
            <input
              type="number"
              id="reorder_level"
              name="reorder_level"
              value={formData.reorder_level}
              onChange={handleChange}
              placeholder="10"
              min="0"
              disabled={loading}
            />
          </div>
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
                {product ? 'Updating...' : 'Adding...'}
              </>
            ) : (
              product ? 'Update Product' : 'Add Product'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
