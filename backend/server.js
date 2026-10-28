const { loadEnvFile } = require("node:process");
const {
	GetAnimalById,
	GetEndpoints,
	GetNameByEndPoint,
} = require("./db/animals.cjs");
const { MakeBreadcrumbMiddleware } = require("./breadcrumbs_server");

const express = require("express");
const app = express();
const path = require("path");
loadEnvFile(".env");

const port = process.env.PORT;

app.set("views", "./views");
app.set("view engine", "ejs");
app.use("/static", express.static(path.join(__dirname, "public")));
app.use(require("./routes/animals_route.cjs"));

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

app.get("/", (req, res) => {
	res.redirect("/koti");
});
app.get("/koti", breadcrumbMiddleware, async (req, res) => {
	const endpoints = await GetEndpoints();
	res.render("home", { breadcrumbs: req.breadcrumbs, endpoints });
});
app.get("/koti/:category", breadcrumbMiddleware, async (req, res) => {
	const endpoint = req.params.category;
	const category = await GetNameByEndPoint(endpoint);
	res.render("animals", {
		category: category.name,
		endpoint,
		breadcrumbs: req.breadcrumbs,
	});
});
app.get("/koti/:category/:id", breadcrumbMiddleware, async (req, res) => {
	const id = req.params.id;
	const animal = await GetAnimalById(id);
	res.render("animal", { name: animal.name, breadcrumbs: req.breadcrumbs });
});
app.get("/koti/:category/:id/varaa", breadcrumbMiddleware, async (req, res) => {
	const id = req.params.id;
	const animal = await GetAnimalById(id);

	res.render("reserve_form", {
		name: animal.name,
		breadcrumbs: req.breadcrumbs,
	});
});

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});
