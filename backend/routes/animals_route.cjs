/** @format */

const { GetAnimalById, GetAnimalsAtEndpoint } = require("../db/animals.cjs");
const express = require("express");
router = express.Router();

router.get("/api/category/get/:endpoint", async (req, res) => {
	const endpoint = req.params.endpoint;
	const result = await GetAnimalsAtEndpoint(endpoint);
	res.json(result);
});
router.get("/api/animal/get/:id", async (req, res) => {
	const id = req.params.id;
	const result = await GetAnimalById(id);
	res.json(result);
});

module.exports = router;
