"use client";

import { useMemo, useState, type ReactNode } from "react";

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

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function StepPill({
  step,
  title,
  subtitle,
}: {
  step: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-semibold tracking-wide text-slate-600">
          {step}
        </span>
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      </div>
      {subtitle ? <p className="text-xs text-slate-500">{subtitle}</p> : null}
    </div>
  );
}

function Panel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cx(
        "rounded-2xl border border-slate-200 bg-white shadow-sm",
        className,
      )}
    >
      {children}
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  helper,
  required,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  helper?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-slate-900">{label}</label>
        {required ? (
          <span className="text-xs font-semibold text-red-600">Required</span>
        ) : null}
      </div>

      <input
        className={cx(
          "w-full rounded-xl border bg-white px-4 py-3 text-slate-900 outline-none transition",
          "focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10",
          disabled
            ? "border-slate-200 opacity-60"
            : "border-slate-200",
        )}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        disabled={disabled}
      />

      {helper ? <p className="text-xs text-slate-500">{helper}</p> : null}
    </div>
  );
}

export default function Page() {
  const [baseUrl, setBaseUrl] = useState("https://example.com/landing");
  const [utmSource, setUtmSource] = useState("google");
  const [utmMedium, setUtmMedium] = useState("cpc");
  const [utmCampaign, setUtmCampaign] = useState("spring_sale");
  const [utmTerm, setUtmTerm] = useState("");
  const [utmContent, setUtmContent] = useState("");
  const [copied, setCopied] = useState(false);

  const parsed = useMemo(() => safeUrl(baseUrl), [baseUrl]);
  const isValid = !!parsed;

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

  const step2Enabled = isValid;
  const step3Enabled = isValid;

  async function onCopy() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 900);
  }

  const activeStep = !isValid ? 1 : 3;

  return (
    <main className="min-h-screen bg-slate-50">
      {/* TapClicks-style top bar */}
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500">
                TapClicks • Transformation Hub
              </p>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                  UTM Studio
                </h1>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-semibold text-slate-600">
                  v0
                </span>
              </div>
              <p className="text-sm text-slate-600">
                Build a trackable campaign link in three steps — consistent inputs now,
                cleaner reporting later.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={onCopy}
                disabled={!output}
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600"
              >
                {copied ? "Copied" : "Copy link"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* App body */}
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left rail / steps */}
          <aside className="lg:col-span-3">
            <Panel className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Workflow
              </p>

              <div className="mt-4 space-y-2">
                <StepRow
                  n={1}
                  title="Destination"
                  active={activeStep === 1}
                  done={isValid}
                  note="Set the landing URL"
                />
                <StepRow
                  n={2}
                  title="Attribution"
                  active={activeStep === 2}
                  done={isValid}
                  note="Define source/medium/campaign"
                  disabled={!step2Enabled}
                />
                <StepRow
                  n={3}
                  title="Share & Track"
                  active={activeStep === 3}
                  done={!!output}
                  note="Copy the final link"
                  disabled={!step3Enabled}
                />
              </div>

              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-semibold text-slate-700">Why this matters</p>
                <p className="mt-1 text-xs text-slate-600">
                  Consistent UTMs make filtering, grouping, and calculated analysis easier later
                  across channels and platforms.
                </p>
              </div>
            </Panel>
          </aside>

          {/* Main inputs */}
          <div className="space-y-6 lg:col-span-6">
            <Panel className="p-5 sm:p-6">
              <StepPill
                step="Step 1"
                title="Destination"
                subtitle="Where should the visitor land? Paste the final destination URL."
              />

              <div className="mt-4 space-y-2">
                <label className="text-sm font-medium text-slate-900">Base URL</label>
                <input
                  className={cx(
                    "w-full rounded-xl border bg-white px-4 py-3 text-slate-900 outline-none transition",
                    "focus:ring-4 focus:ring-blue-600/10",
                    isValid
                      ? "border-slate-200 focus:border-blue-600"
                      : "border-red-300 focus:border-red-500 focus:ring-red-500/10",
                  )}
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="https://example.com/landing"
                  spellCheck={false}
                />

                {!isValid ? (
                  <p className="text-sm text-red-600">
                    Confirm the URL format (example: https://example.com).
                  </p>
                ) : (
                  <p className="text-xs text-slate-500">
                    Next: define how this traffic should be attributed in analytics.
                  </p>
                )}
              </div>
            </Panel>

            <Panel className={cx("p-5 sm:p-6", !step2Enabled && "opacity-60")}>
              <StepPill
                step="Step 2"
                title="Attribution"
                subtitle="Define who/what gets credit in analytics."
              />

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field
                  label="utm_source"
                  value={utmSource}
                  onChange={setUtmSource}
                  placeholder="google"
                  helper="e.g. google, meta, linkedin (lowercase)"
                  required
                  disabled={!step2Enabled}
                />
                <Field
                  label="utm_medium"
                  value={utmMedium}
                  onChange={setUtmMedium}
                  placeholder="cpc"
                  helper="e.g. cpc, paid_social, email"
                  required
                  disabled={!step2Enabled}
                />
                <div className="sm:col-span-2">
                  <Field
                    label="utm_campaign"
                    value={utmCampaign}
                    onChange={setUtmCampaign}
                    placeholder="spring_sale"
                    helper="e.g. product_launch_q1"
                    required
                    disabled={!step2Enabled}
                  />
                </div>
                <Field
                  label="utm_term (optional)"
                  value={utmTerm}
                  onChange={setUtmTerm}
                  placeholder="running_shoes"
                  helper="Use for paid keywords when relevant."
                  disabled={!step2Enabled}
                />
                <Field
                  label="utm_content (optional)"
                  value={utmContent}
                  onChange={setUtmContent}
                  placeholder="ad_variant_a"
                  helper="Use to distinguish creative/variant."
                  disabled={!step2Enabled}
                />
              </div>

              {!step2Enabled ? (
                <p className="mt-4 text-sm text-slate-600">
                  Add a valid Base URL above to enable attribution fields.
                </p>
              ) : null}
            </Panel>
          </div>

          {/* Right output */}
          <div className="lg:col-span-3">
            <Panel className="p-5 sm:p-6 lg:sticky lg:top-24">
              <StepPill
                step="Step 3"
                title="Share & Track"
                subtitle="Use this in ads, email, social, or partner links."
              />

              <div className="mt-4 space-y-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-semibold text-slate-700">Your trackable link</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Auto-updates as you edit inputs. Copy when ready.
                  </p>
                </div>

                <textarea
                  className="w-full min-h-[160px] rounded-xl border border-slate-200 bg-white p-4 font-mono text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                  value={output}
                  readOnly
                  placeholder="Enter a valid Base URL to generate the UTM link."
                />

                <button
                  onClick={onCopy}
                  disabled={!output}
                  className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600"
                >
                  {copied ? "Copied to clipboard" : "Copy link"}
                </button>

                <div className="text-xs text-slate-500">
                  Built by Angshuman •{" "}
                  <span className="text-slate-400">Deployed on Vercel</span>
                </div>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </main>
  );
}

function StepRow({
  n,
  title,
  note,
  active,
  done,
  disabled,
}: {
  n: number;
  title: string;
  note: string;
  active?: boolean;
  done?: boolean;
  disabled?: boolean;
}) {
  return (
    <div
      className={cx(
        "rounded-xl border p-3 transition",
        disabled
          ? "border-slate-200 bg-white opacity-60"
          : active
            ? "border-blue-200 bg-blue-50"
            : "border-slate-200 bg-white",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-0.5">
          <p className="text-sm font-semibold text-slate-900">
            {n}. {title}
          </p>
          <p className="text-xs text-slate-600">{note}</p>
        </div>

        <span
          className={cx(
            "rounded-full px-2 py-0.5 text-xs font-semibold",
            done ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600",
          )}
        >
          {done ? "Done" : active ? "Now" : "Next"}
        </span>
      </div>
    </div>
  );
}
