
import { useMemo, useState } from "react";
import {
  Search, Plus, Download, CalendarDays, ChevronDown,
  ArrowUpRight, Wallet, ShoppingCart, Clock3, X,
  FileText, SlidersHorizontal
} from "lucide-react";
import "./Sales.css";

const initialSales = [
  { id: "SL-1024", customer: "Aarav Traders", date: "22 Nov 2026", total: 12500, paid: 12500 },
  { id: "SL-1023", customer: "Shree Enterprises", date: "22 Nov 2026", total: 8400, paid: 0 },
  { id: "SL-1022", customer: "Metro Stores", date: "21 Nov 2026", total: 6200, paid: 6200 },
  { id: "SL-1021", customer: "Kumar Wholesale", date: "21 Nov 2026", total: 4800, paid: 2400 },
  { id: "SL-1020", customer: "Patel General Store", date: "20 Nov 2026", total: 15800, paid: 15800 },
  { id: "SL-1019", customer: "City Mart", date: "20 Nov 2026", total: 9200, paid: 5000 },
  { id: "SL-1018", customer: "Om Distributors", date: "19 Nov 2026", total: 11300, paid: 11300 }
];

const money = value => `₹${Number(value).toLocaleString("en-IN")}`;

function getStatus(sale) {
  if (sale.paid <= 0) return "Unpaid";
  if (sale.paid < sale.total) return "Partial";
  return "Paid";
}

