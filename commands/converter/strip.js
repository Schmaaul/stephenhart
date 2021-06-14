/**
 *
 * @param {string} input
 */
module.exports = (input) => {
  //input.replace("\r", "\n");
  const inArray = input.split("");

  //console.log(inArray.join(""));
  let index = 0;
  while (inArray[index] == " " || inArray[index] == "\n") {
    index++;
    //process.stdout.write("m");
  }

  inArray.splice(0, index);
  return inArray.join("");
};
