const axios = require("axios");
const server = require("./src/server");
const { conn } = require('./src/db.js');
const PORT = process.env.PORT || 3001;
const loadSeeds = require("./src/scripts/loadSeeds.js")


conn.sync({ force: true }).then(() => {
loadSeeds();
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
})
}).catch(error => console.error(error))
