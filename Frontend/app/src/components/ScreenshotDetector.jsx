import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

function ScreenshotDetector({ isLoading, onAnalyze }) {
  const [file, setFile] = useState(null);
  const [contextText, setContextText] = useState("");

  const onSubmit = (event) => {
    event.preventDefault();
    if (!file) {
      return;
    }
    onAnalyze(file, contextText);
  };

  const inputStyles =
    "w-full rounded-md border bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900";
  const buttonStyles =
    "inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:focus:ring-offset-gray-900";

  return (
    <section>
      <form onSubmit={onSubmit} className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg font-bold">Screenshot Detector</h3>
          <p className="text-sm text-muted-foreground">Detect fake login pages or brand impersonation.</p>
        </div>

        <div className="grid gap-4">
          <div>
            <label htmlFor="screenshotInput" className="mb-2 block text-sm font-semibold">
              Screenshot File
            </label>
            <input
              id="screenshotInput"
              type="file"
              accept="image/*"
              onChange={(event) => setFile(event.target.files?.[0] || null)}
              className={`${inputStyles} file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/50 dark:file:text-blue-300 dark:hover:file:bg-blue-900`}
            />
            {file ? (
              <p className="mt-2 text-xs text-muted-foreground">Selected: {file.name}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="contextText" className="mb-2 block text-sm font-semibold">
              Optional Context
            </label>
            <textarea
              id="contextText"
              rows={2}
              value={contextText}
              onChange={(event) => setContextText(event.target.value)}
              placeholder="e.g., from a WhatsApp message..."
              className={`${inputStyles} resize-y`}
            />
          </div>

          <div>
            <button type="submit" disabled={isLoading || !file} className={buttonStyles}>
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                <div className="inline-flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </svg>
                  Analyze Screenshot
                </div>
              )}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}

export default ScreenshotDetector;
