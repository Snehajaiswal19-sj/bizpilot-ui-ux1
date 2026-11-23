
import { useMemo, useState } from "react";
import {
  Search, Plus, Download, Package, Boxes, AlertTriangle,
  X, Pencil, Trash2, SlidersHorizontal, ArrowUpRight
} from "lucide-react";
import "./Inventory.css";

const startingProducts = [
  { id: 1, name: "Premium Basmati Rice", sku: "GR-001", category: "Groceries", price: 1250, quantity: 8, unit: "bags" },
  { id: 2, name: "Sunflower Oil 1L", sku: "ES-002", category: "Essentials", price: 145, quantity: 42, unit: "bottles" },
  { id: 3, name: "Sugar 1kg Pack", sku: "GR-003", category: "Groceries", price: 48, quantity: 12, unit: "packs" },
  { id: 4, name: "Wheat Flour 5kg", sku: "GR-004", category: "Groceries", price: 260, quantity: 0, unit: "bags" },
  { id: 5, name: "Bathing Soap", sku: "PC-005", category: "Personal Care", price: 35, quantity: 65, unit: "pieces" },
  { id: 6, name: "Tea Powder 500g", sku: "BV-006", category: "Beverages", price: 220, quantity: 18, unit: "packs" },
  { id: 7, name: "Dishwash Liquid", sku: "ES-007", category: "Essentials", price: 95, quantity: 6, unit: "bottles" },
  { id: 8, name: "Instant Coffee", sku: "BV-008", category: "Beverages", price: 180, quantity: 27, unit: "jars" }
];

const formatMoney = value =>
  `₹${Number(value).toLocaleString("en-IN")}`;

function stockStatus(quantity) {
  if (quantity === 0) return "Out of stock";
  if (quantity <= 10) return "Low stock";
  return "In stock";
}

