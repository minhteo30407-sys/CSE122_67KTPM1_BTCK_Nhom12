const fs = require("node:fs");
const path = require("node:path");

const SOURCE_DIR = __dirname;
const PROJECT_DIR = path.resolve(SOURCE_DIR, "..");
const DIST_DIR = path.join(PROJECT_DIR, "dist");
const SOURCE_PAGES_DIR = path.join(SOURCE_DIR, "pages");
const DIST_PAGES_DIR = path.join(DIST_DIR, "pages");
const owners = ["minh", "thanh"];

for (const directory of ["css", "js", "assets"]) {
  fs.cpSync(
    path.join(SOURCE_DIR, directory),
    path.join(DIST_DIR, directory),
    { recursive: true },
  );
}

let pageCount = 0;
const pageNames = new Set();
for (const owner of owners) {
  const ownerDirectory = path.join(SOURCE_PAGES_DIR, owner);
  for (const pageName of fs.readdirSync(ownerDirectory)) {
    const sourcePage = path.join(ownerDirectory, pageName);
    if (!fs.statSync(sourcePage).isDirectory()) continue;
    if (pageNames.has(pageName)) {
      throw new Error(`Duplicate page name: ${pageName}`);
    }
    for (const fileName of ["index.html", "style.css", "script.js"]) {
      if (!fs.existsSync(path.join(sourcePage, fileName))) {
        throw new Error(`Missing ${fileName} in ${owner}/${pageName}`);
      }
    }
    fs.cpSync(sourcePage, path.join(DIST_PAGES_DIR, pageName), {
      recursive: true,
    });
    pageNames.add(pageName);
    pageCount += 1;
  }
}

console.log(`Built shared assets and ${pageCount} pages into dist/.`);
