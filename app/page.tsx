"use client";

import { useMemo, useState } from "react";

function safeUrl(base: string) {
  try {
    return new URL(base);
  } catch {
    return null;
  }
}

function applyParams(url: URL, params: Record<string, string>) {
  const sp = url.searchParams;
  for (const [k, v] of Object.entries(params)) {
    const val = (v ?? "").trim();
    if (val) sp.set(k, val);
    else sp.delete(k);
  }
  url.search = sp.toString();
  return url.toString();
}

export default function Page() {
  const [baseUrl, setBaseUrl] = useState("https://example.com/landing");
  const [utmSource, setUtmSource] = useState("google");
  const [utmMedium, setUtmMedium] = useState("cpc");
  const [utmCampaign, setUtmCampaign] = useState("spring_sale");
  const [utmTerm, setUtmTerm] = useState("");
  const [utmContent, setUtmContent] = useState("");
  const [copied, setCopied] = useState(false);

  const isValid = useMemo(() => !!safeUrl(baseUrl), [baseUrl]);

  const output = useMemo(() => {
    const u = safeUrl(baseUrl);
    if (!u) return "";
    return applyParams(u, {
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      utm_term: utmTerm,
      utm_content: utmContent,
    });
  }, [baseUrl, utmSource, utmMedium, utmCampaign, utmTerm, utmContent]);

  async function onCopy() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 900);
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl p-6 sm:p-10 space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            UTM Builder
          </h1>
          <p className="text-gray-600">
            Generate clean, consistent UTM links for campaigns. Built for
            marketers + agencies.
          </p>
        </header>

        <section className="rounded-2xl border p-5 sm:p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium">Base URL</label>
            <input
              className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black/10"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://example.com/landing"
            />
            {!isValid && (
              <p className="text-sm text-red-600">
                Please enter a valid URL (example: https://example.com).
              </p>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field
              label="utm_source"
              value={utmSource}
              onChange={setUtmSource}
              placeholder="google"
              required
            />
            <Field
              label="utm_medium"
              value={utmMedium}
              onChange={setUtmMedium}
              placeholder="cpc"
              required
            />
            <Field
              label="utm_campaign"
              value={utmCampaign}
              onChange={setUtmCampaign}
              placeholder="spring_sale"
              required
            />
            <Field
              label="utm_term (optional)"
              value={utmTerm}
              onChange={setUtmTerm}
              placeholder="running_shoes"
            />
            <Field
              label="utm_content (optional)"
              value={utmContent}
              onChange={setUtmContent}
              placeholder="ad_variant_a"
            />
          </div>
        </section>

        <section className="rounded-2xl border p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Output</h2>
            <button
              onClick={onCopy}
              disabled={!output}
              className="rounded-xl border px-4 py-2 text-sm font-semibold disabled:opacity-40 hover:bg-gray-50"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <textarea
            className="w-full min-h-[120px] rounded-xl border p-4 font-mono text-sm outline-none focus:ring-2 focus:ring-black/10"
            value={output}
            readOnly
            placeholder="Enter a valid Base URL to generate the UTM link."
          />

          <p className="text-xs text-gray-500">
            Tip: Use consistent naming conventions (lowercase, underscores) to
            keep reporting clean.
          </p>
        </section>

        <footer className="text-xs text-gray-500">
          Built by Angshuman • Deployed on Vercel
        </footer>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </label>
      <input
        className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black/10"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
