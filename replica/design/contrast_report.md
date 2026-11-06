# WCAG 2.2 Contrast Report

Target: PodcastBot Design System Palette  
Algorithms: Standard WCAG 2.2 relative luminance & contrast ratio formula  
Floor Requirement: Normal text AA $\ge$ 4.5:1, Large text $\ge$ 3.0:1, UI parts $\ge$ 3.0:1  

## Results

| Pair (Foreground on Background) | Type | Calculated Ratio | WCAG Grade | Status |
| :--- | :--- | :--- | :--- | :--- |
| `text (#f3f0fa)` on `bg (#0a0a1a)` | Normal | 17.41:1 | **AAA** | **PASS** |
| `text (#f3f0fa)` on `surface (#0f0f2a)` | Normal | 16.63:1 | **AAA** | **PASS** |
| `text-muted (#b5acd5)` on `bg (#0a0a1a)` | Normal | 9.17:1 | **AAA** | **PASS** |
| `text-muted (#b5acd5)` on `surface (#0f0f2a)` | Normal | 8.76:1 | **AAA** | **PASS** |
| `on-accent (#ffffff)` on `accent (#7c3aed)` | Normal | 5.70:1 | **AA** | **PASS** |
| `accent (#7c3aed)` on `bg (#0a0a1a)` | Large | 3.44:1 | **AA** | **PASS** |
| `danger (#f87171)` on `bg (#0a0a1a)` | Normal | 7.09:1 | **AAA** | **PASS** |
| `success (#4ade80)` on `bg (#0a0a1a)` | Normal | 11.25:1 | **AAA** | **PASS** |
| `warning (#fbbf24)` on `bg (#0a0a1a)` | Normal | 11.74:1 | **AAA** | **PASS** |
| `on-accent (#ffffff)` on `discord (#5865f2)` | Normal | 4.61:1 | **AA** | **PASS** |
| `border-input (#6b5ca5)` on `bg (#0a0a1a)` | UI | 3.45:1 | **PASS** | **PASS** |
| `border-input (#6b5ca5)` on `surface (#0f0f2a)` | UI | 3.30:1 | **PASS** | **PASS** |

**Summary:** 12 pairs tested, 0 failing AA. 100% compliant with accessibility requirements.
