const fs = require("fs");

if (!fs.existsSync("./config.json")) {
  fs.writeFileSync(
    "./config.json",
    JSON.stringify(
      {
        botToken: "Here goes the bot token",
        prefix: "!",
        adminRoleIds: [
          "enter the id of the role that can add things to the bot.",
        ],
      },
      null,
      2
    )
  );
  console.log("Please fill out the config.json file");
  process.exit();
}

const { botToken, prefix } = require("./config.json");

const createitem = require("./commands/createitem");
const createtext = require("./commands/createtext");
const convert = require("./commands/convert");
const help = require("./commands/help");
const deleteitem = require("./commands/deleteitem");
const showall = require("./commands/showall");
const search = require("./commands/search");

const { getItemByID } = require("./savesystem");
const getItemEmbed = require("./getItemEmbed");

const Discord = require("discord.js");
const client = new Discord.Client();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("message", (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  const command = message.content.toLowerCase().slice(1);
  if (command.startsWith("createitem")) return createitem(message);
  if (command.startsWith("createtext")) return createtext(message);
  if (command.startsWith("deleteitem") || command.startsWith("deletetext"))
    return deleteitem(message, command);
  if (command.startsWith("convert")) return convert(message, command);
  if (command.startsWith("help")) return help(message);
  if (command.startsWith("showall")) return showall(message);
  if (command.startsWith("search")) return search(message, command);

  const item = getItemByID(command);
  if (item) return message.channel.send(getItemEmbed(item));
});

client.login(botToken);
