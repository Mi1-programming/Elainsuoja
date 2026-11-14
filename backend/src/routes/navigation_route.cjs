/** @format */

const { MakeBreadcrumbMiddleware } = require("../breadcrumbs_server");
const {
	GetAnimalById,
	GetCategories,
	GetCategoryNameByTextID,
	GetAnimalsByCategory,
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
	},
});

router.get("/", (req, res) => {
	res.redirect("/koti");
});
router.get("/koti", breadcrumbMiddleware, async (req, res) => {
	const categories = await GetCategories();
	res.render("home", { breadcrumbs: req.breadcrumbs, categories });
});
router.get("/koti/:category", breadcrumbMiddleware, async (req, res) => {
	const category = req.params.category;
	const categoryName = await GetCategoryNameByTextID(category);
	const animals = await GetAnimalsByCategory(category);

	res.render("animals", {
		category,
		categoryName,
		animals,
		breadcrumbs: req.breadcrumbs,
	});
});
router.get("/koti/:category/:id", breadcrumbMiddleware, async (req, res) => {
	const id = req.params.id;
	const animal = await GetAnimalById(id);

	const category = req.params.category;
	const categoryName = await GetCategoryNameByTextID(category);

	res.render("animal", {
		animal: animal,
		category,
		categoryName,
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
			animal: animal,
			breadcrumbs: req.breadcrumbs,
		});
	},
);

module.exports = router;
