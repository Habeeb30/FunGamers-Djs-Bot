async function loadEventStack(client) {
  const { loadFiles } = require("../Functions/fileLoader");
  const ascii = require("ascii-table");
  const table = new ascii("EventStack List");

  const Files = await loadFiles("EventStack");

  Files.map((value) => require(value));
  return console.log(table.toString());
}

module.exports = { loadEventStack };
