
import { useMemo, useRef, useState } from "react";
import {
  Search, Plus, Download, Truck, Wallet,
  ShoppingBag, X, SlidersHorizontal
} from "lucide-react";
import "./Suppliers.css";

const initialSuppliers = [
  {
    id: "SUP-1001",
    name: "Sharma Wholesale",
    contact: "Rajesh Sharma",
    phone: "9876543210",
    email: "sharma@example.com",
    city: "Mumbai",
    purchases: 42500,
    paid: 42500,
    status: "Active"
  },
  {
    id: "SUP-1002",
    name: "Metro Distributors",
    contact: "Amit Mehta",
    phone: "9820012345",
    email: "metro@example.com",
    city: "Thane",
    purchases: 28600,
    paid: 20200,
    status: "Active"
  },
  {
    id: "SUP-1003",
    name: "Patel Suppliers",
    contact: "Kiran Patel",
    phone: "9819987654",
    email: "patel@example.com",
    city: "Navi Mumbai",
    purchases: 19400,
    paid: 19400,
    status: "Active"
  },
  {
    id: "SUP-1004",
    name: "Fresh Foods Co.",
    contact: "Neha Shah",
    phone: "9892011223",
    email: "fresh@example.com",
    city: "Mumbai",
    purchases: 15800,
    paid: 7800,
    status: "Active"
  },
  {
    id: "SUP-1005",
    name: "National Packaging",
    contact: "Rohit Verma",
    phone: "9765432109",
    email: "national@example.com",
    city: "Kalyan",
    purchases: 35200,
    paid: 35200,
    status: "Inactive"
  }
];

const money = value =>
  `₹${Number(value).toLocaleString("en-IN")}`;

