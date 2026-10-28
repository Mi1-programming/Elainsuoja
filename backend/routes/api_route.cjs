/** @format */

const {
	GetAnimalById,
	GetAnimalsAtEndpoint,
	GetAnimals,
} = require("../db/animals.cjs");
const express = require("express");
router = express.Router();

router.get("/api/category/animals/:endpoint", async (req, res) => {
	const endpoint = req.params.endpoint;
	const result = await GetAnimalsAtEndpoint(endpoint);
	res.json(result);
});
router.get("/api/animals", async (req, res) => {
	const result = await GetAnimals();
	res.json(result);
});
router.get("/api/animals/:id", async (req, res) => {
	const id = req.params.id;
	const result = await GetAnimalById(id);
	res.json(result);
});

module.exports = router;
