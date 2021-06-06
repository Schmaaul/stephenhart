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
  const saveId = index[itemID];
  if (!saveId) return undefined;
  if (!fs.existsSync(savefolderpath + "/" + saveId + ".json")) return undefined;
  return JSON.parse(fs.readFileSync(savefolderpath + "/" + saveId + ".json"));
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
const deleteItemById = (id) => {
  const saveId = index[id];
  if (!saveId) return { err: { msg: "Couldn't find the item" } };
  delete index[id];
  saveindex();
  if (!fs.existsSync(savefolderpath + "/" + saveId + ".json")) return true;
  fs.unlinkSync(savefolderpath + "/" + saveId + ".json");
  return true;
};
const getAllIds = () => {
  return Object.keys(index);
};
const findIdsBySearch = (string) => {
  const ids = Object.keys(index);
  return ids.filter((id) => id.includes(string.toLowerCase()));
};

exports.getItemByID = getItemByID;
exports.addItem = addItem;
exports.deleteItemById = deleteItemById;
exports.getAllIds = getAllIds;
exports.findIdsBySearch = findIdsBySearch;
