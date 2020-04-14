const { pkgName } = require("./config");
const commands = require("./commands");
const { exec } = require("child_process");
const readline = require("readline");
const chalk = require("chalk");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

/**
 * Gets yes or no answer from the user via the terminal
 * @param {String=} question which will be answered yes or no
 * @returns {Promise} which either resolves('yes') or ('no')
 */
const yesOrNo = (question) => {
	return new Promise((resolve, reject) => {
		rl.question(question, (choice) => {
			if (choice === "y") {
				return resolve("yes");
			} else {
				return resolve("no");
			}
		});
	});
};

/**
 * Prints message to the terminal
 * @param {String=} message
 * @param {String=} color defined by chalk package
 */
const msg = (message, color = chalk.white) => console.log(color(message));

const showGitCommand = (command) =>
	msg(
		`git command:\n  git ${command.replace("git ", "")}\n`,
		chalk.yellowBright
	);

// ran when there's no predefined alias by this package
/**
 * Attempt to run git and the command, for cases where this package does not have the command
 * @param {String=} command
 * @param {Array=} options
 */
const attemptGitCommand = (command, options) => {
	if (options) {
		if (!Array.isArray(options))
			throw new Error(`'option' params must be an array`);
		options = options
			.map((option) =>
				option.length === 1 ? `-${option}` : `--${option}`
			)
			.join(" ");
	}
	msg(
		pkgName +
			": '" +
			command +
			"' does not exist. See '" +
			pkgName +
			" all'\n\n" +
			"Attempting to do " +
			"'git " +
			command +
			" " +
			options +
			"'\n",
		chalk.blue
	);
	execCommand(`git ${command} ${options}`);
};

/**
 * Execute command on the terminal
 * @param {String=} command
 */
const execCommand = (command) => {
	exec(command, (err, stdout, stderr) => {
		if (err) {
			// node couldn't execute the command
			console.log(stderr);
		} else {
			console.log(stdout);
		}

		return process.exit(0);
	});
};

/**
 * Print the meaning of a command to the terminal
 * @param {String=} command
 */
const defineCommand = async (command) => {
	const savedCommand = commands[command];
	if (savedCommand === undefined) {
		msg(`${pkgName}:  '${command}' does not exist.`, chalk.redBright);
		const choice = await yesOrNo(
			`Execute 'git ${command} --help'? (y/n): `
		);
		if (choice === "yes") {
			rl.close();
			return execCommand(`git ${command} --help`);
		} else {
			return rl.close();
		}
	}
	if (savedCommand.meaning === undefined && command === savedCommand.git) {
		msg(`No meaning by ${pkgName}`);
		const choice = await yesOrNo(
			`Execute 'git ${command} --help'? (y/n): `
		);
		if (choice === "yes") {
			rl.close();
			return execCommand(`git ${command} --help`);
		} else {
			return rl.close();
		}
	}
	msg(`${command}:  ${savedCommand.meaning}`, chalk.yellowBright);
	return process.exit(0);
};

module.exports = {
	execCommand,
	msg,
	defineCommand,
	showGitCommand,
	attemptGitCommand,
};
