function Field({ label, value }) {
  return (
    <div className="rounded-lg border bg-card p-3 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 truncate text-sm text-foreground">{value || "Not specified"}</p>
    </div>
  );
}

function TechnicalDetails({ technicalDetails = {} }) {
  return (
    <section className="mt-6">
      <details className="group rounded-xl border bg-gray-50 p-4 dark:bg-gray-800/50">
        <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-foreground">
          Technical Details (for security teams)
          <span className="rounded-md bg-gray-200 px-2 py-0.5 text-xs text-gray-600 transition-all duration-200 group-open:bg-blue-100 group-open:text-blue-700 dark:bg-gray-700 dark:text-gray-300 dark:group-open:bg-blue-900/50 dark:group-open:text-blue-300">
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
