#!/usr/bin/env node

const {
	defineCommand,
	getAllCommandsHelp,
	writeAllCommandsHelp,
} = require("../src/utils");
const execute = require("../src/execute");
const fs = require("fs");
const path = require("path");

// ensure the /help directory exists
const helpDir = path.join(__dirname, "../help");
if (!fs.existsSync(helpDir)) fs.mkdirSync(helpDir);

const [, , command, ...options] = process.argv;

// files to be generated before usage
if (command === "generatePreFiles") {
	writeAllCommandsHelp();
	process.exit(0);
}

// handle commands
if (command === "all") getAllCommandsHelp();
else if (options[0] === "is") defineCommand(command, "meaning");
else if (options[0] === "help") defineCommand(command, "help");
else execute(command, options);
