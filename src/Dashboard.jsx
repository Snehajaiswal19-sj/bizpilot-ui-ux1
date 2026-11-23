
import { useState } from "react";
import {
  LayoutDashboard, ShoppingCart, Truck, Package, Users, Handshake,
  Wallet, ChartNoAxesCombined, Bot, Settings, Search, Bell, Plus,
  ArrowUpRight, ArrowDownRight, MoreHorizontal,
  AlertTriangle, Clock3, ChevronDown, Menu, X, Sparkles, LogOut,
  ReceiptText
} from "lucide-react";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";

import "./Dashboard.css";

import Sales from "./Sales";
import Purchases from "./Purchases";
import Customers from "./Customers";
import Suppliers from "./Suppliers";
import Payments from "./Payments";
import Reports from "./Reports";
import AIAssistant from "./AIAssistant";
import SettingsPage from "./Settings";
import Billing from "./Billing";
import Inventory from "./Inventory";

const navGroups = [
  {
    label: "OVERVIEW",
    items: [{ name: "Dashboard", icon: LayoutDashboard }]
  },
  {
    
  label: "BUSINESS",
  items: [
    { name: "Sales", icon: ShoppingCart },
    { name: "Billing", icon: ReceiptText },
    { name: "Purchases", icon: Truck },
    { name: "Inventory", icon: Package },
    { name: "Customers", icon: Users },
    { name: "Suppliers", icon: Handshake },
    { name: "Payments", icon: Wallet }
    ]
    
  },
  {
    label: "INSIGHTS",
    items: [
      { name: "Reports", icon: ChartNoAxesCombined },
      { name: "AI Assistant", icon: Bot }
    ]
  },
  {
    label: "PREFERENCES",
    items: [{ name: "Settings", icon: Settings }]
  }
];

const salesData = [
  { day: "Mon", sales: 12500 },
  { day: "Tue", sales: 18200 },
  { day: "Wed", sales: 15100 },
  { day: "Thu", sales: 22500 },
  { day: "Fri", sales: 19400 },
  { day: "Sat", sales: 28600 },
  { day: "Sun", sales: 22200 }
];

const recentSales = [
  {
    id: "#SL-1024",
    customer: "Aarav Traders",
    date: "22 Nov 2026",
    amount: "₹12,500",
    status: "Paid"
  },
  {
    id: "#SL-1023",
    customer: "Shree Enterprises",
    date: "22 Nov 2026",
    amount: "₹8,400",
    status: "Pending"
  },
  {
    id: "#SL-1022",
    customer: "Metro Stores",
    date: "21 Nov 2026",
    amount: "₹6,200",
    status: "Paid"
  },
  {
    id: "#SL-1021",
    customer: "Kumar Wholesale",
    date: "21 Nov 2026",
    amount: "₹4,800",
    status: "Partial"
  }
];

const stockItems = [
  {
    name: "Premium Basmati Rice",
    category: "Groceries",
    stock: 8,
    unit: "bags"
  },
  {
    name: "Refined Sunflower Oil",
    category: "Essentials",
    stock: 5,
    unit: "bottles"
  },
  {
    name: "Sugar 1kg Pack",
    category: "Groceries",
    stock: 12,
    unit: "packs"
  }
];

const pageDescriptions = {
  Dashboard: "A clear view of your business performance.",
  Sales: "Manage sales transactions and customer orders.",
  Purchases: "Keep track of purchases and supplier orders.",
  Inventory: "Monitor products, quantities and stock levels.",
  Customers: "Manage your customer relationships and records.",
  Suppliers: "Keep supplier information organised.",
  Payments: "Track payments received and outstanding balances.",
  Billing: "Create invoices and track customer payments.",
  Reports: "Understand your business performance.",
  "AI Assistant": "Your business information, easier to explore.",
  Settings: "Manage your workspace preferences."
};

