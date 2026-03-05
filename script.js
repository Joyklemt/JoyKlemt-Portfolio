/**
 * Portfolio – Laddar och renderar allt innehåll från content.json.
 * Redigera content.json för att uppdatera texter, appar och övriga sektioner.
 */

/* ---- SVG-ikoner för kontaktlänkar ---- */
const IKONER = {
  phone: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.19 12 19.79 19.79 0 0 1 1.12 3.38 2 2 0 0 1 3.1 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  email: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
  linkedin: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
};


/* ============================================
   Huvudfunktion: ladda och rendera allt
   ============================================ */

async function loadContent() {
  try {
    // Lägg till tidsstämpel för att förhindra caching av JSON-filen
    const response = await fetch("content.json?t=" + Date.now());
    if (!response.ok) throw new Error("Kunde inte ladda content.json");
    const data = await response.json();

    renderHero(data.hero);
    renderApps(data.apps || []);
    renderAiArt(data.ai_art || []);
    renderBlog(data.blog || []);
    renderDjSets(data.dj_sets || {});
    renderFooter(data.footer);

  } catch (err) {
    console.error("Fel vid laddning av innehåll:", err);
    // Visa felmeddelande i Om-sektionen om något går fel
    const aboutText = document.getElementById("about-text");
    if (aboutText) {
      aboutText.textContent = "Kunde inte ladda innehåll. Kontrollera att content.json finns.";
    }
  }
}


/* ============================================
   Hero-sektionen
   ============================================ */

/** Fyller hero med kursiv rubrik, ingress och knapp-hrefs */
function renderHero(hero) {
  if (!hero) return;

  const titEl      = document.getElementById("hero-title");
  const textEl     = document.getElementById("hero-text");
  const primaryBtn = document.getElementById("hero-btn-primary");
  const secondBtn  = document.getElementById("hero-btn-secondary");

  if (titEl  && hero.title) titEl.textContent  = hero.title;
  if (textEl && hero.text)  textEl.textContent = hero.text;

  // Uppdatera primärknappens text och länk
  if (primaryBtn && hero.btn_primary) {
    primaryBtn.textContent = hero.btn_primary.label || primaryBtn.textContent;
    if (hero.btn_primary.href) primaryBtn.href = hero.btn_primary.href;
  }

  // Uppdatera sekundärknappens text och länk
  if (secondBtn && hero.btn_secondary) {
    secondBtn.textContent = hero.btn_secondary.label || secondBtn.textContent;
    if (hero.btn_secondary.href) secondBtn.href = hero.btn_secondary.href;
  }
}


/* ============================================
   Om-sektionen
   ============================================ */

/** Fyller Om-sektionen med rubrik och brödtext */
function renderAbout(about) {
  if (!about) return;
  const rubrikEl = document.getElementById("about-heading");
  const textEl   = document.getElementById("about-text");
  if (rubrikEl) rubrikEl.textContent = about.heading || "";
  if (textEl)   textEl.textContent   = about.text    || "";
}


/* ============================================
   Appar-sektionen
   ============================================ */

/** Skapar klickbara app-kort i appar-sektionen */
function renderApps(apps) {
  const grid = document.getElementById("apps-grid");
  if (!grid) return;
  grid.innerHTML = "";

  apps.forEach((app) => {
    const card = document.createElement("div");
    card.className = "app-card";

    // App-ikon till vänster i kortet
    const ikon = document.createElement("img");
    ikon.src       = app.image || "favicon_io/android-chrome-192x192.png";
    ikon.alt       = app.name;
    ikon.className = "app-card-icon";
    card.appendChild(ikon);

    // Text-kolumn till höger
    const body = document.createElement("div");
    body.className = "app-card-body";

    const titel = document.createElement("h3");
    titel.textContent = app.name || "App";
    body.appendChild(titel);

    const beskrivning = document.createElement("p");
    beskrivning.textContent = app.description || "";
    body.appendChild(beskrivning);

    // Tekniska specifikationer – klick visar/döljer listan
    if (app.tech && app.tech.length > 0) {
      const specsKnapp = document.createElement("button");
      specsKnapp.type      = "button";
      specsKnapp.className = "app-card-specs-toggle";
      specsKnapp.textContent = "Tekniska specifikationer";
      specsKnapp.setAttribute("aria-expanded", "false");

      const specsList = document.createElement("ul");
      specsList.className = "app-card-specs-list";
      specsList.hidden    = true;

      app.tech.forEach((post) => {
        const li = document.createElement("li");
        li.textContent = post;
        specsList.appendChild(li);
      });

      // Växla synlighet och aria-attribut vid klick
      specsKnapp.addEventListener("click", (e) => {
        e.stopPropagation();
        const ärÖppen = specsList.hidden;
        specsList.hidden = !ärÖppen;
        specsKnapp.setAttribute("aria-expanded", String(!ärÖppen));
      });

      body.appendChild(specsKnapp);
      body.appendChild(specsList);
    }

    // Länk längst ner i kortet
    const länkRad = document.createElement("div");
    länkRad.className = "app-card-link-row";

    const besökLänk = document.createElement("a");
    besökLänk.href      = app.url || "#";
    besökLänk.className = "app-card-link";
    besökLänk.setAttribute("target", "_blank");
    besökLänk.setAttribute("rel", "noopener noreferrer");

    if (app.linkText) {
      besökLänk.textContent = app.linkText;
    } else {
      länkRad.innerHTML = "Besök appen → ";
      besökLänk.textContent = app.name || "App";
    }
    länkRad.appendChild(besökLänk);

    body.appendChild(länkRad);
    card.appendChild(body);
    grid.appendChild(card);
  });
}


