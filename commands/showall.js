const { getAllIds } = require("../savesystem");
const { MessageAttachment } = require("discord.js");
const main = (message) => {
  const ids = getAllIds().sort(function (a, b) {
    if (a.firstname < b.firstname) {
      return -1;
    }
    if (a.firstname > b.firstname) {
      return 1;
    }
    return 0;
  });
  const attach = new MessageAttachment(
    Buffer.from(ids.join("\n")),
    "itemids.txt"
  );
  message.channel.send(attach);
};

module.exports = main;
