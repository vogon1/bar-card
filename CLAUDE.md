# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`bar-card` is a custom Lovelace card for Home Assistant that renders entity states as bars. It's a fork of `custom-cards/bar-card`, distributed via HACS, and compiles to a single bundled JS file (`dist/bar-card.js`) that Home Assistant loads as an ES module.

## Commands

```bash
yarn install        # install dependencies (yarn.lock is the lockfile; no package-lock.json)
npm run start        # rollup -c --watch — rebuilds dist/bar-card.js on change and serves dist/ at http://0.0.0.0:5000
npm run build         # lint, then bundle+minify into dist/bar-card.js (production build)
npm run rollup        # bundle only, no lint
npm run lint           # eslint **/*.ts
npm run lint:fix        # eslint --fix
```

There is no test suite and no typecheck script — `tsc` is invoked implicitly by the rollup TypeScript plugin during build. There is no CI workflow that runs build/lint (the `.github/workflows/` only contain Claude Code review/assistant automation, not build verification), so always run `npm run build` locally before considering a change done.

To manually verify a change in a real dashboard, run `npm run start` and add the served module (`http://<host>:5000/bar-card.js`) as a Lovelace resource, or point a HA dev instance's `dist/bar-card.js` reference at the build output.

## Architecture

Single entry point: [src/bar-card.ts](src/bar-card.ts), bundled by Rollup ([rollup.config.mjs](rollup.config.mjs)) into one ES module. Everything (including the editor) is pulled in transitively and shipped in `dist/bar-card.js`.

- **[src/bar-card.ts](src/bar-card.ts)** — the `<bar-card>` LitElement custom element. Holds `_config` (raw user config merged with defaults) and `_configArray` (one resolved `BarCardConfig` per bar/entity — see "Multi-entity config expansion" below). `render()` calls `_createBarArray()`, which loops `_configArray`, reads live entity state from `hass.states`, and builds the bar markup (icon/name/min/max/value/indicator/target-marker placement, severity color/icon/visibility, animation class) per bar. Layout into rows/columns happens here too, driven by `_config.columns` / `_config.stack`. `history.period` is the one exception to "live state": see "History-derived values" below.
- **[src/editor.ts](src/editor.ts)** — the `<bar-card-editor>` visual config editor (LovelaceCardEditor), a large standalone LitElement with its own option-group state. Mirrors the config shape from `bar-card.ts` but is otherwise independent; changes to config options usually need to be reflected in both files.
- **[src/helpers.ts](src/helpers.ts)** — pure functions shared by card and editor:
  - `mergeDeep` — immutable deep merge (objects merge recursively, arrays concatenate) used to layer defaults → top-level config → per-entity overrides.
  - `createConfigArray` / `createEditorConfigArray` — expand a single config (with optional `entities: []`) into one config object per bar.
  - `getMaxMinBasedOnType` — resolves `max`/`min` as either a literal number or an entity ID whose state is read from `hass`.
  - `hasConfigOrEntitiesChanged` — drives `shouldUpdate` so the card only re-renders when config changes or a watched entity's state object actually changed.
