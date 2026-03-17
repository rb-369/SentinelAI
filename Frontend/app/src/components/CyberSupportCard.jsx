import { useState } from "react";

function CyberSupportCard({ defaultLocation = "", supportData, isLoading, onFetch }) {
  const [location, setLocation] = useState(defaultLocation);

  const submitLocation = (event) => {
    event.preventDefault();
    onFetch(location);
  };

  return (
    <section className="mb-8 rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800">Cyber Support & Reporting System</h3>

      <form onSubmit={submitLocation} className="mt-4 flex flex-col gap-3 md:flex-row">
        <input
          type="text"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          placeholder="Enter your location (e.g., Mumbai)"
          className="flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? "Finding support..." : "Find Cyber Support"}
        </button>
      </form>

      {supportData ? (
        <div className="mt-4 space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <p className="font-semibold text-slate-800">Nearest Cyber Crime Support</p>
          <p>
            <span className="font-semibold">Station:</span> {supportData.nearestSupport?.station}
          </p>
          <p>
            <span className="font-semibold">Contact Number:</span> {supportData.nearestSupport?.contactNumber}
          </p>
          <p>
            <span className="font-semibold">Reporting Website:</span> {supportData.nearestSupport?.reportingWebsite}
          </p>
          <p>
            <span className="font-semibold">Address:</span> {supportData.nearestSupport?.address}
          </p>

          <div>
            <p className="font-semibold text-slate-800">Steps to file a cybercrime complaint</p>
            <ul className="mt-2 space-y-1">
              {(supportData.complaintSteps || []).map((step, index) => (
                <li key={`${step}-${index}`} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-600" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default CyberSupportCard;
