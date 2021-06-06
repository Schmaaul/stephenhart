const savefolderpath = "./saves";
const indexFileName = "index.json";

const fs = require("fs");
const { get } = require("http");
if (!fs.existsSync(savefolderpath)) fs.mkdirSync(savefolderpath);
if (!fs.existsSync(savefolderpath + "/" + indexFileName))
  fs.writeFileSync(savefolderpath + "/" + indexFileName, "{}");

const index = require(savefolderpath + "/" + indexFileName);

const getId = () => {
  const sym = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  let id = "";
  for (let i = 0; i < 10; i++) {
    id += sym[Math.floor(Math.random() * sym.length)];
  }
  return id;
};

const saveindex = () => {
  fs.writeFileSync(savefolderpath + "/" + indexFileName, JSON.stringify(index));
};

const getItemByID = (itemID) => {
  const saveID = index[itemID];
  if (!saveID) return undefined;
  if (!fs.existsSync(savefolderpath + "/" + saveID + ".json")) return undefined;
  return JSON.parse(fs.readFileSync(savefolderpath + "/" + saveID + ".json"));
};

const addItem = (item) => {
  let saveId = index[item.id];
  if (!saveId) saveId = getId();
  if (!item.id) return false;
  index[item.id] = saveId;
  saveindex();
  fs.writeFileSync(
    savefolderpath + "/" + saveId + ".json",
    JSON.stringify(item)
  );
  return saveId;
};

exports.getItemByID = getItemByID;
exports.addItem = addItem;
