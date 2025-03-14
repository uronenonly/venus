const { glob } = require("glob");
const { promisify } = require("util");
const { Client } = require("discord.js");
const fs  = require(`fs`)
const globPromise = promisify(glob);

module.exports = async (client) => {

    const commandFiles = await globPromise(`${process.cwd()}/Commands/**/*.js`);
    commandFiles.map((value) => {
        const file = require(value);
        const splitted = value.split("/");
        const directory = splitted[splitted.length - 2];

        if (file.name) {
            const properties = { directory, ...file };
            client.commands.set(file.name, properties);
        }
    });
    const eventFiles = await globPromise(`${process.cwd()}/events/*.js`);
    eventFiles.map((value) => require(value));



};
