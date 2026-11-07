#!/usr/bin/env python3
"""Open a visible Playwright Chromium window on an isolated profile.

The profile lives in this folder at .jibauto_profile. The browser binary is
Playwright's Chromium, not the everyday Google Chrome profile. This file
does not call fill(), type(), or keyboard.insert_text(). Sign-in fields are
left for the person at the keyboard.
"""

from __future__ import annotations

import sys
from pathlib import Path

from playwright.sync_api import (
    BrowserContext,
    Page,
    Playwright,
    TimeoutError as PlaywrightTimeoutError,
    sync_playwright,
)

DASHBOARD_URL = "https://app.netlify.com/"
PROJECT_NAME = "scintillating-blancmange-61831d"

WINDOW_WIDTH = 1280
WINDOW_HEIGHT = 800
NAVIGATION_TIMEOUT_MS = 30000
SELECTOR_TIMEOUT_MS = 8000
LAUNCH_TIMEOUT_MS = 90000

BOLD = "\033[1m"
RESET = "\033[0m"

# Dedicated automation profile. resolve() follows the 03_jibauto_driver symlink.
PROFILE_DIR = Path(__file__).resolve().parent / ".jibauto_profile"

PHASE_1_BANNER = (
    "==================================================\n"
    "[🛑 PHASE 1 ACTIVE]: Netlify Login Panel.\n"
    "The browser is parked.\n"
    "Sign in on the Chrome window, then press [ENTER] to continue.\n"
    "=================================================="
)

PHASE_2_BANNER = (
    "==================================================\n"
    "[🛑 PHASE 2 ACTIVE]: Site Project Configuration Dashboard View.\n"
    "scintillating-blancmange-61831d is in front.\n"
    "Type \"go\" to hold this view or \"stop\" to close the driver:\n"
    "=================================================="
)


def prepare_profile_directory() -> Path:
    """Create the isolated profile folder if this is the first run."""
    PROFILE_DIR.mkdir(parents=True, exist_ok=True)
    return PROFILE_DIR


def launch_persistent_chromium(playwright: Playwright, profile_dir: Path) -> BrowserContext:
    """Open a visible 1280 by 800 Playwright Chromium window.

    No channel is set, so Playwright uses the Chromium binary from
    python3 -m playwright install chromium. The user-data directory is
    .jibauto_profile inside this project. Everyday Chrome windows stay closed.
    --no-sandbox is omitted so the window does not show that warning banner.
    """
    return playwright.chromium.launch_persistent_context(
        user_data_dir=str(profile_dir),
        headless=False,
        timeout=LAUNCH_TIMEOUT_MS,
        viewport={"width": WINDOW_WIDTH, "height": WINDOW_HEIGHT},
        ignore_default_args=["--no-sandbox"],
        args=[
            "--window-size=1280,800",
            "--window-position=80,40",
        ],
    )


def open_visible_tab(context: BrowserContext) -> Page:
    """Use the tab the persistent window already opened."""
    if context.pages:
        page = context.pages[0]
    else:
        page = context.new_page()
    page.set_viewport_size({"width": WINDOW_WIDTH, "height": WINDOW_HEIGHT})
    return page


def print_bold_block(text: str) -> None:
    """Print a bold terminal barrier. The browser receives nothing from this."""
    print()
    print(f"{BOLD}{text}{RESET}")
    print()


def pause_at_gate(banner: str) -> str:
    """Stop the driver until the operator presses Enter.

    input() blocks Python. While it is blocked, Playwright sends no mouse
    events and no keystrokes. The returned text is a control word only.
    """
    print_bold_block(banner)
    answer = input()
    return answer.strip().lower()


def pause_for_manual_adjustment(reason: str) -> str:
    """Let the operator fix the screen, then retry or stop."""
    print_bold_block(
        "==================================================\n"
        "[PAUSE] The automatic step could not finish.\n"
        f"{reason}\n"
        "Adjust the browser window by hand.\n"
        "Press [ENTER] to try again, or type stop to close the driver.\n"
        "=================================================="
    )
    answer = input()
    return answer.strip().lower()


def address_without_secrets(page: Page) -> str:
    """Return the page address with the query string and fragment removed."""
    try:
        raw_address = page.url
    except Exception:
        return ""
    without_query = raw_address.split("?", 1)[0]
    return without_query.split("#", 1)[0]


def project_overview_is_open(page: Page) -> bool:
    """True when the tab address is the live project, not the sites list."""
    address = address_without_secrets(page).lower()
    if "app.netlify.com" not in address:
        return False
    return PROJECT_NAME in address


def focus_browser(page: Page) -> bool:
    """Raise the Chrome window. This is a window command, not a page click."""
    try:
        page.bring_to_front()
        return True
    except Exception as error:
        print(f"The browser window could not be focused: {error}")
        return False


def goto_address(page: Page, address: str) -> bool:
    """Load one address. A timeout returns False so the caller can recover.

    goto() tells Chrome to navigate. It does not type into a field.
    """
    try:
        page.goto(address, wait_until="domcontentloaded", timeout=NAVIGATION_TIMEOUT_MS)
        return True
    except PlaywrightTimeoutError:
        print(f"Navigation timed out before the document loaded: {address}")
        return False
    except Exception as error:
        print(f"Navigation failed for {address}: {error}")
        return False


