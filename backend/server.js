
/** @format */

const fs = require("node:fs");
const path = require("node:path");
const { loadEnvFile } = require("node:process");

const envPath = path.join(__dirname, ".env");

if (fs.existsSync(envPath)) {
    loadEnvFile(envPath);
}

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());

app.use("/static", express.static(path.join(__dirname, "public")));

app.use(require("./routes/api_route.cjs"));
app.use(require("./routes/navigation_route.cjs"));
app.use(require("./routes/swagger_route.cjs"));

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
