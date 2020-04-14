const {
	showGitCommand,
	execCommand,
	msg,
	attemptGitCommand,
} = require("./functions");
const commands = require("./commands");
const chalk = require("chalk");
const { pkgName } = require("./config");

/**
 * Print real git command to the terminal and execute it
 * @param {String=} command
 * @param {Object=} options
 */
module.exports = (command, options) => {
	const commandObject = commands[command] || undefined;
	const gitCommand = commandObject ? commandObject.git : null;
	let fullCommand = `git ${gitCommand}`;

	if (gitCommand === command) {
		// the commands are the same
		const commandOptions = commandObject.options || undefined;

		if (options.length > 0) {
			// then there are options
			const [first] = options;

			if (commandOptions !== undefined && commandOptions[first]) {
				// then this package has the option

				if (commandOptions[first].requireValue === false) {
					// then the command can be executed without a value
					msg(
						first + `:\n  ${commandObject.options[first].meaning}`,
						chalk.green
					);

					fullCommand += ` ${commandOptions[first].git}`;
					showGitCommand(fullCommand);
					return execCommand(fullCommand);
				}
			}
		}

		// run the command with git directly
		options.forEach((key) => {
			fullCommand += key.length === 1 ? ` -${key}` : ` --${key}`;
		});

		attemptGitCommand(command, options);
		// showGitCommand(fullCommand);
		// return execCommand(fullCommand);
	}

	if (gitCommand === undefined || gitCommand === false) {
		return attemptGitCommand(command);
	}

	showGitCommand(command);
	execCommand(`git ${command}`);
};
