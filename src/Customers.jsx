
import { useMemo, useRef, useState } from "react";
import {
  Search, Plus, Download, Users, Wallet,
  TrendingUp, X, SlidersHorizontal, UserRound
} from "lucide-react";
import "./Customers.css";

const initialCustomers = [
  {
    id: "CUS-1001",
    name: "Aarav Traders",
    phone: "9876543210",
    email: "aarav@example.com",
    city: "Mumbai",
    totalSales: 42500,
    received: 42500,
    status: "Active"
  },
  {
    id: "CUS-1002",
    name: "Shree Enterprises",
    phone: "9820012345",
    email: "shree@example.com",
    city: "Thane",
    totalSales: 28600,
    received: 20200,
    status: "Active"
  },
  {
    id: "CUS-1003",
    name: "Metro Stores",
    phone: "9819987654",
    email: "metro@example.com",
    city: "Navi Mumbai",
    totalSales: 19400,
    received: 19400,
    status: "Active"
  },
  {
    id: "CUS-1004",
    name: "Kumar Wholesale",
    phone: "9892011223",
    email: "kumar@example.com",
    city: "Mumbai",
    totalSales: 15800,
    received: 7800,
    status: "Active"
  },
  {
    id: "CUS-1005",
    name: "Patel General Store",
    phone: "9765432109",
    email: "patel@example.com",
    city: "Kalyan",
    totalSales: 35200,
    received: 35200,
    status: "Inactive"
  },
  {
    id: "CUS-1006",
    name: "City Mart",
    phone: "9898765432",
    email: "citymart@example.com",
    city: "Mumbai",
    totalSales: 22100,
    received: 17100,
    status: "Active"
  }
];

const money = value =>
  `₹${Number(value).toLocaleString("en-IN")}`;

