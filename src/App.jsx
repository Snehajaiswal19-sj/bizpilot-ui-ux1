
import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight, ArrowUpRight, ShoppingCart, Package,
  Wallet, Users, TrendingUp, Menu, X, CircleDollarSign,
  CreditCard, Banknote, ChartNoAxesCombined
} from "lucide-react";
import Dashboard from "./Dashboard";
import Auth from "./Auth";
import Onboarding from "./Onboarding";
import "./Landing.css";

const rise = {
  hidden: { opacity: 0, y: 45 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.85,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const modules = [
  {
    icon: ShoppingCart,
    name: "Sales",
    desc: "Every sale, recorded. Every transaction, accounted for.",
    number: "01"
  },
  {
    icon: Package,
    name: "Inventory",
    desc: "Know what is in stock, what is moving and what needs attention.",
    number: "02"
  },
  {
    icon: Wallet,
    name: "Payments",
    desc: "Keep track of incoming payments and outstanding balances.",
    number: "03"
  },
  {
    icon: Users,
    name: "Customers",
    desc: "Keep customer relationships and business records organised.",
    number: "04"
  },
  {
    icon: ChartNoAxesCombined,
    name: "Cash flow",
    desc: "See money moving through your business with greater clarity.",
    number: "05"
  }
];

function App() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [registeredDetails, setRegisteredDetails] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const { scrollYProgress } = useScroll();

  const heroY = useTransform(scrollYProgress, [0, 0.35], [0, -130]);
  const heroScale = useTransform(scrollYProgress, [0, 0.35], [1, 0.88]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0.3]);
  const chartY = useTransform(scrollYProgress, [0.2, 0.65], [90, -55]);

  // DASHBOARD
  if (showDashboard) {
    return (
      <>
        <button
          className="back-home"
          onClick={() => {
            setShowDashboard(false);
          }}
        >
          ← Back to website
        </button>

        <Dashboard
          businessDetails={registeredDetails}
          onLogout={() => {
            setShowDashboard(false);
            setShowAuth(false);
            setShowOnboarding(false);
            setRegisteredDetails(null);
            setMenuOpen(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </>
    );
  }

  // ONBOARDING
  if (showOnboarding) {
    return (
      <Onboarding
        initialDetails={registeredDetails}
        onBack={() => {
          setShowOnboarding(false);
          setShowAuth(true);
        }}
        onComplete={(details) => {
          setRegisteredDetails(details);
          setShowOnboarding(false);
          setShowDashboard(true);
        }}
      />
    );
  }

  // AUTHENTICATION
  if (showAuth) {
    return (
      <Auth
        onBack={() => setShowAuth(false)}
        onSuccess={() => {
          setShowAuth(false);
          setShowDashboard(true);
        }}
        onRegister={(details) => {
          setRegisteredDetails(details);
          setShowAuth(false);
          setShowOnboarding(true);
        }}
      />
    );
  }

  return (
    <div className="landing">
      <header className="landing-nav">
        <a className="landing-brand" href="#home">
          <span className="landing-logo">B</span>
          <span>bizpilot<span className="brand-dot">.</span></span>
        </a>

        <button
          className="mobile-nav-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        <nav className={menuOpen ? "nav-links nav-open" : "nav-links"}>
          <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="#workspace" onClick={() => setMenuOpen(false)}>Workspace</a>
          <a href="#insights" onClick={() => setMenuOpen(false)}>Insights</a>
          <a href="#modules" onClick={() => setMenuOpen(false)}>Modules</a>

          <button
            className="nav-cta"
            onClick={() => setShowAuth(true)}
          >
            Explore BizPilot <ArrowUpRight size={15} />
          </button>
        </nav>
      </header>

      <main>
        {/* HERO */}
        <section className="hero-section" id="home">
          <motion.div
            className="hero-copy"
            style={{ y: heroY, opacity: heroOpacity }}
          >
            <motion.div
              className="hero-tag"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <span /> YOUR NEXT CHAPTER
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 45 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.15 }}
            >
              Steer your business<br />
              with <em>clarity.</em>
            </motion.h1>

            <motion.p
              className="hero-description"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.35 }}
            >
              A calmer way to manage sales, inventory, payments and customers.
              Bring your everyday business operations together in one clear workspace.
            </motion.p>

            <motion.div
              className="hero-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <button
                className="hero-primary"
                onClick={() => setShowAuth(true)}
              >
                Explore BizPilot <ArrowRight size={16} />
              </button>

              <a href="#workspace" className="hero-secondary">
                View the platform ↗
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            className="hero-visual"
            style={{ scale: heroScale, y: heroY }}
            initial={{ opacity: 0, x: 70 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.25 }}
          >
            <div className="hero-light" />
            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />

            <div className="hero-main-card">
              <div className="preview-top">
                <div className="preview-brand"><span>B</span> bizpilot.</div>
                <span className="preview-account">BUSINESS OVERVIEW</span>
              </div>

              <div className="preview-heading">
                <div>
                  <small>YOUR BUSINESS AT A GLANCE</small>
                  <h3>Good business starts with clarity.</h3>
                </div>
                <span className="preview-date">THIS WEEK</span>
              </div>

              <div className="preview-metrics">
                <div>
                  <span>Total sales</span>
                  <strong>₹1,48,500</strong>
                  <small>↗ 12.8%</small>
                </div>

                <div>
                  <span>Orders</span>
                  <strong>124</strong>
                  <small>↗ 8.2%</small>
                </div>
              </div>

              <div className="preview-chart">
                <div className="preview-chart-title">
                  <span>Sales overview</span>
                  <span>Weekly performance</span>
                </div>

                <div className="preview-bars">
                  {[42, 57, 48, 76, 62, 94, 73].map((height, i) => (
                    <div className="preview-bar-column" key={i}>
                      <span style={{ height: `${height}%` }} />
                      <small>{["M", "T", "W", "T", "F", "S", "S"][i]}</small>
                    </div>
                  ))}
                </div>
              </div>

              <div className="preview-foot">
                <span>Illustrative business data</span>
                <span>BizPilot workspace ↗</span>
              </div>
            </div>

            <motion.div
              className="floating-stat floating-stat-one"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              <TrendingUp size={17} />
              <div>
                <small>Business growth</small>
                <strong>12.8%</strong>
              </div>
            </motion.div>

            <motion.div
              className="floating-stat floating-stat-two"
              animate={{ y: [0, 9, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
            >
              <CircleDollarSign size={18} />
              <div>
                <small>Payments tracked</small>
                <strong>₹24,800</strong>
              </div>
            </motion.div>
          </motion.div>

          <div className="hero-bottom-note">
            <span>01 — A CLEARER WAY FORWARD</span>
            <span>SCROLL TO EXPLORE ↓</span>
          </div>
        </section>

        {/* WORKSPACE */}
        <section className="workspace-section" id="workspace">
          <motion.div
            className="workspace-heading"
            variants={rise}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <span className="section-kicker">THE BIZPILOT WORKSPACE</span>
            <h2>One workspace. Every moving part, <em>connected.</em></h2>
            <p>
              A single place to bring your sales, inventory, payments and
              customer information together. Less switching. More clarity.
            </p>
          </motion.div>

          <div className="module-flow">
            <div className="flow-line" />

            {modules.map((item, i) => {
              const Icon = item.icon;

              return (
                <motion.div
                  className="flow-module"
                  key={item.name}
                  initial={{ opacity: 0, y: 55 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.7, delay: i * 0.12 }}
                >
                  <div className="flow-node"><Icon size={19} /></div>

                  <article className="flow-card">
                    <span>{item.number} / BUSINESS MODULE</span>
                    <h3>{item.name}</h3>
                    <p>{item.desc}</p>

                    <button onClick={() => setShowAuth(true)}>
                      Explore module <ArrowUpRight size={14} />
                    </button>
                  </article>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* REVENUE */}
        <section className="insights-section" id="insights">
          <div className="insights-copy">
            <motion.div
              variants={rise}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <span className="section-kicker">A BETTER VIEW OF BUSINESS</span>
              <h2>Know where every <em>rupee</em> comes from.</h2>

              <p>
                From daily sales to weekly performance, see your business
                activity in a way that feels clear, connected and easy to follow.
              </p>

              <ul>
                <li>See what is selling, day by day.</li>
                <li>Track activity across the week.</li>
                <li>Understand your business at a glance.</li>
              </ul>

              <button
                className="text-link"
                onClick={() => setShowAuth(true)}
              >
                Explore business insights <ArrowRight size={15} />
              </button>
            </motion.div>
          </div>

          <motion.div className="revenue-card" style={{ y: chartY }}>
            <div className="revenue-card-top">
              <div>
                <small>WEEKLY SALES</small>
                <h3>₹1,48,500</h3>
              </div>
              <span>↗ 12.8%</span>
            </div>

            <div className="revenue-chart">
              {[38, 52, 45, 69, 60, 92, 76].map((h, i) => (
                <div className="revenue-column" key={i}>
                  <span style={{ height: `${h}%` }} />
                  <small>{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}</small>
                </div>
              ))}
            </div>

            <div className="revenue-card-bottom">
              <span>Sales performance</span>
              <span>Illustrative sample data</span>
            </div>
          </motion.div>
        </section>

        {/* CASH FLOW */}
        <section className="cashflow-section">
          <motion.div
            className="cashflow-visual"
            initial={{ opacity: 0, x: -55 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1 }}
          >
            <div className="cashflow-card">
              <div className="cashflow-card-heading">
                <span>PAYMENT OVERVIEW</span>
                <span>THIS MONTH</span>
              </div>

              <div className="cashflow-total">₹1,24,500</div>
              <div className="cashflow-total-label">
                Illustrative recorded payments
              </div>

              <div className="payment-ring">
                <div className="ring-center">
                  <strong>4</strong>
                  <small>MODES</small>
                </div>
              </div>

              <div className="payment-legend">
                <div><i className="legend-cash" /> Cash <b>35%</b></div>
                <div><i className="legend-upi" /> UPI <b>40%</b></div>
                <div><i className="legend-card" /> Card <b>15%</b></div>
                <div><i className="legend-other" /> Other <b>10%</b></div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="cashflow-copy"
            variants={rise}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <span className="section-kicker">CASH FLOW</span>
            <h2>Cash flow, clear as morning <em>light.</em></h2>

            <p>
              See how money arrives, what is waiting to be collected and
              what moves out, all without a spreadsheet in sight.
            </p>

            <ul>
              <li>UPI, bank transfers, cash and cheque activity.</li>
              <li>See what you receive against what you pay.</li>
              <li>A clearer footing for every decision.</li>
            </ul>

            <button
              className="text-link"
              onClick={() => setShowAuth(true)}
            >
              Explore payment details <ArrowRight size={15} />
            </button>
          </motion.div>
        </section>

        {/* MODULE SUMMARY */}
        <section className="summary-section" id="modules">
          <motion.div
            variants={rise}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <span className="section-kicker">ONE CONNECTED WORKSPACE</span>
            <h2>
              Everything in its place.<br />
              <em>Everything in view.</em>
            </h2>
          </motion.div>

          <div className="summary-grid">
            <div>
              <span>01</span>
              <h3>Sales & purchases</h3>
              <p>Keep daily transactions organised.</p>
            </div>

            <div>
              <span>02</span>
              <h3>Inventory</h3>
              <p>Stay informed about products and stock.</p>
            </div>

            <div>
              <span>03</span>
              <h3>Customers & suppliers</h3>
              <p>Keep business relationships connected.</p>
            </div>

            <div>
              <span>04</span>
              <h3>Reports & insights</h3>
              <p>Understand your business activity.</p>
            </div>
          </div>
        </section>

        {/* CLOSING */}
        <section className="closing-section">
          <motion.div
            variants={rise}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <span className="section-kicker">YOUR NEXT CHAPTER</span>
            <h2>
              Make every business move<br />
              with <em>clarity.</em>
            </h2>

            <p>
              Bring your everyday business operations into one connected workspace.
            </p>

            <button
              className="hero-primary"
              onClick={() => setShowAuth(true)}
            >
              Explore BizPilot <ArrowRight size={16} />
            </button>
          </motion.div>
        </section>
      </main>

      <footer className="landing-footer">
        <a className="landing-brand" href="#home">
          <span className="landing-logo">B</span>
          <span>bizpilot<span className="brand-dot">.</span></span>
        </a>

        <p>One workspace. Every moving part, connected.</p>
        <span>© 2026 BizPilot · Prototype preview</span>
      </footer>
    </div>
  );
}

export default App;
