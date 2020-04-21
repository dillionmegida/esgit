const assert = require("chai").assert;
const commands = require("../src/commands");

describe("Commands", function () {
	describe("command properties", function () {
		let commandKeys;

		this.beforeAll(function () {
			commandKeys = Object.keys(commands);
		});

		it("all commands should have two properties: meaning and git", function () {
			commandKeys.forEach(function (key) {
				let command = commands[key];
				assert.property(command, "git");
				assert.property(command, "meaning");
			});
		});

		it("all commands can optionally have 'requireValues' property", function () {
			commandKeys.forEach(function (key) {
				let command = commands[key];
				for (let property in command) {
					assert.include(
						["git", "meaning", "requireValues"],
						property
					);
				}
			});
		});

		describe("'requireValues' property if present", function () {
			it("should be of type array with max length of 2 and min, 1 and string values", function () {
				commandKeys.forEach(function (key) {
					const { requireValues = undefined } = commands[key];

					if (requireValues !== undefined) {
						assert.typeOf(commands[key].requireValues, "array");
						assert.isBelow(commands[key].requireValues.length, 3);
						assert.isAbove(commands[key].requireValues.length, 0);

						requireValues.forEach(function (value) {
							assert.typeOf(value, "string");
						});
					}
				});
			});
		});
	});
});
