const { addItem } = require("./savesystem");
const fs = require("fs");
const names = fs.readFileSync("./names.txt").toString("utf-8").split("\n");
let index = 0;
for (const name of names) {
  if (index % 10 == 0) process.stdout.write("#");
  index++;
  addItem({
    type: "text",
    name: name.replace("\r", ""),
    id: name.replace("\r", "").toLowerCase(),
    content: "Im dumb",
  });
}
