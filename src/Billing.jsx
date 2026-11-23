
import { useMemo, useState } from "react";
import {
  ReceiptText, Plus, Search, Download, X, CalendarDays,
  IndianRupee, Clock3, CheckCircle2, AlertCircle
} from "lucide-react";
import "./Billing.css";

const initialInvoices = [
  {
    id: "INV-2026-104",
    customer: "Aarav Traders",
    date: "2026-11-22",
    dueDate: "2026-11-29",
    description: "Wholesale grocery order",
    amount: 12500,
    received: 12500
  },
  {
    id: "INV-2026-103",
    customer: "Shree Enterprises",
    date: "2026-11-21",
    dueDate: "2026-11-28",
    description: "Monthly supply order",
    amount: 8400,
    received: 4000
  },
  {
    id: "INV-2026-102",
    customer: "Metro Stores",
    date: "2026-11-20",
    dueDate: "2026-11-27",
    description: "Retail inventory order",
    amount: 6200,
    received: 6200
  },
  {
    id: "INV-2026-101",
    customer: "Kumar Wholesale",
    date: "2026-11-18",
    dueDate: "2026-11-22",
    description: "Bulk product order",
    amount: 9800,
    received: 3000
  },
  {
    id: "INV-2026-100",
    customer: "Fresh Foods Co.",
    date: "2026-11-15",
    dueDate: "2026-11-20",
    description: "Food supplies",
    amount: 5600,
    received: 0
  }
];

const currency = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN")}`;

const formatDate = (date) => {
  if (!date) return "—";
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
};

const getStatus = (invoice) => {
  if (invoice.received >= invoice.amount) return "Paid";
  if (invoice.received > 0) return "Partial";
  if (invoice.dueDate < new Date().toISOString().slice(0, 10)) {
    return "Overdue";
  }
  return "Unpaid";
};

