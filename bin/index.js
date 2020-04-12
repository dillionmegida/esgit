#!/usr/bin/env node
const argv = require("yargs").argv;
const { pkgName } = require("./config");
const { execute, defineCommand } = require("./functions");
const commands = require("./commands");

const command = argv["_"][0];
const options = {...argv}
if (argv["_"][1] === "is") {
	defineCommand(command);
} else {
	execute(command, options);
}
