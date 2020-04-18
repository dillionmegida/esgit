/**
 *                                              THINGS TO NOTE ❕❕
 *
 * ---------------------------------------------------------------------------------------------------------------------
 *
 * 1. This file holds the mapping of available commands with their respective options and git commands
 *
 * 2. for commands which are different from their associated 'git' values, they are predefined by this package
 * 3. for commands with same git values, the options object contains predefined aliases.
 * 4. if this package cannot execute the command passed, all commands are passed to git to be executed
 *
 * 5. for commands without 'meaning' key, git --help would be ran
 */
module.exports = {
	clone: {
		git: "clone",
		acceptValue: true,
	},
	init: {
		git: "init",
	},
	push: {
		git: "push",
	},
	add: {
		git: "add",
		acceptValue: true,
	},
	branch: {
		meaning: "List, create, or delete branches",
		git: "branch",
		options: {
			"--delete-force": {
				meaning: "Delete branch",
				requireValues: ["branch-name"],
				git: "--delete --force",
			},
		},
		acceptValue: true,
	},
	status: {
		meaning: "Show the working tree status",
		git: "status",
		options: {
			"--short-format": {
				meaning: "Show short format of git status",
				git: "--short",
			},
		},
	},
	commit: {
		git: "commit",
		acceptValue: true,
	},
};
