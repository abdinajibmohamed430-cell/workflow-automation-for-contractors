const PUBLIC_ORIGIN = "https://jibauto.net";
const MAWDAH_BULLETIN = "🌸 MAWDAH EVENTS: Community Paint & Sip Night this Thursday at 6PM! Grab a drink and create art!";
const MAWDAH_VOUCHER = "✨ VIP REWARD UNLOCKED: Show this voucher to the cashier for 10% off your next Date Smoothie or Salted Maple Matcha!";

const CLIENTS = [
  {
    shop: "lotus",
    name: "The Lotus Restaurant in Minneapolis",
    address: "113 W Grant St, Minneapolis, MN 55403",
    reviewUrl: "https://search.google.com/local/writereview?placeid=ChIJWUEQhb8ys1IRjCHmPOynASE"
  },
  {
    shop: "spoon",
    name: "Spoon and Stable",
    address: "211 First Street North, Minneapolis, MN 55401",
    reviewUrl: "https://search.google.com/local/writereview?placeid=ChIJpQmgMoQys1IRID1e5YB8eMo",
    theme: {
      backgroundColor: "#FDFBF7",
      backgroundAccentColor: "#EFE6D8",
      cardColor: "#FFFcf8",
      borderColor: "#585244",
      sageColor: "#E7E1D6",
      sageInkColor: "#585244",
      textColor: "#221f20",
      mutedTextColor: "#6d675f",
      accentColor: "#221f20",
      accentInkColor: "#f4f3f1",
      buttonGradientStart: "#3a342c",
      buttonGradientEnd: "#221f20",
      buttonShadowColor: "#221f2026",
      overlayColor: "#221f20b3",
      headingFontWeight: "600",
      buttonFontWeight: "600"
    }
  },
  {
    shop: "tale",
    name: "The Butcher's Tale",
    address: "1121 Hennepin Avenue, Minneapolis, MN 55403",
    reviewUrl: "https://search.google.com/local/writereview?placeid=ChIJweDHAY0zs1IRUMtMvFN9GFE"
  },
  {
    shop: "boar",
    name: "Butcher & the Boar",
    address: "901 N 3rd St, Suite 195, Minneapolis, MN 55401",
    reviewUrl: "https://search.google.com/local/writereview?placeid=ChIJe_YyOiUzs1IR0qgYBD0rkUM",
    theme: {
      backgroundColor: "#FDFBF7",
      backgroundAccentColor: "#E6E6E6",
      cardColor: "#FFFcf8",
      borderColor: "#3e3e3e",
      sageColor: "#EFEFEF",
      sageInkColor: "#3e3e3e",
      textColor: "#272727",
      mutedTextColor: "#6e6e6e",
      accentColor: "#272727",
      accentInkColor: "#f6f6f6",
      buttonGradientStart: "#3e3e3e",
      buttonGradientEnd: "#272727",
      buttonShadowColor: "#27272726",
      overlayColor: "#272727b3",
      headingFontWeight: "600",
      buttonFontWeight: "600"
    }
  },
  {
    shop: "bucheron",
    name: "Bûcheron",
    address: "4257 Nicollet Ave, Minneapolis, MN 55409",
    reviewUrl: "https://search.google.com/local/writereview?placeid=ChIJKUStfyEn9ocRSvEKf8e3aGk"
  },
  {
    shop: "cabana",
    name: "The Cabana Club",
    address: "201 SE Main St, Minneapolis, MN 55414",
    reviewUrl: "https://search.google.com/local/writereview?placeid=ChIJyaGiHTUts1IRFw_oS8M8AL8"
  },
  {
    shop: "mawdah",
    name: "Mawdah Cafe | Minneapolis Hub",
    address: "505 E Lake St, Minneapolis, MN 55408",
    reviewUrl: "https://search.google.com/local/writereview?placeid=ChIJE8f4JwAn9ocRqmyc2k2Kca0",
    theme: {
      backgroundColor: "#FDFBF7",
      backgroundAccentColor: "#F6E8E4",
      cardColor: "#FFFcf8",
      borderColor: "#EAA9A9",
      sageColor: "#E4EBE0",
      sageInkColor: "#6E7F68",
      textColor: "#3C332E",
      mutedTextColor: "#7A6E68",
      accentColor: "#EAA9A9",
      accentInkColor: "#3C332E",
      buttonGradientStart: "#F6D2D2",
      buttonGradientEnd: "#EAA9A9",
      buttonShadowColor: "#EAA9A966",
      overlayColor: "#3C332E99",
      headingFontWeight: "600",
      buttonFontWeight: "600"
    }
  }
];

const searchParams = new URLSearchParams(window.location.search);
let requestedShop = "";
searchParams.forEach(function (value, key) {
  if (key === "shop" && requestedShop === "") {
    requestedShop = String(value || "").trim().toLowerCase();
  }
});

const bulletin = document.getElementById("bulletin");
const eyebrow = document.getElementById("eyebrow");
const businessName = document.getElementById("business-name");
const addressLine = document.getElementById("address");
const supportLine = document.getElementById("support-line");
const reviewButton = document.getElementById("review-button");
const showcase = document.getElementById("showcase");
const voucherSheet = document.getElementById("voucher-sheet");
const voucherCopy = document.getElementById("voucher-copy");
const voucherContinue = document.getElementById("voucher-continue");
const voucherClose = document.getElementById("voucher-close");

let activeClient = null;

