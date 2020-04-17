const { pkgName, pkgDefine } = require("./config");
const commands = require("./commands");
const { spawnSync } = require("child_process");
const readline = require("readline");
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const colors = {
	red: chalk.redBright,
	yellow: chalk.yellowBright,
	white: chalk.white,
	blue: chalk.blue,
};

/**
 * Gets yes or no answer from the user via the terminal
 * @param {String=} question which will be answered yes or no
 * @returns {Promise} which either resolves('yes') or ('no')
 */
const yesOrNo = (question) => {
	return new Promise((resolve, reject) => {
		rl.question(question, (choice) => {
			if (choice === "y") {
				return resolve("y");
			} else {
				return resolve("n");
			}
		});
	});
};

/**
 * Get all commands passed to the terminal
 */
const getAllCommands = () => process.argv.slice(2).join(" ");

/**
 * Prints message to the terminal
 * @param {String=} message
 * @param {String=} color defined by chalk package
 */
const msg = (message, color = colors.white) => console.log(color(message));

const requireValueMsg = (command, values) => {
	const len = values.length;
	msg(
		`'${command}' needs ${len} value${len > 1 ? "s" : ""}  (${values})`,
		colors.red
	);
	process.exit(0);
};

const showGitCommand = (command) =>
	msg(`\ngit command: git ${command.replace("git ", "")}\n`, colors.yellow);

/**
 * Execute command on the terminal
 * @param {String=} command
 */

const execCommand = async (command) => {
	const package = command.split(" ")[0];
	commandOptions = command.replace(`${package} `, "").split(" ");
	spawnSync(package, commandOptions, {
		stdio: "inherit",
	});
	process.exit(0);
};

const showGitAndExecute = (command) => {
	showGitCommand(command);
	execCommand(command);
};

/**
 * Attempt to run git and the command, for cases where this package does not have the command
 * @param {String=} command to be used by git
 * @param {String=} message to be display
 */
const attemptGitCommand = (command, message) => {
	let fullCommand = `git ${command.replace("git ", "")}`;

	msg(
		pkgName +
			": " +
			message +
			". See `" +
			pkgName +
			" all`\n\n" +
			"Attempting to do `" +
			fullCommand +
			"`\n",
		colors.blue
	);

	execCommand(fullCommand);
};

/**
 * Print the meaning of a command to the terminal
 * @param {String=} command
 */
const defineCommand = async (command, option) => {
	const savedCommand = commands[command];

	if (savedCommand === undefined) {
		msg(`${pkgName}:  '${command}' does not exist.`, chalk.redBright);

		const choice = await yesOrNo(
			`Execute 'git ${command} --help'? (y/n): `
		);

		rl.close();

		if (choice === "y") return execCommand(`git ${command} --help`);
		else process.exit(0);
	}

	if (option === "meaning") {
		if (
			savedCommand.meaning === undefined &&
			command === savedCommand.git
		) {
			msg(`No meaning provided by ${pkgName}`);
			const choice = await yesOrNo(
				`Execute 'git ${command} --help'? (y/n): `
			);

			rl.close();

            if (choice === "y") return execCommand(`git ${command} --help`)
            else process.exit(0)
		}

		msg(`${command}:  ${savedCommand.meaning}`, colors.yellow);
		return process.exit(0);
	}

	if (option === "help") {
		return defineCommand(command);
	}
};

const writeToFile = (title, body, pathToFile) => {
	let content = `\n  ${pkgName}: ${pkgDefine} ✨\n\n    ${title}\n    ${title
		.split("")
		.map(() => "-")
		.join("")}${body}\n`;
	fs.writeFileSync(path.join(__dirname, pathToFile), content);
};

const readFile = (pathToFile) => {
	execCommand(`cat ${path.join(__dirname, pathToFile)}`);
};

const writeCommandHelp = (command) => {
	if (commands[command] === undefined) return;

	const title = command;
	let content = "";
	for (let key in commands[command]) {
		if (key !== "meaning") {
			content += `\n      ${key}: `;

			if (key === "options") {
				for (let option in commands[command][key]) {
					const meaning = commands[command][key][option].meaning;
					content += `\n        ${option}: ${meaning}`;
				}
			} else content += `'${commands[command][key]}'`;
		}
	}

	writeToFile(title, content, `../help/${command}.txt`);
};

const writeAllCommandsHelp = () => {
	const title = `All commands in ${pkgName}`;
	let content = "";

	for (let command in commands) {
		let meaning = commands[command].meaning || undefined;
		content += `\n\n    [${command}]: ${meaning ? meaning : "---"}\n`;

		writeCommandHelp(command);

		for (let key in commands[command]) {
			if (key !== "meaning") {
				content += `\n      ${key}: `;

				if (key === "options") {
					for (let option in commands[command][key]) {
						const meaning = commands[command][key][option].meaning;
						content += `\n        ${option}: ${meaning}`;
					}
				} else content += `'${commands[command][key]}'`;
			}
		}
	}
	writeToFile(title, content, "../help/allcommands.txt");
};

writeAllCommandsHelp();

const getAllCommandsHelp = () => {
	readFile("../help/allcommands.txt");
};

const getCommandHelp = (command) => {
	readFile(`../help/${command}.txt`);
};

module.exports = {
	colors,
	execCommand,
	msg,
	getAllCommands,
	showGitCommand,
	attemptGitCommand,
	showGitAndExecute,
	requireValueMsg,
	getAllCommandsHelp,
	getCommandHelp,
};
