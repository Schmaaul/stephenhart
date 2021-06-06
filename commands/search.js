const { findIdsBySearch } = require("../savesystem");
const main = (message, command) => {
  const ids = findIdsBySearch(command.split(" ").slice(1).join(" "));
  if (ids.length > 100)
    return message.channel.send(
      `Found ${ids.length} items specify more or use !showall`
    );
  message.channel.send(`Found ${ids.length} ids\n${ids.join(", ")}`);
};

module.exports = main;
