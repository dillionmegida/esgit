# egit - easy-git

CLI package with simplified aliases for git commands.

_In progress..._

---

## Quick commands

### \* egit status --short-format

The command for this is `git status --short` which gives the output of the working tree status in short format.

### \* egit branch --delete-force <branch-name>

The command for this is `git branch --delete --force <branch-name>` which deletes a branch by force.

---

A lot more coming.

## If egit cannot handle your request, there is no need to panic

When `egit` cannot handle a command, it hands it over to `git` to execute. With this, you do not have to switch between `egit` and `git`

Also note that, `egit`'s command are not executed. These are just aliases that trigger the real git commands.
