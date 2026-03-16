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

  return (
    <section className="mb-8">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-3xl rounded-xl border border-slate-100 bg-white p-6 shadow-sm"
      >
        <div className="mb-4 grid gap-4 md:grid-cols-3 md:items-end">
          <div className="md:col-span-1">
            <label htmlFor="inputType" className="mb-2 block text-sm font-semibold text-slate-700">
              Input Type
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                <TypeIcon type={inputType} />
              </div>
              <select
                id="inputType"
                value={inputType}
                onChange={(event) => setInputType(event.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="url">URL</option>
                <option value="message">Email/Message</option>
                <option value="prompt">Prompt Text</option>
              </select>
            </div>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m12 3 4 6-4 6-4-6 4-6Z" />
                <path d="m12 15 3 6" />
                <path d="m12 15-3 6" />
              </svg>
              Analyze Threat
            </button>
          </div>
        </div>

        <label htmlFor="threatInput" className="mb-2 block text-sm font-semibold text-slate-700">
          Suspicious Content
        </label>
        <textarea
          id="threatInput"
          rows={6}
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder={placeholder}
          className="w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />

        {isLoading ? <LoadingSpinner /> : null}
      </form>
    </section>
  );
}

export default ScannerPanel;
