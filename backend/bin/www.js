const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT;
const app = require("../app");

app.listen(PORT, () => {
  console.log(`running on port:${PORT}`);
});
