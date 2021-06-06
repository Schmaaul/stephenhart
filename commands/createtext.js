const { addItem } = require("../savesystem");
const getItemEmbed = require("../getItemEmbed");
const { adminRoleIds, prefix } = require("../config.json");
const openCollectors = {};
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

  if (openCollectors[message.author.id])
    openCollectors[message.author.id].stop("new");

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
  openCollectors[message.author.id] = collector;
  collector.on("collect", async (msg) => {
    if (msg.content.startsWith(prefix)) return;
    if (collecting == "name") {
      item.name = msg.content;
      item.id = msg.content.toLowerCase();
      await msg.delete();
      await msgToDelete.delete();
      collecting = "content";
      msgToDelete = await message.channel.send(
        "Type in the content of your text!"
      );
      return;
    }
    if (collecting == "content") {
      item.content = msg.content;
      await msg.delete();
      await msgToDelete.delete();
      collector.stop("done");
    }
  });

  collector.on("end", (_, reason) => {
    delete openCollectors[message.author.id];
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
