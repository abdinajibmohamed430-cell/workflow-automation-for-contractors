const REDIRECT_DELAY_MILLISECONDS = 700;
const PUBLIC_ORIGIN = "https://jibauto.net";

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
    reviewUrl: "https://search.google.com/local/writereview?placeid=ChIJpQmgMoQys1IRID1e5YB8eMo"
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
    reviewUrl: "https://search.google.com/local/writereview?placeid=ChIJe_YyOiUzs1IR0qgYBD0rkUM"
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
  }
];

const searchParams = new URLSearchParams(window.location.search);
let requestedShop = "";
searchParams.forEach(function (value, key) {
  if (key === "shop" && requestedShop === "") {
    requestedShop = String(value || "").trim().toLowerCase();
  }
});

const eyebrow = document.getElementById("eyebrow");
const businessName = document.getElementById("business-name");
const addressLine = document.getElementById("address");
const supportLine = document.getElementById("support-line");
const reviewButton = document.getElementById("review-button");
const showcase = document.getElementById("showcase");
const loadingOverlay = document.getElementById("loading-overlay");

let activeReviewUrl = "";

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

function showCorporateOverview() {
  const description = "One NFC tap opens the Google review for the restaurant on the counter.";
  eyebrow.textContent = "Overview";
  businessName.textContent = "JibAuto Systems";
  addressLine.hidden = true;
  addressLine.textContent = "";
  supportLine.textContent = description;
  reviewButton.hidden = true;
  activeReviewUrl = "";
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
  const description = "Tap once to leave a 5-star review for " + client.name + ".";
  const pageUrl = PUBLIC_ORIGIN + "/?shop=" + client.shop;
  eyebrow.textContent = "Minneapolis";
  businessName.textContent = client.name;
  addressLine.hidden = false;
  addressLine.textContent = client.address;
  supportLine.textContent = "Your support keeps us cooking! Tap below to share your experience.";
  reviewButton.hidden = false;
  activeReviewUrl = client.reviewUrl;
  showcase.hidden = true;
  showcase.replaceChildren();
  setPageIdentity(client.name, description, pageUrl);
}

const matchedClient = findClient(requestedShop);
if (matchedClient) {
  showClient(matchedClient);
} else {
  showCorporateOverview();
}

function beginReviewRedirect() {
  if (!activeReviewUrl) {
    return;
  }
  reviewButton.disabled = true;
  loadingOverlay.hidden = false;
  window.requestAnimationFrame(function () {
    window.requestAnimationFrame(function () {
      loadingOverlay.classList.add("open");
    });
  });
  window.setTimeout(function () {
    window.location.assign(activeReviewUrl);
  }, REDIRECT_DELAY_MILLISECONDS);
}

reviewButton.addEventListener("click", beginReviewRedirect);
