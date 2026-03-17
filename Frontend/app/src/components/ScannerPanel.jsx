import { useMemo, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

const PLACEHOLDER_BY_TYPE = {
  url: "Paste a suspicious URL or link here...",
  message: "Paste a suspicious email, SMS, or WhatsApp message here...",
  prompt: "Paste a suspicious AI prompt or chat message here...",
};

const TypeIcon = ({ type }) => {
  if (type === "url") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10 14 8 16a3 3 0 1 1-4-4l2-2" />
        <path d="m14 10 2-2a3 3 0 1 1 4 4l-2 2" />
        <path d="m9 15 6-6" />
      </svg>
    );
  }

  if (type === "prompt") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2v4" />
        <path d="m19.1 4.9-2.8 2.8" />
        <path d="M22 12h-4" />
        <path d="m19.1 19.1-2.8-2.8" />
        <path d="M12 22v-4" />
        <path d="m4.9 19.1 2.8-2.8" />
        <path d="M2 12h4" />
        <path d="m4.9 4.9 2.8 2.8" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 5h16v12H4z" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
};

function ScannerPanel({ inputType, setInputType, isLoading, onAnalyze }) {
  const [inputValue, setInputValue] = useState("");

  const placeholder = useMemo(() => PLACEHOLDER_BY_TYPE[inputType], [inputType]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onAnalyze(inputValue);
  };

  const inputStyles =
    "w-full rounded-md border bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900";
  const buttonStyles =
    "inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:focus:ring-offset-gray-900";

  return (
    <section>
      <form onSubmit={handleSubmit} className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg font-bold">Text & URL Scanner</h3>
          <p className="text-sm text-muted-foreground">Analyze suspicious text, URLs, or prompts.</p>
        </div>

        <div className="grid gap-4">
          <div>
            <label htmlFor="inputType" className="mb-2 block text-sm font-semibold">
              Input Type
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <TypeIcon type={inputType} />
              </div>
              <select
                id="inputType"
                value={inputType}
                onChange={(event) => setInputType(event.target.value)}
                className={`${inputStyles} appearance-none pl-10`}
              >
                <option value="url">URL</option>
                <option value="message">Email/Message</option>
                <option value="prompt">Prompt Text</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="threatInput" className="mb-2 block text-sm font-semibold">
              Suspicious Content
            </label>
            <textarea
              id="threatInput"
              rows={5}
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder={placeholder}
              className={`${inputStyles} resize-y`}
            />
          </div>

          <div>
            <button type="submit" disabled={isLoading} className={buttonStyles}>
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                <div className="inline-flex items-center gap-2">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="m12 3 4 6-4 6-4-6 4-6Z" />
                    <path d="m12 15 3 6" />
                    <path d="m12 15-3 6" />
                  </svg>
                  Analyze Threat
                </div>
              )}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}

export default ScannerPanel;
