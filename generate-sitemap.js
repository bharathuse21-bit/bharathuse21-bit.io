const fs = require("fs");
const path = require("path");

const BASE_URL = "https://www.medstudyeasy.shop";

// Recursively scan all HTML files in repo
function getPages(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getPages(filePath, fileList);
    } else if (file.endsWith(".html")) {
      let urlPath = filePath.replace(/^public\//, "").replace(/index\.html$/, "");
      fileList.push(`${BASE_URL}/${urlPath}`);
    }
  });
  return fileList;
}

const pages = getPages(".");

const today = new Date().toISOString().split("T")[0];
let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

pages.forEach(url => {
  sitemap += `  <url>\n`;
  sitemap += `    <loc>${url}</loc>\n`;
  sitemap += `    <lastmod>${today}</lastmod>\n`;
  sitemap += `    <priority>${url === BASE_URL + "/" ? "1.0" : "0.7"}</priority>\n`;
  sitemap += `  </url>\n`;
});

sitemap += `</urlset>`;

fs.writeFileSync("sitemap.xml", sitemap);
console.log("✅ sitemap.xml generated with", pages.length, "pages");
