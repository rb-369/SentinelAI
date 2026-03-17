function UserDashboard({ user, onLogout }) {
  return (
    <section className="mb-8 rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Welcome back, <span className="font-semibold text-primary">{user.name}</span>
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {user.email} | Segment: {user.userType || "other"} | Location: {user.location || "Not set"}
          </p>
        </div>

        <button
          onClick={onLogout}
          className="inline-flex items-center justify-center rounded-md border border-input bg-transparent px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          Logout
        </button>
      </div>
    </section>
  );
}

export default UserDashboard;
