
import { useMemo, useRef, useState } from "react";
import {
  Search, Plus, Download, X, ShoppingBag,
  Wallet, Clock3, Package, SlidersHorizontal
} from "lucide-react";
import "./Purchases.css";

const initialPurchases = [
  {
    id: "PUR-1024",
    supplier: "Sharma Wholesale",
    product: "Basmati Rice",
    date: "22 Nov 2026",
    quantity: 50,
    unitPrice: 120,
    total: 6000,
    paid: 6000
  },
  {
    id: "PUR-1023",
    supplier: "Metro Distributors",
    product: "Cooking Oil",
    date: "21 Nov 2026",
    quantity: 30,
    unitPrice: 145,
    total: 4350,
    paid: 2000
  },
  {
    id: "PUR-1022",
    supplier: "Patel Suppliers",
    product: "Sugar",
    date: "20 Nov 2026",
    quantity: 100,
    unitPrice: 42,
    total: 4200,
    paid: 0
  },
  {
    id: "PUR-1021",
    supplier: "Fresh Foods Co.",
    product: "Wheat Flour",
    date: "19 Nov 2026",
    quantity: 40,
    unitPrice: 55,
    total: 2200,
    paid: 2200
  },
  {
    id: "PUR-1020",
    supplier: "Sharma Wholesale",
    product: "Tea Packets",
    date: "18 Nov 2026",
    quantity: 25,
    unitPrice: 180,
    total: 4500,
    paid: 2500
  }
];

const money = value =>
  `₹${Number(value).toLocaleString("en-IN")}`;

function getStatus(purchase) {
  if (purchase.paid <= 0) return "Unpaid";
  if (purchase.paid < purchase.total) return "Partial";
  return "Paid";
}

