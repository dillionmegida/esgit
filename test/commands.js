var assert = require("chai").assert;
const commands = require("../src/commands");

describe("Commands", function () {
	describe("command properties", function () {
		let commandKeys;

		this.beforeAll(function () {
			commandKeys = Object.keys(commands);
		});

		it("all commands should have a meaning property except if git value is the same as command", function () {
			commandKeys.forEach(function (key) {
				if (!commands[key].meaning)
					assert.equal(commands[key].git, key);
			});
		});

		it("all commands are only expected to have five properties max: git, meaning, requireValues, acceptValue and options.", function () {
			commandKeys.forEach(function (key) {
				let command = commands[key];
				for (let property in command) {
					assert.include(
						[
							"git",
							"meaning",
							"options",
							"requireValues",
							"acceptValue",
						],
						property
					);
				}
			});
		});

		describe("'requireValues' property if present", function () {
			it("should only exist when the git value is different from the command", function () {
				commandKeys.forEach(function (key) {
					let command = commands[key];
					for (let property in command) {
						if (key === command.git && property === "requireValues")
							assert.ok(false);
					}
				});
			});

			it("should be of type array with max length of 2 and min, 1", function () {
				commandKeys.forEach(function (key) {
					if (commands[key].requireValues) {
						assert.typeOf(commands[key].requireValues, "array");
						assert.isBelow(commands[key].requireValues.length, 3);
						assert.isAbove(commands[key].requireValues.length, 0);
					}

					if (commands[key].options) {
						let options = commands[key].options;
						for (let option in options) {
							let optionProp = options[option];
							if (optionProp.requireValues) {
								assert.typeOf(
									optionProp.requireValues,
									"array"
								);
								assert.isBelow(
									optionProp.requireValues.length,
									2
								);
							}
						}
					}
				});
			});
		});
	});
});