function Inventory() {
  const [products, setProducts] = useState(startingProducts);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "", sku: "", category: "Groceries",
    price: "", quantity: "", unit: "pieces"
  });

  const stats = useMemo(() => ({
    count: products.length,
    value: products.reduce((sum, p) => sum + p.price * p.quantity, 0),
    low: products.filter(p => p.quantity > 0 && p.quantity <= 10).length,
    out: products.filter(p => p.quantity === 0).length
  }), [products]);

  const categories = ["All", ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.sku.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || product.category === category;

    const productStatus = stockStatus(product.quantity);
    const matchesStatus =
      status === "All" || productStatus === status;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  function openAddForm() {
    setEditingId(null);
    setForm({
      name: "", sku: "", category: "Groceries",
      price: "", quantity: "", unit: "pieces"
    });
    setError("");
    setShowForm(true);
  }

  function openEditForm(product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: String(product.price),
      quantity: String(product.quantity),
      unit: product.unit
    });
    setError("");
    setShowForm(true);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.name.trim() || !form.sku.trim()) {
      setError("Please enter the product name and SKU.");
      return;
    }

    if (products.some(p =>
      p.sku.toLowerCase() === form.sku.trim().toLowerCase() &&
      p.id !== editingId
    )) {
      setError("This SKU already exists. Please use a different SKU.");
      return;
    }

    const price = Number(form.price);
    const quantity = Number(form.quantity);

    if (!Number.isFinite(price) || price <= 0) {
      setError("Enter a valid product price.");
      return;
    }

    if (!Number.isInteger(quantity) || quantity < 0) {
      setError("Enter a valid whole-number stock quantity.");
      return;
    }

    const productData = {
      name: form.name.trim(),
      sku: form.sku.trim().toUpperCase(),
      category: form.category,
      price,
      quantity,
      unit: form.unit
    };

    if (editingId !== null) {
      setProducts(previous =>
        previous.map(p => p.id === editingId ? { ...p, ...productData } : p)
      );
    } else {
      setProducts(previous => [
        { id: Math.max(0, ...previous.map(p => p.id)) + 1, ...productData },
        ...previous
      ]);
    }

    setShowForm(false);
    setEditingId(null);
    setError("");
  }

  function deleteProduct() {
    setProducts(previous => previous.filter(p => p.id !== deleteId));
    setDeleteId(null);
  }

  function exportProducts() {
    const headings = ["Product", "SKU", "Category", "Price", "Quantity", "Unit", "Status"];
    const rows = filteredProducts.map(p => [
      p.name, p.sku, p.category, p.price, p.quantity, p.unit, stockStatus(p.quantity)
    ]);

    const csv = [headings, ...rows]
      .map(row => row.map(value =>
        `"${String(value).replaceAll('"', '""')}"`
      ).join(","))
      .join("\n");

    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "bizpilot-inventory.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="inventory-page">
      <div className="inventory-heading">
        <div>
          <span className="dashboard-eyebrow">BUSINESS MANAGEMENT / INVENTORY</span>
          <h1>Inventory</h1>
          <p>Manage your products, stock levels and product information.</p>
        </div>
        <div className="inventory-heading-actions">
          <button className="inventory-secondary" onClick={exportProducts}>
            <Download size={15} /> Export
          </button>
          <button className="inventory-primary" onClick={openAddForm}>
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      <section className="inventory-stats">
        <article className="inventory-stat">
          <div><span>Total Products</span><Package /></div>
          <strong>{stats.count}</strong>
          <small>Products in your catalogue</small>
        </article>
        <article className="inventory-stat">
          <div><span>Stock Value</span><Boxes /></div>
          <strong>{formatMoney(stats.value)}</strong>
          <small>Based on current quantity × price</small>
        </article>
        <article className="inventory-stat">
          <div><span>Low Stock</span><AlertTriangle /></div>
          <strong>{stats.low}</strong>
          <small>Products with 1–10 units</small>
        </article>
        <article className="inventory-stat">
          <div><span>Out of Stock</span><Package /></div>
          <strong>{stats.out}</strong>
          <small>Products needing replenishment</small>
        </article>
      </section>

      <section className="inventory-table-panel">
        <div className="inventory-table-heading">
          <div>
            <h2>Product catalogue</h2>
            <p>View and manage all your business products.</p>
          </div>
          <span className="inventory-count">{filteredProducts.length} products</span>
        </div>

        <div className="inventory-toolbar">
          <label className="inventory-search">
            <Search size={16} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search product or SKU..."
            />
          </label>

          <label className="inventory-select">
            <SlidersHorizontal size={14} />
            <select value={category} onChange={e => setCategory(e.target.value)}>
              {categories.map(item => <option key={item}>{item}</option>)}
            </select>
          </label>

          <label className="inventory-select">
            <select value={status} onChange={e => setStatus(e.target.value)}>
              <option value="All">All stock status</option>
              <option value="In stock">In stock</option>
              <option value="Low stock">Low stock</option>
              <option value="Out of stock">Out of stock</option>
            </select>
          </label>
        </div>

        <div className="inventory-table-scroll">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>PRODUCT</th>
                <th>SKU</th>
                <th>CATEGORY</th>
                <th>PRICE</th>
                <th>QUANTITY</th>
                <th>STOCK STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => {
                const currentStatus = stockStatus(product.quantity);
                return (
                  <tr key={product.id}>
                    <td className="inventory-product-cell">
                      <span className="inventory-product-icon"><Package size={16} /></span>
                      <strong>{product.name}</strong>
                    </td>
                    <td className="inventory-sku">{product.sku}</td>
                    <td>{product.category}</td>
                    <td>{formatMoney(product.price)}</td>
                    <td>{product.quantity} <span className="inventory-unit">{product.unit}</span></td>
                    <td>
                      <span className={`inventory-status ${
                        currentStatus === "In stock" ? "in-stock" :
                        currentStatus === "Low stock" ? "low-stock" : "out-stock"
                      }`}>{currentStatus}</span>
                    </td>
                    <td>
                      <div className="inventory-row-actions">
                        <button title="Edit product" onClick={() => openEditForm(product)}><Pencil size={14} /></button>
                        <button title="Delete product" onClick={() => setDeleteId(product.id)}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredProducts.length === 0 && (
                <tr><td colSpan="7" className="inventory-empty">No products found. Try changing your search or filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="inventory-table-foot">
          <span>Showing {filteredProducts.length} of {products.length} products</span>
          <span>Illustrative prototype data · Not live inventory</span>
        </div>
      </section>

      {showForm && (
        <div className="inventory-modal-backdrop" onMouseDown={e => {
          if (e.target === e.currentTarget) setShowForm(false);
        }}>
          <section className="inventory-modal">
            <div className="inventory-modal-heading">
              <div>
                <span className="dashboard-eyebrow">{editingId ? "UPDATE PRODUCT" : "NEW PRODUCT"}</span>
                <h2>{editingId ? "Edit product" : "Add a product"}</h2>
                <p>Enter the product details and current stock quantity.</p>
              </div>
              <button onClick={() => setShowForm(false)} aria-label="Close form"><X size={19} /></button>
            </div>

            <form onSubmit={handleSubmit}>
              <label className="inventory-field">
                Product name
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Basmati Rice 5kg" />
              </label>

              <div className="inventory-form-row">
                <label className="inventory-field">
                  SKU / Product code
                  <input value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} placeholder="e.g. GR-009" />
                </label>
                <label className="inventory-field">
                  Category
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    <option>Groceries</option>
                    <option>Essentials</option>
                    <option>Personal Care</option>
                    <option>Beverages</option>
                    <option>Electronics</option>
                    <option>Other</option>
                  </select>
                </label>
              </div>

              <div className="inventory-form-row">
                <label className="inventory-field">
                  Selling price (₹)
                  <input type="number" min="0.01" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="e.g. 250" />
                </label>
                <label className="inventory-field">
                  Current quantity
                  <input type="number" min="0" step="1" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} placeholder="e.g. 30" />
                </label>
              </div>

              <label className="inventory-field">
                Unit
                <select value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })}>
                  <option>pieces</option>
                  <option>bags</option>
                  <option>boxes</option>
                  <option>bottles</option>
                  <option>packs</option>
                  <option>kg</option>
                  <option>litres</option>
                  <option>jars</option>
                </select>
              </label>

              {error && <p className="inventory-error">{error}</p>}

              <div className="inventory-modal-actions">
                <button type="button" className="inventory-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="inventory-primary">{editingId ? "Save Changes" : "Add Product"} <ArrowUpRight size={14} /></button>
              </div>
            </form>
          </section>
        </div>
      )}

      {deleteId !== null && (
        <div className="inventory-modal-backdrop" onMouseDown={e => {
          if (e.target === e.currentTarget) setDeleteId(null);
        }}>
          <section className="inventory-delete-modal">
            <span className="inventory-delete-icon"><Trash2 size={21} /></span>
            <h2>Delete this product?</h2>
            <p>This will remove the product from this prototype's inventory list.</p>
            <div className="inventory-modal-actions">
              <button className="inventory-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="inventory-delete-button" onClick={deleteProduct}>Delete Product</button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default Inventory;
