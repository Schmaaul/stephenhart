const parser = require("fast-xml-parser");
const { MessageAttachment } = require("discord.js");

const convert = async (inXml, message) => {
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
  if (typeof msg != "object") return;
  const eventName = msg.content;
  msg.delete();

  try {
    // create file 1
    let index = 1;
    const file1 = JSON.parse(JSON.stringify(inData));
    //console.log(JSON.stringify(file1, null, 2));
    const newFile1 = { events: { event: [] } };
    file1.events.event.forEach((event) => {
      if (!event.pos.length) event.pos = [event.pos];
      //console.log(event);
      event.pos.forEach((pos) => {
        const newEvent = {};
        newEvent["@_name"] = `Static${eventName}_${index}`;
        newEvent.pos = { ...pos };
        //console.log(newEvent);
        newEvent.pos["@_a"] = newEvent.pos["@_a"] % 360;
        if (newEvent.pos["@_a"] < 0) newEvent.pos["@_a"] += 360;
        newFile1.events.event.push(newEvent);
        index++;
      });
      //event["@_name"] = `Static${eventName}_${index + 1}`;
    });
    //console.log(JSON.stringify(newFile1, null, 2));

    index = 1;
    // create file 2
    const file2 = JSON.parse(JSON.stringify(inData));
    const newFile2 = { events: { event: [] } };
    inData.events.event.forEach((event) => {
      const oldName = event["@_name"];
      if (!event.pos.length) event.pos = [event.pos];

      event.pos.forEach((pos) => {
        newFile2.events.event.push({
          ["@_name"]: `Static${eventName}_${index}`,
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
        });
        index++;
      });
    });
    //console.log(JSON.stringify(newFile1, null, 2));
    //console.log(JSON.stringify(newFile2, null, 2));
    const file1Xml =
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' +
      new parser.j2xParser({
        ignoreAttributes: false,
        format: true,
      }).parse(newFile1);
    const file2Xml =
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' +
      new parser.j2xParser({
        ignoreAttributes: false,
        format: true,
      }).parse(newFile2);
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
  } catch (err) {
    message.channel.send(
      "Could not convert your event xml probably because its not a valid event structure."
    );
    console.log(err);
  }
};
const isRightType = (input) => {
  if (input.startsWith("<")) return true;
  return false;
};
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

exports.convert = convert;
exports.isRightType = isRightType;
