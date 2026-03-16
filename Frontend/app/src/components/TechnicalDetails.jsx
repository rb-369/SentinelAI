function Field({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm text-slate-700">{value || "Not specified"}</p>
    </div>
  );
}

function TechnicalDetails({ technicalDetails = {} }) {
  return (
    <section className="mt-6">
      <details className="group rounded-xl border border-slate-200 bg-slate-50 p-4">
        <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-slate-700">
          Technical Details (for security teams)
          <span className="rounded-md bg-slate-200 px-2 py-0.5 text-xs text-slate-600 transition-all duration-200 group-open:bg-indigo-100 group-open:text-indigo-700">
            Expand
          </span>
        </summary>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Field label="Attack Vector" value={technicalDetails.attackVector} />
          <Field label="Targeted Vulnerability" value={technicalDetails.targetedVulnerability} />
          <Field label="MITRE ATT&CK Technique" value={technicalDetails.mitreTechnique} />
        </div>
      </details>
    </section>
  );
}

export default TechnicalDetails;
