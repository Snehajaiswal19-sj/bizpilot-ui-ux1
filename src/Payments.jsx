
import { useMemo, useRef, useState } from "react";
import {
  Search, Plus, Download, Wallet, ArrowDownLeft,
  ArrowUpRight, X, SlidersHorizontal, CreditCard,
  Banknote, Receipt
} from "lucide-react";
import "./Payments.css";

const initialPayments = [
  {
    id: "PAY-1024",
    party: "Aarav Traders",
    type: "Received",
    date: "22 Nov 2026",
    method: "UPI",
    reference: "UPI882104",
    amount: 12500
  },
  {
    id: "PAY-1023",
    party: "Sharma Wholesale",
    type: "Made",
    date: "22 Nov 2026",
    method: "Bank Transfer",
    reference: "BNK761204",
    amount: 8000
  },
  {
    id: "PAY-1022",
    party: "Metro Stores",
    type: "Received",
    date: "21 Nov 2026",
    method: "Cash",
    reference: "CASH21021",
    amount: 6200
  },
  {
    id: "PAY-1021",
    party: "Fresh Foods Co.",
    type: "Made",
    date: "20 Nov 2026",
    method: "UPI",
    reference: "UPI620145",
    amount: 4500
  },
  {
    id: "PAY-1020",
    party: "Kumar Wholesale",
    type: "Received",
    date: "20 Nov 2026",
    method: "Bank Transfer",
    reference: "BNK550920",
    amount: 2400
  },
  {
    id: "PAY-1019",
    party: "Patel Suppliers",
    type: "Made",
    date: "19 Nov 2026",
    method: "Card",
    reference: "CARD19019",
    amount: 3200
  }
];

const money = value =>
  `₹${Number(value).toLocaleString("en-IN")}`;

