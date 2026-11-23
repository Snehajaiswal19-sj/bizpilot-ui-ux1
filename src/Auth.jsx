
import { useState } from "react";
import {
  ArrowLeft, ArrowRight, Eye, EyeOff, Mail, Lock,
  UserRound, Building2, CheckCircle2, Sparkles
} from "lucide-react";
import "./Auth.css";

function Auth({ onBack, onSuccess, onRegister }) {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    business: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const isRegister = mode === "register";

  function updateField(event) {
    setForm(previous => ({
      ...previous,
      [event.target.name]: event.target.value
    }));
    setError("");
    setSuccess("");
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    setError("");
    setSuccess("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.email.trim() || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    if (isRegister) {
      if (!form.name.trim() || !form.business.trim()) {
        setError("Please complete your name and business name.");
        return;
      }

      if (form.password.length < 8) {
        setError("Password must contain at least 8 characters.");
        return;
      }

      if (form.password !== form.confirmPassword) {
        setError("Your passwords do not match.");
        return;
      }

      onRegister?.({
        name: form.name,
        business: form.business,
        email: form.email
      });
      return;
    }

    if (form.password.length < 1) {
      setError("Please enter your password.");
      return;
    }

    // Demo-only login. This does not verify a real account.
    onSuccess?.();
  }

  return (
    <main className="auth-page">
      <div className="auth-background-glow auth-glow-one" />
      <div className="auth-background-glow auth-glow-two" />
      <div className="auth-grain" />

      <button className="auth-back-button" onClick={onBack}>
        <ArrowLeft size={15} />
        Back to website
      </button>

      <div className="auth-layout">
        <section className="auth-brand-panel">
          <div className="auth-brand">
            <span className="auth-brand-mark">B</span>
            <span>bizpilot<span className="auth-brand-dot">.</span></span>
          </div>

          <div className="auth-brand-content">
            <span className="auth-overline">
              <Sparkles size={13} /> BUSINESS MANAGEMENT, REIMAGINED
            </span>

            <h1>
              Your business.
              <br />
              <span>In better hands.</span>
            </h1>

            <p>
              Bring your sales, inventory, customers and business
              insights together in one beautifully organised workspace.
            </p>

            <div className="auth-feature-list">
              <div><CheckCircle2 size={16} /> One place for everyday operations</div>
              <div><CheckCircle2 size={16} /> Clear insights into your business</div>
              <div><CheckCircle2 size={16} /> Simple tools that work together</div>
            </div>
          </div>

          <div className="auth-brand-footer">
            <span>BUILT FOR BUSINESSES THAT MOVE FORWARD</span>
            <span>© 2026 BizPilot</span>
          </div>
        </section>

        <section className="auth-form-side">
          <div className="auth-mobile-brand">
            <span className="auth-brand-mark">B</span>
            <span>bizpilot<span className="auth-brand-dot">.</span></span>
          </div>

          <div className="auth-form-card">
            <div className="auth-form-heading">
              <span className="auth-overline">
                {isRegister ? "GET STARTED WITH BIZPILOT" : "WELCOME BACK"}
              </span>

              <h2>{isRegister ? "Create your account." : "Good to see you."}</h2>

              <p>
                {isRegister
                  ? "Set up your account and bring your business into focus."
                  : "Sign in to continue managing your business."}
              </p>
            </div>

            <div className="auth-mode-switch">
              <button
                type="button"
                className={!isRegister ? "active" : ""}
                onClick={() => switchMode("login")}
              >
                Sign in
              </button>
              <button
                type="button"
                className={isRegister ? "active" : ""}
                onClick={() => switchMode("register")}
              >
                Create account
              </button>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              {isRegister && (
                <>
                  <label className="auth-field">
                    Full name
                    <span className="auth-input-wrap">
                      <UserRound size={16} />
                      <input
                        name="name"
                        value={form.name}
                        onChange={updateField}
                        placeholder="Enter your full name"
                        autoComplete="name"
                      />
                    </span>
                  </label>

                  <label className="auth-field">
                    Business name
                    <span className="auth-input-wrap">
                      <Building2 size={16} />
                      <input
                        name="business"
                        value={form.business}
                        onChange={updateField}
                        placeholder="Enter your business name"
                        autoComplete="organization"
                      />
                    </span>
                  </label>
                </>
              )}

              <label className="auth-field">
                Email address
                <span className="auth-input-wrap">
                  <Mail size={16} />
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={updateField}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                </span>
              </label>

              <label className="auth-field">
                Password
                <span className="auth-input-wrap">
                  <Lock size={16} />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={updateField}
                    placeholder={isRegister ? "At least 8 characters" : "Enter your password"}
                    autoComplete={isRegister ? "new-password" : "current-password"}
                    required
                  />
                  <button
                    type="button"
                    className="auth-eye-button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </span>
              </label>

              {!isRegister && (
                <div className="auth-form-options">
                  <label className="auth-remember">
                    <input type="checkbox" />
                    <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="auth-text-button"
                    onClick={() => setError("Password recovery will be available after authentication setup.")}
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {isRegister && (
                <label className="auth-field">
                  Confirm password
                  <span className="auth-input-wrap">
                    <Lock size={16} />
                    <input
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={updateField}
                      placeholder="Re-enter your password"
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      className="auth-eye-button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </span>
                </label>
              )}

              {error && <p className="auth-message auth-error">{error}</p>}
              {success && <p className="auth-message auth-success">{success}</p>}

              <button type="submit" className="auth-submit-button">
                {isRegister ? "Create my account" : "Sign in to BizPilot"}
                <ArrowRight size={16} />
              </button>
            </form>

            <p className="auth-switch-text">
              {isRegister ? "Already have an account?" : "New to BizPilot?"}
              <button onClick={() => switchMode(isRegister ? "login" : "register")}>
                {isRegister ? "Sign in" : "Create an account"}
              </button>
            </p>

            <div className="auth-security-note">
              <Lock size={12} />
              <span>Your business workspace, all in one place.</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Auth;
