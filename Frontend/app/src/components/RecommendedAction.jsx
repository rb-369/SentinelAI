function RecommendedAction({ action }) {
  return (
    <section className="mt-6 rounded-xl border-l-4 border-orange-500 bg-orange-50 p-4">
      <div className="flex items-start gap-3">
        <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 text-orange-600" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2 4 5v6c0 5.2 3.4 9.9 8 11 4.6-1.1 8-5.8 8-11V5l-8-3Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-orange-700">What To Do</h3>
          <p className="mt-1 text-base font-semibold text-orange-900">
            {action || "Do not engage. Report this content to your security team."}
          </p>
        </div>
      </div>
    </section>
  );
}

export default RecommendedAction;