- **[src/action-handler-directive.ts](src/action-handler-directive.ts)** — a Lit directive implementing tap/hold/double-tap gesture detection (a single shared `<action-handler-bar>` element is attached to `document.body` and bound to each bar's background element). Fires a custom `action` event consumed by `_handleAction` in `bar-card.ts`, which looks up the right per-bar config via `data-config-index` and delegates to `handleAction` from `custom-card-helpers`.
- **[src/types.ts](src/types.ts)** — the `BarCardConfig` interface. This is the card's config contract; most fields are loosely typed (`any`) because Home Assistant Lovelace YAML config is dynamic.
- **[src/styles.ts](src/styles.ts)** — exports a `<style>` template (custom elements like `bar-card-card`, `bar-card-currentbar`, etc. — listed in the README's "CSS Elements" table — are styled here and are the public hooks for `card-mod` theming).
- **[src/localize/](src/localize/)** — `localize(key)` looks up `section.key` from `localize/languages/<lang>.json` (only `en` and `nb` exist), falling back to English. Language comes from `localStorage.selectedLanguage`.
- **[src/const.ts](src/const.ts)** — `CARD_VERSION` string, imported by `bar-card.ts` to print a console banner on load. Keep in sync with `package.json`'s `version` field (not automated).

### Multi-entity config expansion

A single `<bar-card>` config can describe many bars via top-level `entities: [...]`. `setConfig()` merges defaults into the raw config, then `createConfigArray` flattens `entities` (strings or per-entity override objects) into `_configArray`, where each element is a fully-resolved `BarCardConfig` for one bar (entity-level keys override card-level keys via `mergeDeep`). `_createBarArray()` then lays these out into rows according to `columns`/`stack: horizontal`. When touching config-resolution logic, remember state (`_stateArray`, `_animationState`, `_indicatorToggle`) is indexed in parallel to `_configArray`, so reordering/resizing that array without updating these arrays breaks indicator/animation tracking.

### Direction and positions

`direction` (`right`/`up`, plus legacy `-reverse` variants handled in `_computePercent`) controls bar fill direction and flips several CSS variables (`barDirection`, `flexDirection`, `markerDirection`). `positions.{icon,indicator,name,minmax,value}` (`inside`/`outside`/`off`) independently control where each element renders relative to the bar — most of `_createBarArray()` is a series of switch statements building `*Inside`/`*Outside` template fragments per position setting.

### History-derived values

`history.period` (card-level default, overridable per entity — same `mergeDeep` inheritance as `severity`/`animation`/`positions`, no special-casing needed in `createConfigArray`) replaces a bar's live state with its change over a preset period (`today`/`yesterday`/`last_7d`/`last_30d`/`this_month`/`last_month`/`last_12_months`/`this_year`/`last_year`), fetched from Home Assistant's long-term statistics (`recorder/statistics_during_period`, `change` type — the same source the Energy dashboard uses, robust against counter resets). This is the card's only async/network code path; everywhere else reads `hass.states` synchronously. `_fetchHistoryValues()` runs fire-and-forget from `setConfig()` (which must stay synchronous per the `LovelaceCard` contract) and writes results into `_historyValues`, a parallel array indexed like `_stateArray`/`_animationState`/`_indicatorToggle`. Resolved values are never reset, only overwritten, so an unrelated re-render never flickers a bar back to "loading". `setConfig()` typically runs before `hass` is first assigned (standard Lovelace card lifecycle), so the `hass` setter also retries `_fetchHistoryValues()` the first time `hass` transitions from unset to set — without that, every history bar would silently stay unresolved forever, since nothing else re-triggers the fetch. While a fetch is in flight (or the entity genuinely has no statistics), `_createBarArray()` defaults `entityState` to `0` rather than showing the "entity not available" warning — that warning is reserved for a genuinely missing entity (`!state`); reusing it for an in-flight history fetch made the editor's live preview flash an alarming-looking error on every keystroke, since each config-changed round-trip re-triggers a fresh, momentarily-unresolved fetch. Diagnosis for a permanently-stuck-at-0 bar is the `console.warn` in `_fetchHistoryValues()`, not the UI.

### Editor implementation constraints

`editor.ts` deliberately uses only plain native HTML controls (`<select>`, `<input>`, including `<input type="color">`) plus a small set of HA elements confirmed stable against a real, current HA frontend (`ha-icon`, `ha-switch`, `ha-entity-picker`). Do not introduce `paper-*` (Polymer; removed from HA core since 2022.3) or other `ha-*`/`mwc-*` form widgets (e.g. `ha-fab`, `paper-dropdown-menu`) — HA's frontend has repeatedly changed or removed these without notice, and both of those specific elements were confirmed broken (non-rendering / unclickable) against a live HA instance during development. Prefer native HTML first for any new control.

`setConfig()` must never unconditionally call `fireEvent(this, 'config-changed', ...)` at the end of the method. It deep-clones its input (`JSON.parse(JSON.stringify(config))`), so an unconditional fire there sends a brand-new object reference up to Home Assistant on every single call; HA's change detection on the receiving end is reference-based, so it treats that as "config changed" and calls `setConfig()` again, which fires again, forever — a real infinite loop that hangs the editor tab. Only fire `config-changed` from the methods that handle an actual user action (`_valueChanged`, `_addEntity`, `_removeEntity`, `_addSeverity`, etc.), never from `setConfig()` itself.

## Conventions

- TypeScript, strict mode (`tsconfig.json`), targeting `es2022`/`esnext` modules.
- ESLint flat config ([eslint.config.mjs](eslint.config.mjs)) extends `@typescript-eslint/recommended`; `no-unused-vars` is a warning, `no-console` is allowed, `no-extra-semi` is an error.
- Built on `lit` (3.x) with decorator-based custom elements (`@customElement`) and `custom-card-helpers` for Home Assistant integration types (`HomeAssistant`, `LovelaceCardEditor`, `ActionConfig`, `handleAction`, `fireEvent`, etc.).
- `hacs.json` declares the HACS package name and the built filename (`bar-card.js`) — keep in sync with `rollup.config.mjs` output if the entry/output changes.
