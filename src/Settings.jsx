
import { useState } from "react";
import {
  Building2,
  UserRound,
  MapPin,
  Phone,
  Mail,
  BriefcaseBusiness,
  Bell,
  Save,
  CheckCircle2,
  RotateCcw
} from "lucide-react";
import "./Settings.css";

function SettingsPage({ businessDetails }) {
  const [formData, setFormData] = useState({
    businessName: businessDetails?.businessName || "Your Business",
    ownerName: businessDetails?.ownerName || "Business Owner",
    email: businessDetails?.email || "",
    phone: businessDetails?.phone || "",
    businessType: businessDetails?.businessType || "",
    address: businessDetails?.address || "",
    city: businessDetails?.city || "",
    pincode: businessDetails?.pincode || "",
    gstin: businessDetails?.gstin || ""
  });

  const [notifications, setNotifications] = useState({
    sales: true,
    payments: true,
    inventory: true,
    updates: false
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));

    setSaved(false);
  };

  const handleNotificationChange = (name) => {
    setNotifications((previous) => ({
      ...previous,
      [name]: !previous[name]
    }));

    setSaved(false);
  };

  const handleSave = (event) => {
    event.preventDefault();
    setSaved(true);
  };

  const handleReset = () => {
    setFormData({
      businessName: businessDetails?.businessName || "Your Business",
      ownerName: businessDetails?.ownerName || "Business Owner",
      email: businessDetails?.email || "",
      phone: businessDetails?.phone || "",
      businessType: businessDetails?.businessType || "",
      address: businessDetails?.address || "",
      city: businessDetails?.city || "",
      pincode: businessDetails?.pincode || "",
      gstin: businessDetails?.gstin || ""
    });

    setNotifications({
      sales: true,
      payments: true,
      inventory: true,
      updates: false
    });

    setSaved(false);
  };

  return (
    <div className="settings-page">
      <div className="settings-intro">
        <div>
          <span className="settings-eyebrow">WORKSPACE PREFERENCES</span>
          <h2>Settings</h2>
          <p>Manage your business information and workspace preferences.</p>
        </div>

        <div className="settings-intro-icon">
          <Building2 size={23} />
        </div>
      </div>

      <form onSubmit={handleSave}>
        <section className="settings-card">
          <div className="settings-card-heading">
            <div className="settings-section-icon">
              <Building2 size={18} />
            </div>

            <div>
              <h3>Business Profile</h3>
              <p>Basic information about your business.</p>
            </div>
          </div>

          <div className="settings-fields-grid">
            <div className="settings-field">
              <label htmlFor="businessName">Business Name</label>
              <input
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="Enter business name"
              />
            </div>

            <div className="settings-field">
              <label htmlFor="businessType">Business Type</label>
              <div className="settings-input-icon">
                <BriefcaseBusiness size={16} />
                <select
                  id="businessType"
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                >
                  <option value="">Select business type</option>
                  <option value="Retail">Retail</option>
                  <option value="Wholesale">Wholesale</option>
                  <option value="Distributor">Distributor</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        <section className="settings-card">
          <div className="settings-card-heading">
            <div className="settings-section-icon">
              <UserRound size={18} />
            </div>

            <div>
              <h3>Owner & Contact Details</h3>
              <p>Keep your contact information up to date.</p>
            </div>
          </div>

          <div className="settings-fields-grid">
            <div className="settings-field">
              <label htmlFor="ownerName">Owner Name</label>
              <input
                id="ownerName"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                placeholder="Enter owner name"
              />
            </div>

            <div className="settings-field">
              <label htmlFor="email">Email Address</label>
              <div className="settings-input-icon">
                <Mail size={16} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="settings-field">
              <label htmlFor="phone">Phone Number</label>
              <div className="settings-input-icon">
                <Phone size={16} />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div className="settings-field">
              <label htmlFor="gstin">GSTIN <span>(Optional)</span></label>
              <input
                id="gstin"
                name="gstin"
                value={formData.gstin}
                onChange={handleChange}
                placeholder="Enter GSTIN"
              />
            </div>
          </div>
        </section>

        <section className="settings-card">
          <div className="settings-card-heading">
            <div className="settings-section-icon">
              <MapPin size={18} />
            </div>

            <div>
              <h3>Business Address</h3>
              <p>Your business location details.</p>
            </div>
          </div>

          <div className="settings-fields-grid">
            <div className="settings-field settings-field-full">
              <label htmlFor="address">Street Address</label>
              <input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter street address"
              />
            </div>

            <div className="settings-field">
              <label htmlFor="city">City</label>
              <input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
              />
            </div>

            <div className="settings-field">
              <label htmlFor="pincode">PIN Code</label>
              <input
                id="pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Enter PIN code"
                maxLength={6}
              />
            </div>
          </div>
        </section>

        <section className="settings-card">
          <div className="settings-card-heading">
            <div className="settings-section-icon">
              <Bell size={18} />
            </div>

            <div>
              <h3>Notification Preferences</h3>
              <p>Choose which updates you want to see in your workspace.</p>
            </div>
          </div>

          <div className="settings-notification-list">
            {[
              {
                key: "sales",
                title: "Sales updates",
                description: "Get updates about sales and new transactions."
              },
              {
                key: "payments",
                title: "Payment reminders",
                description: "Stay informed about payment activity."
              },
              {
                key: "inventory",
                title: "Low stock alerts",
                description: "Keep track of products that need restocking."
              },
              {
                key: "updates",
                title: "Product announcements",
                description: "Hear about new BizPilot features and updates."
              }
            ].map((item) => (
              <div className="settings-notification-row" key={item.key}>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </div>

                <button
                  type="button"
                  className={`settings-toggle ${
                    notifications[item.key] ? "is-on" : ""
                  }`}
                  onClick={() => handleNotificationChange(item.key)}
                  aria-label={`Toggle ${item.title}`}
                  aria-pressed={notifications[item.key]}
                >
                  <span />
                </button>
              </div>
            ))}
          </div>
        </section>

        <div className="settings-save-bar">
          <div className="settings-save-message">
            {saved ? (
              <>
                <CheckCircle2 size={17} />
                <span>Changes saved in this demo session.</span>
              </>
            ) : (
              <span>Your changes are not saved yet.</span>
            )}
          </div>

          <div className="settings-save-actions">
            <button
              type="button"
              className="settings-reset-button"
              onClick={handleReset}
            >
              <RotateCcw size={15} />
              Reset
            </button>

            <button type="submit" className="settings-save-button">
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </div>
      </form>

      <div className="settings-demo-note">
        <span>DEMO MODE</span>
        Settings are stored only in the current frontend session. No backend
        account or notification service is connected.
      </div>
    </div>
  );
}

export default SettingsPage;
