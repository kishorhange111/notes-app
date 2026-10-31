#!/usr/bin/env node
/**
 * @file Notes App - command line entry point.
 *
 * Declares the four commands (add, remove, list, read) with yargs. yargs
 * parses `process.argv`, checks that required options such as `--title` are
 * present, and calls the matching `handler`. Each handler only forwards the
 * parsed options to notes.js, which does the real work.
 *
 * Usage: node bin/notes.js <command> [--title="..."] [--body="..."]
 */
const y = require("yargs");
const notes = require("../src/notes.js");

// add --title --body : create a new note.
y.command({
  command: "add",
  describe: "Adding Notes ",
  // builder lists the command's options; demandOption makes them required.
  builder: {
    title: {
      describe: "Title Of Notes",
      demandOption: true,
      type: "string",
    },
    body: {
      describe: "Body Of Notes",
      demandOption: true,
      type: "string",
    },
  },
  handler(argv) {
    notes.addNotes(argv.title, argv.body);
  },
});

// remove --title : delete a note.
y.command({
  command: "remove",
  describe: "Removing Notes ",
  builder: {
    title: {
      describe: "Title Of Notes",
      demandOption: true,
      type: "string",
    },
  },
  handler(argv) {
    notes.removeNotes(argv.title);
  },
});

// list : print every note (no options needed).
y.command({
  command: "list",
  describe: "Listing the Notes ",
  handler: function () {
    notes.listNotes();
  },
});

// read --title : print one note.
y.command({
  command: "read",
  describe: "Reading Notes",
  builder: {
    title: {
      describe: "Title of Notes",
      demandOption: true,
      type: "string",
    },
  },
  handler(argv) {
    notes.readNotes(argv.title);
  },
});

// Nothing runs until parse() reads the command line and dispatches to a handler.
y.parse();
