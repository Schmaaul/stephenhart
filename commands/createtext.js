const { addItem } = require("../savesystem");
const getItemEmbed = require("../getItemEmbed");
const { adminRoleIds } = require("../config.json");

/**
 *
 * @param {import("discord.js").Message} message
 */
const main = async (message) => {
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

  const item = {};
  item.type = "text";

  let collecting = "name";

  let msgToDelete = await message.channel.send(
    "Type in the name of your text!"
  );

  const filter = (msg) => msg.author.id == message.author.id;
  const collector = message.channel.createMessageCollector(filter, {
    time: 180000,
  });

  collector.on("collect", async (msg) => {
    if (collecting == "name") {
      item.name = msg.content;
      item.id = msg.content.toLowerCase();
      msg.delete();
      msgToDelete.delete();
      collecting = "content";
      msgToDelete = await message.channel.send(
        "Type in the content of your text!"
      );
      return;
    }
    if (collecting == "content") {
      item.content = msg.content;
      msg.delete();
      msgToDelete.delete();
      collector.stop("done");
    }
  });

  collector.on("end", (_, reason) => {
    message.delete();
    if (reason == "done") {
      const saveId = saveItem(item);
      if (saveId) {
        message.channel.send(getItemEmbed(item));
        message.channel.send(`Saved the text with the unique id ${saveId}`);
      } else message.channel.send("Could not save the text");
    }
  });
};
const saveItem = (item) => {
  return addItem(item);
};
module.exports = main;
