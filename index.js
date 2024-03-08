const { log } = require("console");
const app = require("./app");
const os = require("os");
// Start the server
app.listen(3000, () => {
  console.log("Server listening on port 3000");
  console.log("====================================");
  console.log(os.platform());
  console.log(os.networkInterfaces());
  console.log(os.uptime() / 3600);
  console.log(os.freemem());
  console.log(os.homedir());
  console.log("====================================");
});
