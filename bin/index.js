#!/usr/bin/env node
const argv = require("yargs").argv;
const { pkgName, pkgDefine } = require("../src/config");
const { defineCommand, msg } = require("../src/functions");
const execute = require("../src/execute");
const chalk = require("chalk");

console.log(chalk.blue("hello"));

const [command, ...options] = argv["_"];

if (command === undefined) {
	msg(`\n  ${pkgName} ✨\n`, chalk.yellowBright);
	msg(`    ${pkgDefine}\n`);
	msg(`    Check all commands available with ${pkgName} all\n`);

	process.exit(0);
}

switch (command) {
	case "all":
		// showAllCommands();
		break;
	default:
		switch (options[0]) {
			case "is":
				defineCommand(command);
				break;
			default:
				execute(command, options);
		}
}
