/* The whole site map. Add a page here and it appears in the sidebar,
   the search index, and the prev/next footer links automatically. */

window.SITE = {
    version: "2.6.1",
    repo: "https://github.com/NoiiLive/hahueuh",
    nav: [
        {
            title: "Start here",
            pages: [
                { url: "/", title: "Home", keywords: "overview index welcome" },
                { url: "/wiki/getting-started.html", title: "Getting started", keywords: "install download setup requirements first join book of life" },
                { url: "/wiki/book-of-life.html", title: "Book of Life", keywords: "gui screen stats race age gate mana od character sheet" }
            ]
        },
        {
            title: "Authorities",
            pages: [
                { url: "/wiki/authorities.html", title: "Authorities overview", keywords: "witch cult sin archbishop authority abilities" },
                { url: "/wiki/return-by-death.html", title: "Return by Death", keywords: "rbd checkpoint rollback death loop satella respawn" },
                { url: "/wiki/greed.html", title: "Greed", keywords: "aldebaran domain regulus little king lion's heart victim aggressor" },
                { url: "/wiki/sloth.html", title: "Sloth", keywords: "unseen hand betelgeuse fingers quick strike grasp self propel" }
            ]
        },
        {
            title: "Magic",
            pages: [
                { url: "/wiki/magic.html", title: "Magic overview", keywords: "spells schools casting mana od chanting" },
                { url: "/wiki/gate.html", title: "The Gate", keywords: "gate output efficiency strain defective destroyed damaged open" },
                { url: "/wiki/spells.html", title: "Spell list", keywords: "shamak minya vita murak el ul al karum emm emt teleportation door crossing" }
            ]
        },
        {
            title: "Spirits",
            pages: [
                { url: "/wiki/spirits.html", title: "Spirits overview", keywords: "spirit arts commune contract rank lesser quasi normal great" },
                { url: "/wiki/spirit-anchors.html", title: "Anchors & contracts", keywords: "anchor bind temporary contract mana siphon manage sever" },
                { url: "/wiki/named-spirits.html", title: "Named spirits", keywords: "puck beatrice great spirit artificial" }
            ]
        },
        {
            title: "Divine Protections",
            pages: [
                { url: "/wiki/divine-protections.html", title: "All protections", keywords: "divine protection kago blessing rarity common rare legendary divine unique roll" },
                { url: "/wiki/witch-factors.html", title: "Witch Factors", keywords: "witch factor miasma insanity scent authority" }
            ]
        },
        {
            title: "Character",
            pages: [
                { url: "/wiki/stats.html", title: "Stats", keywords: "tenacity fortitude strength reflexes magic combat proficiency capacity level training" },
                { url: "/wiki/races.html", title: "Races & lifespan", keywords: "human elf half elf age aging lifespan" }
            ]
        },
        {
            title: "Reference",
            pages: [
                { url: "/wiki/commands.html", title: "Commands", keywords: "rezero command admin op data preset reset gate stat spirit protection" },
                { url: "/wiki/configuration.html", title: "Configuration", keywords: "config toml server common options tuning balance" },
                { url: "/wiki/compatibility.html", title: "Mod compatibility", keywords: "create sable epic fight better combat distant horizons compat" }
            ]
        }
    ]
};
