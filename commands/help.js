const { MessageEmbed } = require("discord.js");
/**
 *
 * @param {import("discord.js").Message} message
 */
const main = (message) => {
  let embed;
  if (
    message.content.split(" ")[1] &&
    message.content.split(" ")[1].toLowerCase() == "createitem"
  ) {
    embed = new MessageEmbed()
      .setTitle("!createitem")
      .setDescription("Used to create a new item embed")
      .addField("1.", "enter the name of your item")
      .addField(
        "2.",
        "enter as many entries as you like. Example input:\n'description of pistol:can hold a 12 bullet magauine and shoot 2 times a seccond' \nwould look like this:"
      )
      .addField(
        "description of pistol:",
        "can hold a 12 bullet magauine and shoot 2 times a seccond"
      )
      .addField("3.", "type in 'done' to stop adding new entries")
      .addField(
        "4.",
        "type in an image url to be displayed in the embed if you dont have one send something thats not an url like 'none'"
      )
      .addField("5.", "type in '![name of your item]' to see your item.");
  } else {
    embed = new MessageEmbed()
      .setTitle("!Help")
      .setDescription("A list of all commands")
      .addField("!createtext", "Used to create a new text embed")
      .addField(
        "!createitem",
        "Used to create a new item embed use '!help createitem' to learn more."
      )
      .addField(
        "!convert [XML string]",
        "Converts an xml string into two files"
      )
      .addField(
        "![text or item name]",
        "Shows you the embed saved for the given name"
      )
      .addField("!deleteitem [item name]", "deletes the item from the database")
      .addField(
        "!search [search string]",
        "Used to search for items or text that include the search string in their name"
      )
      .addField("!showall", "sends a file with all item names");
  }

  message.channel.send(embed);
};

module.exports = main;
