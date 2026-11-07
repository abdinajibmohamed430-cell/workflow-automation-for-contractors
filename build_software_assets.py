#!/usr/bin/env python3
"""Write both offline web apps and the plain-language guide."""

from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parent
WEBRING = ROOT / "📁 01_rotate_ad_webring"
COUNTER = ROOT / "📁 02_counter_nfc_dashboard"
GUIDE = ROOT / "LEARNING_BLUEPRINT.md"
STORE = "https://ko-fi.com"

WEBRING_HTML = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>RotateAd Traffic Webring</title>
  <style>
    :root { color-scheme: light; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: "Avenir Next", "Segoe UI", sans-serif; background: #f3efe6; color: #1c1915; }
    a { color: inherit; }
    header { padding: 28px 20px 8px; max-width: 1120px; margin: 0 auto; }
    .mark { margin: 0; letter-spacing: 0.14em; text-transform: uppercase; font-size: 0.78rem; }
    h1 { margin: 8px 0; font-size: clamp(2rem, 4vw, 3.4rem); line-height: 0.95; }
    header p { max-width: 62ch; }
    .buy { display: inline-block; margin: 8px 0 18px; padding: 14px 18px; background: #e23d2b; color: #fffdf8; text-decoration: none; font-weight: 700; border-radius: 999px; }
    .buy:hover { background: #b9281a; }
    main { max-width: 1120px; margin: 0 auto; padding: 0 20px 48px; }
    .matrix { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 14px; }
    .card { background: #fffdf8; border: 2px solid #1c1915; border-radius: 16px; padding: 12px; transition: transform 0.18s ease, box-shadow 0.18s ease; }
    .card:hover { transform: translateY(-4px); box-shadow: 6px 8px 0 #1c1915; }
    .seat { margin: 0 0 8px; font-size: 0.75rem; letter-spacing: 0.08em; text-transform: uppercase; }
    .banner { min-height: 108px; border-radius: 12px; padding: 14px; display: flex; flex-direction: column; justify-content: flex-end; color: #fffdf8; }
    .banner strong { font-size: 1.25rem; line-height: 1.15; }
    .line { min-height: 2.6em; }
    .actions { display: flex; gap: 8px; }
    button, .visit { font: inherit; border-radius: 999px; padding: 8px 12px; border: 2px solid #1c1915; background: #fffdf8; cursor: pointer; text-decoration: none; }
    .rotate { background: #1c1915; color: #fffdf8; }
    .landing { margin-top: 18px; padding: 18px; border: 2px solid #1c1915; border-radius: 16px; background: #fffdf8; }
    .landing[hidden] { display: none; }
  </style>
</head>
<body>
  <header>
    <p class="mark">RotateAd</p>
    <h1>Traffic webring</h1>
    <p>Twelve seats share one list of sample banners. Click a seat to move it to the next banner and the next landing link. After the last banner, that seat starts again at the top of the list.</p>
    <a class="buy" href="https://ko-fi.com">Buy a Seat · $5/month</a>
  </header>
  <main>
    <section id="matrix" class="matrix" aria-label="RotateAd Matrix"></section>
    <section id="landing" class="landing" hidden>
      <p class="mark">Landing page</p>
      <h2 id="landing-title"></h2>
      <p id="landing-copy"></p>
      <button type="button" id="landing-close">Close</button>
    </section>
  </main>
  <script>
    const banners = [
      { title: "Harbor Bread", line: "Morning loaf, baked before seven.", href: "#harbor-bread", tone: "#c4552a" },
      { title: "North Window Books", line: "A quiet seat and a used novel.", href: "#north-window", tone: "#245c4a" },
      { title: "Lamp and Co.", line: "Desk lamps for small rooms.", href: "#lamp-and-co", tone: "#1f3d6e" },
      { title: "Cedar Soap", line: "Three bars, wrapped in paper.", href: "#cedar-soap", tone: "#6e4b2a" },
      { title: "River Radio", line: "Tonight's local music hour.", href: "#river-radio", tone: "#7a2f45" },
      { title: "Field Notes Cafe", line: "One pastry, one ceramic cup.", href: "#field-notes", tone: "#3d5c2a" },
      { title: "Blue Stair Studio", line: "Drawing class on Thursday.", href: "#blue-stair", tone: "#2a4e6e" },
      { title: "Market Wool", line: "Scarves from this season's yarn.", href: "#market-wool", tone: "#6e3828" },
      { title: "Little Pier Bikes", line: "Tune-ups while you wait.", href: "#little-pier", tone: "#1d4d45" },
      { title: "Paper Kite", line: "Cards printed on the corner.", href: "#paper-kite", tone: "#5c3d73" },
      { title: "Gold Finch Plants", line: "A plant that likes a dim room.", href: "#gold-finch", tone: "#3f5c28" },
      { title: "Sunday Bowl", line: "Soup from two until sold out.", href: "#sunday-bowl", tone: "#8a3d22" },
      { title: "Oak Room Records", line: "Used albums, one dollar bin.", href: "#oak-room", tone: "#243044" },
      { title: "Kin Tailor", line: "Hems finished the same day.", href: "#kin-tailor", tone: "#5a4032" },
      { title: "West Lantern", line: "A walk after the shop lights come on.", href: "#west-lantern", tone: "#6a341f" },
      { title: "Moss and Tin", line: "Camping cups for the weekend.", href: "#moss-and-tin", tone: "#2f4a3c" }
    ];
    const seats = Array.from({ length: 12 }, function (_, index) { return index; });
    const matrix = document.getElementById("matrix");
    const landing = document.getElementById("landing");

    function draw() {
      matrix.innerHTML = seats.map(function (bannerIndex, seat) {
        const ad = banners[bannerIndex];
        const number = String(seat + 1).padStart(2, "0");
        return '<article class="card"><p class="seat">Seat ' + number + '</p><div class="banner" style="background:' + ad.tone + '"><strong>' + ad.title + '</strong></div><p class="line">' + ad.line + '</p><div class="actions"><button type="button" class="rotate" data-rotate="' + seat + '">Rotate</button><a class="visit" href="' + ad.href + '" data-open="' + seat + '">Open link</a></div></article>';
      }).join("");
    }

    matrix.addEventListener("click", function (event) {
      const rotate = event.target.closest("[data-rotate]");
      if (rotate) {
        const seat = Number(rotate.getAttribute("data-rotate"));
        seats[seat] = (seats[seat] + 1) % banners.length;
        draw();
        return;
      }
      const open = event.target.closest("[data-open]");
      if (!open) return;
      event.preventDefault();
      const ad = banners[seats[Number(open.getAttribute("data-open"))]];
      document.getElementById("landing-title").textContent = ad.title;
      document.getElementById("landing-copy").textContent = ad.line + " This sample landing page stays on this screen.";
      landing.hidden = false;
      landing.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    document.getElementById("landing-close").addEventListener("click", function () {
      landing.hidden = true;
    });

    draw();
  </script>
</body>
</html>
"""

COUNTER_HTML = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Counter-Stand NFC Punch Card</title>
  <style>
    :root { color-scheme: light; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: "Avenir Next", "Segoe UI", sans-serif; background: #f6f1e8; color: #1b1714; }
    .screen { max-width: 480px; margin: 0 auto; padding: 22px 16px 32px; }
    .mark { margin: 0; letter-spacing: 0.12em; text-transform: uppercase; font-size: 0.75rem; }
    h1 { margin: 8px 0 4px; font-size: 2rem; line-height: 1; }
    .card { background: #fffdf8; border: 3px solid #1b1714; border-radius: 22px; padding: 16px; }
    .count { margin: 0 0 12px; font-size: 1.1rem; }
    .stamps { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-bottom: 14px; }
    .stamp { aspect-ratio: 1; border-radius: 50%; border: 3px solid #1b1714; background: transparent; }
    .stamp.on { background: #1f6b4a; }
    .tap { width: 100%; min-height: 64px; margin-top: 4px; border: 0; border-radius: 16px; background: #1b1714; color: #fffdf8; font: inherit; font-size: 1.15rem; font-weight: 700; }
    .tap:disabled { background: #1f6b4a; }
    .next { width: 100%; margin-top: 8px; min-height: 48px; border-radius: 16px; border: 2px solid #1b1714; background: transparent; font: inherit; font-weight: 700; }
    .review { display: block; margin-top: 16px; padding: 18px; border-radius: 22px; background: #111; color: #fffdf8; text-decoration: none; }
    .review.ready { outline: 4px solid #ffe14a; }
    .review span { display: block; color: #ffe14a; font-size: 1.35rem; font-weight: 800; line-height: 1.25; margin-bottom: 8px; }
    .note { min-height: 1.2em; color: #ffe14a; }
    footer { margin-top: 16px; padding: 18px; border-radius: 22px; background: #fffdf8; border: 3px solid #1b1714; }
    footer a { display: block; margin-top: 12px; text-align: center; padding: 14px; border-radius: 14px; background: #1b1714; color: #fffdf8; text-decoration: none; font-weight: 700; }
  </style>
</head>
<body>
  <div class="screen">
    <p class="mark">Counter-Stand</p>
    <h1>Digital Punch Card</h1>
    <p>Tap once for each visit. This screen remembers the stamps on this device.</p>
    <section class="card" aria-label="Digital Punch Card">
      <p class="count" id="count">0 of 10 stamps</p>
      <div class="stamps" id="stamps"></div>
      <button type="button" class="tap" id="add">Add a stamp</button>
      <button type="button" class="next" id="reset">Next customer</button>
    </section>
    <a class="review" id="review" href="https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID">
      <span>Loving your service? Tap here to drop a 5-star Google Review!</span>
      <p class="note" id="review-note"></p>
    </a>
    <footer>
      <p class="mark">For the shop owner</p>
      <h2>License this counter</h2>
      <p>Keep this screen on the counter. License the system for $29/month from the Ko-fi shop.</p>
      <a href="https://ko-fi.com">License for $29/month</a>
    </footer>
  </div>
  <script>
    const GOOGLE_REVIEW_URL = "https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID";
    const STORAGE_KEY = "counter-nfc-stamps";
    const stamps = document.getElementById("stamps");
    const count = document.getElementById("count");
    const add = document.getElementById("add");
    const review = document.getElementById("review");
    const reviewNote = document.getElementById("review-note");
    let earned = Number(localStorage.getItem(STORAGE_KEY) || "0");
    if (earned < 0 || earned > 10 || Number.isNaN(earned)) earned = 0;

    function render() {
      localStorage.setItem(STORAGE_KEY, String(earned));
      stamps.innerHTML = "";
      for (let index = 1; index <= 10; index += 1) {
        const dot = document.createElement("div");
        dot.className = "stamp" + (index <= earned ? " on" : "");
        dot.setAttribute("aria-hidden", "true");
        stamps.appendChild(dot);
      }
      count.textContent = earned + " of 10 stamps";
      add.disabled = earned >= 10;
      add.textContent = earned >= 10 ? "Card is full" : "Add a stamp";
      review.classList.toggle("ready", earned >= 10);
      review.href = GOOGLE_REVIEW_URL;
    }

    add.addEventListener("click", function () {
      if (earned < 10) earned += 1;
      render();
    });

    document.getElementById("reset").addEventListener("click", function () {
      earned = 0;
      reviewNote.textContent = "";
      render();
    });

    review.addEventListener("click", function (event) {
      if (GOOGLE_REVIEW_URL.indexOf("YOUR_PLACE_ID") !== -1) {
        event.preventDefault();
        reviewNote.textContent = "The owner pastes the shop Google review link into this page. Until then, this tap stays on the counter.";
      }
    });

    render();
  </script>
</body>
</html>
"""

GUIDE = """# How the two screens work

Both screens are single pages. Open the file and they run on the computer in front of you. No account is required.

## How the ad seats take turns

The webring keeps one list of sample banners. Each banner has a name, a short line, and a landing link.

Twelve boxes sit on the page. Each box remembers which item on the list it is showing. They start on twelve different items so the grid does not look like copies.

When you press Rotate on a box, that box alone steps forward one item. Its picture, its words, and its landing link all change together. When a box is on the last item, the next press brings it back to the first item. The other eleven boxes stay where they are.

Open link shows that seat's current landing page on the same screen, so you can see the link change after a rotation without leaving the page.

Buy a Seat goes to the Ko-fi shop at https://ko-fi.com. The price on the button is $5 a month.

## How the counter loops

The punch card has ten circles. Each press of Add a stamp fills the next circle, from 1 through 10. The page saves that number on the device, so a refresh does not wipe the card.

At 10, the card is full and the dark review card is highlighted. It reads: Loving your service? Tap here to drop a 5-star Google Review!

That tap is the redirect. When the shop owner has pasted their own Google review link into the page, the tap opens that Google page. Until then, the tap stays on the counter and tells them the link is still the sample.

Next customer sets the count back to zero. The same screen is ready for the next person. That is the loop: stamps, a full card, the review tap, then a clear card.

The footer is for the owner. It links to the same Ko-fi shop and shows the license price of $29 a month.

## What stays on this machine

The pages open from their folders with no network. The Ko-fi buttons and a finished Google review link use the internet only after someone taps them.
"""


def main() -> None:
    WEBRING.mkdir(parents=True, exist_ok=True)
    COUNTER.mkdir(parents=True, exist_ok=True)
    webring_path = WEBRING / "index.html"
    counter_path = COUNTER / "index.html"
    webring_path.write_text(WEBRING_HTML, encoding="utf-8")
    guide_path = ROOT / "LEARNING_BLUEPRINT.md"
    guide_path.write_text(GUIDE_TEXT, encoding="utf-8")
    _check(webring_path, counter_path, guide_path)
    print("=" * 64)
    print("JIB ENTERPRISE SOFTWARE INCUBATOR")
    print("BOTH ENGINES ARMED")
    print(f"  Webring   {webring_path}")
    print(f"  Counter   {counter_path}")
    print(f"  Guide     {guide_path}")
    print("=" * 64)


GUIDE_TEXT = GUIDE


def _check(webring_path: Path, counter_path: Path, guide_path: Path) -> None:
    webring = webring_path.read_text(encoding="utf-8")
    counter = counter_path.read_text(encoding="utf-8")
    guide = guide_path.read_text(encoding="utf-8")
    required = (
        (webring, "RotateAd Matrix"),
        (webring, "Buy a Seat"),
        (webring, STORE),
        (webring, "$5/month"),
        (webring, "const banners"),
        (counter, "Leave a Quick 5-Star Review"),
        (counter, "Your support keeps us cooking! Tap below to share your experience."),
        (guide, "Twelve boxes"),
        (guide, "12 hours"),
    )
    missing = [phrase for text, phrase in required if phrase not in text]
    if "length: 12" not in webring:
        missing.append("12 seats")
    if missing:
        raise SystemExit("Missing required copy: " + ", ".join(missing))


if __name__ == "__main__":
    main()
