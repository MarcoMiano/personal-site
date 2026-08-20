# Visual system

The site treats the browser as a technical instrument rather than a simulated shell or a generic Markdown reader. It uses square machine rules, indexed module labels, asymmetric work tickets, and the EHMF mark as a foundry-style registration stamp.

Interface notation follows C, Python, and assembly conventions rather than C++ scope syntax. The header uses a C preprocessor include, page metadata resembles a small C structure, navigation uses indexed access, modules use assembly labels and `.section` directives, and status text uses assignment. These fragments remain decorative supplements to conventional semantic navigation and headings; ordinary prose is not forced into code syntax.

## Notation grammar

The interface uses a small, repeatable vocabulary. New components should reuse
these forms instead of inventing another programming-language motif.

| Purpose                       | Form                       | Example                                  |
| ----------------------------- | -------------------------- | ---------------------------------------- |
| Site and terminal context     | C preprocessor and comment | `#include <miano.cloud> /* tty0 */`      |
| Page or interface module      | C-like structure           | `struct page`, `struct command_palette`  |
| Field or status               | Assignment                 | `status = "active"`, `scope = "minimal"` |
| Current route                 | Entry label and path       | `entry: /en/projects`                    |
| Major content section         | Assembly directive         | `.section 01`, `.section project_02`     |
| Indexed collection or control | Uppercase register/array   | `NAV[...]`, `THEME[...]`, `policy[01]`   |
| Local data label              | Assembly-style label       | `portrait_01:`                           |
| Identifiers                   | Lowercase snake case       | `command_palette`, `mono_rgba`           |

Indices use two digits and restart inside their own collection. `.module-label`
is the shared visual treatment for compact code chrome; `.section` labels use
the established section-heading treatment. Keep fragments short, recognizable,
and secondary to the actual content. Avoid C++ `::`, decorative shell prompts,
or unrelated syntax merely for variety.

Code-like labels that duplicate visible meaning are decorative and must remain
hidden from assistive technology. `NAV[...]` and `THEME[...]` wrap ordinary
semantic controls; headings, links, status text, and navigation must continue to
work without those decorations or without CSS.

## Themes

Solarized Dark uses the canonical `base03`, `base02`, `base1`, `base2`, and `base3` tones. Solarized Light uses the canonical warm `base3` paper and `base2` panels. Both themes add a separate shadow tone so nested surfaces retain depth instead of using a lighter panel colour as a shadow.

The accent palette has stable roles: cyan identifies links, amber marks controls and project signals, green reports healthy state, red marks warnings or exceptional callouts, blue identifies policy and information groups, violet marks section coordinates, and orange identifies entry context. A repeated collection keeps one accent rather than changing colour per item. Text variants are lightened in the dark theme and darkened in the light theme when canonical Solarized accents would not provide enough contrast; the hue relationships remain Solarized.

Both themes use the same semantic tokens in `src/styles/global.css`:

- `--canvas`, `--canvas-deep`, `--panel`, and `--panel-raised` define depth;
- `--shadow` keeps physical depth darker than its surrounding surface;
- `--ink`, `--ink-muted`, and `--heading` define text hierarchy;
- `--link`, `--amber`, `--orange`, `--red`, `--violet`, `--blue`, and `--phosphor` define interaction and status roles;
- `--rule`, `--rule-strong`, and `--focus` define boundaries and focus;
- `--effect-*` tokens keep decoration independently removable.

Body, muted, link, and accent colours used for small text meet WCAG AA against their declared surfaces. Panel rules retain non-text contrast, and focus colours remain clearly visible in both themes. Browser review still checks every rendered state because transparency and colour mixing can change the effective background.

## Effects

Scanlines and the background grid are static pseudo-elements with low token-controlled opacity. They never handle input. Glow is limited to the EHMF mark, short signal labels, and status lamps; body copy receives no glow.

Reduced-motion, increased-contrast, forced-color, and print modes remove the decorative layers. No content depends on them.

## Typography

The site uses a broad system-monospace stack. This keeps layout independent from a font download and adds no dependency or external request.

A self-hosted font should be added only if it materially improves the design without compromising performance. A full Nerd Font is intentionally excluded because the interface uses no private icon glyphs.

## Portrait and mark

The approved grayscale portrait is retained as reviewed 320-pixel and 640-pixel WebP variants. Landing uses eager loading because it is visible immediately, while CV uses lazy loading. Both instances provide localized alternative text and intrinsic dimensions.

The CSS treatment is separate from the image and disappears harmlessly if CSS or effects are disabled. The reviewed WebP variants are stored with the source so the build does not need Astro's optional native `sharp` dependency.

The EHMF mark uses a compact four-letter register built as one connected silhouette. The connections are selective and each remains one stroke wide: the E's lower bar enters the H, only the H's outer right leg continues into the F, and the M uses one short bridge each to meet the E and F. The M starts below the central gutter so it does not gain a second connection to the E. The glyphs use a lighter ten-unit stroke system so the junctions retain open counterspace at small sizes, and the E's two internal gaps are equal. A slightly enlarged registration diamond combines a Solarized violet fill with a cyan outline; there is no secondary node. The mark uses canonical Solarized base colors (`base03`, `base2`, `base3`, `violet`, and `cyan`) and the accent disappears in print, increased-contrast, and forced-colour modes, leaving the complete one-colour mark.

`public/favicon.svg` reuses the same geometry and contains equivalent Solarized Dark/Light colors. It needs no icon library or raster export.

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

The accessible theme switcher cycles through automatic, dark, and bright modes. Automatic mode follows the operating-system preference; without JavaScript, the site still follows that preference through CSS.
