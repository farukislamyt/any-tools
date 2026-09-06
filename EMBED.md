# Embed AnyTools calculators

AnyTools calculators can be embedded on another website with either a normal iframe or the optional lightweight `embed.js` helper. The calculator remains hosted and updated by AnyTools while the other site only owns the container.

## 1. Direct iframe — recommended starting point

```html
<iframe
  src="https://YOUR-ANYTOOLS-DOMAIN/embed/metal-weight"
  title="AnyTools Steel Weight Calculator"
  loading="lazy"
  style="display:block;width:100%;min-height:560px;border:0;border-radius:16px;"
></iframe>
```

Replace `YOUR-ANYTOOLS-DOMAIN` with the production AnyTools domain after deployment.

### Theme and prefilled values

The metal widget accepts safe URL parameters:

- `theme=light` or `theme=dark`
- `family=ISMB`
- `designation=ISMB%20200`
- `length=6`
- `quantity=10`

Example:

```html
<iframe
  src="https://YOUR-ANYTOOLS-DOMAIN/embed/metal-weight?theme=light&family=ISMB&designation=ISMB%20200&length=6&quantity=10"
  title="AnyTools Steel Weight Calculator"
  loading="lazy"
  style="display:block;width:100%;min-height:560px;border:0;border-radius:16px;"
></iframe>
```

## 2. Optional JavaScript helper

For publishers who prefer one small script tag, AnyTools provides `/embed.js`. It creates the iframe and automatically applies the widget's height messages.

```html
<script
  src="https://YOUR-ANYTOOLS-DOMAIN/embed.js"
  data-calculator="metal-weight"
  data-theme="light"
  data-family="ISMB"
  data-designation="ISMB 200"
  data-length="6"
  data-quantity="10"
  data-title="AnyTools Steel Weight Calculator"
  data-height="560px">
</script>
```

The helper validates both the iframe `contentWindow` and the iframe origin before applying resize messages. The widget also derives a specific parent origin from `document.referrer` when available instead of always broadcasting resize messages to `*`. This follows the browser security guidance for `postMessage`. citeturn0search0turn0search6

## WordPress / Webflow / Wix / Squarespace

Use a **Custom HTML**, **Embed**, or equivalent HTML block and paste either the iframe or script snippet. The iframe method is the most portable because cross-origin iframe communication is explicitly supported through `postMessage`. citeturn0search1

## Recommended production architecture

1. Keep the full calculator UI on AnyTools.
2. Give every embeddable calculator a dedicated `/embed/<slug>` route with no site navigation.
3. Keep deterministic calculations client-side where practical.
4. Use URL parameters only for non-secret configuration and safe defaults.
5. Use `postMessage` for optional height synchronization.
6. If a paid white-label tier is introduced, authenticate usage server-side with an embed token or account ID. Never put a secret API key in browser JavaScript.
7. Keep the normal calculator page canonical and mark embed routes `noindex`.
8. For production hardening, use CSP `frame-ancestors` if AnyTools later needs to restrict which publisher origins may embed a particular widget. citeturn0search12

## Why iframe first

An iframe isolates the calculator from the host site's CSS and JavaScript and works across unrelated websites. A JavaScript SDK can be added later for advanced callbacks, analytics, richer theming, and event APIs. Cross-origin pages cannot directly inspect each other's DOM, so `postMessage` is the standard browser mechanism for controlled communication. citeturn0search1turn0search4

## Responsive host wrapper

```html
<div style="width:100%;max-width:760px;margin:auto;">
  <iframe
    src="https://YOUR-ANYTOOLS-DOMAIN/embed/metal-weight?theme=light"
    title="AnyTools Steel Weight Calculator"
    loading="lazy"
    style="display:block;width:100%;height:560px;border:0;border-radius:16px;"
  ></iframe>
</div>
```

## Engineering-data rule

Standard-section mass values are reference data for estimation. For procurement, fabrication, certification or structural design, users should verify the applicable current standard and supplier/mill data. Do not market the widget as a substitute for certified engineering documentation.

## Next calculators

Use the same pattern for future tools:

```text
AnyTools
├── /tools/calculator
├── /tools/metal-weight
├── /embed/metal-weight
├── /embed/calculator
└── /embed.js
```

The next implementation step can turn `/embed.js` into a generic version that supports every AnyTools calculator through the same `data-calculator="<slug>"` interface.
