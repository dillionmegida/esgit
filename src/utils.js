const { pkgName, pkgDefine } = require("./config");
const commands = require("./commands");
const { spawnSync } = require("child_process");
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const { AutoComplete, Confirm, Input } = require("enquirer");

const colors = {
	red: chalk.redBright,
	yellow: chalk.yellowBright,
	white: chalk.white,
	blue: chalk.blue,
};

/**
 * Gets yes or no answer from the user via the terminal
 * @param {String=} question which will be answered yes or no
 * @returns {Boolean} true if yes, and false if no
 */
const yesOrNo = async (question) => {
	const prompt = new Confirm({
		name: "question",
		message: question,
	});

	try {
		const answer = await prompt.run();
		return answer;
	} catch {
		console.log("exiting input...");
		process.exit(0);
	}
};

/**
 * Select from options with autocomplete feature
 * @param {String=} question
 * @param {Array=} options
 * @returns {String} selected option
 */
const selectOptions = async (question, options) => {
	const prompt = new AutoComplete({
		name: "commands",
		message: question,
		limit: 10,
		initial: 0,
		choices: options,
	});

	try {
		const answer = await prompt.run();
		return answer;
	} catch (err) {
		console.log("exiting input...");
		process.exit(0);
	}
};

/**
 * Format string which may contain spaces and return them in quotes
 * @param {String=} string
 * @returns {String} formatted string
 */
const formatSpacedString = (string) => {
	if (string.split(" ").length > 1) {
		// then a connected string like "hello hi" is used
		return `\"${string}\"`;
	}
	return string;
};

/**
 * Get answer from terminal
 * @param {String=} question
 * @returns {String} answer
 */
const getInput = async (question) => {
	const prompt = new Input({
		message: question,
	});

	try {
		const answer = await prompt.run();
		return answer;
	} catch (err) {
		console.log("exiting input...");
		process.exit(0);
	}
};

/**
 * Get all commands passed to the terminal
 * @returns {String} all commands passed to terminal
 */
const getAllCommands = () => {
	let commands = process.argv.slice(2);

	commands = commands.map((command) => {
		return formatSpacedString(command);
	});

	return commands.join(" ");
};

/**
 * Prints message to the terminal
 * @param {String=} message
 * @param {String=} color defined by chalk package
 */
const msg = (message, color = colors.white) => console.log(color(message));

/**
 * Show git command on the terminal
 * @param {String=} command 
 */
const showGitCommand = (command) =>
	msg(`\ngit command: git ${command.replace("git ", "")}\n`, colors.yellow);

/**
 * Execute command on the terminal
 * @param {String=} command
 */
const execCommand = async (command) => {
	const package = command.split(" ")[0];
	let commandOptions = command.replace(`${package} `, "").split(" ");
	let commandOptionsFormatted = [];
	let i = 0;

	// command options needs to be formatted for cases where two words are joined together with quotes
	while (i < commandOptions.length) {
		if (commandOptions[i].startsWith('"')) {
			let l = "";
			while (!l.endsWith('"')) {
				l += ` ${commandOptions[i]}`;
				i++;
			}
			commandOptionsFormatted.push(l);
		} else {
			commandOptionsFormatted.push(commandOptions[i]);
		}
		i++;
	}
	spawnSync(package, commandOptionsFormatted, {
		stdio: "inherit",
	});
	process.exit(0);
};

/**
 * Show git command and execute
 * @param {String=} command 
 */
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

		const choice = await yesOrNo(`Execute 'git ${command} --help'?`);

		if (choice === true) return execCommand(`git ${command} --help`);
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

			if (choice === true) return execCommand(`git ${command} --help`);
			else process.exit(0);
		}

		msg(`${command}:  ${savedCommand.meaning}`, colors.yellow);
		return process.exit(0);
	}

	if (option === "help") {
		return getCommandHelp(command);
	}
};

/**
 * Write to a file
 * @param {String=} title 
 * @param {String=} body 
 * @param {String=} pathToFile 
 */
const writeToFile = (title, body, pathToFile) => {
	let content = `\n  ${pkgName}: ${pkgDefine} ✨\n\n    ${title}\n    ${title
		.split("")
		.map(() => "-")
		.join("")}${body}\n`;
	fs.writeFileSync(path.join(__dirname, pathToFile), content);
};

/**
 * Read a file
 * @param {String} pathToFile 
 */
const readFile = (pathToFile) => {
	spawnSync(
		"node",
		["./node_modules/cross-cmd", "cat", path.join(__dirname, pathToFile)],
		{
			stdio: "inherit",
		}
	);
	process.exit(0);
};

/**
 * Write the help file of a command
 * @param {String=} command 
 */
const writeCommandHelp = (command) => {
	if (commands[command] === undefined) return;

	const title = command;
	let content = "";

	for (let key in commands[command]) {
		content += `\n      ${key}: `;
		const value = commands[command][key];

		if (Array.isArray(value)) {
			content += `'${value.join(", ")}'`;
		} else {
			content += `'${commands[command][key]}'`;
		}
	}
	content += "\n";

	writeToFile(title, content, `../help/${command}.txt`);
};

/**
 * Write the help file of all commands
 */
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

				const value = commands[command][key];

				if (Array.isArray(value)) {
					content += `'${value.join(", ")}'`;
				} else {
					content += `'${commands[command][key]}'`;
				}
			}
		}
	}

	content += "\n";

	writeToFile(title, content, "../help/allcommands.txt");
};

/**
 * Read the all commands help file
 */
const getAllCommandsHelp = () => {
	readFile("../help/allcommands.txt");
};

/**
 * Read the help file of a command
 * @param {String=} command 
 */
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
	getAllCommandsHelp,
	getCommandHelp,
	writeAllCommandsHelp,
	defineCommand,
	selectOptions,
	getInput,
	formatSpacedString,
};
