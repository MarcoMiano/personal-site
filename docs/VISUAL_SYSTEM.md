# Phase 2 visual system

The first visual direction treats the site as a technical workstation rather than a simulated shell or a generic Markdown reader. It uses square machine rules, indexed module labels, asymmetric work tickets, and the EHMF mark as a foundry-style registration stamp.

Interface notation follows C, Python, and assembly conventions rather than C++ scope syntax. The header uses a C preprocessor include, page metadata resembles a small C structure, navigation uses indexed access, modules use assembly labels and `.section` directives, and status text uses assignment. These fragments remain decorative supplements to conventional semantic navigation and headings; ordinary prose is not forced into code syntax.

## Themes

The dark theme starts from Solarized's blue-green depth, then raises body-text contrast and uses amber as its primary signal. Phosphor green is reserved for small status indicators; cyan identifies links and data.

The bright theme is warm paper rather than plain white. Its dark green-black ink and mechanical borders reference early bitmap workstations without copying a specific interface.

Both themes use the same semantic tokens in `src/styles/global.css`:

- `--canvas`, `--canvas-deep`, `--panel`, and `--panel-raised` define depth;
- `--ink`, `--ink-muted`, and `--heading` define text hierarchy;
- `--link`, `--amber`, and `--phosphor` have separate interaction, identity, and status roles;
- `--rule`, `--rule-strong`, and `--focus` define boundaries and focus;
- `--effect-*` tokens keep decoration independently removable.

Representative text contrast ratios range from 6.51:1 to 14.03:1 in dark mode and 5.24:1 to 14.17:1 in bright mode. Panel rules exceed 3:1 against adjacent backgrounds and focus colors exceed 5:1 in both themes. These calculations cover the declared solid token pairs; browser review still needs to check every rendered state.

## Effects

Scanlines and the background grid are static pseudo-elements with low token-controlled opacity. They never handle input. Glow is limited to the EHMF mark, short signal labels, and status lamps; body copy receives no glow.

Reduced-motion, increased-contrast, forced-color, and print modes remove the decorative layers. No content depends on them.

## Typography

The first review keeps a broad system-monospace stack. This isolates layout and hierarchy decisions from a font download and adds no dependency or external request.

If the direction is approved, the next typography decision is whether a small self-hosted IBM Plex Mono Latin/Latin Extended WOFF2 set materially improves it. A full Nerd Font is intentionally excluded because the current interface uses no private icon glyphs.

## Portrait and mark

The approved grayscale portrait is retained as reviewed 320-pixel and 640-pixel WebP variants. Landing uses eager loading because it is visible immediately, while CV uses lazy loading. Both instances provide localized alternative text and intrinsic dimensions.

The CSS treatment is separate from the image and disappears harmlessly if CSS or effects are disabled. Image optimization is deferred rather than adding Astro's optional native `sharp` dependency during visual exploration.

The EHMF mark uses a compact four-letter register built as one connected silhouette. The connections are selective and each remains one stroke wide: the E's lower bar enters the H, only the H's outer right leg continues into the F, and the M uses one short bridge each to meet the E and F. The M starts below the central gutter so it does not gain a second connection to the E. The glyphs use a lighter ten-unit stroke system so the junctions retain open counterspace at small sizes, and the E's two internal gaps are equal. A slightly enlarged registration diamond combines a Solarized violet fill with a cyan outline; there is no secondary node. The mark uses canonical Solarized base colors (`base03`, `base2`, `base3`, `violet`, and `cyan`) and the accent disappears in print, increased-contrast, and forced-colour modes, leaving the complete one-colour mark.

`public/favicon.svg` reuses the same geometry and contains equivalent dark/bright colors. It needs no icon library or raster export during this phase.

External service marks use small grid-aligned SVG shapes with crisp edges rather than ordinary vendor icon sets. `ExternalBrandIcon.astro` uses the original 24-pixel geometry of the GitHub, LinkedIn, and Bluesky marks from [HackerNoon's Pixel Icon Library](https://github.com/hackernoon/pixel-icon-library/tree/main/icons/SVG/brands), licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), with their fill adapted to inherit the site palette. It also provides a local generic external-link fallback. The Credits page carries the required credit and identifies the adaptation. Icons remain decorative beside explicit text labels and must preserve the same pixel treatment when another external brand is added.

## Theme inspection

Start the development server:

```sh
pnpm dev
```

The site follows the operating-system color preference. Browser rendering controls can emulate both schemes; a temporary forced preview can also set one of these values in the browser console:

```js
document.documentElement.dataset.theme = 'dark';
document.documentElement.dataset.theme = 'bright';
delete document.documentElement.dataset.theme;
```

Visual review covers:

1. the landing page at desktop width and 320 CSS pixels;
2. the CV route and its portrait treatment;
3. keyboard focus around navigation and action links;
4. 200% zoom, reduced motion, increased contrast, and print preview;
5. the page with CSS disabled to confirm its content order remains logical.

The permanent accessible theme switcher remains Phase 4 work. Until then, the data attributes are development overrides and the public site requires no JavaScript to select the operating-system theme.
