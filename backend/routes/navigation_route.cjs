/** @format */

const { MakeBreadcrumbMiddleware } = require("../breadcrumbs_server");
const {
	GetAnimalById,
	GetEndpoints,
	GetNameByEndPoint,
} = require("../db/animals.cjs");
const express = require("express");
router = express.Router();

const breadcrumbMiddleware = MakeBreadcrumbMiddleware({
	formatters: {
		":id": async (breadcrumb, req) => {
			const id = req.params.id;
			const animal = await GetAnimalById(id);
			breadcrumb.name = animal.name;
		},
		":category": async (breadcrumb, req) => {
			const category = req.params.category;
			const result = await GetNameByEndPoint(category);
			breadcrumb.name = result.name;
		},
	},
});

router.get("/", (req, res) => {
	res.redirect("/koti");
});
router.get("/koti", breadcrumbMiddleware, async (req, res) => {
	const endpoints = await GetEndpoints();
	res.render("home", { breadcrumbs: req.breadcrumbs, endpoints });
});
router.get("/koti/:category", breadcrumbMiddleware, async (req, res) => {
	const endpoint = req.params.category;
	const category = await GetNameByEndPoint(endpoint);
	res.render("animals", {
		category: category.name,
		endpoint,
		breadcrumbs: req.breadcrumbs,
	});
});
router.get("/koti/:category/:id", breadcrumbMiddleware, async (req, res) => {
	const id = req.params.id;
	const animal = await GetAnimalById(id);

	const endpoint = req.params.category;
	const category = await GetNameByEndPoint(endpoint);

	res.render("animal", {
		name: animal.name,
		breed: animal.breed,
		description: animal.description,
		category: category.name,
		breadcrumbs: req.breadcrumbs,
	});
});
router.get(
	"/koti/:category/:id/varaa",
	breadcrumbMiddleware,
	async (req, res) => {
		const id = req.params.id;
		const animal = await GetAnimalById(id);

		res.render("reserve_form", {
			name: animal.name,
			breadcrumbs: req.breadcrumbs,
		});
	},
);

module.exports = router;