/* ============================================
   AI-konst-sektionen
   ============================================ */

/** Skapar bildkort för AI-konstsektionen.
 *  Stöder både vanliga bilder (jpg/png/webp) och video (mp4). */
function renderAiArt(aiArt) {
  const grid = document.getElementById("ai-art-grid");
  if (!grid) return;
  grid.innerHTML = "";

  aiArt.forEach((post) => {
    const card = document.createElement("div");
    card.className = "ai-art-card";

    const sökväg = post.image || "";
    const ärVideo = /\.(mp4|webm|ogg)$/i.test(sökväg);

    if (ärVideo) {
      // --- Videoklipp: autoplay, loop, mute (krävs för autoplay i webbläsare) ---
      const video = document.createElement("video");
      video.autoplay  = true;
      video.loop      = true;
      video.muted     = true;          // Måste vara mute för autoplay
      video.playsInline = true;        // Förhindrar fullskärm på iOS
      video.setAttribute("aria-label", post.title || "AI-video");

      const källa = document.createElement("source");
      källa.src  = sökväg;
      källa.type = "video/mp4";
      video.appendChild(källa);
      card.appendChild(video);


    } else {
      // --- Stillbild ---
      const img = document.createElement("img");
      img.src     = sökväg;
      img.alt     = post.title || "AI-konstverk";
      img.loading = "lazy";   // Lat inladdning för bättre prestanda
      card.appendChild(img);
    }

    grid.appendChild(card);
  });
}


/* ============================================
   Blog-sektionen
   ============================================ */

/** Skapar artikelkort i blog-sektionen, eller visar "Kommer snart" */
function renderBlog(blog) {
  const lista = document.getElementById("blog-list");
  if (!lista) return;
  lista.innerHTML = "";

  // Visa "Kommer snart" om listan är tom
  if (!blog || blog.length === 0) {
    const wrapper = document.createElement("div");
    wrapper.style.textAlign = "center";
    wrapper.style.padding   = "2.5rem 0";
    const badge = document.createElement("span");
    badge.className   = "btn btn-primary";
    badge.textContent = "Kommer snart";
    wrapper.appendChild(badge);
    lista.appendChild(wrapper);
    return;
  }

  blog.forEach((inlägg) => {
    const card = document.createElement("article");
    card.className = "blog-card";

    // Datum i liten versaltext ovanför titeln
    if (inlägg.date) {
      const meta = document.createElement("div");
      meta.className = "blog-card-meta";

      const tid = document.createElement("time");
      tid.dateTime = inlägg.date;
      // Formattera datum till läsbar svenska, t.ex. "15 januari 2025"
      const d = new Date(inlägg.date);
      tid.textContent = d.toLocaleDateString("sv-SE", {
        year:  "numeric",
        month: "long",
        day:   "numeric",
      });

      meta.appendChild(tid);
      card.appendChild(meta);
    }

    const titel = document.createElement("h3");
    titel.textContent = inlägg.title || "";
    card.appendChild(titel);

    if (inlägg.summary) {
      const sammanfattning = document.createElement("p");
      sammanfattning.textContent = inlägg.summary;
      card.appendChild(sammanfattning);
    }

    // Visa "Läs mer →"-länk bara om URL inte är en platshållare
    if (inlägg.url && inlägg.url !== "#") {
      const länk = document.createElement("a");
      länk.href      = inlägg.url;
      länk.className = "blog-card-link";
      länk.textContent = "Läs mer →";
      card.appendChild(länk);
    }

    lista.appendChild(card);
  });
}


