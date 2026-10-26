const fs = require("node:fs");
const path = require("node:path");

const SOURCE_DIR = __dirname;
const PROJECT_DIR = path.resolve(SOURCE_DIR, "..");
const DIST_DIR = path.join(PROJECT_DIR, "dist");
const SOURCE_PAGES_DIR = path.join(SOURCE_DIR, "pages");
const DIST_PAGES_DIR = path.join(DIST_DIR, "pages");
const owners = ["tran_van_minh", "nguyen_ba_thanh"];

// Sao chép JavaScript và tài nguyên để các trang đã build dùng chung.
for (const directory of ["js", "assets"]) {
  fs.cpSync(
    path.join(SOURCE_DIR, directory),
    path.join(DIST_DIR, directory),
    { recursive: true },
  );
}

fs.rmSync(path.join(DIST_DIR, "css"), { recursive: true, force: true });

let pageCount = 0;
const pageNames = new Set();
// Xuất trang theo tên chức năng, không đưa tên người phụ trách vào đường dẫn.
for (const owner of owners) {
  const ownerDirectory = path.join(SOURCE_PAGES_DIR, owner);
  for (const pageName of fs.readdirSync(ownerDirectory)) {
    const sourcePage = path.join(ownerDirectory, pageName);
    if (!fs.statSync(sourcePage).isDirectory()) continue;
    // Dừng build nếu hai thành viên tạo trang trùng tên.
    if (pageNames.has(pageName)) {
      throw new Error(`Duplicate page name: ${pageName}`);
    }
    for (const fileName of ["index.html", "style.css", "script.js"]) {
      // Mỗi trang cần đủ cấu trúc, kiểu dáng và mã xử lý riêng.
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
