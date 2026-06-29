// Build a manifest of docs CONTENT pages that are new or modified on this
// branch vs the published base (origin/main). Content only (app/ ** /page.mdx)
// so styling/component changes do not flag a page. Output: lib/changed-pages.json
// keyed by route, consumed by ContentStatus + the /changes review index.
//
// Runs at dev/build start (package.json). Best-effort: if git or the base ref
// is unavailable it writes an empty manifest so the site still builds.
import { execSync } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "lib", "changed-pages.json");

// Review aid ONLY — never ship to production. Show in local dev and Vercel
// preview builds; emit an empty manifest (no banners, empty /changes) anywhere
// that's a production build.
const SHOW = process.env.NODE_ENV !== "production" || process.env.VERCEL_ENV === "preview";

function sh(cmd) {
  return execSync(cmd, { cwd: ROOT, stdio: ["ignore", "pipe", "ignore"] })
    .toString()
    .trim();
}

// Prefer origin/main, fall back to main.
function resolveBase() {
  for (const ref of ["origin/main", "main"]) {
    try {
      sh("git rev-parse --verify " + ref);
      return ref;
    } catch {
      /* next */
    }
  }
  return null;
}

// app/spicedb/concepts/zanzibar/page.mdx -> /spicedb/concepts/zanzibar
function fileToRoute(file) {
  const m = file.match(/^app\/(.*)\/page\.mdx$/);
  return m ? "/" + m[1] : null;
}

let manifest = {};
try {
  const base = SHOW ? resolveBase() : null;
  if (base) {
    const out = sh(
      "git diff --name-status -M " + base + "...HEAD -- 'app/**/page.mdx' 'app/*/page.mdx'",
    );
    for (const line of out.split("\n").filter(Boolean)) {
      const parts = line.split(/\t+/);
      const code = parts[0];
      if (code.startsWith("D")) continue; // deleted page — nothing to flag
      const file = parts[parts.length - 1]; // renamed: new path is last
      const route = fileToRoute(file);
      if (!route) continue;
      manifest[route] = { status: code.startsWith("A") ? "new" : "updated" };
    }
    // also catch pages modified but still uncommitted in the working tree
    const wip = sh("git diff --name-only -- 'app/**/page.mdx' 'app/*/page.mdx'");
    for (const file of wip.split("\n").filter(Boolean)) {
      const route = fileToRoute(file);
      if (route && !manifest[route]) manifest[route] = { status: "updated" };
    }
  }
} catch (e) {
  console.warn("[changed-manifest] skipped:", e.message);
  manifest = {};
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(manifest, null, 2) + "\n");
console.log(
  "[changed-manifest] " +
    Object.keys(manifest).length +
    " changed content page(s) -> lib/changed-pages.json",
);