/* ============================================
   DJ-sets-sektionen
   ============================================ */

/** Visar "Coming Soon"-markering i DJ-sets-sektionen */
function renderDjSets(djSets) {
  const innehåll = document.getElementById("dj-sets-content");
  if (!innehåll) return;
  innehåll.innerHTML = "";

  if (djSets.coming_soon) {
    const omslag = document.createElement("div");
    omslag.className = "coming-soon";

    const badge = document.createElement("span");
    badge.className   = "btn btn-primary";
    badge.textContent = "Kommer snart";
    omslag.appendChild(badge);


    innehåll.appendChild(omslag);
  }
}


/* ============================================
   Kontakt-sektionen
   ============================================ */

/** Renderar kontaktuppgifter i kontaktsektionen (flytt från footer) */
function renderContact(kontakt) {
  const innehållEl = document.getElementById("contact-content");
  if (!innehållEl || !kontakt) return;
  innehållEl.innerHTML = "";

  // Kontaktposter med nyckel, href och etikett
  const kontaktPoster = [
    {
      nyckel:   "phone",
      href:     "tel:" + (kontakt.phone || "").replace(/\s/g, ""),
      etikett:  kontakt.phone,
    },
    {
      nyckel:   "email",
      href:     "mailto:" + (kontakt.email || ""),
      etikett:  kontakt.email,
    },
    {
      nyckel:   "linkedin",
      href:     kontakt.linkedin || "#",
      etikett:  "LinkedIn",
      extern:   true,
    },
  ];

  const länkContainer = document.createElement("div");
  länkContainer.className = "contact-links";

  kontaktPoster.forEach((c) => {
    // Hoppa över tomma kontakter
    if (!c.href || c.href === "tel:" || c.href === "mailto:") return;

    const a = document.createElement("a");
    a.href      = c.href;
    a.className = "contact-link";
    a.setAttribute("aria-label", c.etikett);

    // Externa länkarna öppnas i ny flik
    if (c.extern) {
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener noreferrer");
    }

    // Ikon + etikett
    a.innerHTML = (IKONER[c.nyckel] || "") + "<span>" + c.etikett + "</span>";
    länkContainer.appendChild(a);
  });

  innehållEl.appendChild(länkContainer);
}


/* ============================================
   Footer
   ============================================ */

/** Fyller footern med tagline, beskrivning, kontaktlänkar och copyright */
function renderFooter(footer) {
  if (!footer) return;

  // Tagline och beskrivningstext
  const taglineEl = document.getElementById("footer-tagline");
  const descEl    = document.getElementById("footer-desc");
  if (taglineEl && footer.tagline)     taglineEl.textContent = footer.tagline;
  if (descEl    && footer.description) descEl.textContent    = footer.description;

  // Copyright
  const copyrightEl = document.getElementById("footer-copyright");
  if (copyrightEl && footer.copyright) copyrightEl.textContent = footer.copyright;

  // Kontaktlänkar – renderas i footer-contact-list
  const lista = document.getElementById("footer-contact-list");
  if (!lista || !footer.contact) return;

  const c = footer.contact;
  const poster = [
    { href: "mailto:" + (c.email || ""),                    label: c.email },
    { href: "tel:"    + (c.phone || "").replace(/\s/g, ""), label: c.phone },
    { href: c.linkedin || "#", label: "LinkedIn", extern: true },
  ];

  poster.forEach(({ href, label, extern }) => {
    if (!href || !label) return;
    const li = document.createElement("li");
    const a  = document.createElement("a");
    a.href        = href;
    a.textContent = label;
    if (extern) {
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener noreferrer");
    }
    li.appendChild(a);
    lista.appendChild(li);
  });
}


/* ============================================
   Smooth scroll med offset för fast navbar
   ============================================ */

/**
 * Hanterar klick på navbar-länkarna och scrollar till rätt sektion
 * med hänsyn till navbarens höjd så innehållet inte döljs.
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((länk) => {
    länk.addEventListener("click", (e) => {
      const mål = länk.getAttribute("href").slice(1);
      // Tom ankar-länk (#) scrollar bara till toppen
      if (!mål) return;

      const målelement = document.getElementById(mål);
      if (!målelement) return;

      e.preventDefault();

      const navbar    = document.querySelector(".navbar");
      const offset    = navbar ? navbar.offsetHeight : 0;
      const topp      = målelement.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top: topp, behavior: "smooth" });
    });
  });
}


/* ---- Starta när DOM är redo ---- */
document.addEventListener("DOMContentLoaded", () => {
  loadContent();
  initSmoothScroll();
});
