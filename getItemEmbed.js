const { MessageEmbed } = require("discord.js");
module.exports = (item) => {
  if (item.type == "item") {
    const embed = new MessageEmbed().setTitle(item.name);
    item.entries.forEach((entrie) => embed.addField(entrie.n, entrie.d));
    if (item.picurl) embed.setImage(item.picurl);
    return embed;
  }
  if (item.type == "text") {
    const embed = new MessageEmbed()
      .setTitle(item.name)
      .setDescription(item.content);
    return embed;
  }

  return "Could not render";
};
