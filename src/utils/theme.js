export function applyTheme() {
  const configStr = localStorage.getItem("netto_branding");
  const config = configStr ? JSON.parse(configStr) : {
    themePrimary: "#2940D3",
    themeSecondary: "#142297",
    landingPrimary: "#3957ED",
    landingSecondary: "#80C8F6"
  };

  const primary = config.themePrimary || "#2940D3";
  const secondary = config.themeSecondary || "#142297";
  const lPrimary = config.landingPrimary || "#3957ED";
  const lSecondary = config.landingSecondary || "#80C8F6";

  const primaryRgb = hexToRgb(primary);
  const secondaryRgb = hexToRgb(secondary);
  const lPrimaryRgb = hexToRgb(lPrimary);
  const lSecondaryRgb = hexToRgb(lSecondary);

  document.documentElement.style.setProperty("--color-primary", primary);
  document.documentElement.style.setProperty("--color-secondary", secondary);

  let styleEl = document.getElementById("dynamic-theme-style");
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = "dynamic-theme-style";
    document.head.appendChild(styleEl);
  }

  styleEl.innerHTML = `
    /* Override primary #2940D3 classes (Admin Dashboard) */
    .bg-\\[\\#2940D3\\] { background-color: ${primary} !important; }
    .text-\\[\\#2940D3\\] { color: ${primary} !important; }
    .border-\\[\\#2940D3\\] { border-color: ${primary} !important; }
    .from-\\[\\#2940D3\\] { --tw-gradient-from: ${primary} !important; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(41, 64, 211, 0)) !important; }
    .to-\\[\\#2940D3\\] { --tw-gradient-to: ${primary} !important; }
    .hover\\:bg-\\[\\#2940D3\\]\\/90:hover { background-color: ${primary}e6 !important; }
    .hover\\:bg-\\[\\#2940D3\\]:hover { background-color: ${primary} !important; }
    .hover\\:text-\\[\\#2940D3\\]:hover { color: ${primary} !important; }
    .border-\\[\\#2940D3\\]\\/20 { border-color: rgba(${primaryRgb}, 0.2) !important; }
    .bg-\\[\\#2940D3\\]\\/5 { background-color: rgba(${primaryRgb}, 0.05) !important; }
    .bg-\\[\\#2940D3\\]\\/10 { background-color: rgba(${primaryRgb}, 0.1) !important; }
    .text-\\[\\#2940D3\\]\\/10 { color: rgba(${primaryRgb}, 0.1) !important; }
    .focus-within\\:border-\\[\\#2940D3\\]:focus-within { border-color: ${primary} !important; }
    .focus-within\\:ring-\\[\\#2940D3\\]\\/20:focus-within { --tw-ring-color: rgba(${primaryRgb}, 0.2) !important; }

    /* Override secondary #142297 classes (Admin Dashboard) */
    .bg-\\[\\#142297\\] { background-color: ${secondary} !important; }
    .text-\\[\\#142297\\] { color: ${secondary} !important; }
    .border-\\[\\#142297\\] { border-color: ${secondary} !important; }
    .from-\\[\\#142297\\] { --tw-gradient-from: ${secondary} !important; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(20, 34, 151, 0)) !important; }
    .to-\\[\\#142297\\] { --tw-gradient-to: ${secondary} !important; }
    .hover\\:bg-\\[\\#142297\\]:hover { background-color: ${secondary} !important; }
    .hover\\:bg-\\[\\#142297\\]\\/90:hover { background-color: ${secondary}e6 !important; }
    .bg-\\[\\#142297\\]\\/10 { background-color: rgba(${secondaryRgb}, 0.1) !important; }

    /* Override primary #3957ED classes (Guest Landing Page) */
    .bg-\\[\\#3957ED\\] { background-color: ${lPrimary} !important; }
    .text-\\[\\#3957ED\\] { color: ${lPrimary} !important; }
    .border-\\[\\#3957ED\\] { border-color: ${lPrimary} !important; }
    .from-\\[\\#3957ED\\] { --tw-gradient-from: ${lPrimary} !important; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(57, 87, 237, 0)) !important; }
    .to-\\[\\#3957ED\\] { --tw-gradient-to: ${lPrimary} !important; }
    .hover\\:bg-\\[\\#3957ED\\]:hover { background-color: ${lPrimary} !important; }
    .hover\\:text-\\[\\#3957ED\\]:hover { color: ${lPrimary} !important; }
    .bg-\\[\\#3957ED\\]\\/5 { background-color: rgba(${lPrimaryRgb}, 0.05) !important; }
    .bg-\\[\\#3957ED\\]\\/10 { background-color: rgba(${lPrimaryRgb}, 0.1) !important; }
    .bg-\\[\\#3957ED\\]\\/20 { background-color: rgba(${lPrimaryRgb}, 0.2) !important; }
    .bg-\\[\\#3957ED\\]\\/25 { background-color: rgba(${lPrimaryRgb}, 0.25) !important; }
    .border-\\[\\#3957ED\\]\\/20 { border-color: rgba(${lPrimaryRgb}, 0.2) !important; }
    .border-\\[\\#3957ED\\]\\/25 { border-color: rgba(${lPrimaryRgb}, 0.25) !important; }
    .focus\\:border-\\[\\#3957ED\\]:focus { border-color: ${lPrimary} !important; }
    .focus\\:ring-\\[\\#3957ED\\]\\/10:focus { --tw-ring-color: rgba(${lPrimaryRgb}, 0.1) !important; }
    .selection\\:bg-\\[\\#3957ED\\]\\/20 *::selection { background-color: rgba(${lPrimaryRgb}, 0.2) !important; }
    .selection\\:text-\\[\\#3957ED\\] *::selection { color: ${lPrimary} !important; }
    .group:hover .group-hover\\:text-\\[\\#3957ED\\] { color: ${lPrimary} !important; }
    .group-hover\\:text-\\[\\#3957ED\\] { transition: color 0.2s; }

    /* Override secondary #80C8F6 classes (Guest Landing Page) */
    .from-\\[\\#80C8F6\\] { --tw-gradient-from: ${lSecondary} !important; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(128, 200, 246, 0)) !important; }
    .to-\\[\\#80C8F6\\] { --tw-gradient-to: ${lSecondary} !important; }
    .bg-\\[\\#80C8F6\\] { background-color: ${lSecondary} !important; }
    .text-\\[\\#80C8F6\\] { color: ${lSecondary} !important; }
  `;
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? 
    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
    "41, 64, 211";
}
