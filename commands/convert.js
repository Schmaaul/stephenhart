//const fs = require("fs");

const { convertRoleIds, prefix } = require("../config.json");
const strip = require("./converter/strip");
const xml = require("./converter/xml");
const newCon = require("./converter/new");
/**
 *
 * @param {import("discord.js").Message} message
 * @param {string} command
 */
const main = async (message, command) => {
  if (message.channel.type != "text")
    return message.channel.send(
      "This command can only be used in text channels on discord servers"
    );
  if (
    !message.member.roles.cache.some((role) => convertRoleIds.includes(role.id))
  )
    return message.channel.send(
      `Your roles dont have the permissions to use the conversion tool.`
    );
  const attachments = message.attachments.array()[0];
  console.log(attachments);
  const input = strip(
    message.content.split("").slice(`${prefix}convert`.length).join("")
  );
  if (xml.isRightType(input)) return xml.convert(input, message);
  if (newCon.isRightType(input)) return newCon.convert(input, message);
  message.channel.send(
    "Could not identify the type of your conversion object. To convert xml your object needs to start with '<' and for the other conversion with '//'"
  );
};
module.exports = main;
