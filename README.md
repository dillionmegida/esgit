# easy-git

CLI package with simplified aliases for git commands.

_In progress..._

---

## my jottings

to move changes from one branch to another

> cut/copy changes (which is current branch) to branch-name

create branch from new changes

> create branch branch-name with changes

one test should be that all keys in commands should be an object with key, git. If defined key does not exist as a child to git, ensure that the key in command is the same as git

one issue, git colors are hidden in stdout

while pushing, the progress of git was not displayed...ahh

test all commands must have options key, at least null

maximum structure of a command should be status: {
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

repo should not allow options like -- or -, all commands should be names
