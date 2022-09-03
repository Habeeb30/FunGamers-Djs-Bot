// const { readdirSync } = require("fs");

// module.exports = (client) => {
//   client.selectMenuhandler = async () => {
//     const componentFolder = readdirSync("./Handlers"); // replace "selectHandler" with your component file location
//     for (const folder of componentFolder) {
//       const componentFiles = readdirSync(`./Handlers/${folder}`).filter(
//         // replace "selectHandler" with your component file location
//         (file) => file.endsWith(".js")
//       );

//       const { selectMenus } = client; // name of your collection on index.js file

//       if (folder === "selectMenus") {
//         for (const file of componentFiles) {
//           const menu = require(`../../Handlers/${folder}/${file}`); // replace "selectHandler" with your component file location

//           selectMenus.set(menu.data.name, menu);
//         }
//       }
//     }
//   };
// };