function Billing() {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    customer: "",
    date: new Date().toISOString().slice(0, 10),
    dueDate: "",
    description: "",
    amount: "",
    received: "0"
  });

  const totalBilled = invoices.reduce((sum, item) => sum + item.amount, 0);
  const totalReceived = invoices.reduce((sum, item) => sum + item.received, 0);
  const totalDue = invoices.reduce(
    (sum, item) => sum + Math.max(item.amount - item.received, 0),
    0
  );

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const matchesSearch = [
        invoice.id,
        invoice.customer,
        invoice.description
      ].some((value) =>
        value.toLowerCase().includes(search.toLowerCase())
      );

      const status = getStatus(invoice);
      const matchesFilter = filter === "All" || status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [invoices, search, filter]);

  const updateForm = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleCreateInvoice = (event) => {
    event.preventDefault();

    const amount = Number(form.amount);
    const received = Number(form.received);

    if (!form.customer.trim() || !form.dueDate || !form.description.trim()) {
      alert("Please complete all required invoice details.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      alert("Please enter a valid invoice amount.");
      return;
    }

    if (!Number.isFinite(received) || received < 0 || received > amount) {
      alert("Received amount must be between zero and the invoice total.");
      return;
    }

    const newInvoice = {
      ...form,
      id: `INV-${Date.now().toString().slice(-6)}`,
      customer: form.customer.trim(),
      description: form.description.trim(),
      amount,
      received
    };

    setInvoices((previous) => [newInvoice, ...previous]);
    setShowModal(false);
    setForm({
      customer: "",
      date: new Date().toISOString().slice(0, 10),
      dueDate: "",
      description: "",
      amount: "",
      received: "0"
    });
  };

  const exportCSV = () => {
    const headers = [
      "Invoice ID",
      "Customer",
      "Description",
      "Invoice Date",
      "Due Date",
      "Amount",
      "Received",
      "Due",
      "Status"
    ];

    const rows = filteredInvoices.map((invoice) => [
      invoice.id,
      invoice.customer,
      invoice.description,
      invoice.date,
      invoice.dueDate,
      invoice.amount,
      invoice.received,
      invoice.amount - invoice.received,
      getStatus(invoice)
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "bizpilot-invoices.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="billing-page">
      <section className="billing-stats">
        <article className="billing-stat-card">
          <div className="billing-stat-top">
            <span>Total Billed</span>
            <div className="billing-stat-icon gold">
              <ReceiptText size={19} />
            </div>
          </div>
          <strong>{currency(totalBilled)}</strong>
          <small>{invoices.length} invoices created</small>
        </article>

        <article className="billing-stat-card">
          <div className="billing-stat-top">
            <span>Amount Received</span>
            <div className="billing-stat-icon sage">
              <CheckCircle2 size={19} />
            </div>
          </div>
          <strong>{currency(totalReceived)}</strong>
          <small>Payments recorded against invoices</small>
        </article>

        <article className="billing-stat-card">
          <div className="billing-stat-top">
            <span>Outstanding Due</span>
            <div className="billing-stat-icon warning">
              <Clock3 size={19} />
            </div>
          </div>
          <strong>{currency(totalDue)}</strong>
          <small>Amount not yet received</small>
        </article>
      </section>

      <section className="billing-list-panel">
        <div className="billing-toolbar">
          <div>
            <h2>Invoices</h2>
            <p>Create and manage customer billing records.</p>
          </div>

          <div className="billing-toolbar-actions">
            <button className="billing-export-btn" onClick={exportCSV}>
              <Download size={15} />
              Export
            </button>

            <button
              className="billing-create-btn"
              onClick={() => setShowModal(true)}
            >
              <Plus size={16} />
              Create Invoice
            </button>
          </div>
        </div>

        <div className="billing-filters">
          <label className="billing-search">
            <Search size={16} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search invoice or customer..."
            />
          </label>

          <select
            className="billing-status-filter"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option value="All">All statuses</option>
            <option value="Paid">Paid</option>
            <option value="Partial">Partial</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>

        <div className="billing-table-scroll">
          <table className="billing-table">
            <thead>
              <tr>
                <th>INVOICE</th>
                <th>CUSTOMER</th>
                <th>INVOICE DATE</th>
                <th>DUE DATE</th>
                <th>AMOUNT</th>
                <th>RECEIVED</th>
                <th>BALANCE</th>
                <th>STATUS</th>
              </tr>
            </thead>

            <tbody>
              {filteredInvoices.map((invoice) => {
                const status = getStatus(invoice);
                const balance = invoice.amount - invoice.received;

                return (
                  <tr key={invoice.id}>
                    <td className="billing-invoice-id">{invoice.id}</td>
                    <td>
                      <strong className="billing-customer">
                        {invoice.customer}
                      </strong>
                      <small className="billing-description">
                        {invoice.description}
                      </small>
                    </td>
                    <td>{formatDate(invoice.date)}</td>
                    <td>{formatDate(invoice.dueDate)}</td>
                    <td className="billing-amount">
                      {currency(invoice.amount)}
                    </td>
                    <td>{currency(invoice.received)}</td>
                    <td className="billing-balance">
                      {currency(balance)}
                    </td>
                    <td>
                      <span className={`billing-status ${status.toLowerCase()}`}>
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredInvoices.length === 0 && (
            <div className="billing-empty">
              <ReceiptText size={27} />
              <strong>No invoices found</strong>
              <p>Try changing your search or status filter.</p>
            </div>
          )}
        </div>

        <div className="billing-table-footer">
          Showing {filteredInvoices.length} of {invoices.length} invoices
          <span>Illustrative frontend demo data</span>
        </div>
      </section>

      {showModal && (
        <div
          className="billing-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowModal(false);
          }}
        >
          <div className="billing-modal">
            <div className="billing-modal-header">
              <div>
                <span>NEW BILLING RECORD</span>
                <h2>Create Invoice</h2>
                <p>Add customer and payment details.</p>
              </div>

              <button
                type="button"
                className="billing-modal-close"
                onClick={() => setShowModal(false)}
                aria-label="Close invoice form"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice}>
              <div className="billing-form-grid">
                <div className="billing-form-field billing-full">
                  <label>Customer Name *</label>
                  <input
                    name="customer"
                    value={form.customer}
                    onChange={updateForm}
                    placeholder="Enter customer name"
                    required
                  />
                </div>

                <div className="billing-form-field">
                  <label>Invoice Date *</label>
                  <div className="billing-date-input">
                    <CalendarDays size={15} />
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={updateForm}
                      required
                    />
                  </div>
                </div>

                <div className="billing-form-field">
                  <label>Due Date *</label>
                  <div className="billing-date-input">
                    <CalendarDays size={15} />
                    <input
                      type="date"
                      name="dueDate"
                      min={form.date}
                      value={form.dueDate}
                      onChange={updateForm}
                      required
                    />
                  </div>
                </div>

                <div className="billing-form-field billing-full">
                  <label>Item / Description *</label>
                  <input
                    name="description"
                    value={form.description}
                    onChange={updateForm}
                    placeholder="Enter product or service details"
                    required
                  />
                </div>

                <div className="billing-form-field">
                  <label>Invoice Amount (₹) *</label>
                  <div className="billing-date-input">
                    <IndianRupee size={15} />
                    <input
                      type="number"
                      name="amount"
                      min="1"
                      step="0.01"
                      value={form.amount}
                      onChange={updateForm}
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div className="billing-form-field">
                  <label>Amount Received (₹)</label>
                  <div className="billing-date-input">
                    <IndianRupee size={15} />
                    <input
                      type="number"
                      name="received"
                      min="0"
                      step="0.01"
                      value={form.received}
                      onChange={updateForm}
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              <div className="billing-modal-summary">
                <span>Remaining balance</span>
                <strong>
                  {currency(
                    Math.max(
                      Number(form.amount || 0) - Number(form.received || 0),
                      0
                    )
                  )}
                </strong>
              </div>

              <div className="billing-modal-actions">
                <button
                  type="button"
                  className="billing-cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="billing-submit-btn">
                  <Plus size={16} />
                  Create Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Billing;
