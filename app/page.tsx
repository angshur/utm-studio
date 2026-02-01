"use client";

import { useMemo, useState } from "react";

function buildUtmUrl(baseUrl: string, params: Record<string, string>) {
  try {
    const url = new URL(baseUrl);
    const sp = url.searchParams;

    Object.entries(params).forEach(([k, v]) => {
      const val = v?.trim();
      if (val) sp.set(k, val);
      else sp.delete(k);
    });

    url.search = sp.toString();
    return url.toString();
  } catch {
    return "";
  }
}

export default function Page() {
  const [baseUrl, setBaseUrl] = useState("https://example.com/landing");
  const [utmSource, setUtmSource] = useState("google");
  const [utmMedium, setUtmMedium] = useState("cpc");
  const [utmCampaign, setUtmCampaign] = useState("spring_sale");
  const [utmContent, setUtmContent] = useState("");

  const finalUrl = useMemo(
    () =>
      buildUtmUrl(baseUrl, {
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        utm_content: utmContent,
      }),
    [baseUrl, utmSource, utmMedium, utmCampaign, utmContent]
  );

  const canCopy = finalUrl.length > 0;

  async function onCopy() {
    if (!canCopy) return;
    await navigator.clipboard.writeText(finalUrl);
    alert("Copied!");
  }

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold">UTM Builder (v0)</h1>
        <p className="text-muted-foreground">
          Generate consistent UTM links fast. No login. No fluff.
        </p>
      </header>

      <div className="grid gap-4">
        <label className="grid gap-2">
          <span className="font-medium">Base URL</span>
          <input
            className="border rounded-lg p-3"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="https://example.com/"
          />
        </label>

        <label className="grid gap-2">
          <span className="font-medium">utm_source</span>
          <input
            className="border rounded-lg p-3"
            value={utmSource}
            onChange={(e) => setUtmSource(e.target.value)}
            placeholder="google"
          />
        </label>

        <label className="grid gap-2">
          <span className="font-medium">utm_medium</span>
          <input
            className="border rounded-lg p-3"
            value={utmMedium}
            onChange={(e) => setUtmMedium(e.target.value)}
            placeholder="cpc"
          />
        </label>

        <label className="grid gap-2">
          <span className="font-medium">utm_campaign</span>
          <input
            className="border rounded-lg p-3"
            value={utmCampaign}
            onChange={(e) => setUtmCampaign(e.target.value)}
            placeholder="spring_sale"
          />
        </label>

        <label className="grid gap-2">
          <span className="font-medium">utm_content (optional)</span>
          <input
            className="border rounded-lg p-3"
            value={utmContent}
            onChange={(e) => setUtmContent(e.target.value)}
            placeholder="ad_variant_a"
          />
        </label>

        <label className="grid gap-2">
          <span className="font-medium">Output URL</span>
          <input
            className="border rounded-lg p-3 font-mono"
            value={finalUrl}
            readOnly
          />
        </label>

        <button
          onClick={onCopy}
          disabled={!canCopy}
          className={`rounded-lg px-4 py-3 font-semibold border ${
            canCopy ? "hover:bg-gray-50" : "opacity-50 cursor-not-allowed"
          }`}
        >
          Copy URL
        </button>
      </div>
    </main>
  );
}
