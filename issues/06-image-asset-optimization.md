# Issue 6: Optimize Images and Static Assets

## Description

Image formats and loading behavior are not fully optimized for performance.

## Steps to Reproduce

1. Check images under `assets/images/`.
2. Review `img` tags for loading/decoding attributes and modern format usage.

## Expected Behavior

WebP assets are used where possible, images are compressed, and lazy loading is applied to non-critical media.

## Actual Behavior

Image optimization is partially implemented.
