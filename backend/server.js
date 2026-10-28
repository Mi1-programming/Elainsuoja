/** @format */

const { loadEnvFile } = require("node:process");

const express = require("express");
const app = express();
const path = require("path");
loadEnvFile(".env");

app.set("views", "./views");
app.set("view engine", "ejs");
app.use("/static", express.static(path.join(__dirname, "public")));
app.use(require("./routes/api_route.cjs"));
app.use(require("./routes/navigation_route.cjs"));

const port = process.env.PORT;
app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});
