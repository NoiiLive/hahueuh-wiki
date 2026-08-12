# HahUeuh Wiki

The wiki for the [HahUeuh](https://github.com/NoiiLive/hahueuh) Minecraft mod.

Plain static HTML. **There is no build step** — no Node, no npm, no generator. What is in this
folder is exactly what gets served.

## Running it locally

Opening `index.html` straight from disk mostly works, but the absolute paths (`/assets/site.css`)
need a server root. Any static server will do:

```bash
npx serve .
```

If you have no Node installed, VS Code's Live Server extension or IntelliJ's built-in web server
(right-click `index.html` → *Open in Browser*) both work.

## Adding a page

1. Copy any file in `wiki/` as a starting point.
2. Change the `<title>`, the `<meta name="description">`, the `.crumbs` line, the `<h1>` and the `.lede`.
3. Write the body as ordinary HTML — `h2`/`h3`, `p`, `ul`, `table` wrapped in `.table-wrap`.
4. Add one line to `assets/nav.js`.

That last step is the important one. `nav.js` is the single source of truth: it drives the sidebar,
the search index and the previous/next links at the bottom of each page. A page that is not listed
there is invisible even though the file exists.

```js
{ url: "/wiki/my-page.html", title: "My page", keywords: "words people might search for" }
```

## Components available

| Markup | Renders as |
| --- | --- |
| `<div class="note">` | Violet callout |
| `<div class="note tip">` | Teal callout |
| `<div class="note warn">` | Red callout |
| `<div class="note gold">` | Gold callout |
| `<span class="tag divine">` | Rarity pill — also `common`, `rare`, `legendary`, `unique` |
| `<div class="cards"><a class="card">` | Grid of link cards |
| `<div class="table-wrap"><table>` | Table that scrolls sideways on mobile instead of breaking the page |

Headings get their own `id` and anchor link automatically, and any page with two or more `h2`/`h3`
gets an "On this page" rail on wide screens. You do not need to write either by hand.

## Deploying to Cloudflare Pages

1. Push this repo to GitHub.
2. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Pick this repository.
4. Build settings:
   - **Framework preset:** `None`
   - **Build command:** *leave empty*
   - **Build output directory:** `/`
5. Save and deploy.

Every push to `main` redeploys. Every other branch gets its own preview URL, which is the easiest
way to check a page before it goes live.

`_headers` sets the security headers and a content security policy. The policy is deliberately
strict — `self` only — so if you ever add an embedded video or a webfont you will need to widen it
there or the browser will silently block the resource.

### Custom domain

Pages → your project → **Custom domains**. If the domain is already on Cloudflare the DNS record is
created for you; otherwise point a `CNAME` at the `pages.dev` address.

## Conventions

- **Numbers are defaults.** Almost everything in the mod is configurable, so quote defaults and say
  so rather than presenting them as fixed.
- **Do not invent mechanics.** If a detail is not confirmed, leave the section stubbed. A blank
  heading is better than a wrong sentence.
- **Loader differences get called out inline**, not split into separate pages.
