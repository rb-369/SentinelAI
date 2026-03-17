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
    <section className="rounded-xl border bg-card p-6 shadow-lg dark:shadow-blue-500/10">
      <div className="mb-6 flex gap-2 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
        <button
          onClick={() => setMode("login")}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold transition-all duration-200 ${
            mode === "login"
              ? "bg-white text-blue-700 shadow-sm dark:bg-gray-700 dark:text-white"
              : "text-gray-600 dark:text-gray-300"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setMode("register")}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold transition-all duration-200 ${
            mode === "register"
              ? "bg-white text-blue-700 shadow-sm dark:bg-gray-700 dark:text-white"
              : "text-gray-600 dark:text-gray-300"
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
