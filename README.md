# ChatGPT Code Previewer

A simple extension to render HTML (with CSS and JS), SVG, and Markdown code generated by ChatGPT directly on the page.

## File structure

- `/extension`: The extension part of the code. Core of the library. No compiling step, just basic JS files.
- `/src` (and a few top level files): Basic Vue file for tha landing page.
- `package-extension.js`: A script to compress extension file for publishing.

## How to use the extension locally

1. Rename `extension/.manifest-example.json` to `extension/manifest.json`.
1. Open `chrome://extensions`, turn on "Developer mode", then "Load unpacked", choose the `extension` folder.

## TODOs

- Add a script to update the version number in all places.
- Consider adding non html support?
- Consider change the extension code to TS?
