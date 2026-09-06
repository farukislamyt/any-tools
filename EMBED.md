# Embed AnyTools calculators

AnyTools calculators can be embedded on another website with a normal iframe. This is the simplest cross-platform approach because the calculator remains hosted and updated by AnyTools while the other site only owns the iframe container.

## Metal Weight Calculator

Use:

```html
<iframe
  src="https://YOUR-ANYTOOLS-DOMAIN/embed/metal-weight"
  title="AnyTools Steel Weight Calculator"
  loading="lazy"
  style="width:100%;min-height:560px;border:0;border-radius:16px;"
></iframe>
```

Replace `YOUR-ANYTOOLS-DOMAIN` with the production AnyTools domain after deployment.

### Theme parameter

```html
<iframe
  src="https://YOUR-ANYTOOLS-DOMAIN/embed/metal-weight?theme=light"
  title="AnyTools Steel Weight Calculator"
  style="width:100%;min-height:560px;border:0;"
></iframe>
```

Supported starting value: `light` or `dark`. Additional embed configuration can be added later through URL parameters without changing the host website's code.

## WordPress

Use a **Custom HTML** block and paste the iframe. The same method works in Webflow, Wix, Squarespace and most CMS platforms that permit iframe/HTML embeds.

## Recommended production model

1. Keep the calculator UI on AnyTools.
2. Give every embeddable calculator a dedicated `/embed/<slug>` route with no site navigation.
3. Keep calculations deterministic and client-side where possible.
4. Use URL parameters for safe, non-secret defaults such as section family, designation, length and theme.
5. Use `postMessage` for optional height synchronization rather than requiring customers to maintain a fixed height forever.
6. If a paid white-label tier is introduced, authenticate usage server-side with an embed token or account ID. Never put a secret API key in browser JavaScript.
7. Keep the normal calculator page canonical and mark embed routes `noindex`.

## Why iframe is the best first implementation

A normal iframe gives the strongest compatibility across unrelated websites and prevents the host site's CSS from breaking the calculator. Current calculator-widget providers commonly use iframe embeds or a small script that injects an iframe. Some providers also expose a resize listener through `window.postMessage` so the host page can adapt the frame height.

For AnyTools, an iframe should be the default integration. A JavaScript SDK can be added later for advanced features such as events, callbacks, theming, prefilled values and analytics.

## Example responsive host wrapper

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

## Important engineering-data rule

Standard-section mass values are reference data for estimation. For procurement, fabrication, certification or structural design, users should verify the applicable current standard and supplier/mill data. Do not market the widget as a substitute for certified engineering documentation.
