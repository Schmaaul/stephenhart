const parser = require("fast-xml-parser");
const { MessageAttachment } = require("discord.js");
const main = async (input, message) => {
  let lineArray = input.split("\n");
  lineArray = lineArray.filter((line) => line.startsWith("SpawnObject"));
  const argsArray = [];
  lineArray.forEach((line) => {
    line = line.replace('SpawnObject( "', "");
    line = line.replace('SpawnObject("', "");
    line = line.replace(/,/g, "");
    line = line.replace('" );', "");
    line = line.replace('");', "");
    const args = line.split('" "');
    argsArray.push(args);
  });
  if (argsArray.findIndex((args) => args.length != 3) + 1)
    return message.channel.send(
      `There was a error with the arguments of the ${
        argsArray.findIndex((args) => args.length != 3) + 1
      } SpawnObject() function`
    );
  argsArray.forEach((args, argsIndex) => {
    argsArray[argsIndex][1] = args[1].split(" ");
    argsArray[argsIndex][2] = args[2].split(" ");
  });
  if (
    argsArray.findIndex((args) => args[1].length != 3 || args[2].length != 3) +
    1
  )
    return message.channel.send(
      `There was a error with the arguments of the ${
        argsArray.findIndex(
          (args) => args[1].length != 3 || args[2].length != 3
        ) + 1
      } SpawnObject() function`
    );
  // fixing rotations
  argsArray.forEach((args) => {
    args[2][0] = args[2][0] % 360;
    if (args[2][0] < 0) args[2][0] += 360;
  });

  // Collected all infos
  // asking for the event name
  const msgToDelete = await message.channel.send(
    "What should the event be called?"
  );
  const filter = (msg) => msg.author.id == message.author.id;
  const msg = await waitForAnswer(filter, message.channel);
  msgToDelete.delete();
  if (typeof msg != "object") return;
  const eventName = msg.content;
  msg.delete();
  message.delete();

  // creating xml files

  // create file 1
  const file1 = { events: { event: [] } };
  argsArray.forEach((args, index) => {
    const obj = {};
    obj["@_name"] = `Static${eventName}_${index + 1}`;
    obj.pos = {};
    obj.pos["@_x"] = args[1][0];
    obj.pos["@_y"] = args[1][1];
    obj.pos["@_z"] = args[1][2];
    obj.pos["@_a"] = args[2][0];
    file1.events.event.push(obj);
  });

  // create file 2
  const file2 = { events: { event: [] } };
  argsArray.forEach((args, index) => {
    const obj = {};
    obj["@_name"] = `Static${eventName}_${index + 1}`;
    obj.nominal = 1;
    obj.min = 0;
    obj.max = 0;
    obj.lifetime = 300;
    obj.restock = 0;
    obj.saferadius = 0;
    obj.distanceradius = 0;
    obj.cleanupradius = 0;
    obj.flags = {};
    obj.flags["@_deletable"] = 0;
    obj.flags["@_init_random"] = 0;
    obj.flags["@_remove_damaged"] = 0;
    obj.position = "fixed";
    obj.limit = "child";
    obj.active = 1;
    obj.children = {};
    obj.children.child = {};
    obj.children.child["@_lootmax"] = 0;
    obj.children.child["@_lootmin"] = 0;
    obj.children.child["@_max"] = 2;
    obj.children.child["@_min"] = 1;
    obj.children.child["@_type"] = args[0];

    file2.events.event.push(obj);
  });
  // parse file 1
  const file1Xml =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' +
    new parser.j2xParser({
      ignoreAttributes: false,
      format: true,
    }).parse(file1);

  // parse file 2
  const file2Xml =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' +
    new parser.j2xParser({
      ignoreAttributes: false,
      format: true,
    }).parse(file2);
  // send files
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

const isRightType = (input) => {
  if (input.startsWith("//")) return true;
  return false;
};
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

exports.convert = main;
exports.isRightType = isRightType;
