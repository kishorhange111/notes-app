/**
 * @file End-to-end tests: run the real CLI (bin/notes.js) as a child process.
 */
const { test, after } = require("node:test");
const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const APP = path.join(__dirname, "..", "bin", "notes.js");
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "notes-cli-"));
const env = { ...process.env, NOTES_FILE: path.join(tmpDir, "notes.json") };

/** Run the CLI with the given arguments and return its stdout/stderr/status. */
function run(...args) {
  return spawnSync(process.execPath, [APP, ...args], { env, encoding: "utf8" });
}

after(() => fs.rmSync(tmpDir, { recursive: true, force: true }));

test("add, read, list and remove a note through the CLI", () => {
  assert.match(run("add", "--title=Shopping", "--body=Milk").stdout, /Note Saved/);
  assert.match(run("read", "--title=Shopping").stdout, /Body : Milk/);
  assert.match(run("list").stdout, /Title : Shopping/);
  assert.match(run("remove", "--title=Shopping").stdout, /Note Deleted/);
  assert.match(run("list").stdout, /Empty/);
});

test("missing required --title is rejected by yargs", () => {
  const result = run("read");
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Missing required argument: title/);
});
