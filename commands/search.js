const { findIdsBySearch } = require("../savesystem");
const main = (message, command) => {
  const ids = findIdsBySearch(command.split(" ").slice(1).join(" ")).sort(
    function (a, b) {
      if (a < b) {
        return -1;
      }
      if (a > b) {
        return 1;
      }
      return 0;
    }
  );
  if (ids.length > 100)
    return message.channel.send(
      `Found ${ids.length} items specify more or use !showall`
    );
  message.channel.send(`Found ${ids.length} ids\n${ids.join(", ")}`);
};

module.exports = main;
