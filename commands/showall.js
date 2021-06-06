const { getAllIds } = require("../savesystem");
const { MessageAttachment } = require("discord.js");
const main = (message) => {
  const attach = new MessageAttachment(
    Buffer.from(getAllIds().join("\n")),
    "itemids.txt"
  );
  message.channel.send(attach);
};

module.exports = main;
