const BUSINESS_NAME = "The Lotus Restaurant in Minneapolis";
const SUPPORT_LINE = "Your support keeps us cooking! Tap below to share your experience.";
const REVIEW_URL = "https://google.com";
const REDIRECT_DELAY_MILLISECONDS = 700;

const businessName = document.getElementById("business-name");
const supportLine = document.getElementById("support-line");
const reviewButton = document.getElementById("review-button");
const loadingOverlay = document.getElementById("loading-overlay");

businessName.textContent = BUSINESS_NAME;
supportLine.textContent = SUPPORT_LINE;
document.title = BUSINESS_NAME;

function beginReviewRedirect() {
  reviewButton.disabled = true;
  loadingOverlay.hidden = false;
  window.requestAnimationFrame(function () {
    window.requestAnimationFrame(function () {
      loadingOverlay.classList.add("open");
    });
  });
  window.setTimeout(function () {
    window.location.assign(REVIEW_URL);
  }, REDIRECT_DELAY_MILLISECONDS);
}

reviewButton.addEventListener("click", beginReviewRedirect);
