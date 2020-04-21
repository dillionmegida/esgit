module.exports = {
	"delete-branch-force": {
		meaning: "Delete branch whether it has been merged or not",
		requireValues: ["branch-name"],
		git: "branch --delete --force",
	},
	"merged-branches": {
		meaning: "Show branches that have been merged to the current branch",
		git: "branch --merged",
	},
	"unmerged-branches": {
		meaning:
			"Show branches that have not been merged to the current branch",
		git: "branch --no-merged",
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
