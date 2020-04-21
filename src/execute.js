const {
	msg,
	colors,
	attemptGitCommand,
	getAllCommands,
	showGitAndExecute,
	selectOptions,
	getCommandHelp,
	getInput,
	formatSpacedString,
} = require("./utils");
const commands = require("./commands");

/**
 * Print real git command to the terminal and execute it
 * @param {String=} command
 * @param {Array} options [command, options] = argv._
 * @param {Object} allArguments
 */
module.exports = async (command, options) => {
	if (command === undefined || command === "help") {
		let help = false;

		if (command === "help") help = true;

		const allCommands = [];
		let longestCommandLength = 0;

		for (let command in commands) {
			if (command.length > longestCommandLength)
				longestCommandLength = command.length;
		}

		for (let command in commands) {
			// generate spaces so that the options align
			let spaces = [];
			for (
				let i = 0;
				i < longestCommandLength + 3 - command.length;
				i++
			) {
				spaces.push(" ");
			}
			allCommands.push(
				`${command}${spaces.join("")}>   ${colors.blue(
					commands[command].meaning
				)}`
			);
		}

		command = await selectOptions(`Select command`, allCommands);
		command = command.split(" ")[0];

		if (help) return getCommandHelp(command);
	}

	const commandObject = commands[command] || undefined;
	const gitCommand = commandObject ? commandObject.git : undefined;
	let fullCommand = `git ${gitCommand}`;
	const allCommands = getAllCommands();

	if (commandObject === undefined) {
		// no predefined command
		return attemptGitCommand(allCommands, `'${command}' does not exist`);
	}

	if (commandObject.requireValues && options.length === 0) {
		// no options are passed and value(s) is required

		const { requireValues } = commandObject;
		const len = requireValues.length;

		msg(
			`'${command}' needs ${len} value${
				len > 1 ? "s" : ""
			}  (${requireValues.join(", ")})`,
			colors.blue
		);

		let val1,
			val2 = null;

		val1 = await getInput(`${requireValues[0]}?`);
		if (requireValues.length > 1)
			val2 = await getInput(`${requireValues[1]}`);

		val1 = formatSpacedString(val1);
		if (val2) val2 = formatSpacedString(val2);

		fullCommand += ` ${val1}${val2 !== null ? " " + val2 : ""}`;

		msg(commandObject.meaning, colors.yellow);

		return showGitAndExecute(fullCommand);
	}

	// if the interactive platform is not used, then the user entered the command
	// directly on the terminal...the following handles such commands

	if (options.length === 0) {
		// no options passed

		msg(commandObject.meaning, colors.yellow);

		return showGitAndExecute(fullCommand);
	}

	if (commandObject.requireValues) {
		const { requireValues } = commandObject;
		const len = requireValues.length;

		if (options.length === 0 || options.length < len) {
			return msg(
				`'${command}' needs ${len} value${
					len > 1 ? "s" : ""
				}  (${requireValues.join(", ")})`,
				colors.red
			);
		}

		let [val1, val2 = null] = options;

		val1 = formatSpacedString(val1);
		if (val2) val2 = formatSpacedString(val2);

		fullCommand += ` ${val1}${val2 !== null ? " " + val2 : ""}`;

		msg(commandObject.meaning, colors.yellow);

		return showGitAndExecute(fullCommand);
	}

	// if everything above does not get executed, this package cannot handle the command
	attemptGitCommand(allCommands, `'${allCommands}' could not be executed`);
};
