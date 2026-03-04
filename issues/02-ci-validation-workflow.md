# Issue 2: Add CI Workflow for HTML/CSS/JS Validation

## Description

Automated quality checks are not consistently enforced on push and pull requests.

## Steps to Reproduce

1. Open `.github/workflows/`.
2. Verify whether linting/validation runs for HTML, CSS, JS, and formatting.

## Expected Behavior

CI runs build, HTML linting, CSS linting, JS linting, and formatting checks on every commit/PR.

## Actual Behavior

Validation coverage is missing or partial.
