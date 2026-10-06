// Checks news/posts.js the way the news page reads it. Run from the site root: node tools/check-news.cjs
// Used by .github/workflows/pages.yml, so a broken posts.js is never published. No packages needed.
// Fails on: a typing error, a post left out of the page, a file or photo that is not in the repository.
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const postsFile = path.join(root, "news", "posts.js");
const newsFile = path.join(root, "assets", "news.js");
const gh = !!process.env.GITHUB_ACTIONS;
let failed = 0;

function fail(msg, line) {
  failed++;
  if (gh) console.log(`::error file=news/posts.js${line ? ",line=" + line : ""}::${msg}`);
  else console.log(`ERROR news/posts.js${line ? " line " + line : ""}: ${msg}`);
}
function note(msg) {
  if (gh) console.log(`::warning file=news/posts.js::${msg}`);
  else console.log(`note: ${msg}`);
}

const src = fs.readFileSync(postsFile, "utf8");
const window = {};
const sandbox = { window, console: { warn() {}, error() {}, log() {} } };
try {
  new vm.Script(src, { filename: "posts.js" }).runInNewContext(sandbox);
} catch (e) {
  const m = /posts\.js:(\d+)/.exec(e.stack || "");
  fail(`typing error at or just above this line: ${e.message}. Undo your last change to this file.`, m ? +m[1] : 0);
  process.exit(1);
}

// Run assets/news.js without a page; it only reads posts.js and exposes SO_NEWS_CHECK.
const document = { documentElement: { getAttribute: () => "en" }, readyState: "loading", addEventListener() {} };
vm.runInNewContext(fs.readFileSync(newsFile, "utf8"), { window, document, console: sandbox.console }, { filename: "news.js" });
const data = window.SO_NEWS_CHECK();

data.problems.forEach((p) => (p.serious ? fail(p.msg) : note(p.msg)));

// Every relative file and photo must exist, with the same upper and lower case.
function exists(rel) {
  let dir = path.join(root, "news");
  for (const part of decodeURI(rel.split(/[?#]/)[0]).split("/")) {
    if (!part || part === ".") continue;
    if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory() || !fs.readdirSync(dir).includes(part)) return false;
    dir = path.join(dir, part);
  }
  return fs.existsSync(dir);
}
data.posts.forEach((p) => {
  p.files.forEach((f) => { if (!/^https?:/i.test(f.href) && !exists(f.href)) fail(`post "${p.slug}": file ${f.href} is not in news/. Check the name, including upper and lower case.`); });
  p.photos.forEach((f) => { if (!/^https?:/i.test(f.src) && !exists(f.src)) fail(`post "${p.slug}": photo ${f.src} is not in news/. Check the name, including upper and lower case.`); });
});

console.log(`${data.posts.length} post(s), ${data.cats.length} categories.${failed ? ` ${failed} problem(s).` : " OK."}`);
process.exit(failed ? 1 : 0);
