const { deleteItemById } = require("../savesystem");
const { adminRoleIds } = require("../config.json");
/**
 *
 * @param {import("discord.js").Message} message
 * @param {string} command
 * @returns
 */
const main = async (message, command) => {
  if (message.channel.type != "text")
    return message.channel.send(
      "This command can only be used in text channels on discord servers"
    );
  if (
    !message.member.roles.cache.some((role) => adminRoleIds.includes(role.id))
  )
    return message.channel.send(
      `Your roles dont have the permissions to add a item`
    );

  const res = deleteItemById(command.split(" ").slice(1).join(" "));
  if (res.err) return message.channel.send(res.err.msg);
  message.channel.send("Deleted the item!");
};

module.exports = main;
