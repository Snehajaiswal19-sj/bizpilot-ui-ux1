
import { useMemo, useState } from "react";
import {
  CalendarDays,
  Download,
  TrendingUp,
  ShoppingCart,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  ChartNoAxesCombined,
  ReceiptText,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import "./Reports.css";

const reportData = {
  "7": {
    sales: [
      { day: "Mon", sales: 12500 },
      { day: "Tue", sales: 15800 },
      { day: "Wed", sales: 11200 },
      { day: "Thu", sales: 18400 },
      { day: "Fri", sales: 16200 },
      { day: "Sat", sales: 22100 },
      { day: "Sun", sales: 19600 },
    ],
    comparison: [
      { month: "Mon", sales: 12500, purchases: 7200 },
      { month: "Tue", sales: 15800, purchases: 9100 },
      { month: "Wed", sales: 11200, purchases: 6800 },
      { month: "Thu", sales: 18400, purchases: 10500 },
      { month: "Fri", sales: 16200, purchases: 8400 },
      { month: "Sat", sales: 22100, purchases: 12300 },
      { month: "Sun", sales: 19600, purchases: 9800 },
    ],
    totals: { sales: 115800, purchases: 64100, received: 92400, made: 48700 },
  },
  "30": {
    sales: [
      { day: "Week 1", sales: 68500 },
      { day: "Week 2", sales: 82400 },
      { day: "Week 3", sales: 75600 },
      { day: "Week 4", sales: 96800 },
    ],
    comparison: [
      { month: "Week 1", sales: 68500, purchases: 38200 },
      { month: "Week 2", sales: 82400, purchases: 45100 },
      { month: "Week 3", sales: 75600, purchases: 42600 },
      { month: "Week 4", sales: 96800, purchases: 51800 },
    ],
    totals: { sales: 323300, purchases: 177700, received: 274800, made: 148500 },
  },
  "90": {
    sales: [
      { day: "Month 1", sales: 248000 },
      { day: "Month 2", sales: 286000 },
      { day: "Month 3", sales: 323300 },
    ],
    comparison: [
      { month: "Month 1", sales: 248000, purchases: 139000 },
      { month: "Month 2", sales: 286000, purchases: 158000 },
      { month: "Month 3", sales: 323300, purchases: 177700 },
    ],
    totals: { sales: 857300, purchases: 474700, received: 729600, made: 402300 },
  },
};

const paymentColors = ["#879B83", "#D99A43"];

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const formatShort = (value) => {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
  return `₹${value}`;
};

function Reports() {
  const [range, setRange] = useState("30");

  const data = reportData[range];

  const paymentData = useMemo(
    () => [
      { name: "Received", value: data.totals.received },
      { name: "Made", value: data.totals.made },
    ],
    [data]
  );

  const netCashFlow = data.totals.received - data.totals.made;
  const outstanding = data.totals.sales - data.totals.received;

  const handleExport = () => {
    const rows = [
      ["Report", "Amount"],
      ["Total Sales", data.totals.sales],
      ["Total Purchases", data.totals.purchases],
      ["Payments Received", data.totals.received],
      ["Payments Made", data.totals.made],
      ["Net Cash Flow", netCashFlow],
      ["Illustrative Outstanding", outstanding],
    ];

    const csv = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `bizpilot-report-${range}-days.csv`;
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="reports-page">
      <div className="reports-header">
        <div>
          <span className="reports-eyebrow">BUSINESS INSIGHTS</span>
          <h1>Reports & Analytics</h1>
          <p>Understand your business performance at a glance.</p>
        </div>

        <div className="reports-actions">
          <div className="reports-range">
            <CalendarDays size={16} />
            <select
              value={range}
              onChange={(event) => setRange(event.target.value)}
              aria-label="Select report date range"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>

          <button className="reports-export" onClick={handleExport}>
            <Download size={16} />
            Export Report
          </button>
        </div>
      </div>

      <div className="reports-demo-note">
        <span className="reports-demo-dot" />
        Demo analytics · Illustrative sample data, not live business records
      </div>

      <div className="reports-stats-grid">
        <div className="reports-stat-card">
          <div className="reports-stat-top">
            <span>Total Sales</span>
            <div className="reports-stat-icon sage">
              <TrendingUp size={19} />
            </div>
          </div>
          <h2>{formatCurrency(data.totals.sales)}</h2>
          <div className="reports-stat-foot">
            <ArrowUpRight size={15} />
            <span>Sales during selected period</span>
          </div>
        </div>

        <div className="reports-stat-card">
          <div className="reports-stat-top">
            <span>Total Purchases</span>
            <div className="reports-stat-icon amber">
              <ShoppingCart size={19} />
            </div>
          </div>
          <h2>{formatCurrency(data.totals.purchases)}</h2>
          <div className="reports-stat-foot neutral">
            <ReceiptText size={15} />
            <span>Purchase value in this period</span>
          </div>
        </div>

        <div className="reports-stat-card">
          <div className="reports-stat-top">
            <span>Net Cash Flow</span>
            <div className="reports-stat-icon forest">
              <Wallet size={19} />
            </div>
          </div>
          <h2>{formatCurrency(netCashFlow)}</h2>
          <div className="reports-stat-foot">
            <ArrowUpRight size={15} />
            <span>Received minus payments made</span>
          </div>
        </div>

        <div className="reports-stat-card">
          <div className="reports-stat-top">
            <span>Illustrative Outstanding</span>
            <div className="reports-stat-icon brown">
              <ArrowDownRight size={19} />
            </div>
          </div>
          <h2>{formatCurrency(outstanding)}</h2>
          <div className="reports-stat-foot neutral">
            <ReceiptText size={15} />
            <span>Sales minus amount received</span>
          </div>
        </div>
      </div>

      <div className="reports-charts-grid">
        <section className="reports-panel reports-sales-panel">
          <div className="reports-panel-heading">
            <div>
              <h3>Sales Overview</h3>
              <p>Sales performance across the selected period</p>
            </div>
            <div className="reports-chart-label">
              <span className="reports-legend-dot" />
              Sales
            </div>
          </div>

          <div className="reports-chart-area">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data.sales}
                margin={{ top: 12, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#879B83" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#879B83" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#eee9e1" strokeDasharray="4 4" vertical={false} />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#8b8981", fontSize: 11 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#8b8981", fontSize: 11 }}
                  tickFormatter={formatShort}
                  width={55}
                />
                <Tooltip
                  formatter={(value) => [formatCurrency(value), "Sales"]}
                  contentStyle={{
                    border: "1px solid #eee9e1",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#647D68"
                  strokeWidth={2.5}
                  fill="url(#salesGradient)"
                  activeDot={{ r: 5, fill: "#647D68" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="reports-panel reports-payment-panel">
          <div className="reports-panel-heading">
            <div>
              <h3>Payment Breakdown</h3>
              <p>Money received vs payments made</p>
            </div>
          </div>

          <div className="reports-donut-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="46%"
                  innerRadius={66}
                  outerRadius={94}
                  paddingAngle={4}
                  stroke="none"
                >
                  {paymentData.map((entry, index) => (
                    <Cell key={entry.name} fill={paymentColors[index]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span className="reports-pie-legend">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="reports-donut-center">
              <span>Total Payments</span>
              <strong>
                {formatShort(data.totals.received + data.totals.made)}
              </strong>
            </div>
          </div>

          <div className="reports-payment-values">
            <div>
              <span className="payment-value-dot received" />
              <span>Received</span>
              <strong>{formatCurrency(data.totals.received)}</strong>
            </div>
            <div>
              <span className="payment-value-dot made" />
              <span>Made</span>
              <strong>{formatCurrency(data.totals.made)}</strong>
            </div>
          </div>
        </section>
      </div>

      <section className="reports-panel reports-comparison-panel">
        <div className="reports-panel-heading">
          <div>
            <h3>Sales vs Purchases</h3>
            <p>Compare sales and purchase values over time</p>
          </div>
          <div className="reports-comparison-legend">
            <span><i className="sales-key" /> Sales</span>
            <span><i className="purchase-key" /> Purchases</span>
          </div>
        </div>

        <div className="reports-comparison-chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.comparison}
              margin={{ top: 12, right: 12, left: 0, bottom: 0 }}
              barGap={8}
            >
              <CartesianGrid stroke="#eee9e1" strokeDasharray="4 4" vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#8b8981", fontSize: 11 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#8b8981", fontSize: 11 }}
                tickFormatter={formatShort}
                width={55}
              />
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                contentStyle={{
                  border: "1px solid #eee9e1",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="sales" name="Sales" fill="#647D68" radius={[5, 5, 0, 0]} />
              <Bar
                dataKey="purchases"
                name="Purchases"
                fill="#D99A43"
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="reports-footer-note">
        <ChartNoAxesCombined size={17} />
        <p>
          These figures are sample values for the BizPilot frontend prototype.
          They do not represent verified business accounts, bank balances, or
          live transactions.
        </p>
      </div>
    </div>
  );
}

export default Reports;
