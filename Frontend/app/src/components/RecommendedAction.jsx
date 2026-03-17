function RecommendedAction({ action, guidance = [] }) {
  return (
    <section className="mt-6">
      <h3 className="text-base font-bold">Recommended Action</h3>
      <div className="mt-2 rounded-xl border-l-4 border-amber-500 bg-amber-500/10 p-4">
        <div className="flex items-start gap-3">
          <svg
            viewBox="0 0 24 24"
            className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2 4 5v6c0 5.2 3.4 9.9 8 11 4.6-1.1 8-5.8 8-11V5l-8-3Z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          <div>
            <p className="text-base font-semibold text-amber-900 dark:text-amber-200">
              {action || "Do not engage. Report this content to your security team."}
            </p>

            {guidance.length ? (
              <ul className="mt-3 space-y-1 text-sm text-amber-800 dark:text-amber-300">
                {guidance.map((tip, index) => (
                  <li key={`${tip}-${index}`} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-600 dark:bg-amber-400" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export default RecommendedAction;
