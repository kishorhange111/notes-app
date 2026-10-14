// ESLint flat config: recommended rules, Node.js globals, CommonJS modules.
const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: globals.node,
    },
    rules: {
      // loadNotes() deliberately ignores the error it catches.
      "no-unused-vars": ["error", { caughtErrors: "none" }],
    },
  },
];