function formatDate(date) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function Purchases() {
  const [purchases, setPurchases] = useState(initialPurchases);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);

  const [supplier, setSupplier] = useState("");
  const [product, setProduct] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("2026-11-22");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [paid, setPaid] = useState("");
  const [formError, setFormError] = useState("");

  const nextId = useRef(1025);

  const totals = useMemo(() => ({
    purchases: purchases.reduce((sum, item) => sum + item.total, 0),
    paid: purchases.reduce((sum, item) => sum + item.paid, 0),
    due: purchases.reduce(
      (sum, item) => sum + item.total - item.paid,
      0
    )
  }), [purchases]);

  const totalAmount = Number(quantity || 0) * Number(unitPrice || 0);
  const remainingDue = totalAmount - Number(paid || 0);

  const filteredPurchases = purchases.filter(item => {
    const term = search.toLowerCase();

    const matchesSearch =
      item.id.toLowerCase().includes(term) ||
      item.supplier.toLowerCase().includes(term) ||
      item.product.toLowerCase().includes(term);

    const matchesStatus =
      statusFilter === "All" || getStatus(item) === statusFilter;

    return matchesSearch && matchesStatus;
  });

  function resetForm() {
    setSupplier("");
    setProduct("");
    setPurchaseDate("2026-11-22");
    setQuantity("");
    setUnitPrice("");
    setPaid("");
    setFormError("");
  }

  function addPurchase(event) {
    event.preventDefault();

    const qty = Number(quantity);
    const price = Number(unitPrice);
    const amountPaid = Number(paid || 0);
    const total = qty * price;

    if (!supplier.trim()) {
      setFormError("Please enter the supplier name.");
      return;
    }

    if (!product.trim()) {
      setFormError("Please enter the product name.");
      return;
    }

    if (!qty || qty <= 0) {
      setFormError("Enter a valid quantity.");
      return;
    }

    if (!price || price <= 0) {
      setFormError("Enter a valid unit price.");
      return;
    }

    if (amountPaid < 0 || amountPaid > total) {
      setFormError("Amount paid cannot exceed the total amount.");
      return;
    }

    const newPurchase = {
      id: `PUR-${nextId.current++}`,
      supplier: supplier.trim(),
      product: product.trim(),
      date: formatDate(purchaseDate),
      quantity: qty,
      unitPrice: price,
      total,
      paid: amountPaid
    };

    setPurchases(previous => [newPurchase, ...previous]);
    resetForm();
    setShowForm(false);
  }

  function exportPurchases() {
    const headings = [
      "Invoice",
      "Supplier",
      "Product",
      "Date",
      "Quantity",
      "Unit Price",
      "Total",
      "Paid",
      "Due",
      "Status"
    ];

    const rows = filteredPurchases.map(item => [
      item.id,
      item.supplier,
      item.product,
      item.date,
      item.quantity,
      item.unitPrice,
      item.total,
      item.paid,
      item.total - item.paid,
      getStatus(item)
    ]);

    const csv = [headings, ...rows]
      .map(row =>
        row.map(value =>
          `"${String(value).replaceAll('"', '""')}"`
        ).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "bizpilot-purchases.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="purchase-page">

      <div className="purchase-heading">
        <div>
          <span className="purchase-eyebrow">PROCUREMENT</span>
          <h1>Purchases</h1>
          <p>Track supplier orders, purchase costs and pending payments.</p>
        </div>

        <button
          className="purchase-primary-btn"
          onClick={() => setShowForm(true)}
        >
          <Plus size={17} />
          New Purchase
        </button>
      </div>

      <div className="purchase-summary-grid">

        <div className="purchase-summary-card">
          <div className="purchase-card-top">
            <span>Total Purchases</span>
            <div className="purchase-icon sage">
              <ShoppingBag size={19} />
            </div>
          </div>
          <h2>{money(totals.purchases)}</h2>
          <span className="purchase-card-note">
            Across {purchases.length} purchase records
          </span>
        </div>

        <div className="purchase-summary-card">
          <div className="purchase-card-top">
            <span>Amount Paid</span>
            <div className="purchase-icon amber">
              <Wallet size={19} />
            </div>
          </div>
          <h2>{money(totals.paid)}</h2>
          <span className="purchase-card-note">
            Payments recorded in this demo
          </span>
        </div>

        <div className="purchase-summary-card">
          <div className="purchase-card-top">
            <span>Pending Payments</span>
            <div className="purchase-icon brown">
              <Clock3 size={19} />
            </div>
          </div>
          <h2>{money(totals.due)}</h2>
          <span className="purchase-card-note">
            Remaining supplier dues
          </span>
        </div>

      </div>

      <div className="purchase-table-panel">

        <div className="purchase-table-heading">
          <div>
            <h2>Purchase History</h2>
            <p>Review and manage your purchase records.</p>
          </div>

          <button
            className="purchase-export-btn"
            onClick={exportPurchases}
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>

        <div className="purchase-toolbar">

          <div className="purchase-search">
            <Search size={17} />
            <input
              type="text"
              placeholder="Search invoice, supplier or product..."
              value={search}
              onChange={event => setSearch(event.target.value)}
            />
          </div>

          <div className="purchase-filter">
            <SlidersHorizontal size={16} />
            <select
              value={statusFilter}
              onChange={event => setStatusFilter(event.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Partial">Partial</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>

        </div>

        <div className="purchase-table-wrap">
          <table className="purchase-table">
            <thead>
              <tr>
                <th>INVOICE</th>
                <th>SUPPLIER</th>
                <th>PRODUCT</th>
                <th>DATE</th>
                <th>QTY</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DUE</th>
                <th>STATUS</th>
              </tr>
            </thead>

            <tbody>
              {filteredPurchases.length > 0 ? (
                filteredPurchases.map(item => (
                  <tr key={item.id}>
                    <td className="purchase-invoice">{item.id}</td>
                    <td className="purchase-supplier">{item.supplier}</td>
                    <td>{item.product}</td>
                    <td>{item.date}</td>
                    <td>{item.quantity}</td>
                    <td>{money(item.total)}</td>
                    <td>{money(item.paid)}</td>
                    <td className="purchase-due">
                      {money(item.total - item.paid)}
                    </td>
                    <td>
                      <span className={`purchase-status ${getStatus(item).toLowerCase()}`}>
                        {getStatus(item)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="purchase-empty">
                    No purchase records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="purchase-table-footer">
          Showing {filteredPurchases.length} of {purchases.length} records
          <span>Demo data · Not connected to live records</span>
        </div>

      </div>

      {showForm && (
        <div
          className="purchase-modal-overlay"
          onMouseDown={event => {
            if (event.target === event.currentTarget) {
              setShowForm(false);
              setFormError("");
            }
          }}
        >
          <div className="purchase-modal">

            <div className="purchase-modal-heading">
              <div>
                <span className="purchase-eyebrow">NEW ENTRY</span>
                <h2>Add Purchase</h2>
                <p>Enter supplier and product purchase details.</p>
              </div>

              <button
                className="purchase-close-btn"
                onClick={() => {
                  setShowForm(false);
                  setFormError("");
                }}
                aria-label="Close form"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={addPurchase}>

              <div className="purchase-form-grid">

                <label className="purchase-field">
                  Supplier Name
                  <input
                    value={supplier}
                    onChange={event => setSupplier(event.target.value)}
                    placeholder="e.g. Sharma Wholesale"
                  />
                </label>

                <label className="purchase-field">
                  Product Name
                  <input
                    value={product}
                    onChange={event => setProduct(event.target.value)}
                    placeholder="e.g. Basmati Rice"
                  />
                </label>

                <label className="purchase-field">
                  Purchase Date
                  <input
                    type="date"
                    value={purchaseDate}
                    onChange={event => setPurchaseDate(event.target.value)}
                  />
                </label>

                <label className="purchase-field">
                  Quantity
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={quantity}
                    onChange={event => setQuantity(event.target.value)}
                    placeholder="Enter quantity"
                  />
                </label>

                <label className="purchase-field">
                  Unit Price (₹)
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={unitPrice}
                    onChange={event => setUnitPrice(event.target.value)}
                    placeholder="Enter price"
                  />
                </label>

                <label className="purchase-field">
                  Amount Paid (₹)
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={paid}
                    onChange={event => setPaid(event.target.value)}
                    placeholder="Enter amount paid"
                  />
                </label>

              </div>

              <div className="purchase-total-preview">
                <div>
                  <span>Purchase Total</span>
                  <strong>{money(totalAmount)}</strong>
                </div>
                <div>
                  <span>Remaining Due</span>
                  <strong>{money(remainingDue)}</strong>
                </div>
              </div>

              {formError && (
                <p className="purchase-form-error">{formError}</p>
              )}

              <div className="purchase-modal-actions">
                <button
                  type="button"
                  className="purchase-cancel-btn"
                  onClick={() => {
                    setShowForm(false);
                    setFormError("");
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="purchase-primary-btn"
                >
                  <Plus size={16} />
                  Save Purchase
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Purchases;
