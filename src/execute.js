const {
	msg,
	colors,
	attemptGitCommand,
	getAllCommands,
	showGitAndExecute,
	requireValueMsg,
} = require("./utils");
const commands = require("./commands");
const { pkgName } = require("./config");

/**
 * Print real git command to the terminal and execute it
 * @param {String=} command
 * @param {Array} options [command, options] = argv._
 * @param {Object} allArguments
 */
module.exports = (command, options) => {
	const commandObject = commands[command] || undefined;
	const gitCommand = commandObject ? commandObject.git : undefined;
	let fullCommand = `git ${gitCommand}`;
	const allCommands = getAllCommands();

	if (commandObject === undefined) {
		// no predefined command
		return attemptGitCommand(allCommands, `'${command}' does not exist`);
	}

	if (options.length === 0) {
		// no options passed

		if (commandObject.requireValues) {
			const { requireValues } = commandObject;
			requireValueMsg(command, requireValues.join(", "));
			return process.exit(0);
		}

		if (commandObject.meaning) msg(commandObject.meaning, colors.yellow);

		return showGitAndExecute(fullCommand);
	}

	if (commandObject.requireValues) {
		const { requireValues } = commandObject;
		const [val1, val2] = options;
		const nums = requireValues.length;

		if (val2 === undefined && nums === 2) {
			requireValueMsg(command, requireValues.join(", "));
			return process.exit(0);
		}

		fullCommand += ` ${val1}`;
		if (val2) fullCommand += ` ${val2}`;

		return showGitAndExecute(fullCommand);
	}

	if (commandObject.options) {
		const [option, ...rest] = options;
		const commandOption = commandObject.options[option] || undefined;

		if (commandOption !== undefined) {
			fullCommand += ` ${commandOption.git}`;
			msg(commandOption.meaning, colors.yellow);

			const requireValues = commandOption.requireValues || undefined;

			if (requireValues !== undefined) {
				if (rest.length < 1 || requireValues.length > rest.length)
					return requireValueMsg(allCommands, commandOption.requireValues);

				const values =
					commandOption.requireValues.length < 2
						? rest[0]
						: rest.slice(0, 2).join(" "); // slice incase more options are passed

				fullCommand += ` ${values}`;
			}

			return showGitAndExecute(fullCommand);
		}
	}

	if (commandObject.acceptValue) {
		const [...values] = options;
		fullCommand += ` ${values.join(" ")}`;
		return showGitAndExecute(fullCommand);
	}

	// if everything above does not get executed, this package cannot handle the command
	attemptGitCommand(allCommands, `'${allCommands}' could not be executed`);
};
