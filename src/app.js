const y = require("yargs");
const notes = require("./notes.js");

y.command({
  command: "add",
  describe: "Adding Notes ",
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

y.command({
  command: "list",
  describe: "Listing the Notes ",
  handler: function () {
    notes.listNotes();
  },
});

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

y.parse();
