(function () {
    "use strict";

    var SITE = window.SITE || { nav: [], version: "", repo: "#" };

    function el(tag, attrs, kids) {
        var n = document.createElement(tag);
        if (attrs) Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
        (kids || []).forEach(function (c) {
            n.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
        });
        return n;
    }

    function normalise(path) {
        path = path.replace(/index\.html$/, "").replace(/\/+$/, "");
        return path === "" ? "/" : path;
    }

    var here = normalise(location.pathname);

    var flat = [];
    SITE.nav.forEach(function (group) {
        group.pages.forEach(function (page) {
            flat.push({ url: page.url, title: page.title, group: group.title, keywords: page.keywords || "" });
        });
    });

    /* ---------- top bar ---------- */

    function buildTopbar() {
        var bar = document.querySelector(".topbar");
        if (!bar) return;

        var brand = el("a", { class: "brand", href: "/" }, []);
        brand.appendChild(el("span", { class: "mark" }, ["HahUeuh"]));
        brand.appendChild(el("b", {}, ["Wiki"]));
        if (SITE.version) brand.appendChild(el("span", { class: "ver" }, ["v" + SITE.version]));

        var toggle = el("button", {
            class: "icon-btn", id: "nav-toggle", type: "button",
            "aria-label": "Toggle navigation", "aria-expanded": "false"
        }, ["☰"]);
        toggle.addEventListener("click", function () {
            var open = document.body.classList.toggle("nav-open");
            toggle.setAttribute("aria-expanded", String(open));
        });

        var search = el("div", { class: "search" }, []);
        var input = el("input", {
            type: "search", id: "search-input", placeholder: "Search the wiki…",
            autocomplete: "off", spellcheck: "false", "aria-label": "Search"
        }, []);
        var results = el("div", { class: "results", id: "search-results" }, []);
        search.appendChild(input);
        search.appendChild(results);

        var theme = el("button", {
            class: "icon-btn", id: "theme-toggle", type: "button", "aria-label": "Toggle colour theme"
        }, []);
        theme.addEventListener("click", function () {
            var next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
            applyTheme(next);
            try { localStorage.setItem("hahueuh-theme", next); } catch (e) { /* private mode */ }
        });

        var repo = el("a", {
            class: "icon-btn", href: SITE.repo, target: "_blank", rel: "noopener", "aria-label": "Source on GitHub"
        }, ["⚑"]);

        bar.appendChild(toggle);
        bar.appendChild(brand);
        bar.appendChild(el("span", { class: "topbar-spacer" }, []));
        bar.appendChild(search);
        bar.appendChild(theme);
        bar.appendChild(repo);

        wireSearch(input, results);
    }

    function applyTheme(mode) {
        document.documentElement.setAttribute("data-theme", mode);
        var btn = document.getElementById("theme-toggle");
        if (btn) btn.textContent = mode === "light" ? "☾" : "☀";
    }

    /* ---------- sidebar ---------- */

    function buildSidebar() {
        var side = document.querySelector(".sidebar");
        if (!side) return;
        SITE.nav.forEach(function (group) {
            var box = el("div", { class: "nav-group" }, []);
            box.appendChild(el("h4", {}, [group.title]));
            var ul = el("ul", {}, []);
            group.pages.forEach(function (page) {
                var a = el("a", { href: page.url }, [page.title]);
                if (normalise(page.url) === here) a.setAttribute("aria-current", "page");
                ul.appendChild(el("li", {}, [a]));
            });
            box.appendChild(ul);
            side.appendChild(box);
        });
    }

    /* ---------- on this page ---------- */

    function buildToc() {
        var toc = document.querySelector(".toc");
        var article = document.querySelector("article");
        if (!toc || !article) return;

        var heads = article.querySelectorAll("h2, h3");
        if (heads.length < 2) return;

        var ul = el("ul", {}, []);
        var links = [];
        Array.prototype.forEach.call(heads, function (h) {
            if (!h.id) {
                h.id = h.textContent.trim().toLowerCase()
                    .replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").slice(0, 60);
            }
            var a = el("a", { href: "#" + h.id, class: h.tagName === "H3" ? "lvl3" : "" }, [h.textContent]);
            ul.appendChild(el("li", {}, [a]));
            links.push({ a: a, h: h });

            var anchor = el("a", { class: "anchor", href: "#" + h.id, "aria-label": "Link to this section" }, ["#"]);
            h.appendChild(anchor);
        });

        toc.appendChild(el("h4", {}, ["On this page"]));
        toc.appendChild(ul);

        if (!("IntersectionObserver" in window)) return;
        var seen = new Map();
        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) { seen.set(e.target, e.isIntersecting); });
            var current = null;
            links.forEach(function (l) { if (seen.get(l.h)) { if (!current) current = l; } });
            if (!current) {
                for (var i = links.length - 1; i >= 0; i--) {
                    if (links[i].h.getBoundingClientRect().top < 120) { current = links[i]; break; }
                }
            }
            links.forEach(function (l) { l.a.classList.toggle("active", l === current); });
        }, { rootMargin: "-80px 0px -70% 0px" });
        links.forEach(function (l) { obs.observe(l.h); });
    }

    /* ---------- prev / next ---------- */

    function buildPageNav() {
        var slot = document.querySelector(".page-nav");
        if (!slot) return;
        var i = flat.findIndex(function (p) { return normalise(p.url) === here; });
        if (i < 0) return;

        if (i > 0) {
            var p = flat[i - 1];
            var prev = el("a", { class: "prev", href: p.url }, []);
            prev.appendChild(el("small", {}, ["← Previous"]));
            prev.appendChild(document.createTextNode(p.title));
            slot.appendChild(prev);
        }
        if (i < flat.length - 1) {
            var n = flat[i + 1];
            var next = el("a", { class: "next", href: n.url }, []);
            next.appendChild(el("small", {}, ["Next →"]));
            next.appendChild(document.createTextNode(n.title));
            slot.appendChild(next);
        }
    }

    /* ---------- search ---------- */

    function wireSearch(input, results) {
        var active = -1;

        function score(page, q) {
            var t = page.title.toLowerCase();
            var k = page.keywords.toLowerCase();
            if (t === q) return 100;
            if (t.startsWith(q)) return 80;
            if (t.indexOf(q) >= 0) return 60;
            if (k.split(/\s+/).some(function (w) { return w === q; })) return 45;
            if (k.indexOf(q) >= 0) return 30;
            return 0;
        }

        function render(q) {
            results.innerHTML = "";
            active = -1;
            q = q.trim().toLowerCase();
            if (!q) { results.classList.remove("open"); return; }

            var hits = flat
                .map(function (p) { return { p: p, s: score(p, q) }; })
                .filter(function (r) { return r.s > 0; })
                .sort(function (a, b) { return b.s - a.s; })
                .slice(0, 8);

            if (!hits.length) {
                results.appendChild(el("div", { class: "empty" }, ["No pages match “" + q + "”"]));
            } else {
                hits.forEach(function (r) {
                    var a = el("a", { href: r.p.url }, [r.p.title]);
                    a.appendChild(el("small", {}, [r.p.group]));
                    results.appendChild(a);
                });
            }
            results.classList.add("open");
        }

        function move(delta) {
            var items = results.querySelectorAll("a");
            if (!items.length) return;
            if (active >= 0) items[active].classList.remove("active");
            active = (active + delta + items.length) % items.length;
            items[active].classList.add("active");
            items[active].scrollIntoView({ block: "nearest" });
        }

        input.addEventListener("input", function () { render(input.value); });
        input.addEventListener("focus", function () { if (input.value) render(input.value); });

        input.addEventListener("keydown", function (e) {
            if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
            else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
            else if (e.key === "Enter") {
                var items = results.querySelectorAll("a");
                var pick = items[active >= 0 ? active : 0];
                if (pick) { e.preventDefault(); location.href = pick.getAttribute("href"); }
            } else if (e.key === "Escape") {
                input.value = ""; results.classList.remove("open"); input.blur();
            }
        });

        document.addEventListener("click", function (e) {
            if (!results.contains(e.target) && e.target !== input) results.classList.remove("open");
        });

        document.addEventListener("keydown", function (e) {
            var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
            if (e.key === "/" && !typing) { e.preventDefault(); input.focus(); }
        });
    }

    /* ---------- boot ---------- */

    var stored = null;
    try { stored = localStorage.getItem("hahueuh-theme"); } catch (e) { /* private mode */ }
    applyTheme(stored || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"));

    document.addEventListener("DOMContentLoaded", function () {
        buildTopbar();
        applyTheme(document.documentElement.getAttribute("data-theme"));
        buildSidebar();
        buildToc();
        buildPageNav();
    });
})();
