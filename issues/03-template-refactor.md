# Issue 3: Refactor Repeated Markup into Templates/Partials

## Description

Homepage and internal pages repeat shared sections manually, increasing maintenance overhead.

## Steps to Reproduce

1. Compare header/footer/menu-card/review markup across pages.
2. Note repeated static HTML blocks.

## Expected Behavior

A template-based source (partials + shared data) generates all static pages consistently.

## Actual Behavior

Repeated HTML blocks require manual multi-file edits.
