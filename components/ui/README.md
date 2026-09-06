# AnyTools UI

Reusable UI primitives for the AnyTools product surface.

## Foundations

- `Button` — primary, secondary, ghost and soft actions.
- `Badge` — compact status/category labels.
- `SectionHeading` — consistent section hierarchy with optional action.
- `ToolCard` — shared tool discovery card with icon, category, description and navigation affordance.
- `ToolBrowser` — searchable, category-filtered tool collection for the homepage.

## Design rules

- Use rounded-xl controls and rounded-2xl cards.
- Prefer slate neutrals with blue as the interaction accent.
- Keep borders subtle and shadows restrained.
- Use 44px+ controls for touch targets where practical.
- Keep copy concise and task-focused.
- Prefer composition from these primitives instead of one-off styles.

## Adding a new tool

1. Add the tool to `lib/tools.ts`.
2. Reuse `ToolShell` for the full tool page.
3. Add the matching icon to `components/ui/tool-card.tsx` when a new icon is needed.
4. Add an embed route under `app/embed/<slug>` when the tool should be embeddable.
