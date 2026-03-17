function UserDashboard({ user, onLogout }) {
  return (
    <section className="mb-8 rounded-2xl border border-cyan-100 bg-white/85 p-6 shadow-lg shadow-cyan-900/5 backdrop-blur-md">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-slate-600">
            Welcome back, <span className="font-semibold text-cyan-700">{user.name}</span>
          </p>
          <p className="text-xs text-slate-500">
            {user.email} | Segment: {user.userType || "other"} | Location: {user.location || "Not set"}
          </p>
        </div>

        <button
          onClick={onLogout}
          className="inline-flex items-center justify-center rounded-xl border border-cyan-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-cyan-50 hover:text-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-300"
        >
          Logout
        </button>
      </div>
    </section>
  );
}

export default UserDashboard;