function Sales() {
  const [sales, setSales] = useState(initialSales);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [customer, setCustomer] = useState("");
  const [total, setTotal] = useState("");
  const [paid, setPaid] = useState("");
  const [saleDate, setSaleDate] = useState("2026-11-22");
  const [formError, setFormError] = useState("");

  const totals = useMemo(() => ({
    sales: sales.reduce((sum, item) => sum + item.total, 0),
    received: sales.reduce((sum, item) => sum + item.paid, 0),
    due: sales.reduce((sum, item) => sum + item.total - item.paid, 0)
  }), [sales]);

  const filteredSales = sales.filter(sale => {
    const matchesSearch =
      sale.id.toLowerCase().includes(search.toLowerCase()) ||
      sale.customer.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || getStatus(sale) === statusFilter;

    return matchesSearch && matchesStatus;
  });

  function addSale(event) {
    event.preventDefault();
    const amount = Number(total);
    const received = Number(paid || 0);

    if (!customer.trim()) {
      setFormError("Please enter the customer name.");
      return;
    }
    if (!amount || amount <= 0) {
      setFormError("Enter a valid sale amount.");
      return;
    }
    if (received < 0 || received > amount) {
      setFormError("Amount received cannot exceed the total amount.");
      return;
    }

    const formattedDate = new Date(`${saleDate}T12:00:00`)
      .toLocaleDateString("en-GB", {
        day: "2-digit", month: "short", year: "numeric"
      });

    const newSale = {
      id: `SL-${1025 + sales.length - initialSales.length}`,
      customer: customer.trim(),
      date: formattedDate,
      total: amount,
      paid: received
    };

    setSales(previous => [newSale, ...previous]);
    setCustomer("");
    setTotal("");
    setPaid("");
    setFormError("");
    setShowForm(false);
  }

  function exportSales() {
    const headings = ["Invoice", "Customer", "Date", "Total", "Paid", "Due", "Status"];
    const rows = filteredSales.map(sale => [
      sale.id, sale.customer, sale.date, sale.total, sale.paid,
      sale.total - sale.paid, getStatus(sale)
    ]);

    const csv = [headings, ...rows]
      .map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(","))
      .join("\n");

    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "bizpilot-sales.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="sales-page">
      <div className="sales-page-heading">
        <div>
          <span className="dashboard-eyebrow">BUSINESS MANAGEMENT / SALES</span>
          <h1>Sales</h1>
          <p>Track transactions, manage invoices and monitor payments.</p>
        </div>
        <div className="sales-heading-actions">
          <button className="sales-secondary-button" onClick={exportSales}>
            <Download size={15} /> Export
          </button>
          <button className="sales-primary-button" onClick={() => setShowForm(true)}>
            <Plus size={16} /> New Sale
          </button>
        </div>
      </div>

      <section className="sales-summary-grid">
        <article className="sales-summary-card">
          <div className="sales-summary-top">
            <span>Total Sales</span><ShoppingCart />
          </div>
          <strong>{money(totals.sales)}</strong>
          <small>Across {sales.length} recorded transactions</small>
        </article>
        <article className="sales-summary-card">
          <div className="sales-summary-top">
            <span>Amount Received</span><Wallet />
          </div>
          <strong>{money(totals.received)}</strong>
          <small>Payments recorded against sales</small>
        </article>
        <article className="sales-summary-card">
          <div className="sales-summary-top">
            <span>Pending Dues</span><Clock3 />
          </div>
          <strong>{money(totals.due)}</strong>
          <small>Remaining customer balances</small>
        </article>
      </section>

      <section className="sales-table-panel">
        <div className="sales-table-heading">
          <div>
            <h2>All transactions</h2>
            <p>Review and manage your sales records.</p>
          </div>
          <span className="sales-record-count">{filteredSales.length} records</span>
        </div>

        <div className="sales-toolbar">
          <label className="sales-search">
            <Search size={16} />
            <input
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Search invoice or customer..."
            />
          </label>

          <label className="sales-filter">
            <SlidersHorizontal size={15} />
            <select value={statusFilter} onChange={event => setStatusFilter(event.target.value)}>
              <option value="All">All statuses</option>
              <option value="Paid">Paid</option>
              <option value="Partial">Partial</option>
              <option value="Unpaid">Unpaid</option>
            </select>
            <ChevronDown size={13} />
          </label>
        </div>

        <div className="sales-table-scroll">
          <table className="sales-data-table">
            <thead>
              <tr>
                <th>INVOICE</th>
                <th>CUSTOMER</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DUE</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map(sale => {
                const status = getStatus(sale);
                return (
                  <tr key={sale.id}>
                    <td className="invoice-number"><FileText size={14} /> {sale.id}</td>
                    <td className="customer-name">{sale.customer}</td>
                    <td>{sale.date}</td>
                    <td>{money(sale.total)}</td>
                    <td>{money(sale.paid)}</td>
                    <td className={sale.total - sale.paid > 0 ? "due-amount" : ""}>
                      {money(sale.total - sale.paid)}
                    </td>
                    <td><span className={`sales-status ${status.toLowerCase()}`}>{status}</span></td>
                  </tr>
                );
              })}
              {filteredSales.length === 0 && (
                <tr>
                  <td colSpan="7" className="sales-empty">
                    No sales found. Try another search or status filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="sales-table-footnote">
          <span>Showing {filteredSales.length} of {sales.length} transactions</span>
          <span>Illustrative prototype data · Not connected to a live database</span>
        </div>
      </section>

      {showForm && (
        <div className="sale-modal-backdrop" onMouseDown={event => {
          if (event.target === event.currentTarget) setShowForm(false);
        }}>
          <section className="sale-modal">
            <div className="sale-modal-heading">
              <div>
                <span className="dashboard-eyebrow">NEW TRANSACTION</span>
                <h2>Create a sale</h2>
                <p>Enter the customer and payment details below.</p>
              </div>
              <button className="sale-modal-close" onClick={() => setShowForm(false)} aria-label="Close form">
                <X size={19} />
              </button>
            </div>

            <form onSubmit={addSale}>
              <label className="sale-field">
                Customer name
                <input value={customer} onChange={event => setCustomer(event.target.value)} placeholder="Enter customer name" />
              </label>

              <label className="sale-field">
                Sale date
                <span className="sale-input-icon"><CalendarDays size={15} />
                  <input type="date" value={saleDate} onChange={event => setSaleDate(event.target.value)} />
                </span>
              </label>

              <div className="sale-form-row">
                <label className="sale-field">
                  Total amount (₹)
                  <input type="number" min="1" step="0.01" value={total} onChange={event => setTotal(event.target.value)} placeholder="e.g. 12000" />
                </label>
                <label className="sale-field">
                  Amount received (₹)
                  <input type="number" min="0" step="0.01" value={paid} onChange={event => setPaid(event.target.value)} placeholder="e.g. 5000" />
                </label>
              </div>

              {total && Number(total) > 0 && (
                <div className="sale-due-preview">
                  <span>Remaining due</span>
                  <strong>{money(Math.max(0, Number(total) - Number(paid || 0)))}</strong>
                </div>
              )}

              {formError && <p className="sale-form-error">{formError}</p>}

              <div className="sale-modal-actions">
                <button type="button" className="sales-secondary-button" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="sales-primary-button">Save Sale <ArrowUpRight size={14} /></button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default Sales;
