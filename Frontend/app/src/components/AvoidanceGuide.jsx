function AvoidanceGuide({ guide }) {
  if (!guide) return null;

  return (
    <section className="mb-8 rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800">Guide: How To Avoid Cyber Attacks</h3>
      <p className="mt-1 text-sm text-slate-600">{guide.title}</p>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {(guide.sections || []).map((section) => (
          <article key={section.heading} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <h4 className="text-sm font-bold uppercase tracking-wide text-slate-700">{section.heading}</h4>
            <ul className="mt-2 space-y-1 text-sm text-slate-700">
              {(section.tips || []).map((tip, index) => (
                <li key={`${tip}-${index}`} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-600" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

export default AvoidanceGuide;
