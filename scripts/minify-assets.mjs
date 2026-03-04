import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,>])\s*/g, "$1")
    .replace(/;}/g, "}")
    .trim();
}

function minifyJs(js) {
  return js
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{}();,:=+\-*/<>])\s*/g, "$1")
    .trim();
}

async function run() {
  const cssSrc = path.join(root, "assets", "css", "style.css");
  const cssOut = path.join(root, "assets", "css", "style.min.css");
  const jsSrc = path.join(root, "assets", "js", "script.js");
  const jsOut = path.join(root, "assets", "js", "script.min.js");

  const css = await fs.readFile(cssSrc, "utf8");
  const js = await fs.readFile(jsSrc, "utf8");

  await fs.writeFile(cssOut, minifyCss(css), "utf8");
  await fs.writeFile(jsOut, minifyJs(js), "utf8");
}

await run();
