const { MessageEmbed } = require("discord.js");
const { adminRoleIds } = require("../config.json");
const { isUri } = require("valid-url");
const { addItem } = require("../savesystem");
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

  const embed = new MessageEmbed().setFooter("Item preview");
  const item = { entries: [] };
  const itemPreMsg = await message.channel.send(embed);

  let collecting = "name";

  let msgToDelete = await message.channel.send("Item name:");

  const filter = (msg) => msg.author.id == message.author.id;
  const collector = message.channel.createMessageCollector(filter, {
    time: 180000,
  });
  collector.on("collect", async (msg) => {
    collector.resetTimer();
    if (collecting == "name") {
      msgToDelete.delete();
      item.name = msg.content;
      embed.setTitle(item.name);
      itemPreMsg.edit(embed);
      item.id = item.name.toLowerCase();
      collecting = "entry";
      msgToDelete = await message.channel.send(
        "Create a new entry by typing entryname: entrytext or write done"
      );
      msg.delete();
      return;
    }
    if (collecting == "entry") {
      msgToDelete.delete();
      if (msg.content.toLowerCase() == "done") {
        msgToDelete = await message.channel.send("chose a pic url:");
        collecting = "picurl";
        msg.delete();
        return;
      }
      const components = msg.content.split(":");
      if (components.length < 2) {
        msgToDelete = await message.channel.send(
          "Create a new entry by typing entryname: entrytext or write done and dont forget the :"
        );
        return msg.delete();
      }
      item.entries.push({ n: components[0] + ":", d: components[1] });
      embed.addField(components[0] + ":", components[1]);
      itemPreMsg.edit(embed);
      msgToDelete = await message.channel.send(
        "Create a new entry by typing entryname: entrytext or write done"
      );
      msg.delete();
      return;
    }
    if (collecting == "picurl") {
      if (!isUri(msg.content)) {
        msgToDelete.delete();
        msg.delete();
        collector.stop("done");
        return;
      }
      msgToDelete.delete();
      embed.setImage(msg.content);
      item.picurl = msg.content;
      msg.delete();
      itemPreMsg.edit(embed);
      collector.stop("done");
    }
  });
  collector.on("end", (_, reason) => {
    message.delete();

    if (reason === "done") {
      const id = saveItem(item);
      if (!id)
        message.channel.send(
          "Could not create the item maybe this item already exists?"
        );
      message.channel.send(`Saved the item with the unique id ${id}`);
    } else {
      itemPreMsg.delete();
      if (msgToDelete.deletable) msgToDelete.delete();
    }
  });
};

const saveItem = (item) => {
  item.type = "item";
  return addItem(item);
};

module.exports = main;
