const REDIRECT_DELAY_MILLISECONDS = 700;
const PUBLIC_ORIGIN = "https://jibauto.net";

const CLIENTS = [
  {
    shop: "lotus",
    name: "The Lotus Restaurant in Minneapolis",
    address: "113 W Grant St, Minneapolis, MN 55403",
    reviewUrl: "https://search.google.com/local/writereview?placeid=ChIJWUEQhb8ys1IRjCHmPOynASE",
    staffPin: "4811"
  },
  {
    shop: "spoon",
    name: "Spoon and Stable",
    address: "211 First Street North, Minneapolis, MN 55401",
    reviewUrl: "https://search.google.com/local/writereview?placeid=ChIJpQmgMoQys1IRID1e5YB8eMo",
    staffPin: "4822"
  },
  {
    shop: "tale",
    name: "The Butcher's Tale",
    address: "1121 Hennepin Avenue, Minneapolis, MN 55403",
    reviewUrl: "https://search.google.com/local/writereview?placeid=ChIJweDHAY0zs1IRUMtMvFN9GFE",
    staffPin: "4833"
  },
  {
    shop: "boar",
    name: "Butcher & the Boar",
    address: "901 N 3rd St, Suite 195, Minneapolis, MN 55401",
    reviewUrl: "https://search.google.com/local/writereview?placeid=ChIJe_YyOiUzs1IR0qgYBD0rkUM",
    staffPin: "4844"
  },
  {
    shop: "bucheron",
    name: "Bûcheron",
    address: "4257 Nicollet Ave, Minneapolis, MN 55409",
    reviewUrl: "https://search.google.com/local/writereview?placeid=ChIJKUStfyEn9ocRSvEKf8e3aGk",
    staffPin: "4855"
  },
  {
    shop: "cabana",
    name: "The Cabana Club",
    address: "201 SE Main St, Minneapolis, MN 55414",
    reviewUrl: "https://search.google.com/local/writereview?placeid=ChIJyaGiHTUts1IRFw_oS8M8AL8",
    staffPin: "4866"
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
const stampButton = document.getElementById("stamp-button");
const telemetry = document.getElementById("telemetry");
const checkinCount = document.getElementById("checkin-count");
const stampLabel = document.getElementById("stamp-label");
const stampRow = document.getElementById("stamp-row");
const showcase = document.getElementById("showcase");
const loadingOverlay = document.getElementById("loading-overlay");
const pinSheet = document.getElementById("pin-sheet");
const pinStatus = document.getElementById("pin-status");
const pinDots = document.getElementById("pin-dots");
const pinKeys = document.getElementById("pin-keys");
const pinCancel = document.getElementById("pin-cancel");

let activeReviewUrl = "";
let activeClient = null;
let enteredPin = "";

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

function storageKey(shop) {
  return "jibauto.stamps." + shop;
}

function readStampCount(shop) {
  try {
    const value = Number(window.localStorage.getItem(storageKey(shop)));
    if (Number.isFinite(value) && value > 0) {
      return Math.floor(value);
    }
  } catch (error) {
    return 0;
  }
  return 0;
}

function writeStampCount(shop, count) {
  try {
    window.localStorage.setItem(storageKey(shop), String(count));
    return true;
  } catch (error) {
    return false;
  }
}

function renderStampState(count) {
  checkinCount.textContent = String(count);
  stampLabel.textContent = count === 1 ? "1 verified stamp" : count + " verified stamps";
  stampRow.replaceChildren();
  const marks = count === 0 ? 0 : (count % 10 === 0 ? 10 : count % 10);
  for (let index = 0; index < 10; index += 1) {
    const mark = document.createElement("i");
    if (index < marks) {
      mark.className = "filled";
    }
    stampRow.appendChild(mark);
  }
}

function renderPinDots() {
  pinDots.replaceChildren();
  for (let index = 0; index < 4; index += 1) {
    const dot = document.createElement("i");
    if (index < enteredPin.length) {
      dot.className = "filled";
    }
    pinDots.appendChild(dot);
  }
}

function closePinSheet() {
  pinSheet.classList.remove("open");
  pinSheet.hidden = true;
  enteredPin = "";
  pinStatus.textContent = "Ask the cashier to enter the 4-digit code.";
  renderPinDots();
}

function openPinSheet() {
  if (!activeClient) {
    return;
  }
  enteredPin = "";
  pinStatus.textContent = "Ask the cashier to enter the 4-digit code.";
  renderPinDots();
  pinSheet.hidden = false;
  window.requestAnimationFrame(function () {
    pinSheet.classList.add("open");
  });
}

function acceptStamp() {
  const nextCount = readStampCount(activeClient.shop) + 1;
  if (!writeStampCount(activeClient.shop, nextCount)) {
    pinStatus.textContent = "This device could not save the stamp.";
    enteredPin = "";
    renderPinDots();
    return;
  }
  renderStampState(nextCount);
  closePinSheet();
}

function submitPinDigit(digit) {
  if (!activeClient || enteredPin.length >= 4) {
    return;
  }
  enteredPin += digit;
  renderPinDots();
  if (enteredPin.length < 4) {
    return;
  }
  if (enteredPin === activeClient.staffPin) {
    acceptStamp();
    return;
  }
  pinStatus.textContent = "That code does not match this shop.";
  enteredPin = "";
  window.setTimeout(renderPinDots, 180);
}

function showCorporateOverview() {
  const description = "One NFC tap opens the Google review for the restaurant on the counter.";
  activeClient = null;
  closePinSheet();
  eyebrow.textContent = "Overview";
  businessName.textContent = "JibAuto Systems";
  addressLine.hidden = true;
  addressLine.textContent = "";
  supportLine.textContent = description;
  reviewButton.hidden = true;
  stampButton.hidden = true;
  telemetry.hidden = true;
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
  activeClient = client;
  closePinSheet();
  eyebrow.textContent = "Minneapolis";
  businessName.textContent = client.name;
  addressLine.hidden = false;
  addressLine.textContent = client.address;
  supportLine.textContent = "Your support keeps us cooking! Tap below to share your experience.";
  reviewButton.hidden = false;
  stampButton.hidden = false;
  telemetry.hidden = false;
  renderStampState(readStampCount(client.shop));
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
stampButton.addEventListener("click", openPinSheet);
pinCancel.addEventListener("click", closePinSheet);

const pinLayout = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "delete"];
for (let index = 0; index < pinLayout.length; index += 1) {
  const label = pinLayout[index];
  const key = document.createElement("button");
  key.type = "button";
  if (label === "") {
    key.tabIndex = -1;
    key.setAttribute("aria-hidden", "true");
    key.style.visibility = "hidden";
  } else if (label === "delete") {
    key.textContent = "Delete";
    key.addEventListener("click", function () {
      enteredPin = enteredPin.slice(0, -1);
      pinStatus.textContent = "Ask the cashier to enter the 4-digit code.";
      renderPinDots();
    });
  } else {
    key.textContent = label;
    key.addEventListener("click", function () {
      submitPinDigit(label);
    });
  }
  pinKeys.appendChild(key);
}
renderPinDots();
