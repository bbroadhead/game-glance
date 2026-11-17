# Standalone achievements layout fix

## Problem

In Steam Deck Gaming Mode, opening a game's achievements while **the game is not running** can leave an oversized game header and a very short achievements list. Controller scrolling may fail to reach the final achievement. The in-game achievements route behaves differently and is a useful reference.

## Acceptance criteria

- From Library > Game Details, open achievements without launching the game.
- The header is compact and the list uses remaining available height at 1280×800 and 1280×800 scaled UI.
- D-pad, left stick, touchscreen, mouse wheel and scrollbars can reach the **last** achievement.
- Opening an achievement and returning restores focus and scroll position.
- Steam's existing achievements and unlock status remain authoritative.
- The fix can be disabled independently of Game Glance's other features.
- Plugin unload restores all injected styles and patches.
- Works with games having few achievements and games having 100+ achievements; check both locked and unlocked entries.

## Implementation approach

1. Inspect the *standalone* achievements route in Steam's current Chromium UI using remote debugging. Record stable container classes, DOM hierarchy, overflow and computed heights. Compare with the working in-game route.
2. Implement a route-scoped, opt-in style patch under `src/styles/`, wired to the existing plugin lifecycle. Avoid globally targeting achievement-like classes.
3. Prefer a flex column with `min-height: 0` and `overflow-y: auto` on the **actual list scroll container**; constrain the header instead of hiding game information.
4. If controller scrolling still fails, investigate focus ownership and input handling separately. CSS alone cannot guarantee gamepad focus.
5. Validate on real Steam Deck hardware before marking the issue fixed.

## Status

Planning and repository integration groundwork only. **No Steam DOM selectors have been verified yet, and no runtime fix is claimed.** Do not ship guessed selectors or replace Steam's achievement data.

## Follow-up

The other planned theme surfaces (sidebar, QAM, library, profiles and store) are out of scope for this first bug fix.
