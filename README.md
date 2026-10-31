# Notes App (Node.js CLI)

[![CI](https://github.com/kishorhange111/notes-app/actions/workflows/ci.yml/badge.svg)](https://github.com/kishorhange111/notes-app/actions/workflows/ci.yml)

A command-line note-taking app built with **Node.js** and **yargs**. Notes are stored locally as JSON and can be added, listed, read and removed from the terminal, with coloured feedback via **chalk**.

## Features
- `add` a note with a title and body (duplicate titles are rejected)
- `list` all notes
- `read` a single note by title
- `remove` a note by title
- Persistent storage in `notes.json` (created automatically)

## Tech stack
Node.js · yargs (command parsing) · chalk (terminal colours) · fs (JSON persistence) · node:test (tests) · ESLint · GitHub Actions

## Project structure
```
notes-app/
├── src/
│   ├── app.js      # CLI entry point - defines the commands with yargs
│   └── notes.js    # note operations: add / remove / list / read, JSON load & save
├── test/
│   ├── notes.test.js  # unit tests for notes.js (uses a temp notes file)
│   └── cli.test.js    # runs the real CLI as a child process
├── eslint.config.js
├── package.json
└── README.md
```

## Getting started
Requires Node.js 18 or newer.

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

Notes are saved to `notes.json` in the project root. To use a different file, set the `NOTES_FILE` environment variable, for example `NOTES_FILE=~/my-notes.json node src/app.js list`.

## Development
```bash
npm test       # unit + CLI tests (Node's built-in test runner)
npm run lint   # ESLint
```
The tests point `NOTES_FILE` at a temporary file, so your own notes are never touched. GitHub Actions runs lint and the tests on Node 18, 20 and 22 for every push.
