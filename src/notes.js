/**
 * @file Note operations for the Notes CLI: add, remove, list and read.
 *
 * All notes live in one JSON file holding an array of `{ title, body }`
 * objects. Every operation follows the same simple pattern:
 *   1. load the whole array from disk,
 *   2. change it in memory,
 *   3. write it back.
 * That is fine for a personal notes file; a database would only be needed
 * for many notes or several users writing at once.
 */
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");

/**
 * Where notes are stored.
 *
 * By default this is `notes.json` in the project root, built from `__dirname`
 * so it does not depend on which folder you run the command from. The
 * `NOTES_FILE` environment variable can point elsewhere (the tests use it so
 * they never touch your real notes).
 */
const NOTES_FILE = process.env.NOTES_FILE || path.join(__dirname, "..", "notes.json");

/**
 * Add a new note, unless a note with the same title already exists.
 *
 * Titles act as the unique key for a note, which is why duplicates are rejected
 * instead of overwritten.
 *
 * @param {string} title - Note title (used to find the note later).
 * @param {string} body - Note text.
 */
function addNotes(title, body) {
  const notes = loadNotes();
  const duplicateNote = notes.find((note) => note.title === title);
  if (!duplicateNote) {
    notes.push({ title: title, body: body });
    saveNotes(notes);
    console.log(chalk.green.inverse("Note Saved"));
  } else {
    console.log(chalk.red.inverse("Note Already Present"));
  }
}

/**
 * Remove the note with the given title, if there is one.
 *
 * @param {string} title - Title of the note to delete.
 */
function removeNotes(title) {
  const notes = loadNotes();
  const notesPreviousLength = notes.length;
  for (let i = 0; i < notes.length; i++) {
    if (title === notes[i].title) {
      notes.splice(i, 1); // remove 1 element at index i
      break; // titles are unique, so stop at the first match
    }
  }
  // If the length did not change, nothing matched the title.
  if (notes.length === notesPreviousLength) {
    console.log(chalk.red.inverse("No Notes Found"));
  } else {
    console.log(chalk.green.inverse("Note Deleted"));
    saveNotes(notes);
  }
}

/**
 * Print every note's title and body, or "Empty" when there are none.
 */
function listNotes() {
  const notes = loadNotes();
  console.log("Your Notes\n");
  if (notes.length === 0) {
    console.log(chalk.red.inverse("Empty "));
  } else {
    for (let i = 0; i < notes.length; i++) {
      console.log("Title : " + notes[i].title + "\nBody : " + notes[i].body);
    }
  }
  // Separator line so the end of the list is easy to spot in the terminal.
  console.log(
    "----------------------------------------------------------------------------------------------------------------------"
  );
}

/**
 * Print a single note found by its title.
 *
 * @param {string} title - Title of the note to show.
 */
function readNotes(title) {
  const notes = loadNotes();
  // find() returns undefined when no element matches.
  const data = notes.find((note) => note.title === title);
  if (data !== undefined) {
    console.log(chalk.green.inverse("Title : " + data.title + "\nBody : " + data.body));
  } else {
    console.log(chalk.red.inverse("No Note Found"));
  }
}

/**
 * Write the full list of notes to disk, replacing the previous file.
 *
 * @param {Array<{title: string, body: string}>} notes - All notes to keep.
 */
function saveNotes(notes) {
  const data = JSON.stringify(notes);
  fs.writeFileSync(NOTES_FILE, data);
}

/**
 * Read all notes from disk.
 *
 * A missing file (first run) or a file with invalid JSON is treated as "no
 * notes yet", so the app never crashes on startup.
 *
 * @returns {Array<{title: string, body: string}>} The stored notes.
 */
function loadNotes() {
  try {
    const dataBuffer = fs.readFileSync(NOTES_FILE);
    const notes = dataBuffer.toString(); // Buffer -> string before parsing
    return JSON.parse(notes);
  } catch (error) {
    return [];
  }
}

module.exports = {
  removeNotes: removeNotes,
  addNotes: addNotes,
  listNotes: listNotes,
  readNotes: readNotes,
  // Exported so tests can inspect what was saved.
  loadNotes: loadNotes,
  NOTES_FILE: NOTES_FILE,
};
