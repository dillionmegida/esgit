/**
 *                                              THINGS TO NOTE ❕❕
 *
 * ---------------------------------------------------------------------------------------------------------------------
 *
 * This file holds the mapping of available commands with their respective options and git commands
 *
 * for commands which are different from their associated 'git' values, they are predefined by this package
 * for commands with same git values, the options array contains predefined aliases.
 * if option does not exist in the predefined aliases, use the git command normally
 *
 * for commands without 'meaning' key, git --help would be ran
 *
 */
module.exports = {
	clone: {
		git: "clone",
	},
	init: {
		git: "init",
	},
	push: {
		git: "push",
	},
	add: {
		git: "add",
	},
	branch: {
		git: "branch",
		options: {
			del: {
				meaning: "Delete branch",
				requireNext: false,
			},
		},
		meaning: "List, create, or delete branches",
	},
	rm: {
		git: "rm",
	},
	status: {
		meaning: "Show the working tree status",
		git: "status",
		options: {
			"short-format": {
                meaning: "Show short format of git status",
                requireValue: false,
                git: '--short || -s'
			},
		},
	},
	commit: {
		git: "commit",
	},
};
