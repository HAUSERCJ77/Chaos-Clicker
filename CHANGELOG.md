# Changelog

All notable changes to **Chaos-Clicker** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.1.0] - 2025-09-23
### Added
- **Prestige Shop**: Spend prestige points on permanent upgrades.
- **Achievements System**: Unlock and track progress-based achievements with notifications.
- **Autosave / Manual Save / Load / Reset** using localStorage.
- **Stats Panel**: Lifetime clicks, total points earned, prestige count.
- **Tooltips** for shop items (hover/tap for descriptions).
- **Sound Effects & Music**: Toggleable click sound and background drone.
- **Mobile-friendly UI** with responsive panels and improved button layout.

### Changed
- Refactored code structure into clearer sections (shop, prestige, achievements, UI, etc.).
- Improved particle and emoji spawning with performance caps.
- Smoothed animations and transitions for bars and text.
- Rebalanced prestige progression curve.

### Fixed
- Prevented runaway DOM elements by capping emojis/particles.
- Prestige goal scaling bugs fixed.

### Hidden (but preserved)
- **Griffin God Mode Hack Menu** accessible via `G R I F F I N` key sequence.
- Easter egg “ALL LIZARDS MODE” remains.

---

## [1.0.0] - Initial Release
- Core clicker gameplay loop.
- Shop with basic upgrades.
- Prestige mechanic (basic reset with scaling).
- Combo bar, emoji effects, screen shake.
- Secret hack menu (Griffin code).