function Customers() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [formError, setFormError] = useState("");

  const nextId = useRef(1007);

  const totals = useMemo(() => ({
    customers: customers.length,
    sales: customers.reduce((sum, item) => sum + item.totalSales, 0),
    due: customers.reduce(
      (sum, item) => sum + item.totalSales - item.received,
      0
    )
  }), [customers]);

  const filteredCustomers = customers.filter(customer => {
    const term = search.toLowerCase();

    const matchesSearch =
      customer.name.toLowerCase().includes(term) ||
      customer.phone.includes(term) ||
      customer.email.toLowerCase().includes(term) ||
      customer.city.toLowerCase().includes(term);

    const matchesStatus =
      statusFilter === "All" || customer.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  function resetForm() {
    setName("");
    setPhone("");
    setEmail("");
    setCity("");
    setFormError("");
  }

  function addCustomer(event) {
    event.preventDefault();

    if (!name.trim()) {
      setFormError("Please enter the customer name.");
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

    const duplicate = customers.some(
      item => item.phone === phone.trim()
    );

    if (duplicate) {
      setFormError("A customer with this phone number already exists.");
      return;
    }

    const newCustomer = {
      id: `CUS-${nextId.current++}`,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      city: city.trim() || "Not provided",
      totalSales: 0,
      received: 0,
      status: "Active"
    };

    setCustomers(previous => [newCustomer, ...previous]);
    resetForm();
    setShowForm(false);
  }

  function toggleStatus(id) {
    setCustomers(previous =>
      previous.map(customer =>
        customer.id === id
          ? {
              ...customer,
              status: customer.status === "Active" ? "Inactive" : "Active"
            }
          : customer
      )
    );
  }

  function exportCustomers() {
    const headings = [
      "Customer ID",
      "Customer Name",
      "Phone",
      "Email",
      "City",
      "Total Sales",
      "Received",
      "Outstanding",
      "Status"
    ];

    const rows = filteredCustomers.map(customer => [
      customer.id,
      customer.name,
      customer.phone,
      customer.email,
      customer.city,
      customer.totalSales,
      customer.received,
      customer.totalSales - customer.received,
      customer.status
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
    link.download = "bizpilot-customers.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="customers-page">

      <div className="customers-heading">
        <div>
          <span className="customers-eyebrow">RELATIONSHIP MANAGEMENT</span>
          <h1>Customers</h1>
          <p>Manage customer information, sales activity and outstanding dues.</p>
        </div>

        <button
          className="customers-primary-btn"
          onClick={() => setShowForm(true)}
        >
          <Plus size={17} />
          Add Customer
        </button>
      </div>

      <div className="customers-summary-grid">

        <div className="customers-summary-card">
          <div className="customers-card-top">
            <span>Total Customers</span>
            <div className="customers-icon sage">
              <Users size={19} />
            </div>
          </div>
          <h2>{totals.customers}</h2>
          <span className="customers-card-note">
            Registered customer records
          </span>
        </div>

        <div className="customers-summary-card">
          <div className="customers-card-top">
            <span>Total Sales</span>
            <div className="customers-icon amber">
              <TrendingUp size={19} />
            </div>
          </div>
          <h2>{money(totals.sales)}</h2>
          <span className="customers-card-note">
            Sales recorded for customers
          </span>
        </div>

        <div className="customers-summary-card">
          <div className="customers-card-top">
            <span>Outstanding Dues</span>
            <div className="customers-icon brown">
              <Wallet size={19} />
            </div>
          </div>
          <h2>{money(totals.due)}</h2>
          <span className="customers-card-note">
            Pending customer payments
          </span>
        </div>

      </div>

      <div className="customers-table-panel">

        <div className="customers-table-heading">
          <div>
            <h2>Customer Directory</h2>
            <p>View and manage your customer records.</p>
          </div>

          <button
            className="customers-export-btn"
            onClick={exportCustomers}
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>

        <div className="customers-toolbar">

          <div className="customers-search">
            <Search size={17} />
            <input
              type="text"
              placeholder="Search name, phone, email or city..."
              value={search}
              onChange={event => setSearch(event.target.value)}
            />
          </div>

          <div className="customers-filter">
            <SlidersHorizontal size={16} />
            <select
              value={statusFilter}
              onChange={event => setStatusFilter(event.target.value)}
            >
              <option value="All">All Customers</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

        </div>

        <div className="customers-table-wrap">
          <table className="customers-table">
            <thead>
              <tr>
                <th>CUSTOMER</th>
                <th>CONTACT</th>
                <th>CITY</th>
                <th>TOTAL SALES</th>
                <th>RECEIVED</th>
                <th>OUTSTANDING</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map(customer => {
                  const due = customer.totalSales - customer.received;

                  return (
                    <tr key={customer.id}>
                      <td>
                        <div className="customers-name-cell">
                          <div className="customers-avatar">
                            {customer.name
                              .split(/\s+/)
                              .map(word => word[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                          <div>
                            <strong>{customer.name}</strong>
                            <span>{customer.id}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="customers-contact">
                          <span>{customer.phone}</span>
                          <small>{customer.email || "No email provided"}</small>
                        </div>
                      </td>

                      <td>{customer.city}</td>
                      <td>{money(customer.totalSales)}</td>
                      <td>{money(customer.received)}</td>

                      <td className="customers-due">
                        {money(due)}
                      </td>

                      <td>
                        <span className={`customers-status ${customer.status.toLowerCase()}`}>
                          {customer.status}
                        </span>
                      </td>

                      <td>
                        <button
                          className="customers-action-btn"
                          onClick={() => toggleStatus(customer.id)}
                        >
                          {customer.status === "Active" ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="customers-empty">
                    No customers found. Try another search or add a customer.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="customers-table-footer">
          Showing {filteredCustomers.length} of {customers.length} customers
          <span>Illustrative demo data · Not connected to live records</span>
        </div>

      </div>

      {showForm && (
        <div
          className="customers-modal-overlay"
          onMouseDown={event => {
            if (event.target === event.currentTarget) {
              setShowForm(false);
              setFormError("");
            }
          }}
        >
          <div className="customers-modal">

            <div className="customers-modal-heading">
              <div>
                <span className="customers-eyebrow">NEW CUSTOMER</span>
                <h2>Add Customer</h2>
                <p>Enter the customer's contact information.</p>
              </div>

              <button
                className="customers-close-btn"
                onClick={() => {
                  setShowForm(false);
                  setFormError("");
                }}
                aria-label="Close form"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={addCustomer}>

              <div className="customers-form-grid">

                <label className="customers-field">
                  Customer Name *
                  <input
                    value={name}
                    onChange={event => setName(event.target.value)}
                    placeholder="Enter customer name"
                  />
                </label>

                <label className="customers-field">
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

                <label className="customers-field">
                  Email Address
                  <input
                    type="email"
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                    placeholder="customer@example.com"
                  />
                </label>

                <label className="customers-field">
                  City
                  <input
                    value={city}
                    onChange={event => setCity(event.target.value)}
                    placeholder="Enter city"
                  />
                </label>

              </div>

              {formError && (
                <p className="customers-form-error">{formError}</p>
              )}

              <div className="customers-modal-actions">
                <button
                  type="button"
                  className="customers-cancel-btn"
                  onClick={() => {
                    setShowForm(false);
                    setFormError("");
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="customers-primary-btn"
                >
                  <Plus size={16} />
                  Save Customer
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Customers;