def wait_for_layout(page: Page) -> bool:
    """Wait until the document and a visible body element are present."""
    try:
        page.wait_for_load_state("domcontentloaded", timeout=NAVIGATION_TIMEOUT_MS)
        page.wait_for_selector("body", state="visible", timeout=SELECTOR_TIMEOUT_MS)
        return True
    except PlaywrightTimeoutError:
        print("The page layout was not ready before the wait timed out.")
        return False
    except Exception as error:
        print(f"The page layout could not be checked: {error}")
        return False


def open_dashboard(page: Page) -> bool:
    """Bring the window forward and open the Netlify sites dashboard."""
    focus_browser(page)
    if not goto_address(page, DASHBOARD_URL):
        return False
    return wait_for_layout(page)


def click_project_card(page: Page) -> bool:
    """Wait for the dashboard, then click the live project card.

    The card match is the project name, a link whose address contains that
    name, or the grid box that contains the name. click() sends mouse-move,
    mouse-down, and mouse-up. It does not type into a field.
    """
    if project_overview_is_open(page):
        focus_browser(page)
        return True
    name_match = page.locator("a, button, article, li, [role='link']").filter(
        has_text=PROJECT_NAME
    ).first
    named_link = page.locator(f"a[href*='{PROJECT_NAME}']").first
    for target in (named_link, name_match):
        try:
            target.wait_for(state="visible", timeout=SELECTOR_TIMEOUT_MS)
            target.scroll_into_view_if_needed(timeout=SELECTOR_TIMEOUT_MS)
            target.click(timeout=SELECTOR_TIMEOUT_MS)
            page.wait_for_load_state("domcontentloaded", timeout=NAVIGATION_TIMEOUT_MS)
            wait_for_layout(page)
            if project_overview_is_open(page):
                focus_browser(page)
                return True
        except PlaywrightTimeoutError:
            continue
        except Exception as error:
            print(f"The project card click did not finish: {error}")
            continue
    return False


def attempt_site_configuration(page: Page) -> bool:
    """Open https://app.netlify.com/ and click the live project card."""
    if not focus_browser(page):
        return False
    if project_overview_is_open(page):
        return True
    if not open_dashboard(page):
        return False
    return click_project_card(page)


def open_site_configuration(page: Page) -> str:
    """Retry the settings navigation until it is open or the operator stops."""
    while True:
        reached = False
        try:
            reached = attempt_site_configuration(page)
        except PlaywrightTimeoutError:
            print("A navigation selector timed out. The driver is still running.")
            reached = False
        except Exception as error:
            print(f"The settings navigation hit an unexpected error: {error}")
            reached = False

        if reached or project_overview_is_open(page):
            focus_browser(page)
            return "ready"

        decision = pause_for_manual_adjustment(
            "The scintillating-blancmange-61831d project card was not ready."
        )
        if decision == "stop":
            return "stop"
        if project_overview_is_open(page):
            focus_browser(page)
            return "ready"


def close_session(context: BrowserContext) -> None:
    """Close the automated window. The isolated profile stays on disk."""
    try:
        context.close()
    except Exception as error:
        print(f"The browser context was already closed: {error}")


def run() -> int:
    """Launch the isolated profile, park on login, then park on site settings."""
    profile_dir = prepare_profile_directory()
    print(f"Isolated profile: {profile_dir}")

    with sync_playwright() as playwright:
        try:
            context = launch_persistent_chromium(playwright, profile_dir)
        except Exception as error:
            print(f"The browser did not start: {error}")
            return 1

        try:
            page = open_visible_tab(context)
            loaded = open_dashboard(page)
            if not loaded:
                decision = pause_for_manual_adjustment(
                    "https://app.netlify.com/ did not finish loading."
                )
                if decision == "stop":
                    return 0
            phase_one = pause_at_gate(PHASE_1_BANNER)
            if phase_one == "stop":
                return 0
            if phase_one not in ("go", ""):
                print("Type go to open the site configuration view, or stop to close.")
                phase_one = pause_at_gate(PHASE_1_BANNER)
                if phase_one == "stop":
                    return 0
            status = open_site_configuration(page)
            if status == "stop":
                return 0
            while True:
                phase_two = pause_at_gate(PHASE_2_BANNER)
                if phase_two == "stop":
                    return 0
                if phase_two == "go":
                    focus_browser(page)
                    wait_for_layout(page)
                    if not project_overview_is_open(page):
                        open_site_configuration(page)
                    continue
                print("Type go to hold this view or stop to close the driver:")
        finally:
            close_session(context)


def main() -> None:
    """Start the driver. Ctrl-C closes the run without sending a page click."""
    try:
        exit_code = run()
    except KeyboardInterrupt:
        print("\nStopped by keyboard interrupt. No further page click was sent.")
        sys.exit(130)
    except Exception as error:
        print(f"The driver stopped: {error}")
        sys.exit(1)
    sys.exit(exit_code)


if __name__ == "__main__":
    main()