function Dashboard({ businessDetails, onLogout }) {
  const businessName = businessDetails?.businessName || "Your Business";
  const ownerName = businessDetails?.ownerName || "Business Owner";

  const initials = ownerName
    .trim()
    .split(/\s+/)
    .map(word => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  const isHome = activePage === "Dashboard";

  return (
    <div className="app-shell">
      <aside className={`app-sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <span className="sidebar-logo">B</span>

          <div>
            <strong>bizpilot<span>.</span></strong>
            <small>BUSINESS MANAGEMENT</small>
          </div>

          <button
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
          >
            <X />
          </button>
        </div>

        <button className="business-switcher">
          <span className="business-avatar">
            {businessName.charAt(0).toUpperCase()}
          </span>

          <span>
            <strong>{businessName}</strong>
            <small>Business account</small>
          </span>

          <ChevronDown size={15} />
        </button>

        <div className="sidebar-navigation">
          {navGroups.map(group => (
            <div className="nav-group" key={group.label}>
              <p>{group.label}</p>

              {group.items.map(item => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.name}
                    className={`sidebar-link ${
                      activePage === item.name ? "active" : ""
                    }`}
                    onClick={() => {
                      setActivePage(item.name);
                      setSidebarOpen(false);
                    }}
                  >
                    <Icon size={17} />
                    <span>{item.name}</span>

                    {item.name === "AI Assistant" && (
                      <span className="new-label">NEW</span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="sidebar-plan">
          <div className="plan-top">
            <Sparkles size={16} /> YOUR PLAN
          </div>

          <strong>Free Plan</strong>
          <p>Explore your business insights.</p>

          <button onClick={() => setActivePage("Settings")}>
            Explore plans <ArrowUpRight size={13} />
          </button>
        </div>

        <div className="sidebar-profile">
          <div className="profile-avatar">{initials}</div>

          <div>
            <strong>{ownerName}</strong>
            <small>Administrator</small>
          </div>

          <MoreHorizontal size={19} />
        </div>
      </aside>

      {sidebarOpen && (
        <button
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close navigation"
        />
      )}

      <main className="app-main">
        <header className="app-topbar">
          <div className="topbar-left">
            <button
              className="mobile-menu"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu />
            </button>

            <div className="breadcrumb">
              Workspace <span>/</span> <strong>{activePage}</strong>
            </div>
          </div>

          <div className="topbar-actions">
            <label className="dashboard-search">
              <Search size={16} />

              <input
                placeholder="Search anything..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />

              <kbd>⌘ K</kbd>
            </label>

            <button
              className="notification-button"
              aria-label="Notifications"
            >
              <Bell size={18} />
              <i />
            </button>

            {/* PROFILE DROPDOWN */}
            <div className="profile-menu-wrapper">
              <button
                className="topbar-user"
                onClick={() => setProfileOpen(!profileOpen)}
                aria-label="Open profile menu"
                aria-expanded={profileOpen}
              >
                {initials}
              </button>

              {profileOpen && (
                <div className="profile-dropdown">
                  <div className="profile-dropdown-info">
                    <div className="profile-dropdown-avatar">
                      {initials}
                    </div>

                    <div>
                      <strong>{ownerName}</strong>
                      <small>Administrator</small>
                    </div>
                  </div>

                  <div className="profile-dropdown-divider" />

                  <button
                    className="profile-logout"
                    onClick={() => {
                      setProfileOpen(false);
                      onLogout?.();
                    }}
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          <div className="dashboard-welcome">
            <div>
              <span className="dashboard-eyebrow">
                SUNDAY, 22 NOVEMBER 2026
              </span>

              <h1>
                {isHome ? `Good evening, ${ownerName}.` : activePage}
              </h1>

              <p>{pageDescriptions[activePage]}</p>
            </div>

            {/* THIS WEEK FILTER REMOVED */}
            <div className="welcome-actions">
              
            </div>
          </div>

          {isHome ? (
            <>
              <section className="kpi-grid">
                <article className="kpi-card">
                  <div className="kpi-top">
                    <span>Total Sales</span>
                    <span className="kpi-icon"><ShoppingCart /></span>
                  </div>

                  <strong>₹1,48,500</strong>

                  <div className="kpi-bottom">
                    <span className="trend-positive">
                      <ArrowUpRight size={13} /> 12.8%
                    </span>
                    <span>vs. last week</span>
                  </div>
                </article>

                <article className="kpi-card">
                  <div className="kpi-top">
                    <span>Total Orders</span>
                    <span className="kpi-icon"><Package /></span>
                  </div>

                  <strong>124</strong>

                  <div className="kpi-bottom">
                    <span className="trend-positive">
                      <ArrowUpRight size={13} /> 8.2%
                    </span>
                    <span>vs. last week</span>
                  </div>
                </article>

                <article className="kpi-card">
                  <div className="kpi-top">
                    <span>Amount Received</span>
                    <span className="kpi-icon"><Wallet /></span>
                  </div>

                  <strong>₹1,12,300</strong>

                  <div className="kpi-bottom">
                    <span className="trend-positive">
                      <ArrowUpRight size={13} /> 6.4%
                    </span>
                    <span>vs. last week</span>
                  </div>
                </article>

                <article className="kpi-card">
                  <div className="kpi-top">
                    <span>Outstanding Due</span>
                    <span className="kpi-icon"><Clock3 /></span>
                  </div>

                  <strong>₹36,200</strong>

                  <div className="kpi-bottom">
                    <span className="trend-warning">Needs attention</span>
                    <span>Across 12 orders</span>
                  </div>
                </article>
              </section>

              <section className="dashboard-middle">
                <article className="panel sales-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Sales overview</h2>
                      <p>Your business performance this week</p>
                    </div>

                    <button className="panel-menu">
                      <MoreHorizontal />
                    </button>
                  </div>

                  <div className="sales-chart-summary">
                    <strong>₹1,48,500</strong>
                    <span><ArrowUpRight size={13} /> 12.8% this week</span>
                  </div>

                  <div className="chart-wrap">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={salesData}
                        margin={{
                          top: 10,
                          right: 5,
                          left: -20,
                          bottom: 0
                        }}
                      >
                        <defs>
                          <linearGradient
                            id="salesFill"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#D99A43"
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="95%"
                              stopColor="#D99A43"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>

                        <CartesianGrid
                          stroke="#879B8325"
                          vertical={false}
                        />

                        <XAxis
                          dataKey="day"
                          tick={{ fill: "#9DAA9B", fontSize: 11 }}
                          axisLine={false}
                          tickLine={false}
                        />

                        <YAxis
                          tick={{ fill: "#9DAA9B", fontSize: 10 }}
                          axisLine={false}
                          tickLine={false}
                        />

                        <Tooltip
                          contentStyle={{
                            background: "#26352B",
                            border: "1px solid #879B83",
                            borderRadius: 8,
                            color: "#F2E9D9"
                          }}
                          formatter={value => [
                            `₹${value.toLocaleString("en-IN")}`,
                            "Sales"
                          ]}
                        />

                        <Area
                          type="monotone"
                          dataKey="sales"
                          stroke="#D99A43"
                          strokeWidth={2.5}
                          fill="url(#salesFill)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="chart-footnote">
                    Illustrative sample data · Not live business figures
                  </div>
                </article>

                <article className="panel brief-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Business brief</h2>
                      <p>A quick look at your operations</p>
                    </div>

                    <span className="brief-sparkle">
                      <Sparkles size={17} />
                    </span>
                  </div>

                  <div className="brief-highlight">
                    <span>WEEKLY HIGHLIGHT</span>
                    <h3>Sales activity is moving steadily.</h3>
                    <p>
                      Your sample weekly sales are higher than the previous
                      week's illustrative figures.
                    </p>
                  </div>

                  <div className="brief-row">
                    <span><Wallet size={15} /> Payments recorded</span>
                    <strong>₹1,12,300</strong>
                  </div>

                  <div className="brief-row">
                    <span><AlertTriangle size={15} /> Low-stock products</span>
                    <strong>3 items</strong>
                  </div>

                  <button
                    className="brief-link"
                    onClick={() => setActivePage("Reports")}
                  >
                    View business reports <ArrowUpRight size={14} />
                  </button>
                </article>
              </section>

              <section className="dashboard-bottom">
                <article className="panel recent-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Recent sales</h2>
                      <p>Your latest business transactions</p>
                    </div>

                    <button
                      className="view-all"
                      onClick={() => setActivePage("Sales")}
                    >
                      View all <ArrowUpRight size={13} />
                    </button>
                  </div>

                  <div className="table-scroll">
                    <table className="dashboard-table">
                      <thead>
                        <tr>
                          <th>INVOICE</th>
                          <th>CUSTOMER</th>
                          <th>DATE</th>
                          <th>AMOUNT</th>
                          <th>STATUS</th>
                        </tr>
                      </thead>

                      <tbody>
                        {recentSales.map(sale => (
                          <tr key={sale.id}>
                            <td>{sale.id}</td>
                            <td>{sale.customer}</td>
                            <td>{sale.date}</td>
                            <td>{sale.amount}</td>
                            <td>
                              <span className={`status-pill ${sale.status.toLowerCase()}`}>
                                {sale.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </article>

                <article className="panel stock-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Low stock</h2>
                      <p>Products that need attention</p>
                    </div>

                    <button
                      className="view-all"
                      onClick={() => setActivePage("Inventory")}
                    >
                      View all <ArrowUpRight size={13} />
                    </button>
                  </div>

                  {stockItems.map(item => (
                    <div className="stock-item" key={item.name}>
                      <div className="stock-product-icon">
                        <Package size={17} />
                      </div>

                      <div className="stock-product-info">
                        <strong>{item.name}</strong>
                        <small>{item.category}</small>
                      </div>

                      <div className="stock-quantity">
                        <strong>{item.stock}</strong>
                        <small>{item.unit}</small>
                      </div>
                    </div>
                  ))}
                </article>
              </section>
            </>
          ) : activePage === "Payments" ? (
            <Payments />
          ) : activePage === "AI Assistant" ? (
            <AIAssistant />
          ) : activePage === "Suppliers" ? (
            <Suppliers />
          ) : activePage === "Customers" ? (
            <Customers />
          ) : activePage === "Purchases" ? (
            <Purchases />
          ) : activePage === "Sales" ? (
            <Sales />
          ) : activePage === "Inventory" ? (
            <Inventory />
          ) : activePage === "Reports" ? (
            <Reports />
          ) : activePage === "Billing" ? (
            <Billing />  
          ) : activePage === "Settings" ? (
            <SettingsPage businessDetails={businessDetails} />  
          ) : (
            <section className="module-placeholder panel">
              <div className="module-placeholder-icon">
                <Sparkles size={25} />
              </div>

              <span className="dashboard-eyebrow">
                BIZPILOT WORKSPACE
              </span>

              <h2>{activePage}</h2>
              <p>{pageDescriptions[activePage]}</p>

              <p className="module-note">
                This is the separate UI prototype. This module's detailed
                screens and interactions will be built next.
              </p>

              <button
                className="add-button"
                onClick={() => setActivePage("Dashboard")}
              >
                Back to dashboard
              </button>
            </section>
          )}

          <footer className="dashboard-footer">
            <span>© 2026 BizPilot · UI prototype</span>
            <span>Sample figures are illustrative and not live data.</span>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
