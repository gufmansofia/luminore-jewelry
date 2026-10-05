import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { products } from "../src/data/products";
import { blogPosts } from "../src/data/blogs";

const urls = new Set(products.flatMap(product => product.images));
for (const blog of blogPosts) urls.add(blog.image);
for (const file of new Bun.Glob("**/*.{tsx,html,css}").scanSync("src")) {
  const text = await Bun.file(resolve("src", file)).text();
  for (const match of text.matchAll(/["']((?:\/|\.\.\/public\/)[^"']+\.(?:png|jpg|jpeg|svg|webp|mp4))["']/g)) {
    urls.add(match[1]!.replace(/^\.\.\/public\//, "/"));
  }
}
const missing = [...urls].filter(url => !existsSync(resolve("public", url.slice(1))));
if (missing.length) {
  console.error("Missing assets:\n" + missing.join("\n"));
  process.exit(1);
}
console.log(`Verified ${urls.size} local asset references.`);
