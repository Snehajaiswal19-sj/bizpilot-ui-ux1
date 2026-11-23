
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight, ArrowLeft, Building2, Store, ShoppingBag,
  Truck, BriefcaseBusiness, CheckCircle2, MapPin, Phone,
  UserRound, FileText
} from "lucide-react";
import "./Onboarding.css";

const businessTypes = [
  { name: "Retail", description: "Shop or local store", icon: Store },
  { name: "Wholesale", description: "Bulk product sales", icon: ShoppingBag },
  { name: "Distribution", description: "Supply and distribution", icon: Truck },
  { name: "Services", description: "Service-based business", icon: BriefcaseBusiness },
  { name: "Other", description: "Something different", icon: Building2 }
];

function Onboarding({ onComplete, onBack, initialDetails }) {
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  const [details, setDetails] = useState({
   businessName: initialDetails?.business || "",
   ownerName: initialDetails?.name || "",
   businessType: "",
   phone: "",
   address: "",
   city: "",
   pincode: "",
   gstin: ""
  });

  function updateField(event) {
    setDetails(previous => ({
      ...previous,
      [event.target.name]: event.target.value
    }));
    setError("");
  }

  function nextStep(event) {
    event.preventDefault();
    setError("");

    if (step === 1) {
      if (!details.businessName.trim() || !details.ownerName.trim()) {
        setError("Please enter your business name and owner name.");
        return;
      }
      if (!details.businessType) {
        setError("Please select your business type.");
        return;
      }
      setStep(2);
      return;
    }

    if (!details.phone.trim() || !details.address.trim() ||
        !details.city.trim() || !details.pincode.trim()) {
      setError("Please complete all required contact and address fields.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(details.phone.trim())) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (!/^\d{6}$/.test(details.pincode.trim())) {
      setError("Enter a valid 6-digit PIN code.");
      return;
    }

    onComplete?.(details);
  }

  return (
    <main className="onboarding-page">
      <div className="onboarding-glow onboarding-glow-one" />
      <div className="onboarding-glow onboarding-glow-two" />

      <header className="onboarding-header">
        <div className="onboarding-brand">
          <span className="onboarding-brand-mark">B</span>
          <span>bizpilot<span>.</span></span>
        </div>
        <span className="onboarding-header-note">BUSINESS SETUP</span>
      </header>

      <div className="onboarding-content">
        <div className="onboarding-intro">
          <span className="onboarding-kicker">LET'S GET YOU STARTED</span>
          <h1>Set up your <em>workspace.</em></h1>
          <p>A few details about your business will help organise your BizPilot workspace.</p>
        </div>

        <div className="onboarding-progress">
          <div className="onboarding-progress-top">
            <span>STEP {step} OF 2</span>
            <span>{step === 1 ? "Business details" : "Contact details"}</span>
          </div>
          <div className="onboarding-progress-track">
            <span style={{ width: step === 1 ? "50%" : "100%" }} />
          </div>
          <div className="onboarding-step-labels">
            <span className={step === 1 ? "current" : "completed"}>
              <CheckCircle2 size={13} /> Business
            </span>
            <span className={step === 2 ? "current" : ""}>
              <MapPin size={13} /> Contact
            </span>
          </div>
        </div>

        <motion.section
          key={step}
          className="onboarding-card"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          {step === 1 ? (
            <>
              <div className="onboarding-card-heading">
                <span className="onboarding-card-icon"><Building2 size={19} /></span>
                <div>
                  <h2>Tell us about your business</h2>
                  <p>Start with the basic information.</p>
                </div>
              </div>

              <form onSubmit={nextStep}>
                <label className="onboarding-field">
                  Business name <span>*</span>
                  <div className="onboarding-input-wrap">
                    <Building2 size={16} />
                    <input
                      name="businessName"
                      value={details.businessName}
                      onChange={updateField}
                      placeholder="e.g. Shree Enterprises"
                    />
                  </div>
                </label>

                <label className="onboarding-field">
                  Owner's full name <span>*</span>
                  <div className="onboarding-input-wrap">
                    <UserRound size={16} />
                    <input
                      name="ownerName"
                      value={details.ownerName}
                      onChange={updateField}
                      placeholder="Enter owner's name"
                    />
                  </div>
                </label>

                <div className="onboarding-field">
                  <span className="onboarding-field-title">What type of business do you run? <span>*</span></span>
                  <div className="onboarding-type-grid">
                    {businessTypes.map(item => {
                      const Icon = item.icon;
                      return (
                        <button
                          type="button"
                          key={item.name}
                          className={`onboarding-type-option ${details.businessType === item.name ? "selected" : ""}`}
                          onClick={() => {
                            setDetails(previous => ({ ...previous, businessType: item.name }));
                            setError("");
                          }}
                        >
                          <Icon size={18} />
                          <span><strong>{item.name}</strong><small>{item.description}</small></span>
                          {details.businessType === item.name && <CheckCircle2 size={15} />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {error && <p className="onboarding-error">{error}</p>}

                <button className="onboarding-primary" type="submit">
                  Continue to contact details <ArrowRight size={16} />
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="onboarding-card-heading">
                <span className="onboarding-card-icon"><MapPin size={19} /></span>
                <div>
                  <h2>Where is your business?</h2>
                  <p>Add contact and location details.</p>
                </div>
              </div>

              <form onSubmit={nextStep}>
                <label className="onboarding-field">
                  Mobile number <span>*</span>
                  <div className="onboarding-input-wrap">
                    <Phone size={16} />
                    <span className="onboarding-country-code">+91</span>
                    <input
                      name="phone"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={details.phone}
                      onChange={updateField}
                      placeholder="10-digit mobile number"
                    />
                  </div>
                </label>

                <label className="onboarding-field">
                  Business address <span>*</span>
                  <div className="onboarding-input-wrap">
                    <MapPin size={16} />
                    <input
                      name="address"
                      value={details.address}
                      onChange={updateField}
                      placeholder="Shop / office address"
                    />
                  </div>
                </label>

                <div className="onboarding-form-row">
                  <label className="onboarding-field">
                    City <span>*</span>
                    <input
                      className="onboarding-plain-input"
                      name="city"
                      value={details.city}
                      onChange={updateField}
                      placeholder="e.g. Mumbai"
                    />
                  </label>

                  <label className="onboarding-field">
                    PIN code <span>*</span>
                    <input
                      className="onboarding-plain-input"
                      name="pincode"
                      inputMode="numeric"
                      maxLength={6}
                      value={details.pincode}
                      onChange={updateField}
                      placeholder="6-digit PIN"
                    />
                  </label>
                </div>

                <label className="onboarding-field">
                  GSTIN <small>(Optional)</small>
                  <div className="onboarding-input-wrap">
                    <FileText size={16} />
                    <input
                      name="gstin"
                      maxLength={15}
                      value={details.gstin}
                      onChange={updateField}
                      placeholder="Enter GSTIN if applicable"
                    />
                  </div>
                </label>

                {error && <p className="onboarding-error">{error}</p>}

                <div className="onboarding-actions">
                  <button type="button" className="onboarding-back" onClick={() => {
                    setStep(1);
                    setError("");
                  }}>
                    <ArrowLeft size={15} /> Back
                  </button>
                  <button className="onboarding-primary" type="submit">
                    Complete setup <ArrowRight size={16} />
                  </button>
                </div>
              </form>
            </>
          )}
        </motion.section>

        <p className="onboarding-footnote">
          <CheckCircle2 size={13} /> You can review your business details later.
        </p>
      </div>

      <footer className="onboarding-footer">
        <span>© 2026 BizPilot · Prototype preview</span>
        <button onClick={onBack}>Back to sign in</button>
      </footer>
    </main>
  );
}

export default Onboarding;
