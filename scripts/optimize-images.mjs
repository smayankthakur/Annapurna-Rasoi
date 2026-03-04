import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const imageDir = path.join(root, "assets", "images");

const sourceMap = [
  { src: "banner-2.jpg", out: "annapurna-rasoi-og.webp", width: 1200, height: 630 },
  { src: "banner-2.jpg", out: "menu-pure-veg-paschim-vihar.webp", width: 1200, height: 800 },
  { src: "banner-2.jpg", out: "rajma-rice-paschim-vihar.webp", width: 960, height: 720 },
  { src: "banner-2.jpg", out: "chole-rice-paschim-vihar.webp", width: 960, height: 720 },
  { src: "banner-2.jpg", out: "aloo-paratha-paschim-vihar.webp", width: 960, height: 720 },
  { src: "banner-2.jpg", out: "poori-aloo-paschim-vihar.webp", width: 960, height: 720 },
  { src: "logo.png", out: "logo.webp", width: 512, height: 512 },
];

for (const item of sourceMap) {
  const sourcePath = path.join(imageDir, item.src);
  const outPath = path.join(imageDir, item.out);

  try {
    await fs.access(sourcePath);
    await sharp(sourcePath)
      .resize(item.width, item.height, { fit: "cover" })
      .webp({ quality: 82 })
      .toFile(outPath);
  } catch {
    // skip conversion when source image is not available
  }
}
