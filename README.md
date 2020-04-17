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

the format is easy-git command (if value required ? value) ...options

checkout -b branch not showing the u have entered a new branch

if hyphens are used with options, all commands is transferred to git, because this package does not support hyphens

if a command accepts values, note that the values to pick will depend on the array

i.e accept value 1 means const [value1, ...remainOptions] = options
accept value 2 means const [value1, value2, ...remainOptions] = options

all properties in options must begin with double hyphens

acceptValue property is important because if it doesn't exist, it would be difficult to differnet git branch and git branch branch-name
