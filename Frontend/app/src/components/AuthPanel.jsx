import { useState } from "react";

const USER_TYPES = [
  { label: "Student", value: "student" },
  { label: "Office Employee", value: "office employee" },
  { label: "Online Shopper", value: "online shopper" },
  { label: "Security Analyst", value: "security analyst" },
  { label: "Other", value: "other" },
];

function AuthPanel({ onLogin, onRegister, isLoading }) {
  const [mode, setMode] = useState("login");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    userType: "student",
    location: "",
  });

  const submitLogin = (event) => {
    event.preventDefault();
    onLogin(loginData);
  };

  const submitRegister = (event) => {
    event.preventDefault();
    onRegister(registerData);
  };

  const inputStyles =
    "w-full rounded-md border bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900";
  const buttonStyles =
    "inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:focus:ring-offset-gray-900";

  return (
    <section className="rounded-2xl border border-cyan-100 bg-white/85 p-6 shadow-lg shadow-cyan-900/5 backdrop-blur-md">
      <div className="mb-5 flex items-center gap-3">
        <img src="/logo.png" alt="sentinelAI logo" className="h-10 w-10 rounded-xl border border-cyan-100 bg-white p-1" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">sentinelAI Access</p>
          <p className="text-sm text-slate-600">Secure sign in to your threat intelligence dashboard.</p>
        </div>
      </div>

      <div className="mb-6 flex gap-2 rounded-xl bg-slate-100 p-1">
        <button
          onClick={() => setMode("login")}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold transition-all duration-200 ${
            mode === "login"
              ? "bg-white text-cyan-700 shadow-sm"
              : "text-slate-600"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setMode("register")}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold transition-all duration-200 ${
            mode === "register"
              ? "bg-white text-cyan-700 shadow-sm"
              : "text-slate-600"
          }`}
        >
          Register
        </button>
      </div>

      {mode === "login" ? (
        <form onSubmit={submitLogin} className="grid gap-4">
          <input
            type="email"
            value={loginData.email}
            onChange={(event) => setLoginData((prev) => ({ ...prev, email: event.target.value }))}
            placeholder="Email"
            className={inputStyles}
            required
          />
          <input
            type="password"
            value={loginData.password}
            onChange={(event) => setLoginData((prev) => ({ ...prev, password: event.target.value }))}
            placeholder="Password"
            className={inputStyles}
            required
          />
          <button type="submit" disabled={isLoading} className={buttonStyles}>
            {isLoading ? "Signing in..." : "Login"}
          </button>
        </form>
      ) : (
        <form onSubmit={submitRegister} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input
            type="text"
            value={registerData.name}
            onChange={(event) => setRegisterData((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="Full Name"
            className={`${inputStyles} sm:col-span-2`}
            required
          />
          <input
            type="email"
            value={registerData.email}
            onChange={(event) => setRegisterData((prev) => ({ ...prev, email: event.target.value }))}
            placeholder="Email"
            className={inputStyles}
            required
          />
          <input
            type="password"
            value={registerData.password}
            onChange={(event) => setRegisterData((prev) => ({ ...prev, password: event.target.value }))}
            placeholder="Password"
            className={inputStyles}
            required
          />
          <select
            value={registerData.userType}
            onChange={(event) => setRegisterData((prev) => ({ ...prev, userType: event.target.value }))}
            className={inputStyles}
          >
            {USER_TYPES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={registerData.location}
            onChange={(event) => setRegisterData((prev) => ({ ...prev, location: event.target.value }))}
            placeholder="Location (e.g., Mumbai)"
            className={inputStyles}
            required
          />
          <button type="submit" disabled={isLoading} className={`${buttonStyles} sm:col-span-2`}>
            {isLoading ? "Creating account..." : "Register"}
          </button>
        </form>
      )}
    </section>
  );
}

export default AuthPanel;