function Suppliers() {
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [formError, setFormError] = useState("");

  const nextId = useRef(1006);

  const totals = useMemo(() => ({
    suppliers: suppliers.length,
    purchases: suppliers.reduce((sum, item) => sum + item.purchases, 0),
    due: suppliers.reduce(
      (sum, item) => sum + item.purchases - item.paid,
      0
    )
  }), [suppliers]);

  const filteredSuppliers = suppliers.filter(supplier => {
    const term = search.toLowerCase();

    const matchesSearch =
      supplier.name.toLowerCase().includes(term) ||
      supplier.contact.toLowerCase().includes(term) ||
      supplier.phone.includes(term) ||
      supplier.email.toLowerCase().includes(term) ||
      supplier.city.toLowerCase().includes(term);

    const matchesStatus =
      statusFilter === "All" || supplier.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  function resetForm() {
    setName("");
    setContact("");
    setPhone("");
    setEmail("");
    setCity("");
    setFormError("");
  }

  function addSupplier(event) {
    event.preventDefault();

    if (!name.trim()) {
      setFormError("Please enter the supplier business name.");
      return;
    }

    if (!contact.trim()) {
      setFormError("Please enter the contact person's name.");
      return;
    }

    if (!/^[0-9]{10}$/.test(phone.trim())) {
      setFormError("Enter a valid 10-digit phone number.");
      return;
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFormError("Enter a valid email address.");
      return;
    }

    if (suppliers.some(item => item.phone === phone.trim())) {
      setFormError("A supplier with this phone number already exists.");
      return;
    }

    const newSupplier = {
      id: `SUP-${nextId.current++}`,
      name: name.trim(),
      contact: contact.trim(),
      phone: phone.trim(),
      email: email.trim(),
      city: city.trim() || "Not provided",
      purchases: 0,
      paid: 0,
      status: "Active"
    };

    setSuppliers(previous => [newSupplier, ...previous]);
    resetForm();
    setShowForm(false);
  }

  function toggleStatus(id) {
    setSuppliers(previous =>
      previous.map(supplier =>
        supplier.id === id
          ? {
              ...supplier,
              status: supplier.status === "Active" ? "Inactive" : "Active"
            }
          : supplier
      )
    );
  }

  function exportSuppliers() {
    const headings = [
      "Supplier ID",
      "Business Name",
      "Contact Person",
      "Phone",
      "Email",
      "City",
      "Total Purchases",
      "Amount Paid",
      "Outstanding",
      "Status"
    ];

    const rows = filteredSuppliers.map(supplier => [
      supplier.id,
      supplier.name,
      supplier.contact,
      supplier.phone,
      supplier.email,
      supplier.city,
      supplier.purchases,
      supplier.paid,
      supplier.purchases - supplier.paid,
      supplier.status
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
    link.download = "bizpilot-suppliers.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="suppliers-page">

      <div className="suppliers-heading">
        <div>
          <span className="suppliers-eyebrow">SUPPLY NETWORK</span>
          <h1>Suppliers</h1>
          <p>Manage supplier relationships, purchase records and outstanding payments.</p>
        </div>

        <button
          className="suppliers-primary-btn"
          onClick={() => setShowForm(true)}
        >
          <Plus size={17} />
          Add Supplier
        </button>
      </div>

      <div className="suppliers-summary-grid">

        <div className="suppliers-summary-card">
          <div className="suppliers-card-top">
            <span>Total Suppliers</span>
            <div className="suppliers-icon sage">
              <Truck size={19} />
            </div>
          </div>
          <h2>{totals.suppliers}</h2>
          <span className="suppliers-card-note">
            Registered supplier records
          </span>
        </div>

        <div className="suppliers-summary-card">
          <div className="suppliers-card-top">
            <span>Total Purchases</span>
            <div className="suppliers-icon amber">
              <ShoppingBag size={19} />
            </div>
          </div>
          <h2>{money(totals.purchases)}</h2>
          <span className="suppliers-card-note">
            Purchases recorded from suppliers
          </span>
        </div>

        <div className="suppliers-summary-card">
          <div className="suppliers-card-top">
            <span>Pending Payments</span>
            <div className="suppliers-icon brown">
              <Wallet size={19} />
            </div>
          </div>
          <h2>{money(totals.due)}</h2>
          <span className="suppliers-card-note">
            Remaining supplier dues
          </span>
        </div>

      </div>

      <div className="suppliers-table-panel">

        <div className="suppliers-table-heading">
          <div>
            <h2>Supplier Directory</h2>
            <p>View and manage your supplier information.</p>
          </div>

          <button
            className="suppliers-export-btn"
            onClick={exportSuppliers}
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>

        <div className="suppliers-toolbar">

          <div className="suppliers-search">
            <Search size={17} />
            <input
              type="text"
              placeholder="Search supplier, contact, phone or city..."
              value={search}
              onChange={event => setSearch(event.target.value)}
            />
          </div>

          <div className="suppliers-filter">
            <SlidersHorizontal size={16} />
            <select
              value={statusFilter}
              onChange={event => setStatusFilter(event.target.value)}
            >
              <option value="All">All Suppliers</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

        </div>

        <div className="suppliers-table-wrap">
          <table className="suppliers-table">
            <thead>
              <tr>
                <th>SUPPLIER</th>
                <th>CONTACT PERSON</th>
                <th>PHONE</th>
                <th>CITY</th>
                <th>PURCHASES</th>
                <th>PAID</th>
                <th>OUTSTANDING</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {filteredSuppliers.length > 0 ? (
                filteredSuppliers.map(supplier => {
                  const due = supplier.purchases - supplier.paid;

                  return (
                    <tr key={supplier.id}>
                      <td>
                        <div className="suppliers-name-cell">
                          <div className="suppliers-avatar">
                            {supplier.name
                              .split(/\s+/)
                              .map(word => word[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                          <div>
                            <strong>{supplier.name}</strong>
                            <span>{supplier.id}</span>
                          </div>
                        </div>
                      </td>

                      <td>{supplier.contact}</td>
                      <td>{supplier.phone}</td>
                      <td>{supplier.city}</td>
                      <td>{money(supplier.purchases)}</td>
                      <td>{money(supplier.paid)}</td>
                      <td className="suppliers-due">{money(due)}</td>

                      <td>
                        <span className={`suppliers-status ${supplier.status.toLowerCase()}`}>
                          {supplier.status}
                        </span>
                      </td>

                      <td>
                        <button
                          className="suppliers-action-btn"
                          onClick={() => toggleStatus(supplier.id)}
                        >
                          {supplier.status === "Active" ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="suppliers-empty">
                    No suppliers found. Try another search or add a supplier.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="suppliers-table-footer">
          Showing {filteredSuppliers.length} of {suppliers.length} suppliers
          <span>Illustrative demo data · Not connected to live records</span>
        </div>

      </div>

      {showForm && (
        <div
          className="suppliers-modal-overlay"
          onMouseDown={event => {
            if (event.target === event.currentTarget) {
              setShowForm(false);
              setFormError("");
            }
          }}
        >
          <div className="suppliers-modal">

            <div className="suppliers-modal-heading">
              <div>
                <span className="suppliers-eyebrow">NEW SUPPLIER</span>
                <h2>Add Supplier</h2>
                <p>Enter supplier business and contact information.</p>
              </div>

              <button
                className="suppliers-close-btn"
                onClick={() => {
                  setShowForm(false);
                  setFormError("");
                }}
                aria-label="Close form"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={addSupplier}>

              <div className="suppliers-form-grid">

                <label className="suppliers-field">
                  Supplier Business Name *
                  <input
                    value={name}
                    onChange={event => setName(event.target.value)}
                    placeholder="e.g. Sharma Wholesale"
                  />
                </label>

                <label className="suppliers-field">
                  Contact Person *
                  <input
                    value={contact}
                    onChange={event => setContact(event.target.value)}
                    placeholder="Enter contact person's name"
                  />
                </label>

                <label className="suppliers-field">
                  Phone Number *
                  <input
                    type="tel"
                    maxLength="10"
                    value={phone}
                    onChange={event =>
                      setPhone(event.target.value.replace(/\D/g, ""))
                    }
                    placeholder="10-digit mobile number"
                  />
                </label>

                <label className="suppliers-field">
                  Email Address
                  <input
                    type="email"
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                    placeholder="supplier@example.com"
                  />
                </label>

                <label className="suppliers-field suppliers-full-field">
                  City
                  <input
                    value={city}
                    onChange={event => setCity(event.target.value)}
                    placeholder="Enter supplier city"
                  />
                </label>

              </div>

              {formError && (
                <p className="suppliers-form-error">{formError}</p>
              )}

              <div className="suppliers-modal-actions">
                <button
                  type="button"
                  className="suppliers-cancel-btn"
                  onClick={() => {
                    setShowForm(false);
                    setFormError("");
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="suppliers-primary-btn"
                >
                  <Plus size={16} />
                  Save Supplier
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Suppliers;
