const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

function loadAppContext() {
  const source = fs.readFileSync(
    path.join(__dirname, "..", "dist", "js", "app.js"),
    "utf8",
  );
  const context = vm.createContext({
    console,
    document: {
      addEventListener() {},
      createElement() {
        return {};
      },
      body: { appendChild() {} },
      documentElement: { style: {} },
    },
    window: {
      addEventListener() {},
      location: { pathname: "/pages/index/index.html" },
    },
  });
  vm.runInContext(source, context);
  return context;
}

test("escapeHTML encodes HTML and attribute metacharacters", () => {
  const context = loadAppContext();
  const malicious = '<img src=x onerror="alert(1)"> &';
  const escaped = vm.runInContext(
    `escapeHTML(${JSON.stringify(malicious)})`,
    context,
  );

  assert.equal(
    escaped,
    "&lt;img src=x onerror=&quot;alert(1)&quot;&gt; &amp;",
  );
});

test("page helpers preserve directory-based routes", () => {
  const context = loadAppContext();

  assert.equal(
    vm.runInContext('getPageUrl("login")', context),
    "../login/index.html",
  );
  assert.equal(vm.runInContext("getCurrentPageName()", context), "index");
});

test("data seed URLs resolve from the built service script", () => {
  const source = fs.readFileSync(
    path.join(__dirname, "..", "dist", "js", "services.js"),
    "utf8",
  );
  const context = vm.createContext({
    URL,
    document: {
      currentScript: { src: "http://localhost:3000/js/services.js" },
    },
  });
  vm.runInContext(source, context);

  assert.equal(
    vm.runInContext("DataStore.getBasePath()", context),
    "http://localhost:3000/assets/data/",
  );
});

test("escapeJSString safely embeds an untrusted string in an HTML handler", () => {
  const context = loadAppContext();
  const escaped = vm.runInContext(
    `escapeJSString(${JSON.stringify("');alert(1)//")})`,
    context,
  );

  assert.equal(escaped, "&quot;&#39;);alert(1)//&quot;");
  assert.doesNotMatch(escaped, /['"]/);
});

test("shared status and skill renderers encode untrusted labels", () => {
  const context = loadAppContext();
  context.DataStore = {
    getSkillName: () => "<svg onload=alert(1)>",
  };
  const status = vm.runInContext(
    `statusBadge("<img src=x onerror=alert(1)>")`,
    context,
  );
  const skill = vm.runInContext(`skillTags(["unsafe"])`, context);

  assert.match(status, /&lt;img/);
  assert.doesNotMatch(status, /<img/);
  assert.match(skill, /&lt;svg/);
  assert.doesNotMatch(skill, /<svg/);
});

test("empty-state messages are rendered as text, not markup", () => {
  const context = loadAppContext();
  const container = { innerHTML: "" };
  context.emptyStateContainer = container;
  vm.runInContext(
    `showEmptyState(emptyStateContainer, "!", "<script>alert(1)</script>")`,
    context,
  );

  assert.match(container.innerHTML, /&lt;script&gt;/);
  assert.doesNotMatch(container.innerHTML, /<script>/);
});
