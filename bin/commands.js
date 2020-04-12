// holds the mapping of available commands with git commands
module.exports = {
	clone: {
		git: "clone",
	},
	init: {
		git: "init",
	},
	add: {
		git: "add",
	},
	branch: {
        git: "branch",
        meaning: "List, create, or delete branches"
	},
	rm: {
		git: "rm",
	},
	status: {
        meaning: "Show the working tree status",
		git: "status",
	},
	commit: {
		git: "commit",
	},
};
