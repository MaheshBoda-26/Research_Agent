---
name: Cyber-Intelligence Obsidian
version: alpha
colors:
  canvas: "oklch(0.14 0.025 260)"
  surface: "oklch(0.18 0.03 260)"
  surface-glass: "rgba(22, 26, 38, 0.75)"
  surface-hover: "oklch(0.24 0.04 260)"
  border: "oklch(0.28 0.04 260)"
  border-glow: "oklch(0.72 0.19 220 / 0.4)"
  ink-primary: "oklch(0.98 0.01 260)"
  ink-secondary: "oklch(0.75 0.03 260)"
  ink-muted: "oklch(0.55 0.02 260)"
  accent-cyan: "oklch(0.72 0.19 220)"
  accent-magenta: "oklch(0.68 0.24 315)"
  accent-amber: "oklch(0.78 0.18 75)"
  accent-emerald: "oklch(0.75 0.20 155)"
  accent-violet: "oklch(0.62 0.22 285)"
typography:
  display:
    fontFamily: Outfit, sans-serif
    fontSize: 2.25rem
    fontWeight: 700
  h2:
    fontFamily: Outfit, sans-serif
    fontSize: 1.5rem
    fontWeight: 600
  body:
    fontFamily: Plus Jakarta Sans, sans-serif
    fontSize: 0.9375rem
    fontWeight: 400
  mono:
    fontFamily: JetBrains Mono, monospace
    fontSize: 0.875rem
    fontWeight: 500
rounded:
  sm: 6px
  md: 12px
  lg: 20px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
motion:
  hover: 150ms cubic-bezier(0.16, 1, 0.3, 1)
  drawer: 300ms cubic-bezier(0.16, 1, 0.3, 1)
  glow: 2000ms infinite ease-in-out
---

## Overview

Cyber-Intelligence Obsidian theme combines deep dark slate foundations with vibrant glassmorphic layers and neon OKLCH accents. Designed for dense financial & technology market intelligence, the interface balances high-readability data presentation with captivating interactive micro-animations.

## Colors

- **Canvas (`oklch(0.14 0.025 260)`):** Deep obsidian slate backdrop creating extreme contrast for data cards.
- **Surface Glass (`rgba(22, 26, 38, 0.75)`):** Frosted glass panel backdrop with backdrop blur filters.
- **Electric Cyan (`oklch(0.72 0.19 220)`):** Primary signal color for active states, interactive controls, and market cap visualizations.
- **Neon Magenta (`oklch(0.68 0.24 315)`):** Secondary accent for frontier AI labs and high-tier metrics.
- **Luminous Amber (`oklch(0.78 0.18 75)`):** Fortune 500 badges and private valuation tags.
- **Emerald Growth (`oklch(0.75 0.20 155)`):** Positive financial metrics and public market status.

## Typography

- **Display & Headings (Outfit):** Modern geometric sans with high personality and crisp edges.
- **Body & Controls (Plus Jakarta Sans):** Highly readable sans designed specifically for web application interfaces.
- **Data & Numbers (JetBrains Mono):** Tabular numbers (`tnum`) for perfectly aligned currency values, ranks, and financial metrics.

## Motion & Interaction Rationale

- **Ambient Hero Canvas:** Soft floating particles in the header background to create an engaging visual entry point.
- **Drawer Slide-Over:** 300ms cubic-bezier transitions for inspecting detailed company profiles.
- **Glassmorphism:** Hover states elevate cards with subtle glow borders (`box-shadow: 0 0 20px oklch(0.72 0.19 220 / 0.2)`).

## Do's and Don'ts

- **Do** use `tnum` font variant for numeric alignment in tables.
- **Do** keep backdrop filters blurred to maintain text contrast over ambient canvas elements.
- **Don't** use flat pure black `#000000` or plain generic red/blue colors.
- **Don't** disable focus rings for keyboard navigation.
