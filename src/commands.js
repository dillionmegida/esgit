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
	"delete-branch-force": {
		meaning: "Delete branch by force",
		requireValues: ["branch-name"],
		git: "branch --delete --force",
	},
	"short-format-status": {
		meaning: "Show short format of git status",
		git: "status --short",
	},
	"last-commit": {
		meaning: "Print the last commit on a single line",
		git: "log -1 --oneline",
	},
	"edit-commit": {
		meaning: "Edit the last commit made",
		git: "commit --amend -m",
		requireValues: ["new-commit-message"],
	},
	"new-change-recommit": {
		meaning: "Add new changes to a previous commit that hasn't been pushed",
		git: "commit --amend --no-edit",
	},
	"remove-last-master-commit": {
		meaning: "Remove the last commit from master that hasn't been pushed",
		git: "reset HEAD~ --hard",
	},
	"remove-last-master-commit-keep-changes": {
		meaning:
			"Remove the last commit from master that hasn't been pushed but keep the changes",
		git: "reset HEAD~ --soft",
	},
	"remove-staged-file": {
		meaning: "Remove a file that has been staged",
		git: "rm --cached",
		requireValues: ["file"],
	},
};
