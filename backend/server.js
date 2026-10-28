
/** @format */

const fs = require("node:fs");
const path = require("node:path");
const { loadEnvFile } = require("node:process");

// Ladataan backendin .env, jos tiedosto on olemassa.
// Dockerissa asetukset voidaan antaa suoraan ympäristömuuttujina.
const envPath = path.join(__dirname, ".env");

if (fs.existsSync(envPath)) {
    loadEnvFile(envPath);
}

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

// Sivujen näkymät ja staattiset tiedostot.
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());

app.use("/static", express.static(path.join(__dirname, "public")));

// Nykyiset eläinten API-reitit ja adoptiohakemusten välitys.
app.use(require("./routes/animals_route.cjs"));

// Kaverisi lisäämät API- ja navigointireitit.
app.use(require("./routes/api_route.cjs"));
app.use(require("./routes/navigation_route.cjs"));

// Käynnistetään Server A.
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
