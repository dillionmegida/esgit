#!/usr/bin/env node

// // this package does not support prefix hyphens (-s, --short),
// hence all commands and options must begin with a letter

// const argv = require("yargs").argv;
const { pkgName, pkgDefine } = require("../src/config");
const {
	defineCommand,
	msg,
	colors,
	getAllCommandsHelp
} = require("../src/utils");
const execute = require("../src/execute");

const [, , command, ...options] = process.argv;

if (command === undefined) {
	msg(`\n  ${pkgName} ✨\n`, colors.yellow);
	msg(`    ${pkgDefine}\n`);
	msg(`    Check all commands available with ${pkgName} all\n`);

	process.exit(0);
}

if (command === "all") {
	getAllCommandsHelp();
}

if (options[0] === "is") defineCommand(command, "meaning");
else if (options[0] === "help") defineCommand(command, "help");
else execute(command, options);
