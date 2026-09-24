# Notes App (Node.js CLI)

A command-line note-taking app built with **Node.js** and **yargs**. Notes are stored locally as JSON and can be added, listed, read and removed from the terminal, with coloured feedback via **chalk**.

## Features
- `add` a note with a title and body (duplicate titles are rejected)
- `list` all notes
- `read` a single note by title
- `remove` a note by title
- Persistent storage in `notes.json` (created automatically)

## Tech stack
Node.js · yargs (command parsing) · chalk (terminal colours) · fs (JSON persistence)

## Project structure
```
notes-app/
├── src/
│   ├── app.js      # CLI entry point - defines the commands with yargs
│   └── notes.js    # note operations: add / remove / list / read, JSON load & save
├── package.json
└── README.md
```

## Getting started
```bash
git clone https://github.com/kishorhange111/notes-app.git
cd notes-app
npm install
```

## Usage
```bash
node src/app.js add --title="Shopping" --body="Milk, eggs, bread"
node src/app.js list
node src/app.js read --title="Shopping"
node src/app.js remove --title="Shopping"
node src/app.js --help
```

Example output:
```
$ node src/app.js add --title="Shopping" --body="Milk, eggs, bread"
Note Saved
$ node src/app.js add --title="Shopping" --body="Again"
Note Already Present
```

## How it works
Each command is registered with `yargs.command()` (name, description, required options, handler). Handlers call functions in `notes.js`, which read the notes array from `notes.json`, modify it, and write it back with `fs.writeFileSync`. A missing or unreadable file is treated as an empty list.
