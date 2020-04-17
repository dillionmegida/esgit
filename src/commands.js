/**
 *                                              THINGS TO NOTE ❕❕
 *
 * ---------------------------------------------------------------------------------------------------------------------
 *
 * 1. This file holds the mapping of available commands with their respective options and git commands
 *
 * 2. for commands which are different from their associated 'git' values, they are predefined by this package
 * 3. for commands with same git values, the options array contains predefined aliases.
 * 4. if option does not exist in the predefined aliases, use the git command normally with the options passed
 *
 * 5. for commands without 'meaning' key, git --help would be ran
 */
module.exports = {
	clone: {
        git: "clone"
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
        meaning: "List, create, or delete branches",
		git: "branch",
		options: {
			"--delete-force": {
				meaning: "Delete branch",
                requireValues: ['branch-name'],
                git: '--delete --force'
            },
        },
        acceptValue: true
	},
	rm: {
		git: "rm",
	},
	status: {
		meaning: "Show the working tree status",
		git: "status",
		options: {
			"--short-format": {
				meaning: "Show short format of git status",
				git: "--short",
            }
		},
	},
	commit: {
		git: "commit",
	},
};
