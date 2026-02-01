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
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl p-6 sm:p-10 space-y-8">
        {/* Top “app header” */}
        <header className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
              UTM Studio
            </h1>
            <p className="text-slate-600">
              Build a trackable campaign link in three steps — consistent inputs now,
              cleaner reporting later.
            </p>
          </div>


        </header>


        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-5">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Step 1 — Destination
            </p>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900">Base URL</label>
              <p className="text-xs text-slate-500">
                Where should the visitor land? Paste the final destination URL.
              </p>

              <input
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-500"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://example.com/landing"
              />
              {!isValid && (
                <p className="text-sm text-red-600">

                  Please enter a valid URL (example: https://example.com).
                </p>

              )}
              {isValid && (
                <p className="text-xs text-slate-500">
                  Next, define how this traffic should be attributed.
                </p>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Step 2 — Attribution
                </p>
                <p className="text-xs text-slate-500">
                  Define who/what gets credit in analytics.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">


                <Field
                  label="utm_source"
                  value={utmSource}
                  onChange={setUtmSource}
                  placeholder="google"
                  helper="e.g. google, meta, linkedin (lowercase)"
                  required
                />

                <Field
                  label="utm_medium"
                  value={utmMedium}
                  onChange={setUtmMedium}
                  placeholder="cpc"
                  helper="e.g. cpc, paid_social, email"
                  required
                />

                <Field
                  label="utm_campaign"
                  value={utmCampaign}
                  onChange={setUtmCampaign}
                  placeholder="spring_sale"
                  helper="e.g. product_launch_q1"
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
            </div>
          </div>

        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Step 3 — Share & Track
              </p>
              <h2 className="text-lg font-semibold text-slate-900">Your Trackable Link</h2>
              <p className="text-xs text-slate-500">
                Use this in ads, email, social, or partner links.
              </p>
            </div>

            <button
              onClick={onCopy}
              disabled={!output}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600"
            >
              {copied ? "Copied" : "Copy link"}
            </button>
          </div>

          <textarea
            className="w-full min-h-[120px] rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm text-slate-900 outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-500"
            value={output}
            readOnly
            placeholder="Enter a valid Base URL to generate the UTM link."
          />
          <p className="text-xs text-slate-500">
            Consistent UTMs make filtering, grouping, and calculated analysis far easier later
            (especially across channels and platforms).
          </p>
        </section>


        <footer className="text-xs text-slate-500 flex items-center justify-between">
          <span>Built by Angshuman</span>
          <span className="hidden sm:inline">Deployed on Vercel</span>
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
  helper,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  helper?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </label>
      <input
        className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black/10"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {helper ? <p className="text-xs text-gray-500">{helper}</p> : null}
    </div>
  );
}

