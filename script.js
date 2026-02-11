/**
 * Portfolio - Laddar innehåll från content.json
 * Redigera content.json för att uppdatera texter och appar.
 */

async function loadContent() {
  try {
    const response = await fetch("content.json?t=" + Date.now());
    if (!response.ok) throw new Error("Kunde inte ladda content.json");
    const data = await response.json();

    renderHero(data.hero);
    renderAbout(data.about);
    renderApps(data.apps || []);
    renderFooter(data.footer);
  } catch (err) {
    console.error("Fel vid laddning av innehåll:", err);
    document.getElementById("about-text").textContent =
      "Kunde inte ladda innehåll. Kontrollera att content.json finns.";
  }
}

/** Fyller hero med titel och undertitel */
function renderHero(hero) {
  if (!hero) return;
  const titleEl = document.getElementById("hero-title");
  const subtitleEl = document.getElementById("hero-subtitle");
  if (titleEl) titleEl.textContent = hero.title || "";
  if (subtitleEl) subtitleEl.textContent = hero.subtitle || "";
}

/** Fyller om-mig-sektionen */
function renderAbout(about) {
  if (!about) return;
  const headingEl = document.getElementById("about-heading");
  const textEl = document.getElementById("about-text");
  if (headingEl) headingEl.textContent = about.heading || "";
  if (textEl) textEl.textContent = about.text || "";
}

/** Skapar klickbara app-kort */
function renderApps(apps) {
  const grid = document.getElementById("apps-grid");
  if (!grid) return;

  grid.innerHTML = "";

  apps.forEach((app) => {
    const card = document.createElement("div");
    card.className = "app-card";

    // App-ikon till vänster
    const img = document.createElement("img");
    img.src = app.image || "favicon_io/android-chrome-192x192.png";
    img.alt = app.name;
    img.className = "app-card-icon";
    card.appendChild(img);

    const body = document.createElement("div");
    body.className = "app-card-body";

    const title = document.createElement("h3");
    title.textContent = app.name || "App";
    body.appendChild(title);

    const desc = document.createElement("p");
    desc.textContent = app.description || "";
    body.appendChild(desc);

    // Tekniska specifikationer – klick visar/döljer listan
    if (app.tech && app.tech.length > 0) {
      const specsToggle = document.createElement("button");
      specsToggle.type = "button";
      specsToggle.className = "app-card-specs-toggle";
      specsToggle.textContent = "Tekniska specifikationer";
      specsToggle.setAttribute("aria-expanded", "false");

      const specsList = document.createElement("ul");
      specsList.className = "app-card-specs-list";
      specsList.hidden = true;
      app.tech.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        specsList.appendChild(li);
      });

      specsToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = specsList.hidden;
        specsList.hidden = !isOpen;
        specsToggle.setAttribute("aria-expanded", String(!isOpen));
      });

      body.appendChild(specsToggle);
      body.appendChild(specsList);
    }

    // Besök appen → | Appnamn (länk)
    const linkRow = document.createElement("div");
    linkRow.className = "app-card-link-row";
    linkRow.innerHTML = "Besök appen → ";
    const visitLink = document.createElement("a");
    visitLink.href = app.url || "#";
    visitLink.className = "app-card-link";
    visitLink.setAttribute("target", "_blank");
    visitLink.setAttribute("rel", "noopener noreferrer");
    visitLink.textContent = app.name || "App";
    linkRow.appendChild(visitLink);
    body.appendChild(linkRow);

    card.appendChild(body);
    grid.appendChild(card);
  });
}

/** Fyller footer med text och kontaktuppgifter + ikoner */
function renderFooter(footer) {
  if (!footer) return;
  const textEl = document.getElementById("footer-text");
  if (textEl) textEl.textContent = footer.text || "";

  const contactEl = document.getElementById("footer-contact");
  if (!contactEl || !footer.contact) return;

  contactEl.innerHTML = "";

  const contacts = [
    {
      type: "phone",
      href: "tel:" + (footer.contact.phone || "").replace(/\s/g, ""),
      label: footer.contact.phone,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    },
    {
      type: "email",
      href: "mailto:" + (footer.contact.email || ""),
      label: footer.contact.email,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
    },
    {
      type: "linkedin",
      href: footer.contact.linkedin || "#",
      label: "LinkedIn",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
    },
  ];

  contacts.forEach((c) => {
    if (!c.href || c.href === "tel:" || c.href === "mailto:") return;
    const a = document.createElement("a");
    a.href = c.href;
    a.className = "footer-contact-link";
    if (c.href.startsWith("http")) {
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener noreferrer");
    }
    a.setAttribute("aria-label", c.label);
    a.innerHTML = c.icon + '<span>' + c.label + "</span>";
    contactEl.appendChild(a);
  });
}

// Starta när sidan laddats
document.addEventListener("DOMContentLoaded", loadContent);
