const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const projectRoot = path.join(__dirname, "..");
const pageOwners = [
  { directory: "tran_van_minh", expectedPages: 10 },
  { directory: "nguyen_ba_thanh", expectedPages: 11 },
];

test("each member has the expected number of source pages", () => {
  for (const owner of pageOwners) {
    const ownerPath = path.join(projectRoot, "src", "pages", owner.directory);
    const pages = fs
      .readdirSync(ownerPath, { withFileTypes: true })
      .filter((entry) => entry.isDirectory());

    assert.equal(pages.length, owner.expectedPages, owner.directory);
  }
});

test("every source page contains HTML, CSS, and JavaScript files", () => {
  for (const owner of pageOwners) {
    const ownerPath = path.join(projectRoot, "src", "pages", owner.directory);
    const pages = fs
      .readdirSync(ownerPath, { withFileTypes: true })
      .filter((entry) => entry.isDirectory());

    for (const page of pages) {
      const pagePath = path.join(ownerPath, page.name);
      for (const fileName of ["index.html", "style.css", "script.js"]) {
        assert.equal(
          fs.existsSync(path.join(pagePath, fileName)),
          true,
          `${owner.directory}/${page.name} is missing ${fileName}`,
        );
      }
    }
  }
});

test("page stylesheets do not import shared CSS", () => {
  for (const owner of pageOwners) {
    const ownerPath = path.join(projectRoot, "src", "pages", owner.directory);
    const pages = fs
      .readdirSync(ownerPath, { withFileTypes: true })
      .filter((entry) => entry.isDirectory());

    for (const page of pages) {
      const stylesheetPath = path.join(ownerPath, page.name, "style.css");
      const stylesheet = fs.readFileSync(stylesheetPath, "utf8");

      assert.doesNotMatch(stylesheet, /@import\b/i, stylesheetPath);
      assert.doesNotMatch(
        stylesheet,
        /(?:global|responsive)\.css/i,
        stylesheetPath,
      );
    }
  }

  assert.equal(fs.existsSync(path.join(projectRoot, "src", "css")), false);
});