function applyClientTheme(client) {
  const rootStyle = document.documentElement.style;
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const theme = client && client.theme ? client.theme : null;
  if (!theme) {
    rootStyle.removeProperty("--background-color");
    rootStyle.removeProperty("--background-accent-color");
    rootStyle.removeProperty("--card-color");
    rootStyle.removeProperty("--border-color");
    rootStyle.removeProperty("--sage-color");
    rootStyle.removeProperty("--sage-ink-color");
    rootStyle.removeProperty("--text-color");
    rootStyle.removeProperty("--muted-text-color");
    rootStyle.removeProperty("--accent-color");
    rootStyle.removeProperty("--accent-ink-color");
    rootStyle.removeProperty("--button-gradient-start");
    rootStyle.removeProperty("--button-gradient-end");
    rootStyle.removeProperty("--button-shadow-color");
    rootStyle.removeProperty("--overlay-color");
    rootStyle.removeProperty("--heading-font-weight");
    rootStyle.removeProperty("--button-font-weight");
    if (themeColor) {
      themeColor.setAttribute("content", "#FDFBF7");
    }
    return;
  }
  rootStyle.setProperty("--background-color", theme.backgroundColor);
  rootStyle.setProperty("--background-accent-color", theme.backgroundAccentColor);
  rootStyle.setProperty("--card-color", theme.cardColor);
  rootStyle.setProperty("--border-color", theme.borderColor);
  rootStyle.setProperty("--sage-color", theme.sageColor);
  rootStyle.setProperty("--sage-ink-color", theme.sageInkColor);
  rootStyle.setProperty("--text-color", theme.textColor);
  rootStyle.setProperty("--muted-text-color", theme.mutedTextColor);
  rootStyle.setProperty("--accent-color", theme.accentColor);
  rootStyle.setProperty("--accent-ink-color", theme.accentInkColor);
  rootStyle.setProperty("--button-gradient-start", theme.buttonGradientStart);
  rootStyle.setProperty("--button-gradient-end", theme.buttonGradientEnd);
  rootStyle.setProperty("--button-shadow-color", theme.buttonShadowColor);
  rootStyle.setProperty("--overlay-color", theme.overlayColor);
  rootStyle.setProperty("--heading-font-weight", theme.headingFontWeight);
  rootStyle.setProperty("--button-font-weight", theme.buttonFontWeight);
  if (themeColor) {
    themeColor.setAttribute("content", theme.backgroundColor);
  }
}

function findClient(shop) {
  for (let index = 0; index < CLIENTS.length; index += 1) {
    if (CLIENTS[index].shop === shop) {
      return CLIENTS[index];
    }
  }
  return null;
}

function setContent(selector, content) {
  const node = document.querySelector(selector);
  if (node) {
    node.setAttribute("content", content);
  }
}

function setPageIdentity(title, description, url) {
  document.title = title;
  setContent('meta[name="description"]', description);
  setContent('meta[property="og:title"]', title);
  setContent('meta[property="og:description"]', description);
  setContent('meta[property="og:url"]', url);
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) {
    canonical.setAttribute("href", url);
  }
}

function closeVoucher() {
  voucherSheet.classList.remove("open");
  voucherSheet.hidden = true;
}

function openVoucher() {
  voucherCopy.textContent = MAWDAH_VOUCHER;
  voucherSheet.hidden = false;
  window.requestAnimationFrame(function () {
    voucherSheet.classList.add("open");
  });
}

function showCorporateOverview() {
  const description = "One NFC tap opens the Google review for the shop on the counter.";
  activeClient = null;
  applyClientTheme(null);
  closeVoucher();
  bulletin.hidden = true;
  bulletin.textContent = "";
  eyebrow.textContent = "Overview";
  businessName.textContent = "JibAuto Systems";
  addressLine.hidden = true;
  addressLine.textContent = "";
  supportLine.textContent = description;
  reviewButton.hidden = true;
  showcase.hidden = false;
  showcase.replaceChildren();
  for (let index = 0; index < CLIENTS.length; index += 1) {
    const client = CLIENTS[index];
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = "?shop=" + client.shop;
    link.textContent = client.name;
    const detail = document.createElement("span");
    detail.textContent = client.address;
    link.appendChild(detail);
    item.appendChild(link);
    showcase.appendChild(item);
  }
  setPageIdentity("JibAuto Systems", description, PUBLIC_ORIGIN);
}

function showClient(client) {
  const description = "Tap once to leave a Google review for " + client.name + ".";
  const pageUrl = PUBLIC_ORIGIN + "/?shop=" + client.shop;
  activeClient = client;
  applyClientTheme(client);
  closeVoucher();
  if (client.shop === "mawdah") {
    bulletin.hidden = false;
    bulletin.textContent = MAWDAH_BULLETIN;
  } else {
    bulletin.hidden = true;
    bulletin.textContent = "";
  }
  eyebrow.textContent = "Minneapolis";
  businessName.textContent = client.name;
  addressLine.hidden = false;
  addressLine.textContent = client.address;
  supportLine.textContent = "Tap below to share your experience.";
  reviewButton.hidden = false;
  showcase.hidden = true;
  showcase.replaceChildren();
  setPageIdentity(client.name, description, pageUrl);
}

function beginReview() {
  if (!activeClient) {
    return;
  }
  if (activeClient.shop === "mawdah") {
    openVoucher();
    return;
  }
  window.location.assign(activeClient.reviewUrl);
}

function continueToReview() {
  if (!activeClient) {
    return;
  }
  window.location.assign(activeClient.reviewUrl);
}

const matchedClient = findClient(requestedShop);
if (matchedClient) {
  showClient(matchedClient);
} else {
  showCorporateOverview();
}

reviewButton.addEventListener("click", beginReview);
voucherContinue.addEventListener("click", continueToReview);
voucherClose.addEventListener("click", closeVoucher);
