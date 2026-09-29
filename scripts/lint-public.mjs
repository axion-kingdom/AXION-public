import { readdir, stat } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";

const skip = new Set([".git", "node_modules", "dist", "coverage"]);

async function walk(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (skip.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, out);
    else out.push(full);
  }
  return out;
}

const files = await walk(".");
let failed = 0;
for (const file of files) {
  if (!file.endsWith(".mjs") && !file.endsWith(".js") && !file.endsWith(".cjs")) continue;
  const info = await stat(file);
  if (info.size > 1_500_000) {
    console.error(`oversized ${file}`);
    failed += 1;
    continue;
  }
  const checked = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
  if (checked.status !== 0) {
    console.error(checked.stderr || checked.stdout);
    failed += 1;
  }
}
if (failed) {
  console.error("LINT FAIL");
  process.exit(1);
}
console.log("LINT PASS");
