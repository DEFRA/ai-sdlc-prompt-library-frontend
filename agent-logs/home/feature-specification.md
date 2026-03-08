# Feature Specification — home

## Goal

Replace the existing homepage with a redesigned page that clearly communicates the purpose and ambition of the prompt library. The page should feel authoritative — this is where Defra's best AI prompting lives.

## Scenarios

### Happy paths

#### Visitor lands on the homepage

A user navigates to `/`. They see:

1. A hero banner with the page title "Defra AI Prompt Library" and a short description making clear this is a curated library of Defra's highest-quality prompts — not a general resource but the standard for what good AI prompting looks like at Defra.
2. Immediately below the hero, a short introductory section reinforcing the library's purpose: sharing prompts across Defra and setting a high bar for quality.
3. Three prompt cards in a grid. Each card has a title placeholder and no body copy. None of the cards link anywhere.

### Unhappy paths

None. This is a static server-rendered page with no external calls.

### Edge cases

None.

## Out of scope

- Actual prompt content inside the cards
- Links from the cards to prompt detail pages
- The subnav / side navigation section
- The version banner
