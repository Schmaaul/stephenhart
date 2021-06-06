const parser = require("fast-xml-parser");
const fs = require("fs");
const { MessageAttachment } = require("discord.js");
/**
 *
 * @param {import("discord.js").Message} message
 * @param {string} command
 */
const main = async (message, command) => {
  const inXml = command.split(" ").slice(1).join(" ");
  const valid = parser.validate(inXml);
  if (valid.err) {
    return message.channel.send(
      `Error: ${valid.err.msg}\nline: ${valid.err.line}`
    );
  }
  const inData = parser.parse(inXml, { ignoreAttributes: false });
  message.delete();
  const msgToDelete = await message.channel.send(
    "What should the event be called?"
  );
  const filter = (msg) => msg.author.id == message.author.id;
  const msg = await waitForAnswer(filter, message.channel);
  msgToDelete.delete();
  if (typeof msg != "object") return console.log("hulbi");
  const eventName = msg.content;
  msg.delete();
  // create file 1
  const file1 = JSON.parse(JSON.stringify(inData));
  file1.events.event.forEach((event, index) => {
    event["@_name"] = `Static${eventName}_${index + 1}`;
  });

  // create file 2
  const file2 = JSON.parse(JSON.stringify(inData));
  inData.events.event.forEach((event, index) => {
    const oldName = event["@_name"];
    file2.events.event[index] = {
      ["@_name"]: `Static${eventName}_${index + 1}`,
      nominal: 1,
      min: 0,
      max: 0,
      lifetime: 300,
      restock: 0,
      saferadius: 0,
      distanceradius: 0,
      cleanupradius: 0,
      flags: {
        ["@_deletable"]: "0",
        ["@_init_random"]: "0",
        ["@_remove_damaged"]: "0",
      },
      position: "fixed",
      limit: "child",
      active: 1,
      children: {
        child: {
          ["@_lootmax"]: "0",
          ["@_lootmin"]: "0",
          ["@_max"]: "2",
          ["@_min"]: "1",
          ["@_type"]: oldName,
        },
      },
    };
  });
  fs.writeFileSync("out.json", JSON.stringify(file2, null, 2));

  const file1Xml =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' +
    new parser.j2xParser({
      ignoreAttributes: false,
      format: true,
    }).parse(file1);
  const file2Xml =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' +
    new parser.j2xParser({
      ignoreAttributes: false,
      format: true,
    }).parse(file2);
  const Attachment1 = new MessageAttachment(
    Buffer.from(file1Xml, "utf8"),
    "eventspawns.xml"
  );
  const Attachment2 = new MessageAttachment(
    Buffer.from(file2Xml, "utf8"),
    "events.xml"
  );
  message.channel.send(Attachment1);
  message.channel.send(Attachment2);
};
module.exports = main;
/**
 *
 * @param {*} filter
 * @param {import("discord.js").TextChannel} channel
 * @returns
 */
const waitForAnswer = (filter, channel) => {
  return new Promise((resolve, reject) => {
    channel
      .createMessageCollector(filter, { time: 60000, max: 1 })
      .on("end", (map, reason) => {
        const collected = map.array();

        if (collected.length) return resolve(collected[0]);
        else resolve(reason);
      });
  });
};
