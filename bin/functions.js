const { pkgName } = require("./config");
const commands = require("./commands");
const { exec } = require("child_process");
const readline = require("readline");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

/**
 * Gets yes or no answer from the user via the terminal
 * @param {String=} question which will be answered yes or no
 * @returns {Promise} which either resolves('yes') or 'no
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
 */
const msg = (message) => process.stdout.write(message + "\n");

const showGitCommand = (command) => msg(`git-command:  git ${command}\n`);

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
 * Print real git command to the terminal and execute it
 * @param {String=} command
 */
const execute = (command, options) => {
	let gitCommand = commands[command] !== undefined && commands[command].git;
	if (gitCommand === command) {
        // then commands are the same, not changed by easy-git
        // get all options, and use git command
		let fullCommand = `git`;
        const optionKeys = Object.keys(options);
		optionKeys.forEach((key) => {
            if(key === '$0') {
                return;
            }
			else if (key === "_") {
				fullCommand += ` ${options[key].join(' ')}`;
			} else if (options[key] === true) {
				// if key length is one, the an alias like -b is used, else, the complete name e.g --status is used
				fullCommand += ` ${
					key.length === 1 ? ` -${key}` : ` --${key}`
				}`;
			} else {
				fullCommand += ` ${key} ${options[key]}`;
			}
		});
        showGitCommand(fullCommand.replace('git ', ''));
		return execCommand(fullCommand);
	}
	if (gitCommand === undefined || gitCommand === false) {
		process.stdout.write(
			pkgName +
				": '" +
				command +
				"' does not exist. See '" +
				pkgName +
				" all'\n\n" +
				"Attempting to do " +
				"'git " +
				command +
				"'\n"
		);
		execCommand(`git ${command}`);
		return;
	}
	showGitCommand(command);
	execCommand(`git ${command}`);
};

/**
 * Print the meaning of a command to the terminal
 * @param {String=} command
 */
const defineCommand = async (command) => {
	const savedCommand = commands[command];
	if (savedCommand === undefined) {
		msg(`${pkgName}:  '${command}' does not exist.`);
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
    msg(`${command}:  ${savedCommand.meaning}`);
    return process.exit(0   )
};

module.exports = {
	execCommand,
	execute,
	msg,
	defineCommand,
};
