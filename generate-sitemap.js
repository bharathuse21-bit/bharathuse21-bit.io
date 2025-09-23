const fs = require("fs");
const path = require("path");

const BASE_URL = "https://www.medstudyeasy.shop";
const ROOT_DIR = "."; // repo root
const OUTPUT_FILE = path.join(ROOT_DIR, "sitemap.xml");

// Recursively scan for all .html files
function getHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);

    // skip hidden folders (.git, .github, node_modules)
    if (fs.statSync(filePath).isDirectory()) {
      if (!filePath.includes(".git") && !filePath.includes("node_modules")) {
        getHtmlFiles(filePath, fileList);
      }
    } else if (file.endsWith(".html")) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

function buildSitemap(pages) {
  const today = new Date().toISOString().split("T")[0];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  pages.forEach(filePath => {
    // convert local file path → URL
    let relativePath = path.relative(ROOT_DIR, filePath)
      .replace(/\\/g, "/") // Windows fix
      .replace("index.html", ""); // remove index.html

    const url = `${BASE_URL}/${relativePath}`.replace(/\/$/, ""); // remove trailing slash
    sitemap += `  <url>\n`;
    sitemap += `    <loc>${url}</loc>\n`;
    sitemap += `    <lastmod>${today}</lastmod>\n`;
    sitemap += `    <priority>${url === BASE_URL ? "1.0" : "0.7"}</priority>\n`;
    sitemap += `  </url>\n`;
  });

  sitemap += `</urlset>`;
  return sitemap;
}

const htmlFiles = getHtmlFiles(ROOT_DIR);
const sitemap = buildSitemap(htmlFiles);

// Write sitemap.xml in root
fs.writeFileSync(OUTPUT_FILE, sitemap, "utf8");

console.log(`✅ sitemap.xml generated with ${htmlFiles.length} pages`);