function formatDate(date) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function Payments() {
  const [payments, setPayments] = useState(initialPayments);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);

  const [party, setParty] = useState("");
  const [type, setType] = useState("Received");
  const [date, setDate] = useState("2026-11-23");
  const [method, setMethod] = useState("UPI");
  const [reference, setReference] = useState("");
  const [amount, setAmount] = useState("");
  const [formError, setFormError] = useState("");

  const nextId = useRef(1025);

  const totals = useMemo(() => {
    const received = payments
      .filter(item => item.type === "Received")
      .reduce((sum, item) => sum + item.amount, 0);

    const made = payments
      .filter(item => item.type === "Made")
      .reduce((sum, item) => sum + item.amount, 0);

    return {
      received,
      made,
      net: received - made
    };
  }, [payments]);

  const filteredPayments = payments.filter(item => {
    const term = search.toLowerCase();

    const matchesSearch =
      item.id.toLowerCase().includes(term) ||
      item.party.toLowerCase().includes(term) ||
      item.reference.toLowerCase().includes(term);

    const matchesType =
      typeFilter === "All" || item.type === typeFilter;

    return matchesSearch && matchesType;
  });

  function resetForm() {
    setParty("");
    setType("Received");
    setDate("2026-11-23");
    setMethod("UPI");
    setReference("");
    setAmount("");
    setFormError("");
  }

  function addPayment(event) {
    event.preventDefault();

    const paymentAmount = Number(amount);

    if (!party.trim()) {
      setFormError("Please enter the customer or supplier name.");
      return;
    }

    if (!paymentAmount || paymentAmount <= 0) {
      setFormError("Enter a valid payment amount.");
      return;
    }

    if (!date) {
      setFormError("Please select a payment date.");
      return;
    }

    const newPayment = {
      id: `PAY-${nextId.current++}`,
      party: party.trim(),
      type,
      date: formatDate(date),
      method,
      reference: reference.trim() || "Not provided",
      amount: paymentAmount
    };

    setPayments(previous => [newPayment, ...previous]);
    resetForm();
    setShowForm(false);
  }

  function exportPayments() {
    const headings = [
      "Payment ID",
      "Party",
      "Type",
      "Date",
      "Method",
      "Reference",
      "Amount"
    ];

    const rows = filteredPayments.map(item => [
      item.id,
      item.party,
      item.type,
      item.date,
      item.method,
      item.reference,
      item.amount
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
    link.download = "bizpilot-payments.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="payments-page">

      <div className="payments-heading">
        <div>
          <span className="payments-eyebrow">CASH FLOW MANAGEMENT</span>
          <h1>Payments</h1>
          <p>Track money received from customers and payments made to suppliers.</p>
        </div>

        <button
          className="payments-primary-btn"
          onClick={() => setShowForm(true)}
        >
          <Plus size={17} />
          Record Payment
        </button>
      </div>

      <div className="payments-summary-grid">

        <div className="payments-summary-card">
          <div className="payments-card-top">
            <span>Payments Received</span>
            <div className="payments-icon sage">
              <ArrowDownLeft size={19} />
            </div>
          </div>
          <h2>{money(totals.received)}</h2>
          <span className="payments-card-note">
            Total incoming payments
          </span>
        </div>

        <div className="payments-summary-card">
          <div className="payments-card-top">
            <span>Payments Made</span>
            <div className="payments-icon amber">
              <ArrowUpRight size={19} />
            </div>
          </div>
          <h2>{money(totals.made)}</h2>
          <span className="payments-card-note">
            Total outgoing payments
          </span>
        </div>

        <div className="payments-summary-card">
          <div className="payments-card-top">
            <span>Net Cash Flow</span>
            <div className="payments-icon brown">
              <Wallet size={19} />
            </div>
          </div>
          <h2>{money(totals.net)}</h2>
          <span className="payments-card-note">
            Received minus payments made
          </span>
        </div>

      </div>

      <div className="payments-info">
        <Receipt size={18} />
        <div>
          <strong>Payment records</strong>
          <span>
            Record incoming and outgoing transactions. These entries are
            illustrative and are not connected to live bank or UPI accounts.
          </span>
        </div>
      </div>

      <div className="payments-table-panel">

        <div className="payments-table-heading">
          <div>
            <h2>Payment History</h2>
            <p>Review all recorded payment transactions.</p>
          </div>

          <button
            className="payments-export-btn"
            onClick={exportPayments}
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>

        <div className="payments-toolbar">

          <div className="payments-search">
            <Search size={17} />
            <input
              placeholder="Search payment, party or reference..."
              value={search}
              onChange={event => setSearch(event.target.value)}
            />
          </div>

          <div className="payments-filter">
            <SlidersHorizontal size={16} />
            <select
              value={typeFilter}
              onChange={event => setTypeFilter(event.target.value)}
            >
              <option value="All">All Transactions</option>
              <option value="Received">Received</option>
              <option value="Made">Made</option>
            </select>
          </div>

        </div>

        <div className="payments-table-wrap">
          <table className="payments-table">
            <thead>
              <tr>
                <th>PAYMENT ID</th>
                <th>PARTY</th>
                <th>TYPE</th>
                <th>DATE</th>
                <th>METHOD</th>
                <th>REFERENCE</th>
                <th>AMOUNT</th>
              </tr>
            </thead>

            <tbody>
              {filteredPayments.length > 0 ? (
                filteredPayments.map(item => (
                  <tr key={item.id}>
                    <td className="payments-id">{item.id}</td>
                    <td className="payments-party">{item.party}</td>
                    <td>
                      <span className={`payments-type ${item.type.toLowerCase()}`}>
                        {item.type === "Received" ? (
                          <ArrowDownLeft size={13} />
                        ) : (
                          <ArrowUpRight size={13} />
                        )}
                        {item.type}
                      </span>
                    </td>
                    <td>{item.date}</td>
                    <td>{item.method}</td>
                    <td>{item.reference}</td>
                    <td className={`payments-amount ${item.type.toLowerCase()}`}>
                      {item.type === "Received" ? "+" : "−"}
                      {money(item.amount)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="payments-empty">
                    No payment records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="payments-table-footer">
          Showing {filteredPayments.length} of {payments.length} transactions
          <span>Illustrative demo data · Not connected to live accounts</span>
        </div>

      </div>

      {showForm && (
        <div
          className="payments-modal-overlay"
          onMouseDown={event => {
            if (event.target === event.currentTarget) {
              setShowForm(false);
              setFormError("");
            }
          }}
        >
          <div className="payments-modal">

            <div className="payments-modal-heading">
              <div>
                <span className="payments-eyebrow">NEW TRANSACTION</span>
                <h2>Record Payment</h2>
                <p>Add an incoming or outgoing payment record.</p>
              </div>

              <button
                className="payments-close-btn"
                onClick={() => {
                  setShowForm(false);
                  setFormError("");
                }}
                aria-label="Close form"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={addPayment}>

              <div className="payments-form-grid">

                <label className="payments-field">
                  Payment Type
                  <select
                    value={type}
                    onChange={event => setType(event.target.value)}
                  >
                    <option value="Received">Received from Customer</option>
                    <option value="Made">Made to Supplier</option>
                  </select>
                </label>

                <label className="payments-field">
                  {type === "Received" ? "Customer Name" : "Supplier Name"}
                  <input
                    value={party}
                    onChange={event => setParty(event.target.value)}
                    placeholder={
                      type === "Received"
                        ? "Enter customer name"
                        : "Enter supplier name"
                    }
                  />
                </label>

                <label className="payments-field">
                  Payment Date
                  <input
                    type="date"
                    value={date}
                    onChange={event => setDate(event.target.value)}
                  />
                </label>

                <label className="payments-field">
                  Payment Method
                  <select
                    value={method}
                    onChange={event => setMethod(event.target.value)}
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Card">Card</option>
                  </select>
                </label>

                <label className="payments-field">
                  Amount (₹)
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={amount}
                    onChange={event => setAmount(event.target.value)}
                    placeholder="Enter payment amount"
                  />
                </label>

                <label className="payments-field">
                  Reference ID
                  <input
                    value={reference}
                    onChange={event => setReference(event.target.value)}
                    placeholder="Optional transaction reference"
                  />
                </label>

              </div>

              {formError && (
                <p className="payments-form-error">{formError}</p>
              )}

              <div className="payments-modal-actions">
                <button
                  type="button"
                  className="payments-cancel-btn"
                  onClick={() => {
                    setShowForm(false);
                    setFormError("");
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="payments-primary-btn"
                >
                  <Plus size={16} />
                  Save Payment
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Payments;
