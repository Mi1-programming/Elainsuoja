
const fs = require("node:fs");
const { loadEnvFile } = require("node:process");

// Ladataan .env vain, jos tiedosto on olemassa.
// Dockerissa asetukset voidaan antaa suoraan ympäristömuuttujina.
if (fs.existsSync(".env")) {
    loadEnvFile(".env");
}

const {
    GetAnimalById,
    GetEndpoints,
    GetNameByEndPoint,
} = require("./db/animals.cjs");

const { MakeBreadcrumbMiddleware } = require("./breadcrumbs_server");
const express = require("express");
const path = require("node:path");

const app = express();
const port = process.env.PORT || 3000;

// Sivunäkymien ja tiedostojen asetukset.
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Luetaan JSON-muotoiset pyynnöt ennen reittejä.
app.use(express.json());

// Staattiset tiedostot ja API-reitit.
app.use("/static", express.static(path.join(__dirname, "public")));
app.use(require("./routes/animals_route.cjs"));

// Sivuston navigointipolut.
const breadcrumbMiddleware = MakeBreadcrumbMiddleware({
    formatters: {
        ":id": async (breadcrumb, req) => {
            const id = req.params.id;
            const animal = await GetAnimalById(id);
            breadcrumb.name = animal.name;
        },
        ":animals": async (breadcrumb, req) => {
            const category = req.params.category;
            const result = await GetNameByEndPoint(category);
            breadcrumb.name = result.name;
        },
    },
});

// Etusivu.
app.get("/", (req, res) => {
    res.redirect("/koti");
});

app.get("/koti", breadcrumbMiddleware, async (req, res) => {
    const endpoints = await GetEndpoints();

    res.render("home", {
        breadcrumbs: req.breadcrumbs,
        endpoints,
    });
});

// Eläinkategorian lista.
app.get("/koti/:category", breadcrumbMiddleware, async (req, res) => {
    const endpoint = req.params.category;
    const category = await GetNameByEndPoint(endpoint);

    res.render("animals", {
        category: category.name,
        endpoint,
        breadcrumbs: req.breadcrumbs,
    });
});

// Yksittäisen eläimen tietosivu.
app.get("/koti/:category/:id", breadcrumbMiddleware, async (req, res) => {
    const id = req.params.id;
    const animal = await GetAnimalById(id);

    res.render("animal", {
        name: animal.name,
        breadcrumbs: req.breadcrumbs,
    });
});

// Varauslomake.
app.get(
    "/koti/:category/:id/varaa",
    breadcrumbMiddleware,
    async (req, res) => {
        const id = req.params.id;
        const animal = await GetAnimalById(id);

        res.render("reserve_form", {
            name: animal.name,
            animalId: animal.id,
            breadcrumbs: req.breadcrumbs,
        });
    }
);

// Käynnistetään Server A.
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});


