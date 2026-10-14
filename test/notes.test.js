/**
 * @file Unit tests for src/notes.js using Node's built-in test runner.
 *
 * NOTES_FILE is pointed at a temporary file *before* notes.js is loaded, so
 * the tests never read or overwrite your real notes.json.
 */
const { test, beforeEach, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "notes-app-"));
process.env.NOTES_FILE = path.join(tmpDir, "notes.json");
const notes = require("../src/notes.js");

/**
 * Run `fn` while capturing console.log, and return everything it printed.
 * chalk adds colour codes only on a TTY, so we just check for substrings.
 */
function captureLog(t, fn) {
  const logged = [];
  t.mock.method(console, "log", (...args) => logged.push(args.join(" ")));
  fn();
  t.mock.restoreAll();
  return logged.join("\n");
}

beforeEach(() => fs.rmSync(notes.NOTES_FILE, { force: true }));
after(() => fs.rmSync(tmpDir, { recursive: true, force: true }));

test("uses the NOTES_FILE override", () => {
  assert.equal(notes.NOTES_FILE, process.env.NOTES_FILE);
});

test("loadNotes returns [] when the file is missing or invalid", () => {
  assert.deepEqual(notes.loadNotes(), []);
  fs.writeFileSync(notes.NOTES_FILE, "not json");
  assert.deepEqual(notes.loadNotes(), []);
});

test("addNotes saves a note and rejects duplicate titles", (t) => {
  assert.match(captureLog(t, () => notes.addNotes("Shopping", "Milk")), /Note Saved/);
  assert.match(captureLog(t, () => notes.addNotes("Shopping", "Again")), /Note Already Present/);
  assert.deepEqual(notes.loadNotes(), [{ title: "Shopping", body: "Milk" }]);
});

test("removeNotes deletes only the matching note", (t) => {
  captureLog(t, () => {
    notes.addNotes("a", "1");
    notes.addNotes("b", "2");
  });
  assert.match(captureLog(t, () => notes.removeNotes("a")), /Note Deleted/);
  assert.deepEqual(notes.loadNotes(), [{ title: "b", body: "2" }]);
  assert.match(captureLog(t, () => notes.removeNotes("missing")), /No Notes Found/);
});

test("readNotes prints the note or a not-found message", (t) => {
  captureLog(t, () => notes.addNotes("Idea", "Build a CLI"));
  assert.match(captureLog(t, () => notes.readNotes("Idea")), /Title : Idea\nBody : Build a CLI/);
  assert.match(captureLog(t, () => notes.readNotes("Nope")), /No Note Found/);
});

test("listNotes prints every note, or Empty", (t) => {
  assert.match(captureLog(t, () => notes.listNotes()), /Empty/);
  captureLog(t, () => {
    notes.addNotes("one", "1");
    notes.addNotes("two", "2");
  });
  const out = captureLog(t, () => notes.listNotes());
  assert.match(out, /Title : one/);
  assert.match(out, /Title : two/);
});
